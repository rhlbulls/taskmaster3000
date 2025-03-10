"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"

interface SubTaskFormProps {
  initialTitle?: string
  onSubmit: (title: string) => void
  onCancel: () => void
}

export default function SubTaskForm({ initialTitle = "", onSubmit, onCancel }: SubTaskFormProps) {
  const [title, setTitle] = useState(initialTitle)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!title.trim()) return

    onSubmit(title)
  }

  return (
    <Card className="p-3 bg-slate-800/40 border-slate-700/60">
      <form onSubmit={handleSubmit} className="space-y-2">
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter subtask title"
          className="bg-slate-900 border-slate-700 text-white text-sm"
          autoFocus
        />

        <div className="flex justify-end gap-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onCancel}
            className="text-xs text-slate-400 hover:text-slate-300 hover:bg-slate-700/70"
          >
            Cancel
          </Button>
          <Button type="submit" size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-xs">
            {initialTitle ? "Update" : "Add"} Subtask
          </Button>
        </div>
      </form>
    </Card>
  )
}

