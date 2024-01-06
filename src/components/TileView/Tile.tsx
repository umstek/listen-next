import { CheckCircle } from '@phosphor-icons/react';
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
    children,
    onCheckClick,
    ...rest
  }: {
    selected?: boolean;
    onCheckClick?: () => void;
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
        'group/tile relative flex h-48 w-48 flex-col items-center justify-between rounded-4 p-4 transition-all duration-100 hover:ring-4 hover:ring-gray-4 hover:ring-offset-2',
        selected
          ? 'bg-accent-2 text-accent-10 ring-4 ring-accent-4'
          : 'bg-gray-2 text-gray-10 ring-0',
        className,
      )}
    >
      <CheckCircle
        className={cn(
          selected ? 'visible' : 'invisible',
          'absolute -left-3 -top-3 rounded-6 bg-white fill-current group-hover/tile:visible',
        )}
        size={24}
        weight="fill"
        onClick={(e) => {
          e.stopPropagation();
          onCheckClick?.();
        }}
      />

      {children}
    </div>
  );
});
