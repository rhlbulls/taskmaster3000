"use client"

import type { Task } from "@/lib/types"
import TaskItem from "@/components/task-item"
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable"

interface TaskListProps {
  tasks: Task[]
  onToggleCompletion: (id: string) => void
  onUpdateTask: (task: Task) => void
  onDeleteTask: (id: string) => void
  onStartTimer: (id: string) => void
  activeTaskId: string | null
  timerRunning: boolean
  listType: "active" | "completed"
}

export default function TaskList({
  tasks,
  onToggleCompletion,
  onUpdateTask,
  onDeleteTask,
  onStartTimer,
  activeTaskId,
  timerRunning,
  listType,
}: TaskListProps) {
  // Create sortable items with prefixed IDs to avoid collisions
  const sortableItems = tasks.map((task) => `task-${task.id}`)

  return (
    <SortableContext items={sortableItems} strategy={verticalListSortingStrategy}>
      <div className="space-y-3">
        {tasks.map((task) => (
          <TaskItem
            key={task.id}
            task={task}
            onToggleCompletion={onToggleCompletion}
            onUpdateTask={onUpdateTask}
            onDeleteTask={onDeleteTask}
            onStartTimer={onStartTimer}
            isActive={task.id === activeTaskId}
            isTimerRunning={task.id === activeTaskId && timerRunning}
            listType={listType}
          />
        ))}
      </div>
    </SortableContext>
  )
}

