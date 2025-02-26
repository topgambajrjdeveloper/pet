import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const healthRecords = [
  { date: "2023-01-15", vaccine: "Rabies", nextDue: "2024-01-15" },
  { date: "2023-03-20", vaccine: "Distemper", nextDue: "2024-03-20" },
]

export default function HealthRecord() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Health Record</h1>
      <Card>
        <CardHeader>
          <CardTitle>Max's Vaccinations</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {healthRecords.map((record, index) => (
              <li key={index} className="flex justify-between items-center">
                <span>{record.vaccine}</span>
                <span className="text-muted-foreground">
                  Last: {record.date} | Next: {record.nextDue}
                </span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}

