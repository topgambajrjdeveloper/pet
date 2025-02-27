import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import {prisma} from "@/lib/prisma"
import { authOptions } from "@/lib/auth"

export async function GET(request: Request) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const latitude = Number.parseFloat(searchParams.get("latitude") || "0")
  const longitude = Number.parseFloat(searchParams.get("longitude") || "0")

  if (isNaN(latitude) || isNaN(longitude)) {
    return NextResponse.json({ error: "Coordenadas inválidas" }, { status: 400 })
  }

  try {
    // Asumiendo que has añadido campos de latitud y longitud a tu modelo de usuario
    const nearbyUsers = await prisma.$queryRaw`
      SELECT id, name, "petName", "petType",
             (6371 * acos(cos(radians(${latitude})) * cos(radians(latitude))
             * cos(radians(longitude) - radians(${longitude}))
             + sin(radians(${latitude})) * sin(radians(latitude)))) AS distance
      FROM "User"
      WHERE id != ${session.user.id}
        AND "allowLocationSharing" = true
      HAVING distance < 10
      ORDER BY distance
      LIMIT 20
    `

    return NextResponse.json(nearbyUsers)
  } catch (error) {
    console.error("Error al buscar usuarios cercanos:", error)
    return NextResponse.json({ error: "Error al buscar usuarios cercanos" }, { status: 500 })
  }
}

