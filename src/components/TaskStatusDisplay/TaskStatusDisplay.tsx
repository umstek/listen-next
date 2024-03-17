import { Pause, X } from '@phosphor-icons/react';
import * as Progress from '@radix-ui/react-progress';
import { Badge, Box, Button, Flex, Tooltip } from '@radix-ui/themes';
import type { BadgeProps } from 'node_modules/@radix-ui/themes/dist/esm/components/badge';
import type { ReactNode } from 'react';

const statuses = [
  'pending',
  'in-progress',
  'paused',
  'failed',
  'success',
] as const;

const statusToColor: Record<(typeof statuses)[number], BadgeProps['color']> = {
  pending: 'gray',
  'in-progress': 'blue',
  paused: 'yellow',
  failed: 'red',
  success: 'green',
};

export interface TaskStatusDefinition {
  id: string;
  display: ReactNode;
  partsCount: number;
  partsDone: number;
  status: (typeof statuses)[number];
}

interface TaskStatusDisplayProps extends TaskStatusDefinition {
  onPause?: () => void;
  onAbort?: () => void;
}

export function TaskStatusDisplay({
  id,
  display,
  partsCount,
  partsDone,
  status,
  onPause,
  onAbort,
}: TaskStatusDisplayProps) {
  const progress = Math.floor((partsDone / partsCount) * 100);

  return (
    <Tooltip
      id={`task-status-display-${id}`}
      content={`${display}: ${status} (${progress}%)`}
    >
      <Box width="max-content">
        <Flex direction="column" gap="2">
          <Flex gap="1">
            <Box>
              <small>{display}</small>
            </Box>
            <Badge radius="full" size="1" color={statusToColor[status]}>
              {status}
            </Badge>
            {onPause && (
              <Button size="1" radius="full" variant="soft" onClick={onPause}>
                <Pause className="py-1" />
              </Button>
            )}
            {onAbort && (
              <Button size="1" radius="full" variant="soft" onClick={onAbort}>
                <X className="py-1" />
              </Button>
            )}
          </Flex>

          <Progress.Root
            className="relative h-rx-2 w-full overflow-hidden rounded-6 bg-accent-4"
            style={{
              // Fix overflow clipping in Safari
              // https://gist.github.com/domske/b66047671c780a238b51c51ffde8d3a0
              transform: 'translateZ(0)',
            }}
            value={progress}
          >
            <Progress.Indicator
              className="h-full w-full bg-accent-9 transition-transform duration-500 ease-out"
              style={{ transform: `translateX(-${100 - progress}%)` }}
            />
          </Progress.Root>
        </Flex>
      </Box>
    </Tooltip>
  );
}
