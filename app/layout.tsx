import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/(root)/components/navigation";
import { ThemeProvider } from "@/lib/theme-context";
import { SessionProvider } from "@/components/session-provider";
import { Header } from "@/components/(root)/components//header";
import { Footer } from "@/components/(root)/components/footer";
import { Toaster } from "sonner";
import { UserProvider } from "@/context/user-context";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "BarkAndMeow - La red social para amantes de mascotas",
    template: "%s | BarkAndMeow",
  },
  description: "¡Únete a la comunidad de mascotas más divertida!",
  metadataBase: new URL(process.env.NEXTAUTH_URL || "http://localhost:3000"),
  keywords: [
    "mascotas",
    "red social mascotas",
    "comunidad mascotas",
    "perros",
    "gatos",
    "dueños de mascotas",
    "socializar mascotas",
    "fotos de mascotas",
    "cartilla digital mascotas",
    "pasaporte mascotas",
    "puntos de quedada mascotas",
    "BarkAndMeow",
    "cuidar mascotas",
    "adopción mascotas",
    "veterinarios",
    "juguetes mascotas",
    "alimentación mascotas",
    "entrenamiento mascotas",
    "eventos mascotas",
    "mascotas divertidas",
    "mascotas felices",
  ],
  authors: [{ name: "", url: "" }], // Agrega el nombre y URL del autor si es necesario
  creator: "BarkAndMeow - TopgambaJrJ",
  publisher: "BarkAndMeow - TopgambaJrJ",
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/logo.png", // Ruta al favicon
    shortcut: "/icon/favicon.ico", // Ruta al shortcut icon
    apple: "/icon/apple-touch-icon.png", // Ruta al ícono de Apple
    other: [
      {
        rel: "icon",
        type: "image/png",
        sizes: "32x32",
        url: "/icon/favicon-32x32.png",
      },
      {
        rel: "icon",
        type: "image/png",
        sizes: "16x16",
        url: "/icon/favicon-16x16.png",
      },
    ],
  },
  openGraph: {
    title: "BarkAndMeow - La red social para amantes de mascotas",
    description: "¡Únete a la comunidad de mascotas más divertida!",
    url: "https://www.barkandmeow.com", // Reemplaza con tu URL
    siteName: "BarkAndMeow",
    images: [
      {
        url: "/logo.png", // Ruta a la imagen del logo
        width: 800,
        height: 600,
        alt: "Logo de BarkAndMeow",
      },
    ],
    locale: "es_ES",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "BarkAndMeow - La red social para amantes de mascotas",
    description: "¡Únete a la comunidad de mascotas más divertida!",
    images: ["/logo.png"], // Ruta a la imagen del logo
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black",
    title: "BarkAndMeow",
  },
  other: {
    "apple-mobile-web-app-capable": "yes",
    "mobile-web-app-capable": "yes",
    // "apple-touch-fullscreen": "yes",
    distribution: "Global",
    rating: "General",
  },
  // metadataBase: new URL("https://www.barkandmeow.com"), // Reemplaza con tu URL base
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  colorScheme: "dark",
  // Also supported but less commonly used
  // interactiveWidget: 'resizes-visual',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
      <SessionProvider>
          <UserProvider>
            <ThemeProvider>
              <div className="flex min-h-screen flex-col">
                <Header />
                <main className="flex-1">
                  {children}
                  <Toaster />
                </main>
                <Footer />
                <Navigation />
              </div>
            </ThemeProvider>
          </UserProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
