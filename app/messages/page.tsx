"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MessageSquare, Search, MoreHorizontal, PenSquare, Inbox, Send, Heart } from "lucide-react"

// Mock data for messages
const messages = [
  {
    id: "1",
    sender: "Alice Johnson",
    subject: "Weekly Announcement",
    preview: "Here are the updates for this week's activities and events...",
    date: "2023-12-12",
    read: true,
    type: "announcement",
  },
  {
    id: "2",
    sender: "Bob Smith",
    subject: "Prayer Request",
    preview: "Please keep my family in your prayers as we...",
    date: "2023-12-10",
    read: false,
    type: "prayer",
  },
  {
    id: "3",
    sender: "Carol Williams",
    subject: "Volunteer Opportunity",
    preview: "We need volunteers for the upcoming community service day...",
    date: "2023-12-08",
    read: true,
    type: "general",
  },
  {
    id: "4",
    sender: "David Brown",
    subject: "Meeting Reminder",
    preview: "Don't forget about our board meeting tomorrow at 7 PM...",
    date: "2023-12-05",
    read: true,
    type: "announcement",
  },
  {
    id: "5",
    sender: "Eva Martinez",
    subject: "Thank You",
    preview: "I wanted to express my gratitude for your support during...",
    date: "2023-12-01",
    read: false,
    type: "general",
  },
]

export default function MessagesPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("inbox")

  const filteredMessages = messages.filter((message) => {
    const matchesSearch =
      message.sender.toLowerCase().includes(searchQuery.toLowerCase()) ||
      message.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      message.preview.toLowerCase().includes(searchQuery.toLowerCase())

    return matchesSearch
  })

  const getMessageTypeIcon = (type: string) => {
    switch (type) {
      case "announcement":
        return <MessageSquare className="h-4 w-4 text-blue-500" />
      case "prayer":
        return <Heart className="h-4 w-4 text-red-500" />
      case "general":
        return <MessageSquare className="h-4 w-4 text-muted-foreground" />
      default:
        return <MessageSquare className="h-4 w-4 text-muted-foreground" />
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Messages</h1>
          <p className="text-muted-foreground">Communicate with your community members</p>
        </div>
        <Button onClick={() => router.push("/messages/compose")}>
          <PenSquare className="mr-2 h-4 w-4" />
          Compose Message
        </Button>
      </div>

      <Card>
        <CardHeader className="flex flex-col gap-4 space-y-0 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle>Message Center</CardTitle>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search messages..."
              className="pl-8 w-full sm:w-[300px]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="inbox" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="inbox" className="flex items-center gap-2">
                <Inbox className="h-4 w-4" />
                Inbox
              </TabsTrigger>
              <TabsTrigger value="sent" className="flex items-center gap-2">
                <Send className="h-4 w-4" />
                Sent
              </TabsTrigger>
              <TabsTrigger value="prayer" className="flex items-center gap-2">
                <Heart className="h-4 w-4" />
                Prayer Requests
              </TabsTrigger>
            </TabsList>
            <TabsContent value="inbox" className="space-y-4">
              <div className="rounded-md border">
                {filteredMessages.length === 0 ? (
                  <div className="flex h-32 items-center justify-center text-muted-foreground">
                    No messages found matching your criteria
                  </div>
                ) : (
                  <div className="divide-y">
                    {filteredMessages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex cursor-pointer items-center justify-between p-4 hover:bg-muted ${
                          !message.read ? "bg-muted/50" : ""
                        }`}
                        onClick={() => router.push(`/messages/${message.id}`)}
                      >
                        <div className="flex items-center gap-4">
                          <Avatar>
                            <AvatarFallback>
                              {message.sender
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className={`font-medium ${!message.read ? "font-bold" : ""}`}>
                                {message.sender}
                              </span>
                              {!message.read && (
                                <Badge variant="secondary" className="h-2 w-2 rounded-full bg-blue-500 p-0" />
                              )}
                            </div>
                            <div className="flex items-center gap-2">
                              {getMessageTypeIcon(message.type)}
                              <span className={`${!message.read ? "font-semibold" : ""}`}>{message.subject}</span>
                            </div>
                            <p className="text-sm text-muted-foreground line-clamp-1">{message.preview}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-xs text-muted-foreground">{message.date}</div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Actions</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={(e) => {
                                  e.stopPropagation()
                                  router.push(`/messages/${message.id}`)
                                }}
                              >
                                View Message
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={(e) => {
                                  e.stopPropagation()
                                }}
                              >
                                Mark as {message.read ? "Unread" : "Read"}
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={(e) => {
                                  e.stopPropagation()
                                  router.push(`/messages/reply/${message.id}`)
                                }}
                              >
                                Reply
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={(e) => {
                                  e.stopPropagation()
                                }}
                              >
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>
            <TabsContent value="sent" className="space-y-4">
              <div className="rounded-md border">
                <div className="flex h-32 items-center justify-center text-muted-foreground">
                  Your sent messages will appear here
                </div>
              </div>
            </TabsContent>
            <TabsContent value="prayer" className="space-y-4">
              <div className="rounded-md border">
                <div className="flex h-32 items-center justify-center text-muted-foreground">
                  Prayer requests will appear here
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
