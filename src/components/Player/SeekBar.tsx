import { Slider } from ':ui/slider'
import { Flex } from ':layout/Flex'

export interface SeekBarProps {
  onChange: (value: number) => void
  duration: number
  position: number
}

export function SeekBar({ onChange, duration, position }: SeekBarProps) {
  return (
    <Flex flexGrow="1">
      <Slider
        min={0}
        max={duration}
        value={[position]}
        className="w-full"
        onValueChange={([n]) => onChange(n as number)}
      />
    </Flex>
  )
}
