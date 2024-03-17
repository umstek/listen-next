import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { DotsSixVertical, DotsThree, PlayCircle } from '@phosphor-icons/react';
import { Button, Flex } from '@radix-ui/themes';

import type { PlaylistItem as PlaylistItemModel } from '~models/Playlist';
import { cn } from '~util/styles';

interface PlaylistItemProps {
  id: string | number;
  active?: boolean;
  item: PlaylistItemModel;
}

export function PlaylistItem({ id, active, item }: PlaylistItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      className={cn(
        'group/playlist-item select-none rounded-3 transition-shadow duration-200 hover:ring-2 hover:ring-offset-1',
        active ? 'text-accent-11 ring-accent-5' : 'text-gray-11 ring-gray-5',
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
          <Flex direction="column" p="2">
            <div className="text-2 text-gray-12">
              {item.title || item.path?.split('/').pop()}
            </div>
            <div className="text-1 text-gray-12">
              {item.artist} - {item.album}
            </div>
            <Flex direction="row">
              <div className="text-1 text-gray-9">{item.path}</div>
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
