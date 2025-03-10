"use client"

import { useState } from "react"
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay } from "date-fns"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

interface DatePickerProps {
  selectedDate: Date
  onSelect: (date: Date) => void
  onClose: () => void
}

export default function DatePicker({ selectedDate, onSelect, onClose }: DatePickerProps) {
  const [currentMonth, setCurrentMonth] = useState(startOfMonth(selectedDate))

  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

  const monthStart = startOfMonth(currentMonth)
  const monthEnd = endOfMonth(monthStart)
  const dateRange = eachDayOfInterval({ start: monthStart, end: monthEnd })

  const handlePreviousMonth = () => setCurrentMonth(subMonths(currentMonth, 1))
  const handleNextMonth = () => setCurrentMonth(addMonths(currentMonth, 1))

  const handleSelectDate = (date: Date) => {
    onSelect(date)
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-slate-800 border-slate-700 text-white">
        <DialogHeader>
          <DialogTitle>Select Date</DialogTitle>
        </DialogHeader>

        <div className="p-2">
          <div className="flex items-center justify-between mb-4">
            <Button
              variant="outline"
              size="icon"
              className="border-slate-700 text-slate-300 hover:text-white hover:bg-slate-700"
              onClick={handlePreviousMonth}
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>

            <h3 className="text-lg font-medium">{format(currentMonth, "MMMM yyyy")}</h3>

            <Button
              variant="outline"
              size="icon"
              className="border-slate-700 text-slate-300 hover:text-white hover:bg-slate-700"
              onClick={handleNextMonth}
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>

          <div className="grid grid-cols-7 gap-1">
            {days.map((day) => (
              <div key={day} className="text-center text-sm font-medium text-slate-400 py-1">
                {day}
              </div>
            ))}

            {Array.from({ length: monthStart.getDay() }).map((_, i) => (
              <div key={`empty-start-${i}`} className="p-2" />
            ))}

            {dateRange.map((date) => {
              const isSelected = isSameDay(date, selectedDate)
              const isToday = isSameDay(date, new Date())

              return (
                <button
                  key={date.toString()}
                  className={`
                    aspect-square flex items-center justify-center rounded-full text-sm
                    ${
                      isSelected
                        ? "bg-emerald-600 text-white"
                        : isToday
                          ? "bg-slate-700 text-white"
                          : "hover:bg-slate-700 text-slate-300"
                    }
                  `}
                  onClick={() => handleSelectDate(date)}
                >
                  {date.getDate()}
                </button>
              )
            })}
          </div>

          <div className="mt-4 flex justify-end">
            <Button className="bg-emerald-600 hover:bg-emerald-700" onClick={() => onSelect(new Date())}>
              Today
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

