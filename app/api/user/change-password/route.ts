import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import {prisma} from "@/lib/prisma"
import { authOptions } from "@/lib/auth"
import bcrypt from "bcrypt"

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 })
  }

  const { currentPassword, newPassword } = await request.json()

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  })

  if (!user) {
    return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 })
  }

  const isPasswordValid = await bcrypt.compare(currentPassword, user.password)

  if (!isPasswordValid) {
    return NextResponse.json({ error: "Contraseña actual incorrecta" }, { status: 400 })
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10)

  await prisma.user.update({
    where: { id: session.user.id },
    data: { password: hashedPassword },
  })

  return NextResponse.json({ success: true })
}

