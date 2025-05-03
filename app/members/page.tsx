"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { UserPlus, Search, MoreHorizontal, Filter, Download, ChevronLeft, ChevronRight } from "lucide-react"
import { API_ENDPOINTS } from "@/app/config/api"

// Interface matching the Java MemberSummaryDto
interface ApiMember {
  id: string;
  firstName: string;
  lastName: string;
  primaryPhone: string;
  dateJoinedChurch: string;
  emailAddress: string;
  attendanceStatus: "ACTIVE" | "INACTIVE" | null;
  lastAttendance: string;
}

// Interface for our UI display format
interface DisplayMember {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: string;
  joinDate: string;
  lastAttendance: string;
}

interface ApiResponse {
  content: ApiMember[];
  pageable: {
    pageNumber: number;
    pageSize: number;
  };
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}

export default function MembersPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [members, setMembers] = useState<DisplayMember[]>([])
  const [page, setPage] = useState(0)
  const [pageSize] = useState(10)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(false)

  const fetchMembers = async (pageNumber = page) => {
    setLoading(true)
    try {
      const url = new URL(API_ENDPOINTS.getMembers);
      url.searchParams.append('page', pageNumber.toString());
      url.searchParams.append('size', pageSize.toString());
      
      const response = await fetch(url.toString())
      const data: ApiResponse = await response.json()
      
      // Transform the API data to match our component's expected format
      const transformedMembers = data.content.map((apiMember: ApiMember) => ({
        id: apiMember.id, 
        name: `${apiMember.firstName} ${apiMember.lastName}`,
        email: apiMember.emailAddress,
        phone: apiMember.primaryPhone,
        status: apiMember.attendanceStatus?.toLowerCase() || "active",
        joinDate: new Date(apiMember.dateJoinedChurch).toLocaleDateString(),
        lastAttendance: apiMember.lastAttendance ? new Date(apiMember.lastAttendance).toLocaleDateString() : "N/A"
      }));
      
      setMembers(transformedMembers)
      setTotalPages(data.totalPages)
      setPage(pageNumber)
    } catch (error) {
      console.error("Failed to fetch members:", error)
      setMembers([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMembers()
  }, [])

  // Filter members only for search and status filters
  // Pagination is handled by the backend
  const filteredMembers = Array.isArray(members) ? members.filter((member) => {
    const matchesSearch =
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.phone.includes(searchQuery)

    const matchesStatus = statusFilter === "all" || member.status === statusFilter

    return matchesSearch && matchesStatus
  }) : []

  const handleNextPage = () => {
    if (page < totalPages - 1) {
      fetchMembers(page + 1)
    }
  }

  const handlePrevPage = () => {
    if (page > 0) {
      fetchMembers(page - 1)
    }
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
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Rehic Members</h1>
          <p className="text-muted-foreground">Manage your community members and their information</p>
        </div>
        <Button onClick={() => router.push("/members/add")}>
          <UserPlus className="mr-2 h-4 w-4" />
          Add Member
        </Button>
      </div>

      <Card>
        <CardHeader className="flex flex-col gap-4 space-y-0 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle>Member Directory</CardTitle>
          <div className="flex flex-col gap-2 sm:flex-row">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search members..."
                className="pl-8 w-full sm:w-[200px] md:w-[300px]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[150px]">
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  <SelectValue placeholder="Filter by status" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="icon">
              <Download className="h-4 w-4" />
              <span className="sr-only">Download CSV</span>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="hidden md:table-cell">Email</TableHead>
                  <TableHead className="hidden md:table-cell">Phone</TableHead>
                  <TableHead className="hidden lg:table-cell">Join Date</TableHead>
                  <TableHead className="hidden lg:table-cell">Last Attendance</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  Array(pageSize).fill(0).map((_, index) => (
                    <TableRow key={`loading-${index}`} className="h-12">
                      <TableCell colSpan={7} className="py-2">
                        <div className="h-full animate-pulse bg-muted rounded-md"></div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : filteredMembers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center h-24">
                      No members found matching your criteria
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredMembers.map((member) => (
                    <TableRow 
                      key={member.id} 
                      className="cursor-pointer hover:bg-muted/50 h-12" 
                      onClick={() => router.push(`/members/${member.id}`)}
                    >
                      <TableCell className="py-2">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="text-xs">
                              {member.name
                                .split(" ")
                                .map((n: string) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium text-sm">{member.name}</div>
                            <div className="text-xs text-muted-foreground md:hidden">{member.email}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="py-2">{getStatusBadge(member.status)}</TableCell>
                      <TableCell className="hidden md:table-cell py-2 text-sm">{member.email}</TableCell>
                      <TableCell className="hidden md:table-cell py-2 text-sm">{member.phone}</TableCell>
                      <TableCell className="hidden lg:table-cell py-2 text-sm">{member.joinDate}</TableCell>
                      <TableCell className="hidden lg:table-cell py-2 text-sm">{member.lastAttendance}</TableCell>
                      <TableCell className="text-right py-2">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={(e) => e.stopPropagation()} // Prevent row click when clicking dropdown
                            >
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Actions</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => router.push(`/members/${member.id}`)}>
                              View Profile
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={(e) => {
                              e.stopPropagation(); // Prevent row click
                              router.push(`/members/${member.id}/edit`);
                            }}>
                              Edit Member
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={(e) => e.stopPropagation()}>Record Attendance</DropdownMenuItem>
                            <DropdownMenuItem onClick={(e) => e.stopPropagation()}>Send Message</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
          
          {/* Pagination Controls */}
          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-muted-foreground">
              {loading ? 'Loading...' : `Page ${page + 1} of ${totalPages}`}
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handlePrevPage} 
                disabled={page === 0 || loading}
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Previous
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleNextPage} 
                disabled={page >= totalPages - 1 || loading}
              >
                Next
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
