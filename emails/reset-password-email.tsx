import { Body, Container, Head, Heading, Html, Link, Preview, Text } from "@react-email/components"

interface ResetPasswordEmailProps {
  resetUrl: string
}

export default function ResetPasswordEmail({ resetUrl }: ResetPasswordEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Restablece tu contraseña para PetSocial</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Restablece tu contraseña</Heading>
          <Text style={text}>
            Has solicitado restablecer tu contraseña para PetSocial. Por favor, haz clic en el siguiente enlace para
            restablecerla:
          </Text>
          <Link style={button} href={resetUrl}>
            Restablecer Contraseña
          </Link>
          <Text style={text}>Si no solicitaste restablecer tu contraseña, puedes ignorar este email.</Text>
        </Container>
      </Body>
    </Html>
  )
}

const main = {
  backgroundColor: "#ffffff",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
}

const container = {
  margin: "0 auto",
  padding: "20px 0 48px",
  maxWidth: "560px",
}

const h1 = {
  fontSize: "24px",
  fontWeight: "600",
  lineHeight: "1.25",
  marginBottom: "24px",
  color: "#000",
}

const text = {
  fontSize: "16px",
  lineHeight: "1.5",
  marginBottom: "24px",
  color: "#333",
}

const button = {
  backgroundColor: "#000",
  borderRadius: "4px",
  color: "#fff",
  fontSize: "16px",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "block",
  padding: "12px",
  marginBottom: "24px",
}

