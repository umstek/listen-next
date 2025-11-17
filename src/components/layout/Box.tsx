import * as React from "react";
import { cn } from "~lib/utils";

export interface BoxProps extends React.HTMLAttributes<HTMLDivElement> {
  width?: string | number;
  height?: string | number;
  p?: string | number;
  children?: React.ReactNode;
}

export const Box = React.forwardRef<HTMLDivElement, BoxProps>(
  ({ width, height, p, className, children, style, ...props }, ref) => {
    // Build inline styles for dynamic values
    const inlineStyles: React.CSSProperties = {
      ...style,
      ...(width && { width: typeof width === "number" ? `${width}px` : width }),
      ...(height && {
        height: typeof height === "number" ? `${height}px` : height,
      }),
      ...(p && { padding: typeof p === "number" ? `${p}px` : p }),
    };

    return (
      <div ref={ref} className={cn(className)} style={inlineStyles} {...props}>
        {children}
      </div>
    );
  }
);

Box.displayName = "Box";
