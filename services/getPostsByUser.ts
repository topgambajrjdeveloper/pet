import { prisma } from "@/lib/prisma";


interface Post {
  id: number;
  petName: string;
  petType: string;
  image?: string;
  userId: number;
  user: {
    id: number;
    name: string;
    email: string;
    image?: string;
  };
}

export async function getPostsByUser(userId: number): Promise<Post[]> {
  try {
    const posts = await prisma.post.findMany({
      where: {
        userId: userId,
      },
      include: {
        user: true, // Incluye la información del usuario asociado al post
      },
    });
    return posts;
  } catch (error) {
    console.error("Error fetching posts:", error);
    throw new Error("Error al recuperar los posts");
  }
}