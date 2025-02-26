// app/api/send-email/route.ts
import { NextResponse } from "next/server"
import nodemailer from "nodemailer"

export async function POST(request: Request) {
  try {
    // Obtener los datos del cuerpo de la solicitud
    const { email, userId } = await request.json()

    // Configurar Nodemailer según el entorno
    const transporter = nodemailer.createTransport(
      process.env.NODE_ENV === "production"
        ? {
            // Configuración para producción (Gmail, SendGrid, etc.)
            service: "Gmail", // Cambia a "SendGrid" si usas SendGrid
            auth: {
              user: process.env.EMAIL_USER, // Tu correo de Gmail
              pass: process.env.EMAIL_PASSWORD, // Tu contraseña de aplicación
            },
          }
        : {
            // Configuración para desarrollo (Mailtrap)
            host: "sandbox.smtp.mailtrap.io",
            port: 2525,
            auth: {
              user: process.env.MAILTRAP_USER, // Usuario de Mailtrap
              pass: process.env.MAILTRAP_PASSWORD, // Contraseña de Mailtrap
            },
          }
    )

    // Crear el enlace de verificación
    const verificationLink = `${process.env.NEXTAUTH_URL}/verify-email?token=${userId}`

    // Configurar el correo electrónico
    const mailOptions = {
      from: `"BarkAndMeow" <no-reply@barkandmeow.com>`, // Remitente
      to: email, // Destinatario
      subject: "Verifica tu correo electrónico", // Asunto
      html: `<p>Por favor, haz clic en el siguiente enlace para verificar tu correo: <a href="${verificationLink}">Verificar correo</a></p>`, // Cuerpo del correo
    }

    // Enviar el correo
    await transporter.sendMail(mailOptions)

    // Responder con éxito
    return NextResponse.json({ success: "Correo enviado exitosamente" })
  } catch (error) {
    // Responder con error
    return NextResponse.json({ error: "Error al enviar el correo" }, { status: 500 })
  }
}