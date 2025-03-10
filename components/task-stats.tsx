"use client"

import { useState } from "react"
import { format, startOfWeek, endOfWeek, eachDayOfInterval, parseISO } from "date-fns"
import { Card } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { formatTime } from "@/lib/utils"
import { useTaskContext } from "@/contexts/task-context"

export default function TaskStats() {
  // Get tasks from context
  const { tasks } = useTaskContext()

  const [view, setView] = useState("today")

  // Get today's date
  const today = new Date()

  // Get this week's date range
  const weekStart = startOfWeek(today, { weekStartsOn: 1 }) // Start on Monday
  const weekEnd = endOfWeek(today, { weekStartsOn: 1 })
  const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd })

  // Filter tasks based on view
  const filteredTasks = tasks.filter((task) => {
    const taskDate = parseISO(task.date)

    if (view === "today") {
      return format(taskDate, "yyyy-MM-dd") === format(today, "yyyy-MM-dd")
    } else if (view === "week") {
      return taskDate >= weekStart && taskDate <= weekEnd
    } else {
      return true // "all" view
    }
  })

  // Calculate stats
  const totalTasks = filteredTasks.length
  const completedTasks = filteredTasks.filter((task) => task.completed).length
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0

  const totalTimeSpent = filteredTasks.reduce((total, task) => total + (task.timeSpent || 0), 0)

  // Group tasks by priority
  const tasksByPriority = filteredTasks.reduce(
    (acc, task) => {
      const priority = task.priority || "none"
      if (!acc[priority]) acc[priority] = []
      acc[priority].push(task)
      return acc
    },
    {} as Record<string, typeof tasks>,
  )

  // Group tasks by tag
  const tasksByTag = filteredTasks.reduce(
    (acc, task) => {
      if (task.tags && task.tags.length > 0) {
        task.tags.forEach((tag) => {
          if (!acc[tag]) acc[tag] = []
          acc[tag].push(task)
        })
      } else {
        if (!acc["untagged"]) acc["untagged"] = []
        acc["untagged"].push(task)
      }
      return acc
    },
    {} as Record<string, typeof tasks>,
  )

  // Calculate daily stats for the week
  const dailyStats = weekDays.map((day) => {
    const dayTasks = tasks.filter((task) => format(parseISO(task.date), "yyyy-MM-dd") === format(day, "yyyy-MM-dd"))

    const completed = dayTasks.filter((task) => task.completed).length
    const total = dayTasks.length
    const timeSpent = dayTasks.reduce((sum, task) => sum + (task.timeSpent || 0), 0)

    return {
      date: day,
      completed,
      total,
      timeSpent,
    }
  })

  return (
    <div className="space-y-6">
      <Tabs defaultValue="today" value={view} onValueChange={setView}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="today">Today</TabsTrigger>
          <TabsTrigger value="week">This Week</TabsTrigger>
          <TabsTrigger value="all">All Time</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4 dark:bg-gray-800">
          <h3 className="text-lg font-medium mb-2">Task Completion</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Total Tasks</span>
              <span className="font-medium">{totalTasks}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Completed</span>
              <span className="font-medium text-green-600 dark:text-green-400">{completedTasks}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Completion Rate</span>
              <span className="font-medium">{completionRate}%</span>
            </div>

            {/* Progress bar */}
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mt-2">
              <div
                className="bg-green-600 dark:bg-green-500 h-2.5 rounded-full"
                style={{ width: `${completionRate}%` }}
              ></div>
            </div>
          </div>
        </Card>

        <Card className="p-4 dark:bg-gray-800">
          <h3 className="text-lg font-medium mb-2">Time Tracking</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Total Time Spent</span>
              <span className="font-medium">{formatTime(totalTimeSpent)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Average Per Task</span>
              <span className="font-medium">
                {totalTasks > 0 ? formatTime(Math.round(totalTimeSpent / totalTasks)) : "0s"}
              </span>
            </div>
          </div>
        </Card>

        <Card className="p-4 dark:bg-gray-800">
          <h3 className="text-lg font-medium mb-2">Task Breakdown</h3>
          <div className="space-y-2">
            {Object.entries(tasksByPriority).map(([priority, tasks]) => (
              <div key={priority} className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">
                  {priority.charAt(0).toUpperCase() + priority.slice(1)} Priority
                </span>
                <span className="font-medium">{tasks.length}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {view === "week" && (
        <Card className="p-4 dark:bg-gray-800">
          <h3 className="text-lg font-medium mb-4">Weekly Overview</h3>
          <div className="grid grid-cols-7 gap-2">
            {dailyStats.map((day, index) => (
              <div key={index} className="text-center">
                <div className="text-sm text-gray-500 dark:text-gray-400">{format(day.date, "EEE")}</div>
                <div className="text-sm font-medium">{format(day.date, "d")}</div>
                <div className="mt-2 h-20 flex flex-col items-center justify-end">
                  <div
                    className={`w-full max-w-[30px] ${
                      day.total > 0 ? "bg-purple-200 dark:bg-purple-800" : "bg-gray-100 dark:bg-gray-700"
                    } rounded-t-sm`}
                    style={{
                      height: `${day.total > 0 ? Math.min(100, day.total * 10) : 5}%`,
                    }}
                  >
                    <div
                      className="bg-purple-500 dark:bg-purple-400 w-full rounded-t-sm transition-all duration-300"
                      style={{
                        height: `${day.total > 0 ? (day.completed / day.total) * 100 : 0}%`,
                      }}
                    ></div>
                  </div>
                </div>
                <div className="text-xs mt-1 text-gray-600 dark:text-gray-400">
                  {day.completed}/{day.total}
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {Object.keys(tasksByTag).length > 0 && (
        <Card className="p-4 dark:bg-gray-800">
          <h3 className="text-lg font-medium mb-2">Tasks by Tag</h3>
          <div className="space-y-2">
            {Object.entries(tasksByTag).map(([tag, tasks]) => (
              <div key={tag} className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">{tag === "untagged" ? "Untagged" : tag}</span>
                <span className="font-medium">{tasks.length}</span>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  )
}

