"use client"

import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/auth-context"
import { LogIn } from "lucide-react"

export default function LoginPrompt() {
  const { signInWithGoogle, isLoading } = useAuth()

  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
      <div className="max-w-md mx-auto">
        <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-100">Sign in to manage your tasks</h2>
        <p className="mb-8 text-gray-600 dark:text-gray-400">
          TaskMaster3000 helps you track your tasks and time. Sign in to get started.
        </p>
        <Button
          onClick={signInWithGoogle}
          disabled={isLoading}
          className="gap-2 bg-gray-800 hover:bg-gray-700 text-white dark:bg-gray-700 dark:hover:bg-gray-600"
          size="lg"
        >
          {isLoading ? (
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-current border-t-transparent" />
          ) : (
            <LogIn className="h-5 w-5" />
          )}
          Sign in with Google
        </Button>
      </div>
    </div>
  )
}

