import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Heart, MessageCircle, Share } from "lucide-react";

const posts = [
  {
    id: 1,
    user: "Juan Pérez",
    userImage: "/user1.jpg", // URL de la imagen del usuario
    petName: "Max",
    petType: "Perro",
    image: "/logo.png", // URL de la imagen de la publicación
  },
  {
    id: 2,
    user: "Ana Gómez",
    userImage: "/user2.jpg",
    petName: "Luna",
    petType: "Gato",
    image: "/logo.png",
  },
];

export default function Feed() {
  return (
    <div className="container mx-auto p-4 pb-20 md:pb-4">
      <h1 className="text-2xl font-bold mb-4">Pet Feed</h1>
      <div className="max-w-3xl mx-auto space-y-4">
        {" "}
        {/* Contenedor centralizado */}
        {posts.map((post) => (
          <Card key={post.id} className="hover:shadow-lg transition-shadow">
            {" "}
            {/* Efecto de hover */}
            <CardHeader className="flex flex-row items-center space-x-4 p-4">
              <Avatar>
                <AvatarImage src={post.userImage || "/placeholder.svg"} />{" "}
                {/* Avatar del usuario */}
                <AvatarFallback>{post.user[0]}</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-lg">{post.user}</CardTitle>{" "}
                {/* Nombre del usuario */}
                <p className="text-sm text-muted-foreground">
                  @{post.user.toLowerCase().replace(/\s+/g, "")} • con{" "}
                  {post.petName} • {post.petType}
                </p>{" "}
                {/* Nombre de usuario y detalles de la mascota */}
              </div>
            </CardHeader>
            <CardContent className="p-4">
              <Image
                src={post.image || "/logo.png"}
                alt={`${post.petName}'s photo`}
                width={600}
                height={400}
                className="rounded-lg w-full h-auto"
              />{" "}
              {/* Imagen de la publicación */}
            </CardContent>
            <CardFooter className="p-4 flex justify-between">
              <Button variant="ghost" size="sm">
                <Heart className="mr-2 h-4 w-4" /> {/* Icono de "Me gusta" */}
                <span>Me gusta</span>
              </Button>
              <Button variant="ghost" size="sm">
                <MessageCircle className="mr-2 h-4 w-4" />{" "}
                {/* Icono de "Comentar" */}
                <span>Comentar</span>
              </Button>
              <Button variant="ghost" size="sm">
                <Share className="mr-2 h-4 w-4" /> {/* Icono de "Compartir" */}
                <span>Compartir</span>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
