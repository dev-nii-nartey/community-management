// This file contains mock data for the application
// In a real application, this would be replaced with database queries

// Member types
export type MemberStatus = "active" | "inactive" | "pending"

export interface Member {
  id: string
  name: string
  email: string
  phone: string
  address?: string
  joinDate: string
  status: MemberStatus
  lastAttendance?: string
  notes?: string
  image?: string
}

// Event types
export type EventStatus = "upcoming" | "past" | "canceled"

export interface Event {
  id: string
  name: string
  description: string
  date: string
  time: string
  endTime?: string
  location: string
  capacity?: number
  attendees: number
  status: EventStatus
  organizer?: string
  image?: string
}

// Donation types
export type DonationStatus = "completed" | "pending" | "failed"

export interface Donation {
  id: string
  donor: string
  amount: number
  date: string
  method: string
  category: string
  status: DonationStatus
  notes?: string
  receiptSent?: boolean
}

// Message types
export type MessageType = "announcement" | "prayer" | "general"

export interface Message {
  id: string
  sender: string
  recipients?: string[]
  subject: string
  content: string
  preview: string
  date: string
  read: boolean
  type: MessageType
  attachments?: string[]
}

// Mock data for members
export const members: Member[] = [
  {
    id: "1",
    name: "Alice Johnson",
    email: "alice@example.com",
    phone: "(555) 123-4567",
    address: "123 Main St, Anytown, USA",
    joinDate: "2023-01-15",
    status: "active",
    lastAttendance: "2023-12-10",
    notes: "Active volunteer in youth ministry",
  },
  {
    id: "2",
    name: "Bob Smith",
    email: "bob@example.com",
    phone: "(555) 234-5678",
    address: "456 Oak Ave, Somewhere, USA",
    joinDate: "2023-03-03",
    status: "active",
    lastAttendance: "2023-12-03",
  },
  {
    id: "3",
    name: "Carol Williams",
    email: "carol@example.com",
    phone: "(555) 345-6789",
    address: "789 Pine St, Nowhere, USA",
    joinDate: "2022-06-12",
    status: "inactive",
    lastAttendance: "2023-09-15",
    notes: "Moved to another city",
  },
  {
    id: "4",
    name: "David Brown",
    email: "david@example.com",
    phone: "(555) 456-7890",
    joinDate: "2023-11-05",
    status: "active",
    lastAttendance: "2023-12-11",
  },
  {
    id: "5",
    name: "Eva Martinez",
    email: "eva@example.com",
    phone: "(555) 567-8901",
    joinDate: "2023-12-01",
    status: "pending",
  },
]

// Mock data for events
export const events: Event[] = [
  {
    id: "1",
    name: "Weekly Meeting",
    description: "Our regular weekly gathering for fellowship and worship.",
    date: "2023-12-15",
    time: "10:00 AM",
    endTime: "11:30 AM",
    location: "Main Hall",
    capacity: 100,
    attendees: 45,
    status: "upcoming",
    organizer: "Alice Johnson",
  },
  {
    id: "2",
    name: "Volunteer Day",
    description: "Join us as we serve our local community through various projects.",
    date: "2023-12-18",
    time: "9:00 AM",
    endTime: "2:00 PM",
    location: "Community Center",
    attendees: 20,
    status: "upcoming",
    organizer: "Bob Smith",
  },
  {
    id: "3",
    name: "Fundraising Dinner",
    description: "Annual fundraising dinner to support our mission work.",
    date: "2023-12-22",
    time: "6:30 PM",
    endTime: "9:00 PM",
    location: "Grand Ballroom",
    capacity: 150,
    attendees: 120,
    status: "upcoming",
    organizer: "Carol Williams",
  },
  {
    id: "4",
    name: "Board Meeting",
    description: "Monthly meeting of the board of directors.",
    date: "2023-11-30",
    time: "7:00 PM",
    endTime: "8:30 PM",
    location: "Conference Room",
    attendees: 12,
    status: "past",
    organizer: "David Brown",
  },
  {
    id: "5",
    name: "Youth Group",
    description: "Weekly gathering for teenagers with games, music, and discussion.",
    date: "2023-12-01",
    time: "6:00 PM",
    endTime: "8:00 PM",
    location: "Youth Center",
    attendees: 35,
    status: "past",
    organizer: "Eva Martinez",
  },
]

// Mock data for donations
export const donations: Donation[] = [
  {
    id: "1",
    donor: "Alice Johnson",
    amount: 100.0,
    date: "2023-12-10",
    method: "Credit Card",
    category: "General Fund",
    status: "completed",
    receiptSent: true,
  },
  {
    id: "2",
    donor: "Bob Smith",
    amount: 500.0,
    date: "2023-12-05",
    method: "Bank Transfer",
    category: "Building Fund",
    status: "completed",
    receiptSent: true,
  },
  {
    id: "3",
    donor: "Carol Williams",
    amount: 50.0,
    date: "2023-12-01",
    method: "PayPal",
    category: "Youth Ministry",
    status: "completed",
    receiptSent: false,
    notes: "Monthly recurring donation",
  },
  {
    id: "4",
    donor: "David Brown",
    amount: 250.0,
    date: "2023-11-28",
    method: "Check",
    category: "Missions",
    status: "completed",
    receiptSent: true,
  },
  {
    id: "5",
    donor: "Eva Martinez",
    amount: 75.0,
    date: "2023-11-25",
    method: "Credit Card",
    category: "General Fund",
    status: "completed",
    receiptSent: true,
  },
]

// Mock data for messages
export const messages: Message[] = [
  {
    id: "1",
    sender: "Alice Johnson",
    recipients: ["all@members.com"],
    subject: "Weekly Announcement",
    content:
      "Here are the updates for this week's activities and events. We have our regular meeting on Friday at 10 AM, followed by the volunteer day on Monday. Please let us know if you can participate in the volunteer day by responding to this message. Looking forward to seeing everyone!",
    preview: "Here are the updates for this week's activities and events...",
    date: "2023-12-12",
    read: true,
    type: "announcement",
  },
  {
    id: "2",
    sender: "Bob Smith",
    recipients: ["prayer@team.com"],
    subject: "Prayer Request",
    content:
      "Please keep my family in your prayers as we navigate some health challenges. My mother is scheduled for surgery next week, and we would appreciate your support during this time. Thank you for your kindness and prayers.",
    preview: "Please keep my family in your prayers as we...",
    date: "2023-12-10",
    read: false,
    type: "prayer",
  },
  {
    id: "3",
    sender: "Carol Williams",
    recipients: ["volunteers@list.com"],
    subject: "Volunteer Opportunity",
    content:
      "We need volunteers for the upcoming community service day on December 18th. We'll be working on various projects around the community center from 9 AM to 2 PM. Lunch will be provided. Please sign up if you're available to help. It's a great way to serve our community!",
    preview: "We need volunteers for the upcoming community service day...",
    date: "2023-12-08",
    read: true,
    type: "general",
  },
  {
    id: "4",
    sender: "David Brown",
    recipients: ["board@members.com"],
    subject: "Meeting Reminder",
    content:
      "Don't forget about our board meeting tomorrow at 7 PM in the conference room. We'll be discussing the budget for the upcoming year and planning for the annual fundraiser. Please review the attached documents before the meeting. Looking forward to seeing everyone there.",
    preview: "Don't forget about our board meeting tomorrow at 7 PM...",
    date: "2023-12-05",
    read: true,
    type: "announcement",
    attachments: ["budget_2024.pdf"],
  },
  {
    id: "5",
    sender: "Eva Martinez",
    recipients: ["admin@community.com"],
    subject: "Thank You",
    content:
      "I wanted to express my gratitude for your support during my recent move. The help from the community members made a huge difference, and I'm truly thankful for everyone who volunteered their time and energy. It's wonderful to be part of such a caring community.",
    preview: "I wanted to express my gratitude for your support during...",
    date: "2023-12-01",
    read: false,
    type: "general",
  },
]
