"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { BookOpen, Plus, LogOut, User } from "lucide-react"
import { authService } from "@/lib/auth"
import { useRouter } from "next/navigation"
import CreateBookModal from "@/components/create-book-modal"

interface DashboardLayoutProps {
  children: React.ReactNode
  onBookCreated?: () => void
}

export default function DashboardLayout({ children, onBookCreated }: DashboardLayoutProps) {
  const [showCreateBook, setShowCreateBook] = useState(false)
  const router = useRouter()

  const handleLogout = () => {
    authService.clearTokens()
    router.push("/")
  }

  const handleBookCreated = () => {
    setShowCreateBook(false)
    if (onBookCreated) {
      onBookCreated()
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <BookOpen className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold text-card-foreground">BookSwap</span>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-4">
              <Button
                onClick={() => setShowCreateBook(true)}
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Book Ad
              </Button>

              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm">
                  <User className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={handleLogout}>
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 h-[calc(100vh-80px)]">{children}</main>

      {/* Create Book Modal */}
      {showCreateBook && (
        <CreateBookModal
          isOpen={showCreateBook}
          onClose={() => setShowCreateBook(false)}
          onBookCreated={handleBookCreated}
        />
      )}
    </div>
  )
}
