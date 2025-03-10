"use client"

import { useEffect, useCallback } from "react"
import { useToast } from "@/components/ui/use-toast"
import { useTaskContext } from "@/contexts/task-context"

interface KeyboardShortcutsProps {
  onAddTask: () => void
  onFocusSearch: () => void
}

export default function KeyboardShortcuts({ onAddTask, onFocusSearch }: KeyboardShortcutsProps) {
  const { setShowStats, clearFilters } = useTaskContext()
  const { toast } = useToast()

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      // Only trigger if not in an input, textarea, or select
      if (
        document.activeElement instanceof HTMLInputElement ||
        document.activeElement instanceof HTMLTextAreaElement ||
        document.activeElement instanceof HTMLSelectElement
      ) {
        return
      }

      // Ctrl/Cmd + / to show shortcuts
      if ((e.ctrlKey || e.metaKey) && e.key === "/") {
        e.preventDefault()
        toast({
          title: "Keyboard Shortcuts",
          description: (
            <div className="grid grid-cols-2 gap-2 mt-2">
              <div>Add new task</div>
              <div className="font-mono bg-gray-100 dark:bg-gray-800 px-1 rounded text-sm">N</div>
              <div>Toggle stats view</div>
              <div className="font-mono bg-gray-100 dark:bg-gray-800 px-1 rounded text-sm">S</div>
              <div>Focus search</div>
              <div className="font-mono bg-gray-100 dark:bg-gray-800 px-1 rounded text-sm">/</div>
              <div>Clear all filters</div>
              <div className="font-mono bg-gray-100 dark:bg-gray-800 px-1 rounded text-sm">Esc</div>
            </div>
          ),
        })
      }

      // N to add new task
      if (e.key === "n" || e.key === "N") {
        e.preventDefault()
        onAddTask()
      }

      // S to toggle stats
      if (e.key === "s" || e.key === "S") {
        e.preventDefault()
        setShowStats((prev) => !prev)
      }

      // / to focus search
      if (e.key === "/") {
        e.preventDefault()
        onFocusSearch()
      }

      // Esc to clear filters
      if (e.key === "Escape") {
        e.preventDefault()
        clearFilters()
      }
    },
    [onAddTask, setShowStats, clearFilters, onFocusSearch, toast],
  )

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown)

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [handleKeyDown])

  // This component doesn't render anything
  return null
}

