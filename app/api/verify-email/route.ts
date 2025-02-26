import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const token = searchParams.get("token")

  if (!token) {
    return NextResponse.json({ error: "Token inválido" }, { status: 400 })
  }

  try {
    // Verificar el token (userId)
    const user = await prisma.user.update({
      where: { id: token },
      data: { emailVerified: new Date() },
    })

    if (!user) {
      return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 })
    }

    return NextResponse.json({ success: "Correo verificado exitosamente" })
  } catch (error) {
    return NextResponse.json({ error: "Error al verificar el correo" }, { status: 500 })
  }
}