import {
  Browser,
  DotsThree,
  FolderSimple,
  HardDrive,
  Planet,
} from '@phosphor-icons/react';
import { IconButton } from '@radix-ui/themes';
import {
  LegacyRef,
  ReactNode,
  forwardRef,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import { cn } from '~util/styles';

/**
 * Renders a folder card component.
 *
 * @param title The title of the folder.
 * @param icon The icon symbol for the folder.
 * @param highlighted Whether the folder is highlighted or not.
 * @returns The rendered folder card component.
 */
const Tile = forwardRef(function Tile(
  {
    selected,
    children,
  }: {
    children: ReactNode;
    selected?: boolean;
  },
  ref: LegacyRef<HTMLDivElement> | undefined,
): JSX.Element {
  return (
    <div
      ref={ref}
      role="button"
      className={cn(
        'group/tile flex h-48 w-48 flex-col items-center justify-between rounded-4  p-4 transition-all duration-100 hover:ring-4 hover:ring-gray-4',
        selected
          ? 'bg-accent-2 text-accent-10 ring-4 ring-accent-4'
          : 'bg-gray-2 text-gray-10 ring-0',
      )}
    >
      {children}
    </div>
  );
});

function TileBody({ title }: { title: string }): JSX.Element {
  return (
    <>
      <div className="invisible flex w-full justify-end group-hover/tile:visible">
        <IconButton
          radius="full"
          variant="ghost"
          onPointerDown={(e) => e.stopPropagation()}
        >
          <DotsThree size={24} weight="bold" />
        </IconButton>
      </div>
      <div className="mb-4 flex flex-col items-center gap-1">
        {/* <FileAudio className="fill-current" size={64} weight="thin" /> */}
        <FolderSimple className="fill-current" size={64} weight="thin" />
        <p className="text-sm select-none">{title}</p>
      </div>
      <div className="flex w-full justify-center gap-1">
        <Browser className="fill-current" size={16} alt="browser sandbox" />
        <Planet className="fill-current" size={16} alt="online" />
        <HardDrive className="fill-current" size={16} alt="local file system" />
      </div>
    </>
  );
}

const tiles = [
  { title: 'Documents' },
  { title: 'Downloads' },
  { title: 'Music' },
  { title: 'Pictures' },
  { title: 'Videos' },
  { title: 'Other' },
  { title: 'Shared' },
  { title: 'Team Drives' },
];

enum SelectionMode {
  NONE,
  SELECT,
  OR, // Shift
  XOR, // Control
}

export default function Explorer() {
  const itemRefs = useRef<Record<string, HTMLDivElement>>({});
  const selectionBoxRef = useRef<HTMLDivElement>(null);
  const selectionBoundsRef = useRef({
    sx: 0,
    sy: 0,
    cx: 0,
    cy: 0,
  });
  const { sx, sy, cx, cy } = selectionBoundsRef.current;

  const [mode, setMode] = useState<SelectionMode>(SelectionMode.NONE);
  const [refresh, setRefresh] = useState(0);

  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [selecting, setSelecting] = useState<Set<string>>(new Set());

  useLayoutEffect(() => {
    if (!mode) return;
    if (!selectionBoxRef.current) return;
    if (!itemRefs.current) return;

    const overlappingItems = Object.entries(itemRefs.current)
      .filter(([, ref]) =>
        overlaps(
          ref.getBoundingClientRect(),
          selectionBoxRef.current!.getBoundingClientRect(),
        ),
      )
      .map(([key]) => key);

    setSelecting(new Set(overlappingItems));
  }, [refresh, mode]);

  return (
    <div
      className="bg-white p-10"
      onPointerDown={(e) => {
        e.currentTarget.setPointerCapture(e.pointerId);

        const { left, top } = e.currentTarget.getBoundingClientRect();
        selectionBoundsRef.current = {
          sx: e.clientX - left,
          sy: e.clientY - top,
          cx: e.clientX - left,
          cy: e.clientY - top,
        };

        if (e.shiftKey) {
          setMode(SelectionMode.OR);
        } else if (e.ctrlKey) {
          setMode(SelectionMode.XOR);
        } else {
          setSelected(new Set());
          setMode(SelectionMode.SELECT);
        }
      }}
      onPointerUp={() => {
        setMode(SelectionMode.NONE);

        // Just setting the selection box to invisible may create a scroll bar.
        selectionBoundsRef.current = {
          sx: 0,
          sy: 0,
          cx: 0,
          cy: 0,
        };

        // Commit the selection.
        switch (mode) {
          case SelectionMode.SELECT:
            setSelected(selecting);
            setSelecting(new Set());
            break;
          case SelectionMode.OR:
            setSelected(new Set([...selected, ...selecting]));
            break;
          case SelectionMode.XOR:
            setSelected(
              new Set(
                [...selected, ...selecting].filter(
                  (key) => !(selected.has(key) && selecting.has(key)),
                ),
              ),
            );
            break;
          default:
            break;
        }
      }}
      onPointerMove={(e) => {
        if (mode) {
          const { left, top } = e.currentTarget.getBoundingClientRect();

          selectionBoundsRef.current = {
            sx: selectionBoundsRef.current.sx,
            sy: selectionBoundsRef.current.sy,
            cx: e.clientX - left,
            cy: e.clientY - top,
          };

          if (e.shiftKey) {
            setMode(SelectionMode.OR);
          } else if (e.ctrlKey) {
            setMode(SelectionMode.XOR);
          } else {
            setSelected(new Set());
            setMode(SelectionMode.SELECT);
          }

          setRefresh(refresh + 1);
        }
      }}
    >
      <div
        ref={selectionBoxRef}
        className={cn(
          'pointer-events-none invisible absolute rounded-1 bg-accentA-2 ring-1 ring-accent-4',
          mode && 'visible',
        )}
        style={{
          height: cy - sy >= 0 ? cy - sy : sy - cy,
          width: cx - sx >= 0 ? cx - sx : sx - cx,
          left: cx - sx >= 0 ? sx : cx,
          top: cy - sy >= 0 ? sy : cy,
        }}
      />
      <div className="flex flex-wrap gap-8">
        {tiles.map(({ title }) => (
          <Tile
            key={title}
            ref={(ref) => {
              if (ref) itemRefs.current[title] = ref;
            }}
            selected={
              [
                selected.has(title),
                selecting.has(title),
                selected.has(title) || selecting.has(title),
                selected.has(title) !== selecting.has(title),
              ][mode]
            }
          >
            <TileBody title={title} />
          </Tile>
        ))}
      </div>
      <div className="flex justify-center text-accent-10">
        {mode > 1 ? (
          <kbd className="rounded-2 px-2 py-1 text-4 shadow-2">
            {['', '', 'Shift', 'Ctrl'][mode]}
          </kbd>
        ) : undefined}
      </div>
    </div>
  );
}

function overlaps(a: DOMRect, b: DOMRect) {
  return (
    a.right > b.left && a.left < b.right && a.bottom > b.top && a.top < b.bottom
  );
}
