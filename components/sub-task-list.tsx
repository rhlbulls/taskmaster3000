"use client"

import type { SubTask } from "@/lib/types"
import SubTaskItem from "@/components/sub-task-item"
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable"

interface SubTaskListProps {
  subTasks: SubTask[]
  taskId: string
  onToggleCompletion: (id: string) => void
  onDeleteSubTask: (id: string) => void
}

export default function SubTaskList({ subTasks, taskId, onToggleCompletion, onDeleteSubTask }: SubTaskListProps) {
  // Create sortable items with prefixed IDs to avoid collisions
  const sortableItems = subTasks.map((subTask) => `subtask-${taskId}-${subTask.id}`)

  return (
    <SortableContext items={sortableItems} strategy={verticalListSortingStrategy}>
      <div className="space-y-1">
        {subTasks.map((subTask) => (
          <SubTaskItem
            key={subTask.id}
            subTask={subTask}
            taskId={taskId}
            onToggleCompletion={onToggleCompletion}
            onDeleteSubTask={onDeleteSubTask}
          />
        ))}
      </div>
    </SortableContext>
  )
}

