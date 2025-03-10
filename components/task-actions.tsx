"use client"

import { Button } from "@/components/ui/button"
import { Edit, Trash, ChevronDown, ChevronUp } from "lucide-react"
import type { Task } from "@/lib/types"

interface TaskActionsProps {
  task: Task
  onEdit: () => void
  onDelete: () => void
  onToggleDetails: () => void
  onToggleSubtasks: () => void
  showDetails: boolean
  expanded: boolean
}

export default function TaskActions({
  task,
  onEdit,
  onDelete,
  onToggleDetails,
  onToggleSubtasks,
  showDetails,
  expanded,
}: TaskActionsProps) {
  return (
    <div className="flex flex-wrap items-center gap-2 mt-3">
      <Button
        variant="ghost"
        size="sm"
        className="h-7 px-2 text-xs text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:bg-gray-700"
        onClick={onEdit}
      >
        <Edit className="h-3.5 w-3.5 mr-1" />
        Edit
      </Button>

      <Button
        variant="ghost"
        size="sm"
        className="h-7 px-2 text-xs text-gray-500 hover:text-red-600 hover:bg-red-50 dark:text-gray-400 dark:hover:text-red-400 dark:hover:bg-red-900/20"
        onClick={onDelete}
      >
        <Trash className="h-3.5 w-3.5 mr-1" />
        Delete
      </Button>

      <Button
        variant="ghost"
        size="sm"
        className="h-7 px-2 text-xs text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:bg-gray-700"
        onClick={onToggleDetails}
      >
        {showDetails ? "Hide details" : "Show details"}
      </Button>

      <Button
        variant="ghost"
        size="sm"
        className="h-7 px-2 text-xs text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:bg-gray-700 ml-auto"
        onClick={onToggleSubtasks}
      >
        {expanded ? (
          <>
            <ChevronUp className="h-3.5 w-3.5 mr-1" />
            Hide subtasks
          </>
        ) : (
          <>
            <ChevronDown className="h-3.5 w-3.5 mr-1" />
            {(task.subTasks?.length || 0) > 0 ? `Subtasks (${task.subTasks?.length})` : "Add subtasks"}
          </>
        )}
      </Button>
    </div>
  )
}

