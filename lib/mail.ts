import nodemailer from "nodemailer"

// Configuración para desarrollo (Mailtrap)
const devConfig = {
  host: "sandbox.smtp.mailtrap.io",
  port: 2525,
  secure: false, // Mailtrap no requiere TLS
  auth: {
    user: process.env.MAILTRAP_USER,
    pass: process.env.MAILTRAP_PASSWORD,
  },
  tls: {
    rejectUnauthorized: false, // Permitir certificados autofirmados
  },
}

// Configuración para producción (Gmail, SendGrid, etc.)
const prodConfig = {
  host: "smtp.gmail.com", // Servidor SMTP de Gmail
  port: 465, // Puerto seguro para Gmail
  secure: false, // Usar TLS
  auth: {
    user: process.env.EMAIL_USER, // Tu correo de Gmail
    pass: process.env.EMAIL_PASSWORD, // Tu contraseña de aplicación
  },
  tls: {
    // Opciones adicionales de TLS
    rejectUnauthorized: false, // Rechazar conexiones no autorizadas
  },
}

// Seleccionar la configuración según el entorno
const transporter = nodemailer.createTransport(
  process.env.NODE_ENV === "production" ? prodConfig : devConfig
)

export async function sendVerificationEmail(email: string, userId: string) {
  const verificationLink = `${process.env.NEXTAUTH_URL}/verify-email?token=${userId}`

  const mailOptions = {
    from: `"BarkAndMeow" <no-reply@barkandmeow.com>`, // Remitente
    to: email, // Destinatario
    subject: "Verifica tu correo electrónico", // Asunto
    html: `<p>Por favor, haz clic en el siguiente enlace para verificar tu correo: <a href="${verificationLink}">Verificar correo</a></p>`, // Cuerpo del correo
  }

  try {
    await transporter.sendMail(mailOptions)
    console.log(
      `Correo de verificación enviado a ${
        process.env.NODE_ENV === "production" ? "Gmail" : "Mailtrap"
      }`
    )
  } catch (error) {
    console.error("Error al enviar el correo de verificación:", error)
  }
}