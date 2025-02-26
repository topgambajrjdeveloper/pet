import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const meetups = [
  { id: 1, name: "Park Playdate", location: "Central Park", date: "2023-12-15", time: "15:00" },
  { id: 2, name: "Beach Day", location: "Sunny Beach", date: "2023-12-20", time: "10:00" },
]

export default function Meetups() {
  return (
    <div className="container mx-auto p-4 pb-20 md:pb-4">
      <h1 className="text-2xl font-bold mb-4">Pet Meetups</h1>
      <div className="grid gap-4">
        {meetups.map((meetup) => (
          <Card key={meetup.id}>
            <CardHeader>
              <CardTitle>{meetup.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                <strong>Location:</strong> {meetup.location}
              </p>
              <p>
                <strong>Date:</strong> {meetup.date}
              </p>
              <p>
                <strong>Time:</strong> {meetup.time}
              </p>
              <Button className="mt-2">Join Meetup</Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

