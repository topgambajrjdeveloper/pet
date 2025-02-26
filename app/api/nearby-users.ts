import type { NextApiRequest, NextApiResponse } from "next"
import {prisma} from "@/lib/prisma"
import { getSession } from "next-auth/react"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req })
  if (!session) {
    return res.status(401).json({ message: "Unauthorized" })
  }

  const { latitude, longitude } = req.query

  // Esto es una simplificación. En una implementación real, usaríamos
  // funciones geoespaciales de la base de datos para calcular la
  // distancia entre usuarios.
  const nearbyUsers = await prisma.user.findMany({
    where: {
      AND: [{ id: { not: session.user.id } }, { allowLocationSharing: true }],
    },
    select: {
      id: true,
      name: true,
      petName: true,
      petType: true,
    },
  })

  res.status(200).json(nearbyUsers)
}

