
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcrypt"

export async function POST(request: Request) {
  try {
    const { name, email, password, image } = await request.json()

    // Verificar si el usuario ya existe
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return NextResponse.json({ error: "El usuario ya existe" }, { status: 400 })
    }

    // Hashear la contraseña
    const hashedPassword = await bcrypt.hash(password, 10)

    // Crear el usuario en la base de datos
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        image,
        emailVerified: null, // El email no está verificado aún
      },
    })

    return NextResponse.json({ userId: user.id })
  } catch (error) {
    return NextResponse.json({ error: "Error al registrar el usuario" }, { status: 500 })
  }
}