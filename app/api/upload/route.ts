import { NextResponse } from "next/server"
import { v2 as cloudinary } from "cloudinary"

// Configurar Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "No se ha proporcionado ningún archivo" }, { status: 400 })
    }

    // Convertir el archivo a un Buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Subir a Cloudinary
    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          resource_type: "auto",
          folder: "pet-social", // Carpeta en Cloudinary
          transformation: [
            { width: 1000, height: 1000, crop: "limit" }, // Redimensionar si es necesario
            { quality: "auto" }, // Optimización automática
            { fetch_format: "auto" }, // Formato automático según el navegador
          ],
        },
        (error, result) => {
          if (error) reject(error)
          resolve(result)
        },
      )

      // Escribir el buffer en el stream
      uploadStream.end(buffer)
    })

    // @ts-ignore - El tipo de result es any
    return NextResponse.json({
      url: result.secure_url,
      // @ts-ignore
      public_id: result.public_id,
    })
  } catch (error) {
    console.error("Error al subir la imagen:", error)
    return NextResponse.json({ error: "Error al subir la imagen" }, { status: 500 })
  }
}

// Opcional: Endpoint para eliminar imágenes
export async function DELETE(request: Request) {
  try {
    const { public_id } = await request.json()

    if (!public_id) {
      return NextResponse.json({ error: "No se ha proporcionado el ID de la imagen" }, { status: 400 })
    }

    const result = await cloudinary.uploader.destroy(public_id)

    return NextResponse.json({ result })
  } catch (error) {
    console.error("Error al eliminar la imagen:", error)
    return NextResponse.json({ error: "Error al eliminar la imagen" }, { status: 500 })
  }
}

