import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { DotsSixVertical, DotsThree, PlayCircle } from '@phosphor-icons/react';
import { Button, Flex } from '@radix-ui/themes';

import { cn } from '~util/styles';

interface PlaylistItemProps {
  id: string | number;
  active?: boolean;
}

export function PlaylistItem({ id, active }: PlaylistItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      className={cn(
        'select-none rounded-3 group/playlist-item transition-shadow duration-200 hover:ring-offset-1 hover:ring-2',
        active
          ? 'bg-accent-2 text-accent-11 ring-accent-5'
          : 'bg-gray-2 text-gray-11 ring-gray-5',
      )}
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
    >
      <Flex direction="row" justify="between" align="stretch">
        <Flex direction="row" gap="3" align="center">
          <Flex
            role="button"
            direction="column"
            className="cursor-grab active:cursor-grabbing"
          >
            <DotsSixVertical
              weight="thin"
              size={32}
              className="invisible group-hover/playlist-item:visible"
            />
          </Flex>
          <Flex direction="column">
            <PlayCircle className="fill-current" weight="thin" size={48} />
          </Flex>
          <Flex direction="column" gap="1" p="2">
            <h4>Lonely Day</h4>
            <h5>System of a Down</h5>
            <Flex direction="row">
              <h6>/asd/fgh</h6>
            </Flex>
          </Flex>
        </Flex>
        <Flex
          direction="column"
          justify="center"
          className="invisible group-hover/playlist-item:visible"
        >
          <Button
            mr="4"
            variant="ghost"
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
            }}
          >
            <DotsThree size={24} />
          </Button>
        </Flex>
      </Flex>
    </div>
  );
}
