"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect, useRef } from "react"

// Define the shape of the theme context
type ThemeContextType = {
  theme: "light" | "dark"
  toggleTheme: () => void
}

// Create the context with default values
const ThemeContext = createContext<ThemeContextType>({
  theme: "light",
  toggleTheme: () => {},
})

// Custom hook to use the theme context
export const useTheme = () => useContext(ThemeContext)

// Provider component that wraps the app
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // Initialize theme from localStorage or default to light
  const [theme, setTheme] = useState<"light" | "dark">("light")
  const isInitialMount = useRef(true)

  // Load theme preference from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null

    // Check for saved preference or system preference
    if (savedTheme) {
      setTheme(savedTheme)
    } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      setTheme("dark")
    }
  }, [])

  // Update document when theme changes
  useEffect(() => {
    // Skip during the initial mount if we're just setting up from localStorage
    if (!isInitialMount.current) {
      // Update localStorage
      localStorage.setItem("theme", theme)
    }

    // Always update the document class
    if (theme === "dark") {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }

    // Set isInitialMount to false after first render
    isInitialMount.current = false
  }, [theme])

  // Toggle between light and dark themes
  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"))
  }

  return <ThemeContext.Provider value={{ theme, toggleTheme }}>{children}</ThemeContext.Provider>
}

