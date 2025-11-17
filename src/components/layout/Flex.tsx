import * as React from "react";
import { cn } from "~lib/utils";

export interface FlexProps extends React.HTMLAttributes<HTMLDivElement> {
  direction?: "row" | "column" | "row-reverse" | "column-reverse";
  align?: "start" | "center" | "end" | "stretch" | "baseline";
  justify?: "start" | "center" | "end" | "between";
  wrap?: "nowrap" | "wrap" | "wrap-reverse";
  gap?: "0" | "1" | "2" | "3" | "4" | "5" | "6" | "8";
  flexGrow?: "0" | "1";
  height?: string | number;
  p?: string | number;
  pt?: string | number;
  children?: React.ReactNode;
}

const directionMap = {
  row: "flex-row",
  column: "flex-col",
  "row-reverse": "flex-row-reverse",
  "column-reverse": "flex-col-reverse",
};

const alignMap = {
  start: "items-start",
  center: "items-center",
  end: "items-end",
  stretch: "items-stretch",
  baseline: "items-baseline",
};

const justifyMap = {
  start: "justify-start",
  center: "justify-center",
  end: "justify-end",
  between: "justify-between",
};

const wrapMap = {
  nowrap: "flex-nowrap",
  wrap: "flex-wrap",
  "wrap-reverse": "flex-wrap-reverse",
};

const gapMap = {
  "0": "gap-0",
  "1": "gap-1",
  "2": "gap-2",
  "3": "gap-3",
  "4": "gap-4",
  "5": "gap-5",
  "6": "gap-6",
  "8": "gap-8",
};

const flexGrowMap = {
  "0": "flex-grow-0",
  "1": "flex-grow",
};

export const Flex = React.forwardRef<HTMLDivElement, FlexProps>(
  (
    {
      direction = "row",
      align,
      justify,
      wrap,
      gap,
      flexGrow,
      height,
      p,
      pt,
      className,
      children,
      style,
      ...props
    },
    ref
  ) => {
    // Build inline styles for dynamic values
    const inlineStyles: React.CSSProperties = {
      ...style,
      ...(height && {
        height: typeof height === "number" ? `${height}px` : height,
      }),
      ...(p && { padding: typeof p === "number" ? `${p}px` : p }),
      ...(pt && { paddingTop: typeof pt === "number" ? `${pt}px` : pt }),
    };

    return (
      <div
        ref={ref}
        className={cn(
          "flex",
          directionMap[direction],
          align && alignMap[align],
          justify && justifyMap[justify],
          wrap && wrapMap[wrap],
          gap && gapMap[gap],
          flexGrow && flexGrowMap[flexGrow],
          className
        )}
        style={inlineStyles}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Flex.displayName = "Flex";
