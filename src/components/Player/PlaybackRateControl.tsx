import TooltipSlider from './Slider';

export interface PlaybackRateControlProps {
  onChange: (value: number) => void;
  value: number;
}

export function PlaybackRateControl({
  onChange,
  value,
}: PlaybackRateControlProps) {
  return (
    <div className="flex flex-row flex-grow items-center">
      <TooltipSlider
        min={0.25}
        max={4}
        step={0.05}
        marks={{
          0.25: '0.25x',
          0.5: '0.5x',
          0.8: '0.8x',
          1: '1x',
          1.25: '1.25x',
          2: '2x',
          4: '4x',
        }}
        defaultValue={1}
        startPoint={1}
        tipFormatter={(value) => value}
        tipProps={{
          placement: 'top',
          prefixCls: 'rc-slider-tooltip',
          overlay: value,
        }}
        value={value}
        onChange={(n) => onChange(n as number)}
      />
    </div>
  );
}
