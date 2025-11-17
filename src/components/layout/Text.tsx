import * as React from "react"
import { cn } from "~lib/utils"

export interface TextProps extends React.HTMLAttributes<HTMLElement> {
  as?: "div" | "p" | "span" | "label"
  size?: "1" | "2" | "3" | "4" | "5" | "sm"
  weight?: "light" | "regular" | "medium" | "bold"
  color?: "gray"
  children?: React.ReactNode
}

const sizeMap = {
  "1": "text-xs",
  "2": "text-sm",
  "3": "text-base",
  "4": "text-lg",
  "5": "text-xl",
  "sm": "text-sm",
}

const weightMap = {
  light: "font-light",
  regular: "font-normal",
  medium: "font-medium",
  bold: "font-bold",
}

const colorMap = {
  gray: "text-muted-foreground",
}

export const Text = React.forwardRef<HTMLElement, TextProps>(
  (
    { as: Component = "p", size = "2", weight = "regular", color, className, children, ...props },
    ref
  ) => {
    return (
      <Component
        ref={ref as any}
        className={cn(
          sizeMap[size],
          weightMap[weight],
          color && colorMap[color],
          className
        )}
        {...props}
      >
        {children}
      </Component>
    )
  }
)

Text.displayName = "Text"
