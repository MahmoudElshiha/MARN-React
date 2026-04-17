import { useState, useCallback } from 'react'
import { AuthContext } from './authContext'
import type { User } from '@/types/user'

const TOKEN_KEY = 'token'
const USER_KEY = 'user'

function readStorage<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key) ?? sessionStorage.getItem(key) ?? null
    return raw ? (JSON.parse(raw) as T) : null
  } catch {
    return null
  }
}

function writeStorage(key: string, value: unknown, persist: boolean): void {
  const storage = persist ? localStorage : sessionStorage
  storage.setItem(key, JSON.stringify(value))
}

function clearStorage(): void {
  ;[localStorage, sessionStorage].forEach((s) => {
    s.removeItem(TOKEN_KEY)
    s.removeItem(USER_KEY)
  })
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(() =>
    readStorage<string>(TOKEN_KEY),
  )
  const [user, setUser] = useState<User | null>(() =>
    readStorage<User>(USER_KEY),
  )

  const login = useCallback(
    (newToken: string, newUser: User, remember: boolean) => {
      writeStorage(TOKEN_KEY, newToken, remember)
      writeStorage(USER_KEY, newUser, remember)
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
