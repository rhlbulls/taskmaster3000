"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect } from "react"
import { format } from "date-fns"
import type { Task } from "@/lib/types"
import { useAuth } from "@/contexts/auth-context"
import { ref, onValue, push, update, remove, query, orderByChild, equalTo, get } from "firebase/database"
import { db } from "@/lib/firebase"
import type { SubTask } from "@/lib/types"

// Define the shape of the task context
type TaskContextType = {
  // Task data
  tasks: Task[]
  isLoading: boolean

  // Date selection
  selectedDate: Date
  setSelectedDate: (date: Date) => void

  // Filtered task lists
  activeTasks: Task[]
  completedTasks: Task[]

  // Task operations
  addTask: (title: string) => Promise<void>
  updateTask: (updatedTask: Task) => Promise<void>
  toggleTaskCompletion: (taskId: string) => Promise<void>
  deleteTask: (taskId: string) => Promise<void>
  refreshTasks: () => Promise<void>
  updateTaskOrder: (reorderedTasks: Task[]) => Promise<void>
  updateSubTaskOrder: (taskId: string, reorderedSubTasks: SubTask[]) => Promise<void>
}

// Create the context with a placeholder value
const TaskContext = createContext<TaskContextType | null>(null)

// Custom hook to use the task context
export const useTaskContext = () => {
  const context = useContext(TaskContext)
  if (!context) {
    throw new Error("useTaskContext must be used within a TaskProvider")
  }
  return context
}

// Provider component that wraps the app
export function TaskProvider({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated } = useAuth()
  const [tasks, setTasks] = useState<Task[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())

  useEffect(() => {
    if (!isAuthenticated || !user) {
      setTasks([])
      setIsLoading(false)
      return
    }

    setIsLoading(true)

    const tasksRef = ref(db, `tasks/${user.uid}`)
    const tasksQuery = query(tasksRef, orderByChild("date"), equalTo(format(selectedDate, "yyyy-MM-dd")))

    const unsubscribe = onValue(
      tasksQuery,
      (snapshot) => {
        const taskList: Task[] = []

        snapshot.forEach((childSnapshot) => {
          const taskData = childSnapshot.val()
          taskList.push({
            id: childSnapshot.key!,
            ...taskData,
          })
        })

        setTasks(taskList.sort((a, b) => (a.position || 0) - (b.position || 0)))
        setIsLoading(false)
      },
      (error) => {
        console.error("Error loading tasks:", error)
        setIsLoading(false)
      },
    )

    return () => unsubscribe()
  }, [user, isAuthenticated, selectedDate])

  const addTask = async (title: string) => {
    if (!title.trim() || !isAuthenticated || !user) return

    try {
      const tasksRef = ref(db, `tasks/${user.uid}`)
      const newTaskRef = push(tasksRef)
      const newTask: Task = {
        id: newTaskRef.key!,
        title,
        date: format(selectedDate, "yyyy-MM-dd"),
        completed: false,
        timeSpent: 0,
        subTasks: [],
        description: "",
        links: [],
        position: tasks.length,
      }
      await update(newTaskRef, newTask)
    } catch (error) {
      console.error("Error adding task:", error)
    }
  }

  const updateTask = async (updatedTask: Task) => {
    if (!isAuthenticated || !user) return

    try {
      const taskRef = ref(db, `tasks/${user.uid}/${updatedTask.id}`)
      await update(taskRef, updatedTask)
    } catch (error) {
      console.error("Error updating task:", error)
    }
  }

  const toggleTaskCompletion = async (taskId: string) => {
    if (!isAuthenticated || !user) return

    try {
      const task = tasks.find((t) => t.id === taskId)
      if (!task) return

      const taskRef = ref(db, `tasks/${user.uid}/${taskId}`)
      await update(taskRef, { completed: !task.completed })
    } catch (error) {
      console.error("Error toggling task completion:", error)
    }
  }

  const deleteTask = async (taskId: string) => {
    if (!isAuthenticated || !user) return

    try {
      const taskRef = ref(db, `tasks/${user.uid}/${taskId}`)
      await remove(taskRef)
    } catch (error) {
      console.error("Error deleting task:", error)
    }
  }

  const refreshTasks = async () => {
    if (!isAuthenticated || !user) return

    setIsLoading(true)
    const tasksRef = ref(db, `tasks/${user.uid}`)
    const tasksQuery = query(tasksRef, orderByChild("date"), equalTo(format(selectedDate, "yyyy-MM-dd")))

    try {
      const snapshot = await get(tasksQuery)
      const taskList: Task[] = []

      snapshot.forEach((childSnapshot) => {
        const taskData = childSnapshot.val()
        taskList.push({
          id: childSnapshot.key!,
          ...taskData,
        })
      })

      setTasks(taskList.sort((a, b) => (a.position || 0) - (b.position || 0)))
    } catch (error) {
      console.error("Error refreshing tasks:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const updateTaskOrder = async (reorderedTasks: Task[]) => {
    if (!isAuthenticated || !user) return

    const updates: { [key: string]: number } = {}
    reorderedTasks.forEach((task, index) => {
      updates[`${task.id}/position`] = index
    })

    try {
      const tasksRef = ref(db, `tasks/${user.uid}`)
      await update(tasksRef, updates)
    } catch (error) {
      console.error("Error updating task order:", error)
    }
  }

  const updateSubTaskOrder = async (taskId: string, reorderedSubTasks: SubTask[]) => {
    if (!isAuthenticated || !user) return

    const updates: { [key: string]: number } = {}
    reorderedSubTasks.forEach((subTask, index) => {
      updates[`${taskId}/subTasks/${subTask.id}/position`] = index
    })

    try {
      const taskRef = ref(db, `tasks/${user.uid}`)
      await update(taskRef, updates)
    } catch (error) {
      console.error("Error updating subtask order:", error)
    }
  }

  return (
    <TaskContext.Provider
      value={{
        tasks,
        isLoading,
        selectedDate,
        setSelectedDate,
        activeTasks: tasks.filter((task) => !task.completed),
        completedTasks: tasks.filter((task) => task.completed),
        addTask,
        updateTask,
        toggleTaskCompletion,
        deleteTask,
        refreshTasks,
        updateTaskOrder,
        updateSubTaskOrder,
      }}
    >
      {children}
    </TaskContext.Provider>
  )
}

