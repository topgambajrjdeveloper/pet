import type React from "react";
import { Suspense } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Heart, Users, Calendar, Shield } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { PublicFeedPreview } from "@/components/(root)/components/public-feed-preview";
import { FeedSkeleton } from "@/components/skeletons";
import HeroSection from "@/components/(root)/components/hero-section";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Feed from "./feed/page";

export default async function Home() {
  const session = await getServerSession(authOptions);


  return (
    <>
      {session ? (
        <>
          <Feed />
        </>
      ) : (
        <>
          {/* Hero Section */}
          <HeroSection />

          {/* Features Section */}
          <section className="py-20 bg-background">
            <div className="container px-4 mx-auto">
              <h2 className="text-3xl font-bold text-center mb-12">
                Todo lo que tu mascota necesita
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                <FeatureCard
                  icon={<Heart className="h-8 w-8 text-primary" />}
                  title="Cartilla Digital"
                  description="Mantén el historial médico de tu mascota organizado y accesible."
                />
                <FeatureCard
                  icon={<Users className="h-8 w-8 text-primary" />}
                  title="Comunidad"
                  description="Conecta con otros dueños de mascotas y comparte experiencias."
                />
                <FeatureCard
                  icon={<Calendar className="h-8 w-8 text-primary" />}
                  title="Eventos"
                  description="Encuentra y organiza quedadas con otras mascotas cercanas."
                />
                <FeatureCard
                  icon={<Shield className="h-8 w-8 text-primary" />}
                  title="Pasaporte"
                  description="Gestiona los documentos oficiales de tu mascota fácilmente."
                />
              </div>
            </div>
          </section>

          {/* Public Feed Preview */}
          <section className="py-20 bg-muted/50">
            <div className="container px-4 mx-auto">
              <h2 className="text-3xl font-bold text-center mb-12">
                Descubre Momentos Especiales
              </h2>
              <Suspense fallback={<FeedSkeleton />}>
                <PublicFeedPreview />
              </Suspense>
              <div className="text-center mt-8">
                <Link href="/register">
                  <Button size="lg">Unirse a la comunidad</Button>
                </Link>
              </div>
            </div>
          </section>

          {/* Testimonials */}
          <section className="py-20 bg-background">
            <div className="container px-4 mx-auto">
              <h2 className="text-3xl font-bold text-center mb-12">
                Lo que dicen nuestros usuarios
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <TestimonialCard
                  name="Ana García"
                  pet="Luna"
                  image="/placeholder.svg"
                  text="Gracias a PetSocial, Luna ha hecho muchos amigos en el vecindario."
                />
                <TestimonialCard
                  name="Carlos Ruiz"
                  pet="Max"
                  image="/placeholder.svg"
                  text="La cartilla digital me ayuda a mantener todas las vacunas al día."
                />
                <TestimonialCard
                  name="Laura Martín"
                  pet="Coco"
                  image="/placeholder.svg"
                  text="Los eventos son geniales para socializar a mi cachorro."
                />
              </div>
            </div>
          </section>
        </>
      )}
    </>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <Card className="text-center p-6">
      <CardContent className="pt-6">
        <div className="flex justify-center mb-4">{icon}</div>
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p className="text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}

function TestimonialCard({
  name,
  pet,
  image,
  text,
}: {
  name: string;
  pet: string;
  image: string;
  text: string;
}) {
  return (
    <Card className="p-6">
      <CardContent className="pt-6">
        <div className="flex items-center mb-4">
          <img
            src={image || "/placeholder.svg"}
            alt={`${name} y ${pet}`}
            className="w-12 h-12 rounded-full mr-4"
            width={48}
            height={48}
          />
          <div>
            <h4 className="font-semibold">{name}</h4>
            <p className="text-sm text-muted-foreground">con {pet}</p>
          </div>
        </div>
        <p className="italic">{text}</p>
      </CardContent>
    </Card>
  );
}
