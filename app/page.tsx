"use client"

import Link from "next/link"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { ChevronRight, Users, Calendar, Heart, MessageSquare, Sun, Moon } from "lucide-react"
import { useEffect, useState } from "react"

export default function Home() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Ensure component is mounted before accessing theme
  useEffect(() => {
    setMounted(true)
  }, [])

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  if (!mounted) {
    return null
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 border-b bg-background">
        <div className="container flex h-16 items-center justify-between py-4">
          <div className="flex items-center gap-2 font-bold">
            <Heart className="h-6 w-6 text-primary" />
            <span>Community Manager</span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="#features" className="text-muted-foreground hover:text-foreground">
              Features
            </Link>
            <Link href="#testimonials" className="text-muted-foreground hover:text-foreground">
              Testimonials
            </Link>
            <Link href="#pricing" className="text-muted-foreground hover:text-foreground">
              Pricing
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={toggleTheme}>
              {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              <span className="sr-only">Toggle theme</span>
            </Button>
            <Link href="/dashboard">
              <Button>Go to Dashboard</Button>
            </Link>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <section className="container py-24 sm:py-32">
          <div className="grid gap-8 md:grid-cols-2 md:gap-12">
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl xl:text-6xl">
                  Manage your community with ease
                </h1>
                <p className="max-w-[600px] text-muted-foreground md:text-xl">
                  A comprehensive platform for managing members, events, donations, and communications all in one place.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/dashboard">
                  <Button size="lg" className="gap-2">
                    Get Started <ChevronRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="#features">
                  <Button size="lg" variant="outline">
                    Learn More
                  </Button>
                </Link>
              </div>
            </div>
            <div className="flex items-center justify-center">
              <div className="relative h-[350px] w-full rounded-lg bg-muted p-4 shadow-lg">
                <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                  Dashboard Preview
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="container py-24 sm:py-32 border-t">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Powerful Features</h2>
            <p className="mx-auto mt-4 max-w-[700px] text-muted-foreground md:text-xl">
              Everything you need to manage your community effectively
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <div className="flex flex-col items-center text-center p-6 border rounded-lg">
              <Users className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-xl font-bold mb-2">Member Management</h3>
              <p className="text-muted-foreground">
                Track member information, attendance, and engagement with comprehensive profiles.
              </p>
            </div>

            <div className="flex flex-col items-center text-center p-6 border rounded-lg">
              <Calendar className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-xl font-bold mb-2">Event Management</h3>
              <p className="text-muted-foreground">
                Create, schedule, and manage events with RSVP tracking and attendance reporting.
              </p>
            </div>

            <div className="flex flex-col items-center text-center p-6 border rounded-lg">
              <Heart className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-xl font-bold mb-2">Donation Management</h3>
              <p className="text-muted-foreground">
                Record donations, generate receipts, and track giving patterns over time.
              </p>
            </div>

            <div className="flex flex-col items-center text-center p-6 border rounded-lg">
              <MessageSquare className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-xl font-bold mb-2">Communication</h3>
              <p className="text-muted-foreground">
                Send messages, announcements, and prayer requests to individuals or groups.
              </p>
            </div>

            <div className="flex flex-col items-center text-center p-6 border rounded-lg">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-12 w-12 text-primary mb-4"
              >
                <rect width="18" height="18" x="3" y="3" rx="2" />
                <path d="M3 9h18" />
                <path d="M9 21V9" />
              </svg>
              <h3 className="text-xl font-bold mb-2">Dashboards</h3>
              <p className="text-muted-foreground">
                Visualize key metrics and data with customizable dashboards for admins and members.
              </p>
            </div>

            <div className="flex flex-col items-center text-center p-6 border rounded-lg">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-12 w-12 text-primary mb-4"
              >
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
              </svg>
              <h3 className="text-xl font-bold mb-2">Secure & Reliable</h3>
              <p className="text-muted-foreground">
                Built with security in mind to protect your community's sensitive information.
              </p>
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t py-12">
        <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="flex items-center gap-2 font-bold">
            <Heart className="h-6 w-6 text-primary" />
            <span>Community Manager</span>
          </div>
          <p className="text-center text-sm text-muted-foreground md:text-left">
            &copy; {new Date().getFullYear()} Community Manager. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}
