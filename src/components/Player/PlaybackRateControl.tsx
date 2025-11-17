import { PersonSimpleRun } from '@phosphor-icons/react'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from ':ui/select'
import { Flex } from ':layout/Flex'

export interface PlaybackRateControlProps {
  onChange: (value: number) => void
  value: number
}

export function PlaybackRateControl({
  onChange,
  value,
}: PlaybackRateControlProps) {
  return (
    <Flex align="center" gap="2">
      <PersonSimpleRun size={16} />
      <Select
        value={value.toFixed(2)}
        onValueChange={(v) => onChange(Number.parseFloat(v))}
      >
        <SelectTrigger className="w-24">
          <SelectValue placeholder="Playback speed" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value="0.25">25%</SelectItem>
            <SelectItem value="0.50">50%</SelectItem>
            <SelectItem value="0.80">80%</SelectItem>
          </SelectGroup>
          <SelectSeparator />
          <SelectGroup>
            <SelectItem value="1.00">100%</SelectItem>
          </SelectGroup>
          <SelectSeparator />
          <SelectGroup>
            <SelectItem value="1.25">125%</SelectItem>
            <SelectItem value="2.00">200%</SelectItem>
            <SelectItem value="4.00">400%</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </Flex>
  )
}
