"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Mail, Phone, MapPin, Calendar, Clock, Edit, UserPlus, MessageSquare } from "lucide-react"
import { members } from "@/lib/data"

export default function MemberProfilePage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [member, setMember] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // In a real app, this would be an API call to fetch the member
    const fetchMember = async () => {
      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 500))
        const foundMember = members.find((m) => m.id === params.id)

        if (foundMember) {
          setMember(foundMember)
        } else {
          router.push("/members")
        }
      } catch (error) {
        console.error("Error fetching member:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchMember()
  }, [params.id, router])

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="text-center">
          <div className="text-muted-foreground">Loading member profile...</div>
        </div>
      </div>
    )
  }

  if (!member) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="text-center">
          <div className="text-muted-foreground">Member not found</div>
          <Button className="mt-4" onClick={() => router.push("/members")}>
            Back to Members
          </Button>
        </div>
      </div>
    )
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-500">Active</Badge>
      case "inactive":
        return <Badge variant="secondary">Inactive</Badge>
      case "pending":
        return <Badge variant="outline">Pending</Badge>
      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={() => router.push("/members")}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">Member Profile</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-1">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center">
              <Avatar className="h-24 w-24">
                <AvatarFallback className="text-xl">
                  {member.name
                    .split(" ")
                    .map((n: string) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <h2 className="mt-4 text-2xl font-bold">{member.name}</h2>
              <div className="mt-2">{getStatusBadge(member.status)}</div>
              <p className="mt-2 text-sm text-muted-foreground">Member since {member.joinDate}</p>
              <div className="mt-6 flex w-full flex-col gap-2">
                <Button onClick={() => router.push(`/members/${member.id}/edit`)}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Profile
                </Button>
                <Button variant="outline">
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Send Message
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <Mail className="h-5 w-5 text-muted-foreground" />
              <div>
                <div className="font-medium">Email</div>
                <div>{member.email}</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="h-5 w-5 text-muted-foreground" />
              <div>
                <div className="font-medium">Phone</div>
                <div>{member.phone}</div>
              </div>
            </div>
            {member.address && (
              <div className="flex items-center gap-3">
                <MapPin className="h-5 w-5 text-muted-foreground" />
                <div>
                  <div className="font-medium">Address</div>
                  <div>{member.address}</div>
                </div>
              </div>
            )}
            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-muted-foreground" />
              <div>
                <div className="font-medium">Join Date</div>
                <div>{member.joinDate}</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="h-5 w-5 text-muted-foreground" />
              <div>
                <div className="font-medium">Last Attendance</div>
                <div>{member.lastAttendance || "Never"}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-3">
          <CardHeader>
            <CardTitle>Member Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="attendance">
              <TabsList className="mb-4">
                <TabsTrigger value="attendance">Attendance</TabsTrigger>
                <TabsTrigger value="donations">Donations</TabsTrigger>
                <TabsTrigger value="events">Events</TabsTrigger>
                <TabsTrigger value="notes">Notes</TabsTrigger>
              </TabsList>
              <TabsContent value="attendance" className="space-y-4">
                <div className="rounded-md border p-4">
                  <div className="text-center text-muted-foreground">No attendance records found</div>
                </div>
                <Button>
                  <UserPlus className="mr-2 h-4 w-4" />
                  Record Attendance
                </Button>
              </TabsContent>
              <TabsContent value="donations" className="space-y-4">
                <div className="rounded-md border p-4">
                  <div className="text-center text-muted-foreground">No donation records found</div>
                </div>
              </TabsContent>
              <TabsContent value="events" className="space-y-4">
                <div className="rounded-md border p-4">
                  <div className="text-center text-muted-foreground">No event participation records found</div>
                </div>
              </TabsContent>
              <TabsContent value="notes" className="space-y-4">
                {member.notes ? (
                  <div className="rounded-md border p-4">
                    <p>{member.notes}</p>
                  </div>
                ) : (
                  <div className="rounded-md border p-4">
                    <div className="text-center text-muted-foreground">No notes found</div>
                  </div>
                )}
                <Button variant="outline">Add Note</Button>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
