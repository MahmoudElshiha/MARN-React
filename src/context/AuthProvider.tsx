import { useState, useCallback } from 'react'
import { AuthContext } from './authContext'
import type { User } from '@/types/user'

const TOKEN_KEY = 'token'
const USER_KEY = 'user'

import { decodeUserFromToken } from '@/utils/tokenUtils'

function readToken(): string | null {
  return localStorage.getItem(TOKEN_KEY) ?? sessionStorage.getItem(TOKEN_KEY)
}

function readUser(token: string | null): User | null {
  try {
    const raw =
      localStorage.getItem(USER_KEY) ?? sessionStorage.getItem(USER_KEY) ?? null
    let user = raw ? (JSON.parse(raw) as User) : null
    
    // Repair the stored user object if it's missing the firstName
    if (user && !user.firstName && token) {
      try {
        const decoded = decodeUserFromToken(token)
        user = { ...user, firstName: decoded.firstName, lastName: decoded.lastName }
      } catch {}
    }
    
    return user
  } catch {
    return null
  }
}

function writeStorage(token: string, user: User, persist: boolean): void {
  const storage = persist ? localStorage : sessionStorage
  storage.setItem(TOKEN_KEY, token)
  storage.setItem(USER_KEY, JSON.stringify(user))
}

function clearStorage(): void {
  ;[localStorage, sessionStorage].forEach((s) => {
    s.removeItem(TOKEN_KEY)
    s.removeItem(USER_KEY)
  })
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(readToken)
  const [user, setUser] = useState<User | null>(() => readUser(readToken()))

  const login = useCallback(
    (newToken: string, newUser: User, remember: boolean) => {
      writeStorage(newToken, newUser, remember)
      setToken(newToken)
      setUser(newUser)
    },
    [],
  )

  const logout = useCallback(() => {
    clearStorage()
    setToken(null)
    setUser(null)
  }, [])

  return (
    <AuthContext.Provider
      value={{ user, token, isAuthenticated: !!token, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  )
}
