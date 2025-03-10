import type { Metadata } from "next"
import TaskManager from "@/components/task-manager"

export const metadata: Metadata = {
  title: "TaskMaster3000",
  description: "A task management app with time tracking",
}

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <TaskManager />
    </div>
  )
}

