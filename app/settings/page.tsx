"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { toast } from "sonner"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

const profileSchema = z.object({
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  email: z.string().email("Email inválido"),
})

const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, "La contraseña actual es requerida"),
    newPassword: z.string().min(8, "La nueva contraseña debe tener al menos 8 caracteres"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  })

interface NearbyUser {
  id: string
  name: string
  petName: string
  petType: string
  distance: number
}

export default function SettingsPage() {
  const { data: session, update } = useSession()
  const router = useRouter()
  const [isGeolocationEnabled, setIsGeolocationEnabled] = useState(false)
  const [isDeleteAccountDialogOpen, setIsDeleteAccountDialogOpen] = useState(false)
  const [buildVersion, setBuildVersion] = useState("")
  const [nearbyUsers, setNearbyUsers] = useState<NearbyUser[]>([])

  const profileForm = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: session?.user?.name || "",
      email: session?.user?.email || "",
    },
  })

  const passwordForm = useForm({
    resolver: zodResolver(passwordSchema),
  })

  useEffect(() => {
    if (session?.user?.id) {
      // Cargar la configuración de geolocalización del usuario
      fetch(`/api/users/${session.user.id}`)
        .then((res) => res.json())
        .then((data) => {
          setIsGeolocationEnabled(data.allowLocationSharing)
          profileForm.reset({
            name: data.name,
            email: data.email,
          })
          if (data.allowLocationSharing && data.latitude && data.longitude) {
            fetchNearbyUsers(data.latitude, data.longitude)
          }
        })
        .catch((error) => console.error("Error fetching user data:", error))

      // Obtener la versión de la compilación
      fetch("/api/version")
        .then((res) => res.json())
        .then((data) => setBuildVersion(data.version))
    }
  }, [session, profileForm])

  const fetchNearbyUsers = async (latitude: number, longitude: number) => {
    try {
      const response = await fetch(`/api/nearby-users?latitude=${latitude}&longitude=${longitude}`)
      if (response.ok) {
        const users = await response.json()
        setNearbyUsers(users)
      } else {
        throw new Error("Error fetching nearby users")
      }
    } catch (error) {
      console.error("Error:", error)
      toast.error("Error al obtener usuarios cercanos")
    }
  }

  const handleGeolocationToggle = async () => {
    if (!session?.user?.id) return

    const newGeolocationState = !isGeolocationEnabled

    if (newGeolocationState) {
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords
            try {
              const response = await fetch(`/api/users/${session.user.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  allowLocationSharing: true,
                  latitude,
                  longitude,
                }),
              })
              if (response.ok) {
                setIsGeolocationEnabled(true)
                toast.success("Geolocalización habilitada")
                fetchNearbyUsers(latitude, longitude)
              } else {
                throw new Error("Error al actualizar la configuración")
              }
            } catch (error) {
              console.error("Error:", error)
              toast.error("Error al habilitar la geolocalización")
            }
          },
          () => {
            toast.error("Se requiere permiso para la geolocalización")
          },
        )
      } else {
        toast.error("Tu navegador no soporta geolocalización")
      }
    } else {
      try {
        const response = await fetch(`/api/users/${session.user.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            allowLocationSharing: false,
            latitude: null,
            longitude: null,
          }),
        })
        if (response.ok) {
          setIsGeolocationEnabled(false)
          setNearbyUsers([])
          toast.success("Geolocalización deshabilitada")
        } else {
          throw new Error("Error al actualizar la configuración")
        }
      } catch (error) {
        console.error("Error:", error)
        toast.error("Error al deshabilitar la geolocalización")
      }
    }
  }

  const onProfileSubmit = async (data: z.infer<typeof profileSchema>) => {
    if (!session?.user?.id) return

    try {
      const response = await fetch(`/api/users/${session.user.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      if (response.ok) {
        toast.success("Perfil actualizado correctamente")
        await update({ name: data.name, email: data.email })
      } else {
        toast.error("Error al actualizar el perfil")
      }
    } catch (error) {
      toast.error("Error al actualizar el perfil")
    }
  }

  const onPasswordSubmit = async (data: z.infer<typeof passwordSchema>) => {
    if (!session?.user?.id) return

    try {
      const response = await fetch(`/api/users/${session.user.id}/change-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      if (response.ok) {
        toast.success("Contraseña actualizada correctamente")
        passwordForm.reset()
      } else {
        toast.error("Error al actualizar la contraseña")
      }
    } catch (error) {
      toast.error("Error al actualizar la contraseña")
    }
  }

  const handleDeleteAccount = async () => {
    if (!session?.user?.id) return

    try {
      const response = await fetch(`/api/users/${session.user.id}`, {
        method: "DELETE",
      })
      if (response.ok) {
        toast.success("Cuenta eliminada correctamente")
        router.push("/")
      } else {
        toast.error("Error al eliminar la cuenta")
      }
    } catch (error) {
      toast.error("Error al eliminar la cuenta")
    }
  }

  if (!session) {
    return <div>Cargando...</div>
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Configuración</h1>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Información del Perfil</CardTitle>
          <CardDescription>Actualiza tu información personal</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={profileForm.handleSubmit(onProfileSubmit)}>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Nombre</Label>
                <Input id="name" {...profileForm.register("name")} />
                {profileForm.formState.errors.name && (
                  <p className="text-sm text-red-500">{profileForm.formState.errors.name.message}</p>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" {...profileForm.register("email")} />
                {profileForm.formState.errors.email && (
                  <p className="text-sm text-red-500">{profileForm.formState.errors.email.message}</p>
                )}
              </div>
            </div>
            <Button type="submit" className="mt-4">
              Actualizar Perfil
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Cambiar Contraseña</CardTitle>
          <CardDescription>Actualiza tu contraseña de acceso</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)}>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="currentPassword">Contraseña Actual</Label>
                <Input id="currentPassword" type="password" {...passwordForm.register("currentPassword")} />
                {passwordForm.formState.errors.currentPassword && (
                  <p className="text-sm text-red-500">{passwordForm.formState.errors.currentPassword.message}</p>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="newPassword">Nueva Contraseña</Label>
                <Input id="newPassword" type="password" {...passwordForm.register("newPassword")} />
                {passwordForm.formState.errors.newPassword && (
                  <p className="text-sm text-red-500">{passwordForm.formState.errors.newPassword.message}</p>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="confirmPassword">Confirmar Nueva Contraseña</Label>
                <Input id="confirmPassword" type="password" {...passwordForm.register("confirmPassword")} />
                {passwordForm.formState.errors.confirmPassword && (
                  <p className="text-sm text-red-500">{passwordForm.formState.errors.confirmPassword.message}</p>
                )}
              </div>
            </div>
            <Button type="submit" className="mt-4">
              Cambiar Contraseña
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Geolocalización</CardTitle>
          <CardDescription>Habilita o deshabilita el uso de tu ubicación</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2">
            <Switch checked={isGeolocationEnabled} onCheckedChange={handleGeolocationToggle} id="geolocation-mode" />
            <Label htmlFor="geolocation-mode">{isGeolocationEnabled ? "Habilitada" : "Deshabilitada"}</Label>
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            Al habilitar la geolocalización, podrás encontrar mascotas y eventos cercanos a tu ubicación.
          </p>
          {isGeolocationEnabled && nearbyUsers.length > 0 && (
            <div className="mt-4">
              <h4 className="font-semibold mb-2">Usuarios cercanos:</h4>
              <ul className="list-disc pl-5">
                {nearbyUsers.slice(0, 5).map((user) => (
                  <li key={user.id}>
                    {user.name} con {user.petName} ({user.petType}) - a {user.distance.toFixed(2)} km
                  </li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Información de la Aplicación</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Versión de la compilación: {buildVersion}</p>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Eliminar Cuenta</CardTitle>
          <CardDescription>Esta acción es irreversible</CardDescription>
        </CardHeader>
        <CardContent>
          <Dialog open={isDeleteAccountDialogOpen} onOpenChange={setIsDeleteAccountDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="destructive">Eliminar Cuenta</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>¿Estás seguro de que quieres eliminar tu cuenta?</DialogTitle>
                <DialogDescription>
                  Esta acción no se puede deshacer. Esto eliminará permanentemente tu cuenta y todos los datos
                  asociados.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDeleteAccountDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button variant="destructive" onClick={handleDeleteAccount}>
                  Eliminar Cuenta
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>
    </div>
  )
}

