import { Flex, IconButton, Slider } from '@radix-ui/themes';
import {
  SpeakerSimpleHigh,
  SpeakerSimpleLow,
  SpeakerSimpleNone,
} from '@phosphor-icons/react';

import { clamp } from '~util/math';

import { VolumeControlProps } from './VolumeControl';

const speakerSimpleIconSet = [
  SpeakerSimpleNone,
  SpeakerSimpleLow,
  SpeakerSimpleHigh,
];
export function PanControl({ onChange, value }: VolumeControlProps) {
  const LeftSpeaker = speakerSimpleIconSet[clamp(Math.ceil(-value + 1), 0, 2)];
  const RightSpeaker = speakerSimpleIconSet[clamp(Math.ceil(value + 1), 0, 2)];

  return (
    <Flex align="center" gap="1">
      <IconButton
        variant="ghost"
        size="1"
        onClick={() => onChange(clamp(value - 0.1, -1, 1))}
      >
        <LeftSpeaker mirrored size={16} weight="fill" />
      </IconButton>
      <Slider
        size="1"
        variant="soft"
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
        size="1"
        onClick={() => onChange(value + 0.1)}
      >
        <RightSpeaker size={16} weight="fill" />
      </IconButton>
    </Flex>
  );
}
