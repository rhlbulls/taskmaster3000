"use client"

import { cn } from "@/lib/utils"

interface TaskPriorityBadgeProps {
  priority: string
}

export default function TaskPriorityBadge({ priority }: TaskPriorityBadgeProps) {
  const getPriorityStyles = () => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-700"
      case "medium":
        return "bg-amber-100 text-amber-700"
      case "low":
        return "bg-green-100 text-green-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  return (
    <span className={cn("text-xs px-1.5 py-0.5 rounded-full font-medium", getPriorityStyles())}>
      {priority.charAt(0).toUpperCase() + priority.slice(1)}
    </span>
  )
}

