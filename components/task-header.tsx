"use client"

import { Calendar } from "lucide-react"
import DateSelector from "@/components/date-selector"
import ThemeToggle from "@/components/theme-toggle"
import AuthButton from "@/components/auth-button"
import { useTaskContext } from "@/contexts/task-context"

export default function TaskHeader() {
  // Get state and functions from context
  const { selectedDate, setSelectedDate } = useTaskContext()

  const handlePreviousDay = () => {
    const newDate = new Date(selectedDate)
    newDate.setDate(newDate.getDate() - 1)
    setSelectedDate(newDate)
  }

  const handleNextDay = () => {
    const newDate = new Date(selectedDate)
    newDate.setDate(newDate.getDate() + 1)
    setSelectedDate(newDate)
  }

  return (
    <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div className="flex items-center gap-2">
        <Calendar className="h-8 w-8 text-gray-700 dark:text-gray-300" />
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">TaskMaster3000</h1>
      </div>

      <div className="flex items-center gap-3">
        {/* Auth button */}
        <AuthButton />

        {/* Theme toggle */}
        <ThemeToggle />

        {/* Date selector */}
        <DateSelector
          selectedDate={selectedDate}
          onPrevious={handlePreviousDay}
          onNext={handleNextDay}
          onSelectDate={setSelectedDate}
        />
      </div>
    </header>
  )
}

