import { Flex, Slider } from '@radix-ui/themes';

export interface SeekBarProps {
  onChange: (value: number) => void;
  duration: number;
  position: number;
}

export function SeekBar({ onChange, duration, position }: SeekBarProps) {
  return (
    <Flex grow="1">
      <Slider
        variant="surface"
        size="1"
        min={0}
        max={duration}
        value={[position]}
        className="w-full"
        onValueChange={([n]) => onChange(n as number)}
      />
    </Flex>
  );
}
