"use client"

import type React from "react"

import { useState } from "react"
import { Plus, X } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

interface TaskDetailsFormProps {
  description: string
  links: string[]
  onSubmit: (description: string, links: string[]) => void
  onCancel: () => void
}

export default function TaskDetailsForm({ description, links = [], onSubmit, onCancel }: TaskDetailsFormProps) {
  const [taskDescription, setTaskDescription] = useState(description)
  const [taskLinks, setTaskLinks] = useState<string[]>(links)
  const [newLink, setNewLink] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(taskDescription, taskLinks)
  }

  const addLink = () => {
    if (!newLink.trim()) return

    setTaskLinks([...taskLinks, newLink])
    setNewLink("")
  }

  const removeLink = (index: number) => {
    setTaskLinks(taskLinks.filter((_, i) => i !== index))
  }

  return (
    <Dialog open={true} onOpenChange={onCancel}>
      <DialogContent className="sm:max-w-md bg-slate-800 border-slate-700 text-white">
        <DialogHeader>
          <DialogTitle>Task Details</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={taskDescription}
              onChange={(e) => setTaskDescription(e.target.value)}
              placeholder="Add a detailed description..."
              className="bg-slate-900 border-slate-700 text-white min-h-24"
            />
          </div>

          <div>
            <Label htmlFor="links">Links</Label>
            <div className="space-y-2">
              {taskLinks.map((link, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Input value={link} readOnly className="bg-slate-900 border-slate-700 text-white" />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-slate-400 hover:text-red-300 hover:bg-slate-700/70"
                    onClick={() => removeLink(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}

              <div className="flex items-center gap-2">
                <Input
                  id="new-link"
                  value={newLink}
                  onChange={(e) => setNewLink(e.target.value)}
                  placeholder="Add a link (https://...)"
                  className="bg-slate-900 border-slate-700 text-white"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-slate-400 hover:text-emerald-300 hover:bg-slate-700/70"
                  onClick={addLink}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
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
              Save Details
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

