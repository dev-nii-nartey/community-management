"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Heart, Search, MoreHorizontal, Calendar, Download, CreditCard, DollarSign } from "lucide-react"

// Mock data for donations
const donations = [
  {
    id: "1",
    donor: "Alice Johnson",
    amount: 100.0,
    date: "2023-12-10",
    method: "Credit Card",
    category: "General Fund",
    status: "completed",
  },
  {
    id: "2",
    donor: "Bob Smith",
    amount: 500.0,
    date: "2023-12-05",
    method: "Bank Transfer",
    category: "Building Fund",
    status: "completed",
  },
  {
    id: "3",
    donor: "Carol Williams",
    amount: 50.0,
    date: "2023-12-01",
    method: "PayPal",
    category: "Youth Ministry",
    status: "completed",
  },
  {
    id: "4",
    donor: "David Brown",
    amount: 250.0,
    date: "2023-11-28",
    method: "Check",
    category: "Missions",
    status: "completed",
  },
  {
    id: "5",
    donor: "Eva Martinez",
    amount: 75.0,
    date: "2023-11-25",
    method: "Credit Card",
    category: "General Fund",
    status: "completed",
  },
]

export default function DonationsPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("all")

  const filteredDonations = donations.filter((donation) => {
    const matchesSearch =
      donation.donor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      donation.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      donation.method.toLowerCase().includes(searchQuery.toLowerCase())

    return matchesSearch
  })

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-500">Completed</Badge>
      case "pending":
        return <Badge variant="outline">Pending</Badge>
      case "failed":
        return <Badge variant="destructive">Failed</Badge>
      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Donations</h1>
          <p className="text-muted-foreground">Manage donations and generate receipts</p>
        </div>
        <Button onClick={() => router.push("/donations/add")}>
          <Heart className="mr-2 h-4 w-4" />
          Record Donation
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Donations</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(975.0)}</div>
            <p className="text-xs text-muted-foreground">+20.1% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Donation Count</CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-muted-foreground">+2 from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Donation</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(195.0)}</div>
            <p className="text-xs text-muted-foreground">+$45 from last month</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-col gap-4 space-y-0 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle>Donation History</CardTitle>
          <div className="flex flex-col gap-2 sm:flex-row">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search donations..."
                className="pl-8 w-full sm:w-[300px]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="outline" size="icon">
              <Download className="h-4 w-4" />
              <span className="sr-only">Download CSV</span>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="all">All Donations</TabsTrigger>
              <TabsTrigger value="recent">Recent</TabsTrigger>
              <TabsTrigger value="categories">By Category</TabsTrigger>
            </TabsList>
            <TabsContent value="all" className="space-y-4">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Donor</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead className="hidden md:table-cell">Method</TableHead>
                      <TableHead className="hidden lg:table-cell">Category</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredDonations.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center h-24">
                          No donations found matching your criteria
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredDonations.map((donation) => (
                        <TableRow key={donation.id}>
                          <TableCell>
                            <div className="font-medium">{donation.donor}</div>
                          </TableCell>
                          <TableCell>
                            <div className="font-medium text-green-600">{formatCurrency(donation.amount)}</div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4 text-muted-foreground" />
                              <span>{donation.date}</span>
                            </div>
                          </TableCell>
                          <TableCell className="hidden md:table-cell">{donation.method}</TableCell>
                          <TableCell className="hidden lg:table-cell">{donation.category}</TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreHorizontal className="h-4 w-4" />
                                  <span className="sr-only">Actions</span>
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => router.push(`/donations/${donation.id}`)}>
                                  View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem>Generate Receipt</DropdownMenuItem>
                                <DropdownMenuItem>Send Thank You</DropdownMenuItem>
                                <DropdownMenuItem>Edit Donation</DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
            <TabsContent value="recent" className="space-y-4">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Donor</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredDonations.slice(0, 3).map((donation) => (
                      <TableRow key={donation.id}>
                        <TableCell>
                          <div className="font-medium">{donation.donor}</div>
                        </TableCell>
                        <TableCell>
                          <div className="font-medium text-green-600">{formatCurrency(donation.amount)}</div>
                        </TableCell>
                        <TableCell>{donation.date}</TableCell>
                        <TableCell>{donation.category}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm" onClick={() => router.push(`/donations/${donation.id}`)}>
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
            <TabsContent value="categories" className="space-y-4">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Category</TableHead>
                      <TableHead>Total Amount</TableHead>
                      <TableHead>Count</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>
                        <div className="font-medium">General Fund</div>
                      </TableCell>
                      <TableCell>{formatCurrency(175.0)}</TableCell>
                      <TableCell>2</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        <div className="font-medium">Building Fund</div>
                      </TableCell>
                      <TableCell>{formatCurrency(500.0)}</TableCell>
                      <TableCell>1</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        <div className="font-medium">Youth Ministry</div>
                      </TableCell>
                      <TableCell>{formatCurrency(50.0)}</TableCell>
                      <TableCell>1</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        <div className="font-medium">Missions</div>
                      </TableCell>
                      <TableCell>{formatCurrency(250.0)}</TableCell>
                      <TableCell>1</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
