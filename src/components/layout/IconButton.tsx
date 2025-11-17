import * as React from "react"
import { Button, type ButtonProps } from ":ui/button"
import { cn } from "~lib/utils"

export interface IconButtonProps extends Omit<ButtonProps, "size"> {
  size?: "1" | "2" | "3" | "sm"
  children?: React.ReactNode
}

const sizeMap = {
  "1": "h-6 w-6 p-0",
  "2": "h-8 w-8 p-0",
  "3": "h-10 w-10 p-0",
  "sm": "h-8 w-8 p-0",
}

export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ size = "2", className, children, ...props }, ref) => {
    return (
      <Button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center",
          sizeMap[size],
          className
        )}
        {...props}
      >
        {children}
      </Button>
    )
  }
)

IconButton.displayName = "IconButton"
