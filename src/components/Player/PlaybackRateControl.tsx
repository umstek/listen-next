import { PersonSimpleRun } from '@phosphor-icons/react';
import { Flex, Select } from '@radix-ui/themes';

export interface PlaybackRateControlProps {
  onChange: (value: number) => void;
  value: number;
}

export function PlaybackRateControl({
  onChange,
  value,
}: PlaybackRateControlProps) {
  return (
    <Flex align="center" gap="2">
      <Select.Root
        size="1"
        value={value.toFixed(2)}
        onValueChange={(v) => onChange(Number.parseFloat(v))}
      >
        <PersonSimpleRun size={16} />
        <Select.Trigger placeholder="Playback speed" />
        <Select.Content>
          <Select.Group>
            <Select.Item value="0.25">25%</Select.Item>
            <Select.Item value="0.50">50%</Select.Item>
            <Select.Item value="0.80">80%</Select.Item>
          </Select.Group>
          <Select.Separator />
          <Select.Group>
            <Select.Item value="1.00">100%</Select.Item>
          </Select.Group>
          <Select.Separator />
          <Select.Group>
            <Select.Item value="1.25">125%</Select.Item>
            <Select.Item value="2.00">200%</Select.Item>
            <Select.Item value="4.00">400%</Select.Item>
          </Select.Group>
        </Select.Content>
      </Select.Root>
    </Flex>
  );
}
