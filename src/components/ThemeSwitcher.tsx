import { Monitor, Moon, Sun } from "@phosphor-icons/react";
import { useEffect, useState } from "react";
import { Button } from ":ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from ":ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from ":ui/tooltip";
import { Flex } from ":layout";

export type ThemePreference = "light" | "dark" | "auto";

const THEME_STORAGE_KEY = "listen-theme-preference";

// Custom event for theme changes
const THEME_CHANGE_EVENT = "theme-preference-change";

export function useThemePreference() {
  const [theme, setTheme] = useState<ThemePreference>(() => {
    // Guard against SSR/test environments
    if (typeof window === "undefined") {
      return "light";
    }

    const stored = localStorage.getItem(THEME_STORAGE_KEY);

    // Validate stored value against allowed themes
    const validThemes: ThemePreference[] = ["light", "dark", "auto"];
    if (!stored || !validThemes.includes(stored as ThemePreference)) {
      // Only set default if missing or invalid
      localStorage.setItem(THEME_STORAGE_KEY, "light");
      return "light";
    }

    // Preserve valid stored value (including 'auto')
    return stored as ThemePreference;
  });

  useEffect(() => {
    // Guard against SSR/test environments
    if (typeof window === "undefined") {
      return;
    }

    // Listen for theme changes from other components
    const handleThemeChange = (e: CustomEvent<ThemePreference>) => {
      setTheme(e.detail);
    };

    window.addEventListener(
      THEME_CHANGE_EVENT,
      handleThemeChange as EventListener
    );
    return () => {
      window.removeEventListener(
        THEME_CHANGE_EVENT,
        handleThemeChange as EventListener
      );
    };
  }, []);

  const updateTheme = (newTheme: ThemePreference) => {
    // Guard against SSR/test environments
    if (typeof window === "undefined") {
      return;
    }

    localStorage.setItem(THEME_STORAGE_KEY, newTheme);
    setTheme(newTheme);
    // Dispatch event to notify other components
    window.dispatchEvent(
      new CustomEvent(THEME_CHANGE_EVENT, { detail: newTheme })
    );
  };

  return [theme, updateTheme] as const;
}

export function ThemeSwitcher() {
  const [theme, updateTheme] = useThemePreference();

  const icons = {
    light: <Sun size={16} weight="fill" />,
    dark: <Moon size={16} weight="fill" />,
    auto: <Monitor size={16} weight="fill" />,
  };

  const _labels = {
    light: "Light",
    dark: "Dark",
    auto: "Auto",
  };

  return (
    <DropdownMenu>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                {icons[theme]}
              </Button>
            </DropdownMenuTrigger>
          </TooltipTrigger>
          <TooltipContent>
            <p>Change theme</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <DropdownMenuContent>
        <DropdownMenuItem
          onClick={() => updateTheme("auto")}
          className={theme === "auto" ? "font-bold" : ""}
        >
          <Flex align="center" gap="2">
            {icons.auto} Auto (System)
          </Flex>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => updateTheme("light")}
          className={theme === "light" ? "font-bold" : ""}
        >
          <Flex align="center" gap="2">
            {icons.light} Light
          </Flex>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => updateTheme("dark")}
          className={theme === "dark" ? "font-bold" : ""}
        >
          <Flex align="center" gap="2">
            {icons.dark} Dark
          </Flex>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
