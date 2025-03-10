"use client"

import type React from "react"

import { useState } from "react"
import { format } from "date-fns"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { nanoid } from "nanoid"
import type { Task } from "@/lib/types"

interface TaskFormProps {
  task?: Task
  onSubmit: (task: Task) => void
  onCancel: () => void
  selectedDate: Date
}

export default function TaskForm({ task, onSubmit, onCancel, selectedDate }: TaskFormProps) {
  const [title, setTitle] = useState(task?.title || "")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!title.trim()) return

    const newTask: Task = {
      id: task?.id || nanoid(),
      title,
      date: format(selectedDate, "yyyy-MM-dd'T'HH:mm:ss"),
      completed: task?.completed || false,
      timeSpent: task?.timeSpent || 0,
      subTasks: task?.subTasks || [],
      description: task?.description || "",
      links: task?.links || [],
      position: task?.position || 0,
    }

    onSubmit(newTask)
  }

  return (
    <Dialog open={true} onOpenChange={onCancel}>
      <DialogContent className="sm:max-w-md bg-slate-800 border-slate-700 text-white">
        <DialogHeader>
          <DialogTitle>{task ? "Edit Task" : "Add New Task"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div>
            <Label htmlFor="title">Task Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter task title"
              className="bg-slate-900 border-slate-700 text-white"
              autoFocus
              required
            />
          </div>

          <DialogFooter className="mt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              className="border-slate-700 text-slate-300 hover:text-white hover:bg-slate-700"
            >
              Cancel
            </Button>
            <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700">
              {task ? "Update" : "Add"} Task
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

