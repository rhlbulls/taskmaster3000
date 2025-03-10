"use client"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { Task } from "@/lib/types"
import { formatTime } from "@/lib/utils"

interface TimerDisplayProps {
  activeTask: Task | null | undefined
  elapsedTime: number
  isTimerRunning: boolean
  onPauseTimer: () => void
  onResumeTimer: () => void
  onStopTimer: () => void
}

export default function TimerDisplay({
  activeTask,
  elapsedTime,
  isTimerRunning,
  onPauseTimer,
  onResumeTimer,
  onStopTimer,
}: TimerDisplayProps) {
  return (
    <div
      className={cn(
        "mb-8 p-4 rounded-xl transition-all duration-300 overflow-hidden w-full",
        activeTask
          ? "bg-gray-100 shadow-lg border border-gray-200 dark:bg-gray-800 dark:border-gray-700"
          : "bg-gray-50 border border-gray-200 dark:bg-gray-800/50 dark:border-gray-700",
      )}
    >
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex flex-col items-center md:items-start">
          <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
            {activeTask ? "Currently working on:" : "No active task"}
          </div>
          <div className="text-xl font-semibold text-gray-800 dark:text-gray-100 mt-1">
            {activeTask?.title || "Start a task to begin tracking"}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-4xl font-bold font-mono bg-white dark:bg-gray-900 px-4 py-2 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-100">
            {formatTime(elapsedTime)}
          </div>

          <div className="flex gap-2">
            {activeTask && (
              <>
                {isTimerRunning ? (
                  <Button
                    onClick={onPauseTimer}
                    className="bg-gray-800 hover:bg-gray-700 text-white dark:bg-gray-700 dark:hover:bg-gray-600"
                  >
                    Pause
                  </Button>
                ) : (
                  <Button
                    onClick={onResumeTimer}
                    className="bg-gray-800 hover:bg-gray-700 text-white dark:bg-gray-700 dark:hover:bg-gray-600"
                  >
                    Resume
                  </Button>
                )}
                <Button onClick={onStopTimer} variant="outline" className="border-gray-300 dark:border-gray-700">
                  Stop
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

