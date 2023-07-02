import {
  SpeakerSimpleHigh,
  SpeakerSimpleLow,
  SpeakerSimpleNone,
} from '@phosphor-icons/react';

import { clamp } from '~util/math';

import Slider from './Slider';
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
    <div className="flex flex-row flex-grow items-center">
      <LeftSpeaker mirrored size={24} weight="fill" className="text-blue-600" />
      <Slider
        tipFormatter={(value) => value}
        tipProps={{
          placement: 'top',
          prefixCls: 'rc-slider-tooltip',
          overlay: value,
        }}
        defaultValue={0}
        startPoint={0}
        min={-1}
        max={1}
        value={value}
        step={0.01}
        onChange={(v) => void onChange(v as number)}
      />
      <RightSpeaker size={24} weight="fill" className="text-blue-600" />
    </div>
  );
}
