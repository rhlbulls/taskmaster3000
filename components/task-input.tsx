"use client"

import type React from "react"

import { useState } from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface TaskInputProps {
  onAddTask: (title: string) => Promise<void>
}

export default function TaskInput({ onAddTask }: TaskInputProps) {
  const [newTaskTitle, setNewTaskTitle] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!newTaskTitle.trim()) return

    await onAddTask(newTaskTitle)
    setNewTaskTitle("")
  }

  return (
    <form onSubmit={handleSubmit} className="mb-8 flex gap-2">
      <Input
        id="new-task-input"
        value={newTaskTitle}
        onChange={(e) => setNewTaskTitle(e.target.value)}
        placeholder="Add a new task..."
        className="text-base border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
      />
      <Button
        type="submit"
        className="bg-gray-800 hover:bg-gray-700 text-white dark:bg-gray-700 dark:hover:bg-gray-600 whitespace-nowrap"
      >
        <Plus className="h-5 w-5 mr-2" />
        Add Task
      </Button>
    </form>
  )
}

