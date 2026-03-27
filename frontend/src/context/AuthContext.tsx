import React, { createContext, useContext, useState, useEffect } from 'react'
import { authApi } from '../services/api'

interface User {
  id: number
  email: string
  role: 'admin' | 'user'
}

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  login: (credentials: { email: string, password: string, rememberMe: boolean }) => Promise<void>
  logout: () => void
  register: (name: string, email: string, password: string, role: string) => Promise<void> // <-- Add this line
}

const AuthContext = createContext<AuthState | null>(null)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const login = async ({ email, password }: { email: string, password: string}) => {
    setIsLoading(true)
    setError(null)
    try {
      const { token, user: userData } = await authApi.login(email, password)
      localStorage.setItem('token', token)
      setUser(userData)
      setIsAuthenticated(true)
    } catch (err: any) {
      setError(err.message || 'Failed to log in')
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (name: string, email: string, password: string, role: string) => {
    setIsLoading(true)
    setError(null)
    try {
      await authApi.register(name, email, password, role)
    } catch (err: any) {
      setError(err.message || 'Failed to register')
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    setUser(null)
    setIsAuthenticated(false)
    setError(null)
  }

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      authApi.getProfile()
        .then((userData) => {
          setUser(userData)
          setIsAuthenticated(true)
        })
        .catch(() => {
          localStorage.removeItem('token')
        })
    }
  }, [])

  return (
    <AuthContext.Provider value={{user, isAuthenticated, isLoading, error, login, logout, register}}>
      {children}
    </AuthContext.Provider>
  )
}