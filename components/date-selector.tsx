"use client"

import { useState } from "react"
import { format, isSameDay } from "date-fns"
import { ChevronLeft, ChevronRight, CalendarIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { cn } from "@/lib/utils"

interface DateSelectorProps {
  selectedDate: Date
  onPrevious: () => void
  onNext: () => void
  onSelectDate: (date: Date) => void
}

export default function DateSelector({ selectedDate, onPrevious, onNext, onSelectDate }: DateSelectorProps) {
  const [open, setOpen] = useState(false)

  const today = new Date()
  const isToday = isSameDay(selectedDate, today)

  return (
    <div className="flex items-center gap-2 bg-white dark:bg-gray-800 rounded-full px-2 py-1 border border-gray-200 dark:border-gray-700 shadow-sm">
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:bg-gray-700 rounded-full"
        onClick={onPrevious}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            className={cn(
              "px-3 font-normal text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full",
              isToday &&
                "bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600",
            )}
          >
            {isToday ? "Today" : format(selectedDate, "MMM d, yyyy")}
            <CalendarIcon className="ml-2 h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="center">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={(date) => {
              if (date) {
                onSelectDate(date)
                setOpen(false)
              }
            }}
            initialFocus
          />
        </PopoverContent>
      </Popover>

      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:bg-gray-700 rounded-full"
        onClick={onNext}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  )
}

