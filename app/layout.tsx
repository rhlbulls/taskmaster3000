import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Toaster } from "@/components/toaster"
import { ThemeProvider } from "@/contexts/theme-context"
import { AuthProvider } from "@/contexts/auth-context"
import { TaskProvider } from "@/contexts/task-context"
import { TimerProvider } from "@/contexts/timer-context"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "TaskMaster3000",
  description: "W Task Manager For real",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        {/* Wrap the app with all context providers */}
        <ThemeProvider>
          <AuthProvider>
            <TaskProvider>
              <TimerProvider>
                {children}
                <Toaster />
              </TimerProvider>
            </TaskProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}

