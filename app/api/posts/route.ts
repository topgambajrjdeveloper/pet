import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import {prisma} from "@/lib/prisma"
import { z } from "zod"

// Schema de validación para los posts
const postSchema = z.object({
  image: z.string().url("La imagen debe ser una URL válida"),
  description: z.string().min(1, "La descripción no puede estar vacía"),
})

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const posts = await prisma.post.findMany({
      where: {
        OR: [{ userId: session.user.id }, { user: { isProfilePublic: true } }],
      },
      include: {
        user: {
          select: {
            name: true,
            image: true,
            petName: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    return NextResponse.json(posts)
  } catch (error) {
    console.error("Error fetching posts:", error)
    return NextResponse.json({ error: "Error al obtener las publicaciones" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const body = await request.json()

    // Validar los datos recibidos
    const validatedData = postSchema.parse({
      image: body.image,
      description: body.description,
    })

    const newPost = await prisma.post.create({
      data: {
        image: validatedData.image,
        description: validatedData.description,
        userId: session.user.id,
      },
      include: {
        user: {
          select: {
            name: true,
            image: true,
            petName: true,
          },
        },
      },
    })

    return NextResponse.json(newPost, { status: 201 })
  } catch (error) {
    console.error("Error creating post:", error)

    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 })
    }

    return NextResponse.json({ error: "Error al crear la publicación" }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const postId = searchParams.get("id")

    if (!postId) {
      return NextResponse.json({ error: "ID de post no proporcionado" }, { status: 400 })
    }

    // Verificar que el post pertenece al usuario
    const post = await prisma.post.findUnique({
      where: { id: postId },
    })

    if (!post) {
      return NextResponse.json({ error: "Post no encontrado" }, { status: 404 })
    }

    if (post.userId !== session.user.id) {
      return NextResponse.json({ error: "No autorizado para eliminar este post" }, { status: 403 })
    }

    await prisma.post.delete({
      where: { id: postId },
    })

    return NextResponse.json({ message: "Post eliminado correctamente" }, { status: 200 })
  } catch (error) {
    console.error("Error deleting post:", error)
    return NextResponse.json({ error: "Error al eliminar la publicación" }, { status: 500 })
  }
}

