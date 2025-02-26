"use client"

import type React from "react"

import { createContext, useEffect, useState, useCallback } from "react"
import { useSession } from "next-auth/react"
import { toast } from "sonner"

interface UserData {
  id: string
  name: string
  email: string
  petName: string
  petType: string
  image?: string
  isProfilePublic: boolean
  allowLocationSharing: boolean
}

interface UserContextType {
  user: UserData | null
  isLoading: boolean
  error: string | null
  updateUser: (data: Partial<UserData>) => Promise<void>
  refreshUser: () => Promise<void>
}

export const UserContext = createContext<UserContextType | undefined>(undefined)

export function UserProvider({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession()
  const [user, setUser] = useState<UserData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchUser = useCallback(async () => {
    try {
      if (!session?.user?.id) return

      const response = await fetch(`/api/users/${session.user.id}`)

      if (!response.ok) {
        throw new Error("Error al obtener los datos del usuario")
      }

      const userData = await response.json()
      setUser(userData)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido")
      toast.error("Error al cargar los datos del usuario")
    } finally {
      setIsLoading(false)
    }
  }, [session?.user?.id])

  useEffect(() => {
    if (status === "authenticated") {
      fetchUser()
    } else if (status === "unauthenticated") {
      setUser(null)
      setIsLoading(false)
    }
  }, [status, fetchUser])

  const updateUser = async (data: Partial<UserData>) => {
    try {
      if (!user?.id) return

      const response = await fetch(`/api/users/${user.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error("Error al actualizar el usuario")
      }

      const updatedUser = await response.json()
      setUser(updatedUser)
      toast.success("Perfil actualizado correctamente")
    } catch (err) {
      toast.error("Error al actualizar el perfil")
      throw err
    }
  }

  const refreshUser = async () => {
    setIsLoading(true)
    await fetchUser()
  }

  return (
    <UserContext.Provider
      value={{
        user,
        isLoading,
        error,
        updateUser,
        refreshUser,
      }}
    >
      {children}
    </UserContext.Provider>
  )
}

