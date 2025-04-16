"use client"

import { useState } from "react"
import Link from "next/link"
import { useAuth } from "@/components/auth-provider"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Users,
  Calendar,
  Heart,
  MessageSquare,
  TrendingUp,
  UserPlus,
  CalendarPlus,
  PlusCircle,
  ArrowRight,
} from "lucide-react"

// Mock data for the dashboard
const stats = [
  { name: "Total Members", value: 245, icon: Users, change: "+12% from last month" },
  { name: "Upcoming Events", value: 8, icon: Calendar, change: "Next event in 3 days" },
  { name: "Recent Donations", value: "$2,450", icon: Heart, change: "+5% from last month" },
  { name: "Unread Messages", value: 18, icon: MessageSquare, change: "5 new since yesterday" },
]

const recentMembers = [
  { id: 1, name: "Alice Johnson", email: "alice@example.com", joinedDate: "2 days ago" },
  { id: 2, name: "Bob Smith", email: "bob@example.com", joinedDate: "5 days ago" },
  { id: 3, name: "Carol Williams", email: "carol@example.com", joinedDate: "1 week ago" },
]

const upcomingEvents = [
  { id: 1, name: "Weekly Meeting", date: "Tomorrow, 10:00 AM", location: "Main Hall" },
  { id: 2, name: "Volunteer Day", date: "Saturday, 9:00 AM", location: "Community Center" },
  { id: 3, name: "Fundraising Dinner", date: "Next Friday, 6:30 PM", location: "Grand Ballroom" },
]

export default function DashboardPage() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState("overview")

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {user?.name}! Here's what's happening with your community.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="hidden md:flex">
            <Calendar className="mr-2 h-4 w-4" />
            View Calendar
          </Button>
          <Button size="sm">
            <PlusCircle className="mr-2 h-4 w-4" />
            New Event
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="activity">Recent Activity</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => (
              <Card key={stat.name}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">{stat.name}</p>
                      <p className="text-2xl font-bold">{stat.value}</p>
                    </div>
                    <div className="rounded-full bg-muted p-2">
                      <stat.icon className="h-5 w-5 text-primary" />
                    </div>
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground">{stat.change}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="lg:col-span-4">
              <CardHeader>
                <CardTitle>Recent Members</CardTitle>
                <CardDescription>New members who joined recently</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentMembers.map((member) => (
                    <div key={member.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarFallback>
                            {member.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium">{member.name}</p>
                          <p className="text-xs text-muted-foreground">{member.email}</p>
                        </div>
                      </div>
                      <div className="text-xs text-muted-foreground">Joined {member.joinedDate}</div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 flex justify-end">
                  <Link href="/members">
                    <Button variant="ghost" size="sm" className="gap-1">
                      View all members
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            <Card className="lg:col-span-3">
              <CardHeader>
                <CardTitle>Upcoming Events</CardTitle>
                <CardDescription>Events scheduled in the near future</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {upcomingEvents.map((event) => (
                    <div key={event.id} className="flex flex-col gap-1">
                      <p className="text-sm font-medium">{event.name}</p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        {event.date}
                      </div>
                      <p className="text-xs text-muted-foreground">{event.location}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-4 flex justify-end">
                  <Link href="/events">
                    <Button variant="ghost" size="sm" className="gap-1">
                      View all events
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Growth Analytics</CardTitle>
              <CardDescription>Member growth and engagement over time</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px] flex items-center justify-center">
              <div className="text-center text-muted-foreground">
                <TrendingUp className="mx-auto h-12 w-12 mb-2" />
                <p>Analytics charts would be displayed here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="activity" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest actions and updates in your community</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="rounded-full bg-primary/10 p-2">
                    <UserPlus className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">New Member Joined</p>
                    <p className="text-xs text-muted-foreground">Alice Johnson joined the community</p>
                    <p className="text-xs text-muted-foreground">2 hours ago</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="rounded-full bg-primary/10 p-2">
                    <CalendarPlus className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">New Event Created</p>
                    <p className="text-xs text-muted-foreground">Weekly Meeting scheduled for tomorrow</p>
                    <p className="text-xs text-muted-foreground">5 hours ago</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="rounded-full bg-primary/10 p-2">
                    <Heart className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">New Donation Received</p>
                    <p className="text-xs text-muted-foreground">$500 donation from Bob Smith</p>
                    <p className="text-xs text-muted-foreground">Yesterday</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
