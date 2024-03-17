import {
  DndContext,
  type DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  type UniqueIdentifier,
  closestCenter,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { Flex } from '@radix-ui/themes';
import { useEffect, useState } from 'react';

import type { PlaylistItem } from '~models/Playlist';

import { PlaylistItem as Item } from './PlaylistItem';

export interface PlaylistProps {
  items: PlaylistItem[];
}

export function Playlist(props: PlaylistProps) {
  const [items, setItems] = useState<UniqueIdentifier[]>([]);
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  useEffect(() => {
    if (!props.items) {
      return;
    }
    setItems(props.items.map((item) => item.fileId!));
  }, [props.items]);

  return (
    <div className="h-full w-full overflow-y-auto overflow-x-hidden">
      <Flex direction="column" gap="3" p="3">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext items={items} strategy={verticalListSortingStrategy}>
            {items.map((id) => {
              const i = props.items.find((i) => i.fileId === id);
              return i ? <Item key={id} id={id} item={i} /> : undefined;
            })}
          </SortableContext>
        </DndContext>
      </Flex>
    </div>
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (active.id !== over?.id) {
      setItems((items) => {
        if (!over?.id) {
          return items;
        }

        const oldIndex = items.indexOf(active.id);
        const newIndex = items.indexOf(over.id);

        return arrayMove(items, oldIndex, newIndex);
      });
    }
  }
}
