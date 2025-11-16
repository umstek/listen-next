import { Temporal } from '@js-temporal/polyfill'

/**
 * Converts the given number of seconds into a string representing the time
 * in the format "[[hh:]mm:]ss", with internally millisecond precision.
 *
 * @param seconds The number of (possibly fractional) seconds to convert
 * @return The time string in the format "[[hh:]mm:]ss"
 */
export function toHmmss(seconds: number) {
  const milliseconds = Math.round(seconds * 1000)
  const duration = Temporal.Duration.from({ milliseconds }).round({
    largestUnit: 'hour',
    smallestUnit: 'second',
    roundingMode: 'floor',
  })
  return duration
    .toString()
    .split(/[A-Z]/)
    .filter(Boolean)
    .map((p) => p.padStart(2, '0'))
    .join(':')
}
