"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect, useRef } from "react"
import type { Task } from "@/lib/types"
import { useTaskContext } from "@/contexts/task-context"

// Define the shape of the timer context
type TimerContextType = {
  activeTaskId: string | null
  timerRunning: boolean
  elapsedTime: number
  startTimer: (taskId: string) => void
  pauseTimer: () => void
  stopTimer: () => void
  activeTask: Task | null
}

// Create the context with a placeholder value
const TimerContext = createContext<TimerContextType | null>(null)

// Custom hook to use the timer context
export const useTimer = () => {
  const context = useContext(TimerContext)
  if (!context) {
    throw new Error("useTimer must be used within a TimerProvider")
  }
  return context
}

// Provider component that wraps the app
export function TimerProvider({ children }: { children: React.ReactNode }) {
  const { tasks, updateTask } = useTaskContext()

  const [activeTaskId, setActiveTaskId] = useState<string | null>(null)
  const [timerRunning, setTimerRunning] = useState(false)
  const [elapsedTime, setElapsedTime] = useState(0)

  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const timerStartRef = useRef<number | null>(null)

  // Timer logic
  useEffect(() => {
    if (timerRunning && activeTaskId) {
      timerStartRef.current = Date.now() - elapsedTime * 1000

      timerRef.current = setInterval(() => {
        if (timerStartRef.current) {
          const newElapsed = Math.floor((Date.now() - timerStartRef.current) / 1000)
          setElapsedTime(newElapsed)
        }
      }, 1000)
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current)
        timerRef.current = null
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [timerRunning, activeTaskId])

  // Update task time when timer stops or pauses
  useEffect(() => {
    // Only update the task in the database when the timer stops or pauses
    if (!timerRunning && activeTaskId && elapsedTime > 0) {
      const task = tasks.find((t) => t.id === activeTaskId)
      if (task && task.timeSpent !== elapsedTime) {
        updateTask({ ...task, timeSpent: elapsedTime })
      }
    }
  }, [timerRunning, activeTaskId, elapsedTime, tasks, updateTask])

  // Get the active task
  const activeTask = activeTaskId ? tasks.find((task) => task.id === activeTaskId) || null : null

  // Start the timer for a task
  const startTimer = (taskId: string) => {
    // If a different task is already running, stop it first
    if (timerRunning && activeTaskId && activeTaskId !== taskId) {
      stopTimer()
    }

    const task = tasks.find((t) => t.id === taskId)
    if (task) {
      setActiveTaskId(taskId)
      setElapsedTime(task.timeSpent || 0)
      setTimerRunning(true)
    }
  }

  // Pause the timer
  const pauseTimer = () => {
    setTimerRunning(false)
  }

  // Stop the timer
  const stopTimer = () => {
    if (activeTaskId && elapsedTime > 0) {
      const task = tasks.find((t) => t.id === activeTaskId)
      if (task && task.timeSpent !== elapsedTime) {
        updateTask({ ...task, timeSpent: elapsedTime })
      }
    }

    setTimerRunning(false)
    setActiveTaskId(null)
    setElapsedTime(0)
  }

  return (
    <TimerContext.Provider
      value={{
        activeTaskId,
        timerRunning,
        elapsedTime,
        startTimer,
        pauseTimer,
        stopTimer,
        activeTask,
      }}
    >
      {children}
    </TimerContext.Provider>
  )
}

