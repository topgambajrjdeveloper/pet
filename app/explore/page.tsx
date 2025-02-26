import { Suspense } from "react"
import type { Metadata } from "next"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { PublicFeedPreview } from "@/components/(root)/components/public-feed-preview"
import { FeedSkeleton } from "@/components/skeletons"

export const metadata: Metadata = {
  title: "Explorar",
  description: "Descubre las historias más populares de nuestra comunidad de mascotas",
}

async function getPublicEvents() {
  // Simular una llamada a la API
  return [
    {
      id: 1,
      title: "Día del Perro en el Parque",
      date: "15 de Marzo, 2024",
      location: "Parque Central",
      attendees: 42,
    },
    {
      id: 2,
      title: "Exposición Felina",
      date: "22 de Marzo, 2024",
      location: "Centro de Eventos",
      attendees: 89,
    },
    {
      id: 3,
      title: "Taller de Adiestramiento",
      date: "29 de Marzo, 2024",
      location: "Club Canino",
      attendees: 24,
    },
  ]
}

export default async function Explore() {
  const events = await getPublicEvents()

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Explora PetSocial</h1>
        <p className="text-xl text-muted-foreground mb-8">Descubre las historias más populares de nuestra comunidad</p>
        <Link href="/register">
          <Button size="lg">Únete a la comunidad</Button>
        </Link>
      </div>

      {/* Sección de eventos públicos */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-6">Próximos Eventos</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <EventCard
              key={event.id}
              title={event.title}
              date={event.date}
              location={event.location}
              attendees={event.attendees}
            />
          ))}
        </div>
      </section>

      {/* Feed público */}
      <section>
        <h2 className="text-2xl font-bold mb-6">Momentos Destacados</h2>
        <Suspense fallback={<FeedSkeleton />}>
          <PublicFeedPreview />
        </Suspense>
      </section>
    </div>
  )
}

function EventCard({
  title,
  date,
  location,
  attendees,
}: {
  title: string
  date: string
  location: string
  attendees: number
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground mb-2">{date}</p>
        <p className="mb-4">{location}</p>
        <p className="text-sm text-muted-foreground">{attendees} asistentes</p>
        <Link href="/register">
          <Button className="w-full mt-4">Participar</Button>
        </Link>
      </CardContent>
    </Card>
  )
}

