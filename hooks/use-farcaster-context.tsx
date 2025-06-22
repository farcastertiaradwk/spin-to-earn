"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"

interface FarcasterUser {
  fid: number
  username: string
  displayName: string
  pfpUrl: string
}

interface FarcasterContextType {
  user: FarcasterUser | null
  isLoading: boolean
  error: string | null
  isInFrame: boolean
}

const FarcasterContext = createContext<FarcasterContextType>({
  user: null,
  isLoading: true,
  error: null,
  isInFrame: false,
})

export function FarcasterProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<FarcasterUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isInFrame, setIsInFrame] = useState(false)

  useEffect(() => {
    async function initializeFarcaster() {
      try {
        // Check if we're in a Farcaster frame environment
        if (typeof window !== "undefined") {
          // Check for Farcaster frame context
          const urlParams = new URLSearchParams(window.location.search)
          const frameContext = urlParams.get("fc_frame")

          if (frameContext || window.parent !== window) {
            setIsInFrame(true)

            // Try to get user data from frame context
            try {
              // Import the SDK dynamically
              const { default: sdk } = await import("@farcaster/frame-sdk")

              // Initialize the SDK
              const context = await sdk.context

              if (context?.user) {
                setUser({
                  fid: context.user.fid,
                  username: context.user.username || `user-${context.user.fid}`,
                  displayName: context.user.displayName || context.user.username || `User ${context.user.fid}`,
                  pfpUrl: context.user.pfpUrl || "/placeholder.svg?height=40&width=40",
                })
              } else {
                // Fallback for demo purposes
                setUser({
                  fid: 12345,
                  username: "demo_user",
                  displayName: "Demo User",
                  pfpUrl: "/placeholder.svg?height=40&width=40",
                })
              }
            } catch (sdkError) {
              console.warn("Farcaster SDK not available, using demo data:", sdkError)
              // Fallback for demo purposes
              setUser({
                fid: 12345,
                username: "demo_user",
                displayName: "Demo User",
                pfpUrl: "/placeholder.svg?height=40&width=40",
              })
            }
          } else {
            // Not in frame, use demo data for testing
            setUser({
              fid: 12345,
              username: "demo_user",
              displayName: "Demo User",
              pfpUrl: "/placeholder.svg?height=40&width=40",
            })
          }
        }
      } catch (err) {
        console.error("Error initializing Farcaster:", err)
        setError("Failed to initialize Farcaster connection")
        // Set demo user even on error for testing
        setUser({
          fid: 12345,
          username: "demo_user",
          displayName: "Demo User",
          pfpUrl: "/placeholder.svg?height=40&width=40",
        })
      } finally {
        setIsLoading(false)
      }
    }

    initializeFarcaster()
  }, [])

  return <FarcasterContext.Provider value={{ user, isLoading, error, isInFrame }}>{children}</FarcasterContext.Provider>
}

export function useFarcasterContext() {
  const context = useContext(FarcasterContext)
  if (!context) {
    throw new Error("useFarcasterContext must be used within a FarcasterProvider")
  }
  return context
}
