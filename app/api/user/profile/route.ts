import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import {prisma} from "@/lib/prisma"
import { authOptions } from "@/lib/auth"

export async function PUT(request: Request) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 })
  }

  const { name, email } = await request.json()

  const updatedUser = await prisma.user.update({
    where: { id: session.user.id },
    data: { name, email },
  })

  return NextResponse.json(updatedUser)
}

