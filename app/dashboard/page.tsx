// app/dashboard/page.tsx
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/login")
  }

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Bienvenido, {session.user?.email}!</p>
    </div>
  )
}