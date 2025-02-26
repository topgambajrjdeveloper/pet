"use server"

import { z } from "zod"
import bcrypt from "bcrypt"
import { registerSchema } from "@/lib/validations/auth"
import { sendVerificationEmail, sendPasswordResetEmail } from "@/lib/mail"
import { generateVerificationToken } from "@/lib/tokens"
import { prisma } from "@/lib/prisma"

export async function register(data: z.infer<typeof registerSchema>) {
  try {
    // Validar los datos
    const validatedData = registerSchema.parse(data)

    // Verificar si el email ya existe
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email },
    })

    if (existingUser) {
      return { error: "El email ya está registrado" }
    }

    // Hashear la contraseña
    const hashedPassword = await bcrypt.hash(validatedData.password, 10)

    // Generar token de verificación
    const verificationToken = await generateVerificationToken(validatedData.email)

    // Crear el usuario
    const user = await prisma.user.create({
      data: {
        name: validatedData.name,
        email: validatedData.email,
        password: hashedPassword,
        petName: validatedData.petName,
        petType: validatedData.petType,
        isProfilePublic: validatedData.isProfilePublic,
        allowLocationSharing: validatedData.allowLocationSharing,
        verificationToken: verificationToken,
      },
    })

    // Enviar email de verificación
    await sendVerificationEmail(validatedData.email, verificationToken)

    return { success: "Usuario registrado correctamente. Por favor, verifica tu email." }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { error: error.errors[0].message }
    }
    return { error: "Error al registrar el usuario" }
  }
}

export async function verifyEmail(token: string) {
  try {
    // Buscar usuario con el token
    const user = await prisma.user.findFirst({
      where: { verificationToken: token },
    })

    if (!user) {
      return { error: "Token inválido" }
    }

    // Actualizar usuario
    await prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerified: new Date(),
        verificationToken: null,
      },
    })

    return { success: "Email verificado correctamente" }
  } catch (error) {
    return { error: "Error al verificar el email" }
  }
}

export async function resetPassword(email: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      return { error: "No existe una cuenta con este email" }
    }

    const resetToken = await generateVerificationToken(email)

    await prisma.user.update({
      where: { id: user.id },
      data: { resetPasswordToken: resetToken },
    })

    await sendPasswordResetEmail(email, resetToken)

    return { success: "Se ha enviado un email con las instrucciones" }
  } catch (error) {
    return { error: "Error al procesar la solicitud" }
  }
}

