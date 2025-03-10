"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import type { Task } from "@/lib/types"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { X, Plus } from "lucide-react"

interface TaskEditFormProps {
  task: Task
  onSave: (task: Task) => void
  onCancel: () => void
}

export default function TaskEditForm({ task, onSave, onCancel }: TaskEditFormProps) {
  const [editTitle, setEditTitle] = useState(task.title)
  const [editDescription, setEditDescription] = useState(task.description || "")
  const [priority, setPriority] = useState(task.priority || "medium")
  const [tags, setTags] = useState<string[]>(task.tags || [])
  const [newTag, setNewTag] = useState("")

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
      description: editDescription,
      priority,
      tags,
    })
  }

  const handleAddTag = () => {
    if (!newTag.trim() || tags.includes(newTag.trim())) return

    setTags([...tags, newTag.trim()])
    setNewTag("")
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove))
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && newTag.trim()) {
      e.preventDefault()
      handleAddTag()
    }
  }

  return (
    <div className="p-4">
      <Input
        ref={titleInputRef}
        value={editTitle}
        onChange={(e) => setEditTitle(e.target.value)}
        className="mb-3 font-medium border-gray-300"
      />

      <div className="grid grid-cols-2 gap-3 mb-3">
        <div>
          <label className="text-sm text-gray-600 mb-1 block">Priority</label>
          <Select value={priority} onValueChange={setPriority}>
            <SelectTrigger className="border-gray-300">
              <SelectValue placeholder="Select priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="low">Low</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-sm text-gray-600 mb-1 block">Tags</label>
          <div className="flex gap-2">
            <Input
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Add tag..."
              className="border-gray-300"
            />
            <Button type="button" size="icon" onClick={handleAddTag} disabled={!newTag.trim()}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="gap-1 bg-gray-100 hover:bg-gray-200 text-gray-700">
              {tag}
              <X className="h-3 w-3 cursor-pointer" onClick={() => handleRemoveTag(tag)} />
            </Badge>
          ))}
        </div>
      )}

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

