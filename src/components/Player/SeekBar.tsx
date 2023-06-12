import TooltipSlider from './Slider';

export interface SeekBarProps {
  onChange: (value: number) => void;
  duration: number;
  position: number;
}

export function SeekBar({ onChange, duration, position }: SeekBarProps) {
  return (
    <div className="flex flex-row flex-grow items-center">
      <TooltipSlider
        min={0}
        max={duration}
        tipFormatter={(value) => value}
        tipProps={{
          placement: 'top',
          prefixCls: 'rc-slider-tooltip',
          overlay: position,
        }}
        value={position}
        onChange={(n) => onChange(n as number)}
      />
    </div>
  );
}
