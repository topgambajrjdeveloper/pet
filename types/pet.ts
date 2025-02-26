export interface Pet {
  id: number;
  name: string;
  description: string;
  imageUrl: string;
}

export interface UserData {
  name: string
  email: string
  petName: string
  petType: string
  coverImage?: string
  userImage?: string
  bio?: string
}

export interface Post {
  id: number
  image: string
  description: string
  date: string
}

export interface Friend {
  id: number;
  name: string;
  avatar: string;
}

export interface Event {
  id: number;
  name: string;
  date: string;
  location: string;
}
