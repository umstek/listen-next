import {
  SpeakerSimpleHigh,
  SpeakerSimpleLow,
  SpeakerSimpleNone,
} from '@phosphor-icons/react'
import { Slider } from ':ui/slider'
import { Flex } from ':layout/Flex'
import { IconButton } from ':layout/IconButton'

import { clamp } from '~util/math'

import type { VolumeControlProps } from './VolumeControl'

const speakerSimpleIconSet = [
  SpeakerSimpleNone,
  SpeakerSimpleLow,
  SpeakerSimpleHigh,
]
export function PanControl({ onChange, value }: VolumeControlProps) {
  const LeftSpeaker = speakerSimpleIconSet[clamp(Math.ceil(-value + 1), 0, 2)]
  const RightSpeaker = speakerSimpleIconSet[clamp(Math.ceil(value + 1), 0, 2)]

  return (
    <Flex align="center" gap="1">
      <IconButton
        variant="ghost"
        size="sm"
        onClick={() => onChange(clamp(value - 0.1, -1, 1))}
      >
        <LeftSpeaker mirrored size={16} weight="fill" />
      </IconButton>
      <Slider
        defaultValue={[0]}
        min={-1}
        max={1}
        value={[value]}
        step={0.01}
        className="w-24"
        onValueChange={([v]) => onChange(v)}
      />
      <IconButton
        variant="ghost"
        size="sm"
        onClick={() => onChange(value + 0.1)}
      >
        <RightSpeaker size={16} weight="fill" />
      </IconButton>
    </Flex>
  )
}
