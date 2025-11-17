import * as React from "react"
import { cn } from "~lib/utils"

export interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6"
  size?: "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9" | "lg"
  weight?: "light" | "regular" | "medium" | "bold"
  children?: React.ReactNode
}

const sizeMap = {
  "1": "text-xs",
  "2": "text-sm",
  "3": "text-base",
  "4": "text-lg",
  "5": "text-xl",
  "6": "text-2xl",
  "7": "text-3xl",
  "8": "text-4xl",
  "9": "text-5xl",
  "lg": "text-lg",
}

const weightMap = {
  light: "font-light",
  regular: "font-normal",
  medium: "font-medium",
  bold: "font-bold",
}

export const Heading = React.forwardRef<HTMLHeadingElement, HeadingProps>(
  ({ as: Component = "h2", size = "5", weight = "bold", className, children, ...props }, ref) => {
    return (
      <Component
        ref={ref}
        className={cn(
          sizeMap[size],
          weightMap[weight],
          className
        )}
        {...props}
      >
        {children}
      </Component>
    )
  }
)

Heading.displayName = "Heading"
