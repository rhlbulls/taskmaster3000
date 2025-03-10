"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import type { Task } from "@/lib/types"

interface TaskEditFormProps {
  task: Task
  onSave: (task: Task) => void
  onCancel: () => void
}

export default function TaskEditForm({ task, onSave, onCancel }: TaskEditFormProps) {
  const [editTitle, setEditTitle] = useState(task.title)
  const [editDescription, setEditDescription] = useState(task.description || "")

  const titleInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (titleInputRef.current) {
      titleInputRef.current.focus()
    }
  }, [])

  const handleSave = () => {
    if (!editTitle.trim()) return

    onSave({
      ...task,
      title: editTitle,
      description: editDescription
    })
  }

  return (
    <div className="p-4">
      <Input
        ref={titleInputRef}
        value={editTitle}
        onChange={(e) => setEditTitle(e.target.value)}
        className="mb-3 font-medium border-gray-300"
      />
      <Textarea
        value={editDescription}
        onChange={(e) => setEditDescription(e.target.value)}
        placeholder="Add description (optional)"
        className="mb-3 text-sm border-gray-300 min-h-[80px]"
      />

      <div className="flex justify-end gap-2">
        <Button variant="outline" size="sm" onClick={onCancel}>
          Cancel
        </Button>
        <Button size="sm" onClick={handleSave} className="bg-purple-500 hover:bg-purple-600 text-white">
          Save
        </Button>
      </div>
    </div>
  )
}

