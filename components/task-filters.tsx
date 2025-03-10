"use client"

import { useState, type RefObject, useRef, useEffect } from "react"
import { Search, Filter, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { useTaskContext } from "@/contexts/task-context"

interface TaskFiltersProps {
  searchInputRef?: RefObject<HTMLInputElement>
}

export default function TaskFilters({ searchInputRef }: TaskFiltersProps) {
  // Get filter state and functions from context
  const {
    filterPriority,
    setFilterPriority,
    filterTag,
    setFilterTag,
    searchQuery,
    setSearchQuery,
    allTags,
    clearFilters,
  } = useTaskContext()

  const [showSearch, setShowSearch] = useState(false)

  // Add a ref to track if this is the initial render
  const isInitialRender = useRef(true)

  // Add an effect to prevent search input focus on initial render
  useEffect(() => {
    // Skip focusing on initial render
    if (!isInitialRender.current && showSearch && searchInputRef?.current) {
      searchInputRef.current.focus()
    }
    isInitialRender.current = false
  }, [showSearch, searchInputRef])

  // Available priorities
  const priorities = ["high", "medium", "low"]

  // Get color for priority display
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "text-red-600 dark:text-red-400"
      case "medium":
        return "text-amber-600 dark:text-amber-400"
      case "low":
        return "text-green-600 dark:text-green-400"
      default:
        return ""
    }
  }

  // Check if any filters are active
  const hasActiveFilters = filterPriority || filterTag || searchQuery

  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-2">
        {showSearch ? (
          <div className="flex-1 flex items-center gap-2">
            <Input
              ref={searchInputRef}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tasks..."
              className="border-gray-300 dark:border-gray-700"
            />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                setSearchQuery("")
                setShowSearch(false)
              }}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <Button variant="outline" size="sm" className="gap-2" onClick={() => setShowSearch(true)}>
            <Search className="h-4 w-4" />
            Search
          </Button>
        )}

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className={`gap-2 ${hasActiveFilters ? "bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-400 dark:border-purple-800" : ""}`}
            >
              <Filter className="h-4 w-4" />
              Filter
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Priority</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => setFilterPriority(null)}
              className={!filterPriority ? "bg-purple-50 dark:bg-purple-900/20" : ""}
            >
              All priorities
            </DropdownMenuItem>
            {priorities.map((priority) => (
              <DropdownMenuItem
                key={priority}
                onClick={() => setFilterPriority(priority)}
                className={filterPriority === priority ? "bg-purple-50 dark:bg-purple-900/20" : ""}
              >
                <span className={getPriorityColor(priority)}>
                  {priority.charAt(0).toUpperCase() + priority.slice(1)}
                </span>
              </DropdownMenuItem>
            ))}

            {allTags.length > 0 && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuLabel>Tags</DropdownMenuLabel>
                <DropdownMenuItem
                  onClick={() => setFilterTag(null)}
                  className={!filterTag ? "bg-purple-50 dark:bg-purple-900/20" : ""}
                >
                  All tags
                </DropdownMenuItem>
                {allTags.map((tag) => (
                  <DropdownMenuItem
                    key={tag}
                    onClick={() => setFilterTag(tag)}
                    className={filterTag === tag ? "bg-purple-50 dark:bg-purple-900/20" : ""}
                  >
                    {tag}
                  </DropdownMenuItem>
                ))}
              </>
            )}

            {hasActiveFilters && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={clearFilters}
                  className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30"
                >
                  Clear all filters
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Active filters */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2 mt-2">
          {filterPriority && (
            <Badge
              variant="outline"
              className="gap-1 bg-white dark:bg-gray-800"
              onClick={() => setFilterPriority(null)}
            >
              Priority:{" "}
              <span className={getPriorityColor(filterPriority)}>
                {filterPriority.charAt(0).toUpperCase() + filterPriority.slice(1)}
              </span>
              <X className="h-3 w-3 ml-1 cursor-pointer" />
            </Badge>
          )}

          {filterTag && (
            <Badge variant="outline" className="gap-1 bg-white dark:bg-gray-800" onClick={() => setFilterTag(null)}>
              Tag: {filterTag}
              <X className="h-3 w-3 ml-1 cursor-pointer" />
            </Badge>
          )}

          {searchQuery && (
            <Badge variant="outline" className="gap-1 bg-white dark:bg-gray-800" onClick={() => setSearchQuery("")}>
              Search: {searchQuery}
              <X className="h-3 w-3 ml-1 cursor-pointer" />
            </Badge>
          )}
        </div>
      )}
    </div>
  )
}

