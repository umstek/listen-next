import { SpeakerHigh, SpeakerLow, SpeakerNone } from '@phosphor-icons/react';

import Slider from './Slider';

export interface VolumeControlProps {
  onChange: (value: number) => void;
  value: number;
}
const speakerIconSet = [SpeakerNone, SpeakerLow, SpeakerHigh];
export function VolumeControl({ onChange, value }: VolumeControlProps) {
  const Speaker = speakerIconSet[Math.ceil(value)];

  return (
    <div className="flex flex-row flex-grow items-center">
      <Slider
        tipFormatter={(value) => value}
        tipProps={{
          placement: 'top',
          prefixCls: 'rc-slider-tooltip',
          overlay: value,
        }}
        defaultValue={1}
        min={0}
        max={2}
        value={value}
        step={0.01}
        onChange={(v) => void onChange(v as number)}
      />
      <Speaker size={24} weight="fill" className="text-blue-600" />
    </div>
  );
}
