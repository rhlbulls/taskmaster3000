"use client"

import type React from "react"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import type { Task, SubTask } from "@/lib/types"
import { Plus } from "lucide-react"
import { nanoid } from "nanoid"
import SubTaskList from "@/components/sub-task-list"
import { DndContext, closestCenter, type DragEndEvent } from "@dnd-kit/core"
import { arrayMove } from "@dnd-kit/sortable"
import { useTaskContext } from "@/contexts/task-context"

interface TaskSubtasksProps {
  task: Task
  onUpdateTask: (task: Task) => void
}

export default function TaskSubtasks({ task, onUpdateTask }: TaskSubtasksProps) {
  const [newSubTaskTitle, setNewSubTaskTitle] = useState("")
  const { updateSubTaskOrder } = useTaskContext()

  const handleAddSubTask = (e: React.FormEvent) => {
    e.preventDefault()

    if (!newSubTaskTitle.trim()) return

    const newSubTask: SubTask = {
      id: nanoid(),
      title: newSubTaskTitle,
      completed: false,
      timeSpent: 0,
      position: task.subTasks?.length || 0,
    }

    const updatedSubTasks = [...(task.subTasks || []), newSubTask]

    onUpdateTask({
      ...task,
      subTasks: updatedSubTasks,
    })

    setNewSubTaskTitle("")
  }

  const handleSubTaskToggle = (subTaskId: string) => {
    const updatedSubTasks =
      task.subTasks?.map((subTask) =>
        subTask.id === subTaskId ? { ...subTask, completed: !subTask.completed } : subTask,
      ) || []

    onUpdateTask({
      ...task,
      subTasks: updatedSubTasks,
    })
  }

  const handleSubTaskDelete = (subTaskId: string) => {
    const updatedSubTasks = task.subTasks?.filter((subTask) => subTask.id !== subTaskId) || []

    onUpdateTask({
      ...task,
      subTasks: updatedSubTasks,
    })
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (!over || !task.subTasks) return

    if (active.id !== over.id) {
      const oldIndex = task.subTasks.findIndex((st) => `subtask-${task.id}-${st.id}` === active.id)
      const newIndex = task.subTasks.findIndex((st) => `subtask-${task.id}-${st.id}` === over.id)

      const newSubTasks = arrayMove(task.subTasks, oldIndex, newIndex)

      onUpdateTask({
        ...task,
        subTasks: newSubTasks,
      })

      updateSubTaskOrder(task.id, newSubTasks)
    }
  }

  return (
    <div className="mt-4 pl-8 border-t border-gray-100 pt-3">
      <div className="space-y-2">
        <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SubTaskList
            subTasks={task.subTasks || []}
            taskId={task.id}
            onToggleCompletion={handleSubTaskToggle}
            onDeleteSubTask={handleSubTaskDelete}
          />
        </DndContext>

        <form onSubmit={handleAddSubTask} className="flex gap-2 mt-3">
          <Input
            value={newSubTaskTitle}
            onChange={(e) => setNewSubTaskTitle(e.target.value)}
            placeholder="Add a subtask..."
            className="text-sm border-gray-200"
          />
          <Button
            type="submit"
            size="sm"
            className="bg-gray-800 hover:bg-gray-700 text-white dark:bg-gray-700 dark:hover:bg-gray-600"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  )
}

