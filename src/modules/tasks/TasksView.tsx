import { TaskStatusDisplay } from ':TaskStatusDisplay'
import { Flex } from ':layout/Flex'
import { useDispatch, useSelector } from 'react-redux'
import type { RootState } from '~store'

export function TasksView() {
  const _dispatch = useDispatch()
  const tasks = useSelector((state: RootState) => state.tasks.items)

  return (
    <Flex gap="3" className="w-full">
      {tasks.map((task) => (
        <TaskStatusDisplay key={task.id} {...task} />
      ))}
    </Flex>
  )
}
