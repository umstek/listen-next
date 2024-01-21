import { Flex } from '@radix-ui/themes';
import { useDispatch, useSelector } from 'react-redux';

import { RootState } from '~store';

import { TaskStatusDisplay } from ':TaskStatusDisplay';

export function TasksView() {
  const dispatch = useDispatch();
  const tasks = useSelector((state: RootState) => state.tasks.items);

  return (
    <Flex gap="3" className="w-full">
      {tasks.map((task) => (
        <TaskStatusDisplay key={task.id} {...task} />
      ))}
    </Flex>
  );
}
