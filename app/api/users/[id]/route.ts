import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import {prisma} from "@/lib/prisma"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { id: params.id },
      select: {
        id: true,
        name: true,
        email: true,
        petName: true,
        petType: true,
        image: true,
        isProfilePublic: true,
        allowLocationSharing: true,
      },
    })

    if (!user) {
      return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 })
    }

    // Si el perfil no es público y no es el propio usuario
    if (!user.isProfilePublic && user.id !== session.user.id) {
      return NextResponse.json({ error: "Perfil privado" }, { status: 403 })
    }

    return NextResponse.json(user)
  } catch (error) {
    console.error("Error fetching user:", error)
    return NextResponse.json({ error: "Error al obtener los datos del usuario" }, { status: 500 })
  }
}

