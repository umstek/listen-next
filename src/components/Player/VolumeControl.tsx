import {
  SpeakerHigh,
  SpeakerLow,
  SpeakerNone,
  SpeakerX,
} from '@phosphor-icons/react';
import { Flex, IconButton, Slider } from '@radix-ui/themes';
import { clamp } from '~util/math';

export interface VolumeControlProps {
  onChange: (value: number) => void;
  value: number;
}
const speakerIconSet = [SpeakerNone, SpeakerLow, SpeakerHigh];
export function VolumeControl({ onChange, value }: VolumeControlProps) {
  const Speaker = speakerIconSet[Math.ceil(value)];

  return (
    <Flex align="center" gap="1">
      <IconButton variant="ghost" size="1" onClick={() => onChange(0)}>
        <SpeakerX size={16} weight="fill" />
      </IconButton>
      <Slider
        size="1"
        variant="soft"
        defaultValue={[1]}
        min={0}
        max={2}
        value={[value]}
        step={0.01}
        className="w-24"
        onValueChange={([v]) => void onChange(v as number)}
      />
      <IconButton
        variant="ghost"
        size="1"
        onClick={() => onChange(clamp(value + 0.1, 0, 2))}
      >
        <Speaker size={16} weight="fill" />
      </IconButton>
    </Flex>
  );
}
