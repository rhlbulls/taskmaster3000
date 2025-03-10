"use client"

import { useState, useCallback } from "react"
import { PlayCircle, PauseCircle } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import type { Task } from "@/lib/types"
import { cn } from "@/lib/utils"
import TaskDetails from "@/components/task-details"
import TaskSubtasks from "@/components/task-subtasks"
import TaskEditForm from "@/components/task-edit-form"
import TaskActions from "@/components/task-actions"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { Clock } from "lucide-react"
import { formatTime } from "@/lib/utils"

interface TaskItemProps {
  task: Task
  onToggleCompletion: (id: string) => void
  onUpdateTask: (task: Task) => void
  onDeleteTask: (id: string) => void
  onStartTimer: (id: string) => void
  isActive: boolean
  isTimerRunning: boolean
  listType: "active" | "completed"
}

export default function TaskItem({
  task,
  onToggleCompletion,
  onUpdateTask,
  onDeleteTask,
  onStartTimer,
  isActive,
  isTimerRunning,
  listType,
}: TaskItemProps) {
  const [expanded, setExpanded] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [showDetails, setShowDetails] = useState(false)

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: `task-${task.id}`,
    disabled: isEditing || listType === "completed",
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  const handleStartTimer = useCallback(() => {
    onStartTimer(task.id)
  }, [onStartTimer, task.id])

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "rounded-xl border transition-all duration-200",
        isActive
          ? "border-gray-300 bg-gray-50 shadow-md dark:border-gray-700 dark:bg-gray-800"
          : task.completed
            ? "border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800/50"
            : "border-gray-200 bg-white hover:shadow-sm dark:border-gray-700 dark:bg-gray-800",
      )}
    >
      {isEditing ? (
        <TaskEditForm
          task={task}
          onSave={(updatedTask) => {
            onUpdateTask(updatedTask)
            setIsEditing(false)
          }}
          onCancel={() => setIsEditing(false)}
        />
      ) : (
        <div className="p-4">
          <div className="flex items-start gap-3">
            <Checkbox
              id={`task-${task.id}`}
              checked={task.completed}
              onCheckedChange={() => onToggleCompletion(task.id)}
              className="mt-1 data-[state=checked]:bg-gray-700 data-[state=checked]:border-gray-700 dark:data-[state=checked]:bg-gray-600 dark:data-[state=checked]:border-gray-600"
            />

            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 overflow-hidden cursor-move" {...attributes} {...listeners}>
                  <div className="flex items-center gap-2">
                    <h4
                      className={`font-medium text-base ${
                        task.completed
                          ? "text-gray-500 line-through dark:text-gray-400"
                          : "text-gray-800 dark:text-gray-200"
                      }`}
                    >
                      {task.title}
                    </h4>
                  </div>

                  {task.description && (
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-1">{task.description}</p>
                  )}

                  <div className="flex items-center gap-4 mt-1">
                    <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                      <Clock className="h-3.5 w-3.5" />
                      <span>{formatTime(task.timeSpent)}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  {!task.completed &&
                    (isTimerRunning ? (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:bg-gray-700"
                        onClick={() => {
                          /* Pause handled in parent */
                        }}
                      >
                        <PauseCircle className="h-5 w-5" />
                      </Button>
                    ) : (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:bg-gray-700"
                        onClick={handleStartTimer}
                      >
                        <PlayCircle className="h-5 w-5" />
                      </Button>
                    ))}
                </div>
              </div>

              <TaskActions
                task={task}
                onEdit={() => setIsEditing(true)}
                onDelete={() => onDeleteTask(task.id)}
                onToggleDetails={() => setShowDetails(!showDetails)}
                onToggleSubtasks={() => setExpanded(!expanded)}
                showDetails={showDetails}
                expanded={expanded}
              />
            </div>
          </div>

          {/* Details section */}
          {showDetails && <TaskDetails task={task} onUpdateTask={onUpdateTask} />}

          {/* Subtasks section */}
          {expanded && <TaskSubtasks task={task} onUpdateTask={onUpdateTask} />}
        </div>
      )}
    </div>
  )
}

