"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react"

type User = {
  email: string
  name?: string
  token?: string
}

type AuthContextType = {
  user: User | null
  login: (user: User) => void
  logout: () => void
  isLoading: boolean
  fetchWithAuth: (input: RequestInfo, init?: RequestInit) => Promise<Response>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const isTokenExpired = (token: string): boolean => {
  try {
    const decoded = JSON.parse(atob(token.split('.')[1])) // Decode JWT payload
    const currentTime = Math.floor(Date.now() / 1000) // Current time in seconds
    return decoded.exp < currentTime
  } catch {
    return true
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Call backend refresh token endpoint to get new access token
  const refreshAccessToken = async (): Promise<string | null> => {
    try {
      const response = await fetch("/api/account/refresh-token", {
        method: "POST",
        credentials: "include", // send cookies
      })
      if (!response.ok) {
        logout(false)
        return null
      }
      const data = await response.json()
      if (data.token) {
        const updatedUser = user ? { ...user, token: data.token } : null
        if (updatedUser) {
          setUser(updatedUser)
          localStorage.setItem("user", JSON.stringify(updatedUser))
        }
        return data.token
      } else {
        logout(false)
        return null
      }
    } catch {
      logout(false)
      return null
    }
  }

  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      const userData = JSON.parse(storedUser)
      if (userData.token && !isTokenExpired(userData.token)) {
        setUser(userData)
      } else {
        // Silent refresh on page load if token expired
        refreshAccessToken().then((newToken) => {
          if (!newToken) {
            localStorage.removeItem("user")
            setUser(null)
          }
        })
      }
    }
    setIsLoading(false)

    // Multi-tab sync: listen for logout/login events
    const syncLogout = (event: StorageEvent) => {
      if (event.key === "logout") {
        setUser(null)
      }
      if (event.key === "login") {
        const newUser = localStorage.getItem("user")
        if (newUser) {
          setUser(JSON.parse(newUser))
        }
      }
    }
    window.addEventListener("storage", syncLogout)
    return () => {
      window.removeEventListener("storage", syncLogout)
    }
  }, [])

  // Wrapper around fetch to handle token refresh automatically
  const fetchWithAuth = async (input: RequestInfo, init?: RequestInit): Promise<Response> => {
    if (!user || !user.token) {
      return fetch(input, init)
    }

    let token = user.token

    if (isTokenExpired(token)) {
      const newToken = await refreshAccessToken()
      if (!newToken) {
        throw new Error("Unable to refresh token")
      }
      token = newToken
    }

    const authHeaders = {
      Authorization: `Bearer ${token}`,
      ...(init && init.headers ? init.headers : {}),
    }

    const response = await fetch(input, {
      ...init,
      headers: authHeaders,
      credentials: "include",
    })

    // If unauthorized, try refreshing token once more
    if (response.status === 401) {
      const newToken = await refreshAccessToken()
      if (!newToken) {
        throw new Error("Unable to refresh token")
      }
      const retryResponse = await fetch(input, {
        ...init,
        headers: {
          ...authHeaders,
          Authorization: `Bearer ${newToken}`,
        },
        credentials: "include",
      })
      return retryResponse
    }

    return response
  }

  // Logout function with optional backend revoke call
  const logout = async (callBackend = true) => {
    if (callBackend) {
      try {
        await fetch("/api/account/logout", {
          method: "POST",
          credentials: "include",
        })
      } catch {
        // ignore errors
      }
    }
    setUser(null)
    localStorage.removeItem("user")
    localStorage.setItem("logout", Date.now().toString()) // trigger multi-tab logout sync
  }

  // Login function with multi-tab sync
  const login = (userData: User) => {
    setUser(userData)
    localStorage.setItem("user", JSON.stringify(userData))
    localStorage.setItem("login", Date.now().toString()) // trigger multi-tab login sync
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading, fetchWithAuth }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
