"use client"

import { useState } from "react"
import type { Task } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Download, Upload } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"

interface TaskExportProps {
  tasks: Task[]
  onImport: (tasks: Task[]) => void
}

export default function TaskExport({ tasks, onImport }: TaskExportProps) {
  const [open, setOpen] = useState(false)
  const [importData, setImportData] = useState("")
  const { toast } = useToast()

  const handleExport = () => {
    const dataStr = JSON.stringify(tasks, null, 2)
    const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`

    const exportFileDefaultName = `taskmaster3000_export_${new Date().toISOString().slice(0, 10)}.json`

    const linkElement = document.createElement("a")
    linkElement.setAttribute("href", dataUri)
    linkElement.setAttribute("download", exportFileDefaultName)
    linkElement.click()

    toast({
      title: "Tasks exported successfully",
      description: `${tasks.length} tasks have been exported to ${exportFileDefaultName}`,
    })
  }

  const handleImport = () => {
    try {
      const importedTasks = JSON.parse(importData)

      if (!Array.isArray(importedTasks)) {
        throw new Error("Imported data is not an array")
      }

      // Validate that each item has required task properties
      importedTasks.forEach((task: any, index: number) => {
        if (!task.id || !task.title || !task.date) {
          throw new Error(`Task at index ${index} is missing required properties`)
        }
      })

      onImport(importedTasks)
      setImportData("")
      setOpen(false)

      toast({
        title: "Tasks imported successfully",
        description: `${importedTasks.length} tasks have been imported`,
      })
    } catch (error) {
      toast({
        title: "Import failed",
        description: error instanceof Error ? error.message : "Invalid JSON format",
        variant: "destructive",
      })
    }
  }

  return (
    <>
      <div className="flex gap-2">
        <Button variant="outline" size="sm" className="gap-2" onClick={handleExport}>
          <Download className="h-4 w-4" />
          Export
        </Button>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2">
              <Upload className="h-4 w-4" />
              Import
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Import Tasks</DialogTitle>
              <DialogDescription>Paste your exported JSON data below to import tasks</DialogDescription>
            </DialogHeader>

            <Textarea
              value={importData}
              onChange={(e) => setImportData(e.target.value)}
              placeholder="Paste JSON data here..."
              className="min-h-[200px]"
            />

            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleImport} disabled={!importData.trim()}>
                Import
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </>
  )
}

