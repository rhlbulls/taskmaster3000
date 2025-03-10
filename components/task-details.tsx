"use client"

import type React from "react"

import { useState } from "react"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import type { Task } from "@/lib/types"
import { Trash } from "lucide-react"

interface TaskDetailsProps {
  task: Task
  onUpdateTask: (task: Task) => void
}

export default function TaskDetails({ task, onUpdateTask }: TaskDetailsProps) {
  const [newLink, setNewLink] = useState("")

  const handleAddLink = (e: React.FormEvent) => {
    e.preventDefault()

    if (!newLink.trim()) return

    const updatedLinks = [...(task.links || []), newLink]

    onUpdateTask({
      ...task,
      links: updatedLinks,
    })

    setNewLink("")
  }

  const handleRemoveLink = (index: number) => {
    const updatedLinks = task.links?.filter((_, i) => i !== index) || []

    onUpdateTask({
      ...task,
      links: updatedLinks,
    })
  }

  return (
    <div className="mt-4 pl-8 border-t border-gray-100 pt-3">
      <div className="space-y-3">
        <div>
          <h5 className="text-sm font-medium text-gray-700 mb-2">Description</h5>
          <Textarea
            value={task.description || ""}
            onChange={(e) => onUpdateTask({ ...task, description: e.target.value })}
            placeholder="Add a description..."
            className="text-sm border-gray-200 min-h-[80px]"
          />
        </div>

        <div>
          <h5 className="text-sm font-medium text-gray-700 mb-2">Links</h5>
          <div className="space-y-2">
            {task.links?.map((link, index) => (
              <div key={index} className="flex items-center gap-2">
                <a
                  href={link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 text-sm text-blue-600 hover:underline truncate"
                >
                  {link}
                </a>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 text-gray-400 hover:text-red-500"
                  onClick={() => handleRemoveLink(index)}
                >
                  <Trash className="h-3.5 w-3.5" />
                </Button>
              </div>
            ))}

            <form onSubmit={handleAddLink} className="flex gap-2">
              <Input
                value={newLink}
                onChange={(e) => setNewLink(e.target.value)}
                placeholder="Add a link..."
                className="text-sm border-gray-200"
              />
              <Button type="submit" size="sm" className="bg-purple-500 hover:bg-purple-600 text-white">
                Add
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

