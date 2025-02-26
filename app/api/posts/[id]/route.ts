import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 })
  }

  const postId = parseInt(params.id)

  try {
    // Verificar que la publicación pertenece al usuario actual
    const post = await prisma.post.findUnique({
      where: { id: postId },
    })

    if (!post || post.userId !== session.user.id) {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 })
    }

    await prisma.post.delete({
      where: { id: postId },
    })
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Error al eliminar la publicación" }, { status: 500 })
  }
}