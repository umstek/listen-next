import * as React from "react"
import { cn } from "~lib/utils"

export interface BoxProps extends React.HTMLAttributes<HTMLDivElement> {
  width?: string
  height?: string
  p?: string
  children?: React.ReactNode
}

export const Box = React.forwardRef<HTMLDivElement, BoxProps>(
  ({ width, height, p, className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          width && `w-${width}`,
          height && `h-${height}`,
          p && `p-${p}`,
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)

Box.displayName = "Box"
