"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect } from "react"
import {
  type User as FirebaseUser,
  signInWithPopup,
  signOut as firebaseSignOut,
  onAuthStateChanged,
} from "firebase/auth"
import { auth, googleProvider } from "@/lib/firebase"

// Define the shape of a user
type User = FirebaseUser | null

// Define the shape of the auth context
type AuthContextType = {
  user: User
  isAuthenticated: boolean
  isLoading: boolean
  signInWithGoogle: () => Promise<void>
  signOut: () => Promise<void>
}

// Create the context with default values
const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  signInWithGoogle: async () => {},
  signOut: async () => {},
})

// Custom hook to use the auth context
export const useAuth = () => useContext(AuthContext)

// Provider component that wraps the app
export function AuthProvider({ children }: { children: React.ReactNode }) {
  // State for authentication status
  const [user, setUser] = useState<User>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user)
      setIsLoading(false)
    })

    // Cleanup subscription
    return () => unsubscribe()
  }, [])

  // Sign in with Google
  const signInWithGoogle = async () => {
    try {
      setIsLoading(true)
      await signInWithPopup(auth, googleProvider)
    } catch (error) {
      console.error("Error signing in with Google:", error)
    } finally {
      setIsLoading(false)
    }
  }

  // Sign out
  const signOut = async () => {
    try {
      await firebaseSignOut(auth)
    } catch (error) {
      console.error("Error signing out:", error)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        signInWithGoogle,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

