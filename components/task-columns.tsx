"use client"

import type { Task } from "@/lib/types"
import TaskList from "@/components/task-list"
import { Loader2 } from "lucide-react"

interface TaskColumnsProps {
  activeTasks: Task[]
  completedTasks: Task[]
  onToggleCompletion: (id: string) => void
  onUpdateTask: (task: Task) => Promise<void>
  onDeleteTask: (id: string) => void
  onStartTimer: (id: string) => void
  activeTaskId: string | null
  timerRunning: boolean
  isLoading: boolean
}

export default function TaskColumns({
  activeTasks,
  completedTasks,
  onToggleCompletion,
  onUpdateTask,
  onDeleteTask,
  onStartTimer,
  activeTaskId,
  timerRunning,
  isLoading,
}: TaskColumnsProps) {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    )
  }

  return (
    <div className="grid gap-8 md:grid-cols-2">
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 border-b border-gray-200 dark:border-gray-700 pb-2 flex items-center gap-2">
          <span className="bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 px-2 py-0.5 rounded-full text-sm">
            {activeTasks.length}
          </span>
          To Do
        </h3>
        {activeTasks.length > 0 ? (
          <TaskList
            tasks={activeTasks}
            onToggleCompletion={onToggleCompletion}
            onUpdateTask={onUpdateTask}
            onDeleteTask={onDeleteTask}
            onStartTimer={onStartTimer}
            activeTaskId={activeTaskId}
            timerRunning={timerRunning}
            listType="active"
          />
        ) : (
          <div className="text-gray-500 dark:text-gray-400 text-center py-8 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-100 dark:border-gray-700">
            No active tasks for today
          </div>
        )}
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 border-b border-gray-200 dark:border-gray-700 pb-2 flex items-center gap-2">
          <span className="bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 px-2 py-0.5 rounded-full text-sm">
            {completedTasks.length}
          </span>
          Completed
        </h3>
        {completedTasks.length > 0 ? (
          <TaskList
            tasks={completedTasks}
            onToggleCompletion={onToggleCompletion}
            onUpdateTask={onUpdateTask}
            onDeleteTask={onDeleteTask}
            onStartTimer={onStartTimer}
            activeTaskId={activeTaskId}
            timerRunning={timerRunning}
            listType="completed"
          />
        ) : (
          <div className="text-gray-500 dark:text-gray-400 text-center py-8 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-100 dark:border-gray-700">
            Complete some tasks to see them here
          </div>
        )}
      </div>
    </div>
  )
}

