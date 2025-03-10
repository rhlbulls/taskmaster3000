"use client"

import { DndContext, closestCenter, type DragEndEvent } from "@dnd-kit/core"
import { arrayMove } from "@dnd-kit/sortable"
import TaskHeader from "@/components/task-header"
import TaskInput from "@/components/task-input"
import TaskColumns from "@/components/task-columns"
import TimerDisplay from "@/components/timer-display"
import { useTaskContext } from "@/contexts/task-context"
import { useTimer } from "@/contexts/timer-context"
import { useAuth } from "@/contexts/auth-context"
import LoginPrompt from "@/components/login-prompt"
import { Button } from "@/components/ui/button"
import { RefreshCw } from "lucide-react"

export default function TaskManager() {
  const { isAuthenticated } = useAuth()
  const {
    tasks,
    activeTasks,
    completedTasks,
    toggleTaskCompletion,
    updateTask,
    deleteTask,
    addTask,
    isLoading,
    refreshTasks,
    updateTaskOrder,
  } = useTaskContext()
  const { activeTaskId, timerRunning, elapsedTime, startTimer, pauseTimer, stopTimer, activeTask } = useTimer()

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (!over) return

    if (active.id !== over.id) {
      const oldIndex = tasks.findIndex((t) => `task-${t.id}` === active.id)
      const newIndex = tasks.findIndex((t) => `task-${t.id}` === over.id)

      const newTasks = arrayMove(tasks, oldIndex, newIndex)
      updateTaskOrder(newTasks)
    }
  }

  const handleToggleCompletion = (taskId: string) => {
    if (taskId === activeTaskId) {
      stopTimer()
    }
    toggleTaskCompletion(taskId)
  }

  const handleDeleteTask = (taskId: string) => {
    if (taskId === activeTaskId) {
      stopTimer()
    }
    deleteTask(taskId)
  }

  return (
    <div className="container mx-auto py-6 px-4 max-w-5xl">
      <TaskHeader />

      {!isAuthenticated ? (
        <LoginPrompt />
      ) : (
        <>
          <TimerDisplay
            activeTask={activeTask}
            elapsedTime={elapsedTime}
            isTimerRunning={timerRunning}
            onPauseTimer={pauseTimer}
            onResumeTimer={() => activeTaskId && startTimer(activeTaskId)}
            onStopTimer={stopTimer}
          />

          <TaskInput onAddTask={addTask} />

          <div className="mb-8 flex justify-end">
            <Button onClick={refreshTasks} variant="outline" size="sm" className="gap-2">
              <RefreshCw className="h-4 w-4" />
              Refresh Tasks
            </Button>
          </div>

          <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <TaskColumns
              activeTasks={activeTasks}
              completedTasks={completedTasks}
              onToggleCompletion={handleToggleCompletion}
              onUpdateTask={updateTask}
              onDeleteTask={handleDeleteTask}
              onStartTimer={startTimer}
              activeTaskId={activeTaskId}
              timerRunning={timerRunning}
              isLoading={isLoading}
            />
          </DndContext>
        </>
      )}
    </div>
  )
}

