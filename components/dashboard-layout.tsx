"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useAuth } from "@/components/auth-provider"
import { useSidebar } from "@/components/sidebar-provider"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {
  Users,
  Calendar,
  Heart,
  MessageSquare,
  BarChart,
  Settings,
  Menu,
  X,
  Bell,
  Search,
  User,
  Sun,
  Moon,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"

interface DashboardLayoutProps {
  children: React.ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const pathname = usePathname()
  const { user } = useAuth()
  const { isOpen, toggle, close } = useSidebar()
  const { theme, setTheme } = useTheme()
  const [isMounted, setIsMounted] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return null
  }

  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: BarChart },
    { name: "Members", href: "/members", icon: Users },
    { name: "Events", href: "/events", icon: Calendar },
    { name: "Donations", href: "/donations", icon: Heart },
    { name: "Messages", href: "/messages", icon: MessageSquare },
    { name: "Settings", href: "/settings", icon: Settings },
  ]

  const isActive = (path: string) => {
    return pathname === path || pathname.startsWith(`${path}/`)
  }

  const userInitials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
    : "U"

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed)
  }

  return (
    <div className="flex min-h-screen">
      {/* Mobile header */}
      <header className="fixed top-0 z-40 w-full border-b bg-background lg:hidden">
        <div className="container flex h-16 items-center justify-between py-4">
          <div className="flex items-center gap-2 font-bold">
            <Heart className="h-6 w-6 text-primary" />
            <span>Community Manager</span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={toggleTheme}>
              {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              <span className="sr-only">Toggle theme</span>
            </Button>
            <Sheet open={isOpen} onOpenChange={toggle}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[240px] sm:w-[300px]">
                <div className="flex h-full flex-col">
                  <div className="flex items-center justify-between border-b py-4">
                    <div className="flex items-center gap-2 font-bold">
                      <Heart className="h-6 w-6 text-primary" />
                      <span>Community Manager</span>
                    </div>
                    <Button variant="ghost" size="icon" onClick={close}>
                      <X className="h-6 w-6" />
                      <span className="sr-only">Close menu</span>
                    </Button>
                  </div>
                  <nav className="flex-1 overflow-auto py-4">
                    <div className="space-y-1">
                      {navigation.map((item) => (
                        <Link
                          key={item.name}
                          href={item.href}
                          onClick={close}
                          prefetch={true}
                          className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium ${
                            isActive(item.href) ? "bg-primary text-primary-foreground" : "hover:bg-muted"
                          }`}
                        >
                          <item.icon className="h-5 w-5" />
                          {item.name}
                        </Link>
                      ))}
                    </div>
                  </nav>
                  <div className="border-t py-4">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={user?.image} />
                        <AvatarFallback>{userInitials}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">{user?.name}</p>
                        <p className="text-xs text-muted-foreground">{user?.email}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      {/* Desktop sidebar - fixed position */}
      <aside className={`fixed hidden h-screen flex-col border-r bg-background transition-all duration-300 ease-in-out lg:flex ${sidebarCollapsed ? 'w-16' : 'w-64'}`}>
        <div className={`flex h-16 items-center border-b px-6 font-bold ${sidebarCollapsed ? 'justify-center px-0' : 'gap-2'}`}>
          {!sidebarCollapsed && (
            <>
              <Heart className="h-6 w-6 text-primary" />
              <span>Community Manager</span>
            </>
          )}
          {sidebarCollapsed && <Heart className="h-6 w-6 text-primary" />}
        </div>
        <nav className="flex-1 overflow-auto py-4">
          <div className="space-y-1 px-3">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                prefetch={true}
                className={`flex items-center rounded-lg px-3 py-2 text-sm font-medium ${
                  isActive(item.href) ? "bg-primary text-primary-foreground" : "hover:bg-muted"
                } ${sidebarCollapsed ? 'justify-center px-0' : 'gap-3'}`}
                title={sidebarCollapsed ? item.name : ""}
              >
                <item.icon className="h-5 w-5" />
                {!sidebarCollapsed && item.name}
              </Link>
            ))}
          </div>
        </nav>
        <div className="border-t p-4">
          <div className={`flex items-center ${sidebarCollapsed ? 'justify-center' : 'justify-between'}`}>
            {!sidebarCollapsed && (
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={user?.image} />
                  <AvatarFallback>{userInitials}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">{user?.name}</p>
                  <p className="text-xs text-muted-foreground">{user?.email}</p>
                </div>
              </div>
            )}
            {sidebarCollapsed && (
              <Avatar>
                <AvatarImage src={user?.image} />
                <AvatarFallback>{userInitials}</AvatarFallback>
              </Avatar>
            )}
            {!sidebarCollapsed && (
              <Button variant="ghost" size="icon" onClick={toggleTheme}>
                {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                <span className="sr-only">Toggle theme</span>
              </Button>
            )}
          </div>
        </div>
        {/* Toggle sidebar button */}
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={toggleSidebar}
          className="absolute -right-4 top-20 z-10 h-8 w-8 rounded-full border bg-background"
        >
          {sidebarCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          <span className="sr-only">Toggle sidebar</span>
        </Button>
      </aside>

      {/* Main content - with padding to account for fixed sidebar */}
      <main className={`flex-1 transition-all duration-300 ease-in-out ${sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-64'}`}>
        {/* Desktop header */}
        <header className="sticky top-0 z-30 hidden h-16 items-center border-b bg-background px-6 lg:flex">
          <div className="flex flex-1 items-center gap-4">
            <Button variant="ghost" size="icon" onClick={toggleSidebar} className="mr-2 lg:flex">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle sidebar</span>
            </Button>
            <form className="relative w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input type="search" placeholder="Search..." className="w-full rounded-lg bg-background pl-8 md:w-64" />
            </form>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
              <span className="sr-only">Notifications</span>
            </Button>
            <Button variant="ghost" size="icon">
              <User className="h-5 w-5" />
              <span className="sr-only">Profile</span>
            </Button>
            {sidebarCollapsed && (
              <Button variant="ghost" size="icon" onClick={toggleTheme}>
                {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                <span className="sr-only">Toggle theme</span>
              </Button>
            )}
          </div>
        </header>

        {/* Add top padding for mobile to account for fixed header */}
        <div className="pt-16 lg:pt-0">
          <div className="mx-auto max-w-screen-xl px-4 py-6 sm:px-6 lg:px-8">{children}</div>
        </div>
      </main>
    </div>
  )
}
