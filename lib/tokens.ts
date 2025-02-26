import { v4 as uuidv4 } from "uuid"
import {prisma} from "@/lib/prisma"

export async function generateVerificationToken(email: string) {
  const token = uuidv4()
  const expires = new Date(new Date().getTime() + 24 * 60 * 60 * 1000) // 24 horas

  const existingToken = await prisma.verificationToken.findFirst({
    where: { email },
  })

  if (existingToken) {
    await prisma.verificationToken.delete({
      where: { id: existingToken.id },
    })
  }

  const verificationToken = await prisma.verificationToken.create({
    data: {
      email,
      token,
      expires,
    },
  })

  return verificationToken.token
}

