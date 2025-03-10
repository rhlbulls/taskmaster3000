"use client"

import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Trash } from "lucide-react"
import type { SubTask } from "@/lib/types"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"

interface SubTaskItemProps {
  subTask: SubTask
  taskId: string
  onToggleCompletion: (id: string) => void
  onDeleteSubTask: (id: string) => void
}

export default function SubTaskItem({ subTask, taskId, onToggleCompletion, onDeleteSubTask }: SubTaskItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: `subtask-${taskId}-${subTask.id}`,
    disabled: subTask.completed,
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <div ref={setNodeRef} style={style} className="flex items-center gap-2 py-1">
      <Checkbox
        id={`subtask-${subTask.id}`}
        checked={subTask.completed}
        onCheckedChange={() => onToggleCompletion(subTask.id)}
        className="data-[state=checked]:bg-green-500 data-[state=checked]:border-green-500"
      />

      <label
        htmlFor={`subtask-${subTask.id}`}
        className={`flex-1 text-sm cursor-move ${subTask.completed ? "text-gray-400 line-through" : "text-gray-700"}`}
        {...attributes}
        {...listeners}
      >
        {subTask.title}
      </label>

      <Button
        variant="ghost"
        size="icon"
        className="h-6 w-6 text-gray-400 hover:text-red-500"
        onClick={() => onDeleteSubTask(subTask.id)}
      >
        <Trash className="h-3.5 w-3.5" />
      </Button>
    </div>
  )
}

