"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { toast } from "sonner"
import Link from "next/link"

export default function VerifyEmailPage() {
  const searchParams = useSearchParams()
  const token = searchParams.get("token")
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading")

  useEffect(() => {
    if (token) {
      fetch(`/api/verify-email?token=${token}`)
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            setStatus("success")
            toast.success("Correo verificado exitosamente")
          } else {
            setStatus("error")
            toast.error(data.error || "Error al verificar el correo")
          }
        })
        .catch(() => {
          setStatus("error")
          toast.error("Error al verificar el correo")
        })
    } else {
      setStatus("error")
      toast.error("Token inválido")
    }
  }, [token])

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md text-center">
        {status === "loading" && <p>Verificando tu correo...</p>}
        {status === "success" && (
          <>
            <p className="text-green-600">¡Correo verificado exitosamente!</p>
            <Link href="/login" className="text-blue-500 hover:underline">
              Iniciar sesión
            </Link>
          </>
        )}
        {status === "error" && (
          <>
            <p className="text-red-600">Error al verificar el correo.</p>
            <Link href="/register" className="text-blue-500 hover:underline">
              Intentar de nuevo
            </Link>
          </>
        )}
      </div>
    </div>
  )
}