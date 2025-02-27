import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import {prisma} from "@/lib/prisma"
import { authOptions } from "@/lib/auth"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 })
  }

  const userId = params.id

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        petName: true,
        petType: true,
        isProfilePublic: true,
        allowLocationSharing: true,
      },
    })

    if (!user) {
      return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 })
    }

    return NextResponse.json(user)
  } catch (error) {
    console.error("Error al obtener el usuario:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 })
  }

  const { isGeolocationEnabled } = await request.json()

  await prisma.user.update({
    where: { id: session.user.id },
    data: { allowLocationSharing: isGeolocationEnabled },
  })

  return NextResponse.json({ success: true })
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 })
  }

  const userId = params.id

  if (session.user.id !== userId) {
    return NextResponse.json({ error: "No autorizado para actualizar este perfil" }, { status: 403 })
  }

  try {
    const { name, email } = await request.json()

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { name, email },
    })

    return NextResponse.json(updatedUser)
  } catch (error) {
    console.error("Error al actualizar el usuario:", error)
    return NextResponse.json({ error: "Error al actualizar el perfil" }, { status: 500 })
  }
}

