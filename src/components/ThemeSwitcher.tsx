import { Monitor, Moon, Sun } from '@phosphor-icons/react'
import { Button, DropdownMenu, Flex, Tooltip } from '@radix-ui/themes'
import { useEffect, useState } from 'react'

export type ThemePreference = 'light' | 'dark' | 'auto'

const THEME_STORAGE_KEY = 'listen-theme-preference'

export function useThemePreference() {
  const [theme, setTheme] = useState<ThemePreference>(() => {
    const stored = localStorage.getItem(THEME_STORAGE_KEY)

    // Validate stored value against allowed themes
    const validThemes: ThemePreference[] = ['light', 'dark', 'auto']
    if (!stored || !validThemes.includes(stored as ThemePreference)) {
      // Only set default if missing or invalid
      localStorage.setItem(THEME_STORAGE_KEY, 'light')
      return 'light'
    }

    // Preserve valid stored value (including 'auto')
    return stored as ThemePreference
  })

  useEffect(() => {
    localStorage.setItem(THEME_STORAGE_KEY, theme)
  }, [theme])

  return [theme, setTheme] as const
}

export function ThemeSwitcher() {
  const [theme, setTheme] = useThemePreference()

  const icons = {
    light: <Sun size={16} weight="fill" />,
    dark: <Moon size={16} weight="fill" />,
    auto: <Monitor size={16} weight="fill" />,
  }

  const _labels = {
    light: 'Light',
    dark: 'Dark',
    auto: 'Auto',
  }

  return (
    <DropdownMenu.Root>
      <Tooltip content="Change theme">
        <DropdownMenu.Trigger>
          <Button variant="ghost" size="2">
            {icons[theme]}
          </Button>
        </DropdownMenu.Trigger>
      </Tooltip>
      <DropdownMenu.Content>
        <DropdownMenu.Item
          onClick={() => setTheme('auto')}
          className={theme === 'auto' ? 'font-bold' : ''}
        >
          <Flex align="center" gap="2">
            {icons.auto} Auto (System)
          </Flex>
        </DropdownMenu.Item>
        <DropdownMenu.Item
          onClick={() => setTheme('light')}
          className={theme === 'light' ? 'font-bold' : ''}
        >
          <Flex align="center" gap="2">
            {icons.light} Light
          </Flex>
        </DropdownMenu.Item>
        <DropdownMenu.Item
          onClick={() => setTheme('dark')}
          className={theme === 'dark' ? 'font-bold' : ''}
        >
          <Flex align="center" gap="2">
            {icons.dark} Dark
          </Flex>
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  )
}
