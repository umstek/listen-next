import { LegacyRef, forwardRef } from 'react';

import { cn } from '~util/styles';

/**
 * Renders a folder card component.
 *
 * @param title The title of the folder.
 * @param icon The icon symbol for the folder.
 * @param highlighted Whether the folder is highlighted or not.
 * @returns The rendered folder card component.
 */
export const Tile = forwardRef(function Tile(
  {
    selected,
    className,
    ...rest
  }: {
    selected?: boolean;
  } & React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  >,
  ref: LegacyRef<HTMLDivElement> | undefined,
): JSX.Element {
  return (
    <div
      {...rest}
      role="button"
      ref={ref}
      onPointerDown={(e) => e.stopPropagation()}
      className={cn(
        'relative group/tile flex h-48 w-48 flex-col items-center justify-between rounded-4 p-4 transition-all duration-100 hover:ring-4 hover:ring-gray-4',
        selected
          ? 'bg-accent-2 text-accent-10 ring-4 ring-accent-4'
          : 'bg-gray-2 text-gray-10 ring-0',
        className,
      )}
    />
  );
});
