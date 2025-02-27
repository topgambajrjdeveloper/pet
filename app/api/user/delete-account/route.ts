import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import {prisma} from "@/lib/prisma"
import { authOptions } from "@/lib/auth"

export async function DELETE() {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 })
  }

  await prisma.user.delete({
    where: { id: session.user.id },
  })

  return NextResponse.json({ success: true })
}

