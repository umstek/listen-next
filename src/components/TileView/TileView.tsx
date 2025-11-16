import { useLayoutEffect, useRef, useState } from 'react'

import { cn } from '~util/styles'

import { Tile } from './Tile'
import { overlaps, SelectionMode } from './util'

/**
 * Interface for props for the TileView component.
 */
export interface TileViewProps<T> {
  items: T[]
  extractKey: (item: T) => string
  renderItem: (item: T) => React.ReactElement
  onOpen: (item: T) => void
}

/**
 * Renders a tile view component.
 *
 * @param items The array of items to be rendered in the tile view.
 * @param extractKey A function to extract a unique key for each item in the tile view.
 * @param renderItem A function to render each item in the tile view.
 * @param onOpen A function to handle when an item is opened.
 * @return The rendered tile view component.
 */
export function TileView<T>({
  items,
  extractKey,
  renderItem,
  onOpen,
}: TileViewProps<T>) {
  /**
   * A React ref attached to the host div element, which contains the selection
   * rectangle and the container for the items.
   */
  const hostRef = useRef<HTMLDivElement>(null)
  /**
   * A React ref containing a record mapping item keys to their DOM element references.
   * This is used to efficiently check for item overlaps during selection.
   */
  const itemRefs = useRef<Record<string, HTMLElement>>({})

  const selectionBoxRef = useRef<HTMLDivElement>(null)
  const selectionBoundsRef = useRef({ sx: 0, sy: 0, cx: 0, cy: 0 })
  const { sx, sy, cx, cy } = selectionBoundsRef.current

  // Whether the current selection extends, toggles, or clears the existing selection.
  const [mode, setMode] = useState<SelectionMode>(SelectionMode.NONE)
  // Used to force a refresh of the component as most of the data uses refs.
  const [refresh, setRefresh] = useState(0)

  // The items selected.
  const [selected, setSelected] = useState<Set<string>>(new Set())
  // The items currently being selected. These may extend, toggle, or clear
  // the current selection based on the key pressed.
  const [selecting, setSelecting] = useState<Set<string>>(new Set())

  useLayoutEffect(() => {
    if (!mode) return
    if (!selectionBoxRef.current) return
    if (!itemRefs.current) return

    const overlappingItems = Object.entries(itemRefs.current)
      .filter(([, ref]) =>
        overlaps(
          ref.getBoundingClientRect(),
          selectionBoxRef.current!.getBoundingClientRect(),
        ),
      )
      .map(([key]) => key)

    setSelecting(new Set(overlappingItems))
  }, [mode])

  /**
   * Handles the start event when a selection rectangle is being created.
   *
   * @param e The pointer event object.
   */
  const onRectangleStart = (e: React.PointerEvent) => {
    e.currentTarget.setPointerCapture(e.pointerId)

    const { left, top } = e.currentTarget.getBoundingClientRect()
    selectionBoundsRef.current = {
      sx: e.clientX - left,
      sy: e.clientY - top,
      cx: e.clientX - left,
      cy: e.clientY - top,
    }

    if (e.shiftKey) {
      setMode(SelectionMode.OR)
    } else if (e.ctrlKey) {
      setMode(SelectionMode.XOR)
    } else {
      setSelected(new Set())
      setMode(SelectionMode.SELECT)
    }
  }

  /**
   * Handles the drawing event of the selection rectangle.
   *
   * @param e The pointer event object.
   */
  const onRectangleDrag = (e: React.PointerEvent) => {
    if (mode) {
      const { left, top } = e.currentTarget.getBoundingClientRect()

      selectionBoundsRef.current = {
        sx,
        sy,
        cx: e.clientX - left,
        cy: e.clientY - top,
      }

      if (e.shiftKey) {
        setMode(SelectionMode.OR)
      } else if (e.ctrlKey) {
        setMode(SelectionMode.XOR)
      } else {
        setSelected(new Set())
        setMode(SelectionMode.SELECT)
      }

      setRefresh(refresh + 1)
    }
  }

  /**
   * Handles the event when the user finishes selecting items.
   */
  const onRectangleEnd = () => {
    setMode(SelectionMode.NONE)

    // Just setting the selection box to invisible may create a scroll bar.
    selectionBoundsRef.current = { sx: 0, sy: 0, cx: 0, cy: 0 }

    // Commit the selection.
    switch (mode) {
      case SelectionMode.SELECT:
        setSelected(selecting)
        setSelecting(new Set())
        break
      case SelectionMode.OR:
        setSelected(new Set([...selected, ...selecting]))
        break
      case SelectionMode.XOR:
        setSelected(
          new Set(
            [...selected, ...selecting].filter(
              (key) => !(selected.has(key) && selecting.has(key)),
            ),
          ),
        )
        break
      default:
        break
    }
  }

  /**
   * Defines the inline styles for the selection rectangle element.
   * Computes the rectangle's position and dimensions based on the
   * starting and current pointer coordinates.
   */
  const rectangleStyle = {
    height: Math.abs(cy - sy),
    width: Math.abs(cx - sx),
    left: cx - sx >= 0 ? sx : cx,
    top: cy - sy >= 0 ? sy : cy,
  }

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
        {items
          .map((item) => [item, extractKey(item)] as const)
          .map(([item, key]) => (
            <Tile
              key={key}
              ref={(ref) => {
                if (ref) itemRefs.current[key] = ref
              }}
              onDoubleClick={() => {
                onOpen(item)
              }}
              onClick={(e) => {
                if (e.shiftKey) {
                  setSelected(new Set([...selected, key]))
                } else if (e.ctrlKey) {
                  setSelected(
                    selected.has(key)
                      ? new Set([...selected].filter((k) => k !== key))
                      : new Set([...selected, key]),
                  )
                } else {
                  setSelected(new Set([key]))
                }
              }}
              onCheckClick={() => {
                if (selected.has(key)) {
                  setSelected(new Set([...selected].filter((k) => k !== key)))
                } else {
                  setSelected(new Set([...selected, key]))
                }
              }}
              selected={
                [
                  selected.has(key),
                  selecting.has(key),
                  selected.has(key) || selecting.has(key),
                  selected.has(key) !== selecting.has(key),
                ][mode]
              }
            >
              {renderItem(item)}
            </Tile>
          ))}
      </div>
    </div>
  )
}
