import { Pause, X } from '@phosphor-icons/react';
import * as Progress from '@radix-ui/react-progress';
import { Badge, Box, Button, Flex } from '@radix-ui/themes';

interface TaskProps {
  progress: number;
}

export function Task({ progress }: TaskProps) {
  return (
    <Box width="max-content">
      <Flex direction="column" gap="2">
        <Flex gap="1">
          <Box>
            <small>Indexing music...</small>
          </Box>
          <Badge radius="full" size="1">
            working
          </Badge>
          <Button size="1" radius="full" variant="soft">
            <Pause className="py-1" />
          </Button>
          <Button size="1" radius="full" variant="soft">
            <X className="py-1" />
          </Button>
        </Flex>
        <Progress.Root
          className="relative overflow-hidden bg-accent-4 rounded-6 w-full h-rx-2"
          style={{
            // Fix overflow clipping in Safari
            // https://gist.github.com/domske/b66047671c780a238b51c51ffde8d3a0
            transform: 'translateZ(0)',
          }}
          value={progress}
        >
          <Progress.Indicator
            className="bg-accent-9 w-full h-full transition-transform duration-500 ease-out"
            style={{ transform: `translateX(-${100 - progress}%)` }}
          />
        </Progress.Root>
      </Flex>
    </Box>
  );
}
