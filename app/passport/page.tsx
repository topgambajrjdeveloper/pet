import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function Passport() {
  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Pet Passport</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4 mb-4">
            <Avatar className="w-24 h-24">
              <AvatarImage src="/placeholder.svg" />
              <AvatarFallback>MP</AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-xl font-semibold">Max</h2>
              <p className="text-muted-foreground">Golden Retriever</p>
            </div>
          </div>
          <div className="grid gap-2">
            <div>
              <strong>Date of Birth:</strong> January 1, 2020
            </div>
            <div>
              <strong>Microchip Number:</strong> 123456789012345
            </div>
            <div>
              <strong>Owner:</strong> John Doe
            </div>
            <div>
              <strong>Country of Origin:</strong> Spain
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

