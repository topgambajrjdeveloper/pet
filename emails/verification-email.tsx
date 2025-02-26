import { Body, Container, Head, Heading, Html, Link, Preview, Text } from "@react-email/components"

interface VerificationEmailProps {
  verificationUrl: string
}

export default function VerificationEmail({ verificationUrl }: VerificationEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Verifica tu email para PetSocial</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Verifica tu email</Heading>
          <Text style={text}>
            Gracias por registrarte en PetSocial. Por favor, haz clic en el siguiente enlace para verificar tu email:
          </Text>
          <Link style={button} href={verificationUrl}>
            Verificar Email
          </Link>
          <Text style={text}>Si no te registraste en PetSocial, puedes ignorar este email.</Text>
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

