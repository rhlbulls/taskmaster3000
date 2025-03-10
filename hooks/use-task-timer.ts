"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import type { Task } from "@/lib/types"

export function useTaskTimer(tasks: Task[], setTasks: React.Dispatch<React.SetStateAction<Task[]>>) {
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

  // Update task time when timer changes
  useEffect(() => {
    if (activeTaskId && elapsedTime > 0) {
      setTasks((prev) => prev.map((task) => (task.id === activeTaskId ? { ...task, timeSpent: elapsedTime } : task)))
    }
  }, [elapsedTime, activeTaskId, setTasks])

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

  const pauseTimer = () => {
    setTimerRunning(false)
  }

  const stopTimer = () => {
    setTimerRunning(false)
    setActiveTaskId(null)
    setElapsedTime(0)
  }

  return {
    activeTaskId,
    timerRunning,
    elapsedTime,
    startTimer,
    pauseTimer,
    stopTimer,
  }
}

