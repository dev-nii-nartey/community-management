"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Calendar, Mail, Phone } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { API_ENDPOINTS } from "@/app/config/api"

interface Member {
  id: string
  firstName: string
  lastName: string
  preferredName?: string
  dateOfBirth: string
  gender: string
  maritalStatus: string
  residingAddress: string
  primaryPhone: string
  secondaryPhone?: string
  emailAddress: string
  occupation?: string
  employer?: string
  dateJoinedChurch?: string
  attendanceStatus: "ACTIVE" | "INACTIVE" | null
  lastAttendance?: string
  baptizedWithHolySpirit?: boolean
}

export default function MemberProfilePage() {
  const router = useRouter()
  const params = useParams()
  const { toast } = useToast()
  const [member, setMember] = useState<Member | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchMember = async () => {
      try {
        setLoading(true)
        // Fetch member by ID using the API config
        const response = await fetch(`${API_ENDPOINTS.members}/${params.id}`)
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        
        const memberData = await response.json()
        setMember(memberData)
      } catch (error) {
        console.error("Error fetching member:", error)
        toast({
          title: "Error",
          description: "Failed to load member details. Please try again.",
          variant: "destructive",
        })
        router.push("/members")
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      fetchMember()
    }
  }, [params.id, router, toast])

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="mt-2 text-sm text-muted-foreground">Loading member profile...</p>
        </div>
      </div>
    )
  }

  if (!member) {
    return null
  }

  return (
    <div className="flex flex-col space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">Member Profile</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarFallback className="text-lg">
                  {member.firstName[0]}
                  {member.lastName[0]}
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle>{`${member.firstName} ${member.lastName}`}</CardTitle>
                <CardDescription>
                  {member.preferredName && <span>Preferred name: {member.preferredName}</span>}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2">
              <Badge variant={member.attendanceStatus === "ACTIVE" ? "default" : "secondary"}>
                {member.attendanceStatus || "Unknown"}
              </Badge>
              {member.lastAttendance && (
                <span className="text-xs text-muted-foreground">Last attended: {member.lastAttendance}</span>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span>{member.emailAddress}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span>{member.primaryPhone}</span>
              </div>
              {member.secondaryPhone && (
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{member.secondaryPhone}</span>
                </div>
              )}
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>Born {member.dateOfBirth}</span>
              </div>
            </div>
          </CardContent>
          <CardFooter className="justify-between">
            <Button variant="outline" size="sm" onClick={() => router.push(`/messages/compose?to=${member.emailAddress}`)}>
              Send Message
            </Button>
            <Button size="sm" onClick={() => router.push(`/members/edit/${member.id}`)}>
              Edit Profile
            </Button>
          </CardFooter>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2 text-sm">
                <div className="grid grid-cols-2">
                  <span className="text-muted-foreground">Gender</span>
                  <span>{member.gender}</span>
                </div>
                <div className="grid grid-cols-2">
                  <span className="text-muted-foreground">Marital Status</span>
                  <span>{member.maritalStatus}</span>
                </div>
                <div className="grid grid-cols-2">
                  <span className="text-muted-foreground">Address</span>
                  <span>{member.residingAddress}</span>
                </div>
                {member.occupation && (
                  <div className="grid grid-cols-2">
                    <span className="text-muted-foreground">Occupation</span>
                    <span>{member.occupation}</span>
                  </div>
                )}
                {member.employer && (
                  <div className="grid grid-cols-2">
                    <span className="text-muted-foreground">Employer</span>
                    <span>{member.employer}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Church Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2 text-sm">
                {member.dateJoinedChurch && (
                  <div className="grid grid-cols-2">
                    <span className="text-muted-foreground">Member Since</span>
                    <span>{member.dateJoinedChurch}</span>
                  </div>
                )}
                <div className="grid grid-cols-2">
                  <span className="text-muted-foreground">Holy Spirit Baptism</span>
                  <span>{member.baptizedWithHolySpirit ? "Yes" : "No"}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
