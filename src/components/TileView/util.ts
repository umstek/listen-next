/**
 * Checks if two rectangles overlap.
 *
 * @param a The first rectangle.
 * @param b The second rectangle.
 * @return True if the rectangles overlap, false otherwise.
 */
export function overlaps(a: DOMRect, b: DOMRect) {
  return (
    a.right > b.left && a.left < b.right && a.bottom > b.top && a.top < b.bottom
  );
}

export enum SelectionMode {
  /**
   * No selection mode.
   */
  NONE,
  /**
   * Select mode.
   */
  SELECT,
  /**
   * Add to selection mode.
   */
  OR,
  /**
   * Toggle selection mode.
   */
  XOR,
}
