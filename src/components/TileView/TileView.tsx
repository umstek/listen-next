import { useLayoutEffect, useRef, useState } from 'react';

import { cn } from '~util/styles';
import { Thumbnail } from ':TileView';
import { Tile } from './Tile';
import { overlaps, SelectionMode } from './util';

export interface TileViewProps {
  onOpen: (title: string) => void;
  tiles: { title: string; kind: 'file' | 'directory' }[];
}

/**
 * Renders the Explorer component.
 *
 */
export default function TileView({ tiles, onOpen }: TileViewProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<Record<string, HTMLElement>>({});
  const selectionBoxRef = useRef<HTMLDivElement>(null);
  const selectionBoundsRef = useRef({ sx: 0, sy: 0, cx: 0, cy: 0 });
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

  const onRectangleStart = (e: React.PointerEvent) => {
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
  };

  const onRectangleDrag = (e: React.PointerEvent) => {
    if (mode) {
      const { left, top } = e.currentTarget.getBoundingClientRect();

      selectionBoundsRef.current = {
        sx,
        sy,
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
  };

  const onRectangleEnd = () => {
    setMode(SelectionMode.NONE);

    // Just setting the selection box to invisible may create a scroll bar.
    selectionBoundsRef.current = { sx: 0, sy: 0, cx: 0, cy: 0 };

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
  };

  const rectangleStyle = {
    height: Math.abs(cy - sy),
    width: Math.abs(cx - sx),
    left: cx - sx >= 0 ? sx : cx,
    top: cy - sy >= 0 ? sy : cy,
  };

  return (
    <div
      ref={hostRef}
      className="relative bg-white p-10"
      onPointerDown={onRectangleStart}
      onPointerUp={onRectangleEnd}
      onPointerMove={onRectangleDrag}
    >
      <div
        ref={selectionBoxRef}
        className={cn(
          'pointer-events-none invisible absolute z-10 rounded-1 bg-accentA-2 ring-1 ring-accent-4',
          mode && 'visible',
        )}
        style={rectangleStyle}
      />
      <div className="flex flex-wrap gap-8">
        {tiles.map(({ title, kind }) => (
          <Tile
            key={title}
            ref={(ref) => {
              if (ref) itemRefs.current[title] = ref;
            }}
            onDoubleClick={() => {
              onOpen(title);
            }}
            onClick={(e) => {
              if (e.shiftKey) {
                setSelected(new Set([...selected, title]));
              } else if (e.ctrlKey) {
                setSelected(
                  selected.has(title)
                    ? new Set([...selected].filter((key) => key !== title))
                    : new Set([...selected, title]),
                );
              } else {
                setSelected(new Set([title]));
              }
            }}
            onCheckClick={() => {
              if (selected.has(title)) {
                setSelected(
                  new Set([...selected].filter((key) => key !== title)),
                );
              } else {
                setSelected(new Set([...selected, title]));
              }
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
            <Thumbnail title={title} kind={kind} />
            {/* <HTile title={title} /> */}
          </Tile>
        ))}
      </div>
    </div>
  );
}
