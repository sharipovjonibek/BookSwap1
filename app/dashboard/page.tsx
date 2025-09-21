"use client"

import { useState, useCallback } from "react"
import AuthGuard from "@/components/auth-guard"
import DashboardLayout from "@/components/dashboard-layout"
import ChatBot from "@/components/chat-bot"
import BooksDisplay from "@/components/books-display"
import type { Book } from "@/lib/api"

export default function Dashboard() {
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([])
  const [refreshKey, setRefreshKey] = useState(0)

  const handleBookRecommendations = useCallback((books: Book[]) => {
    setFilteredBooks(books)
  }, [])

  const handleBookCreated = useCallback(() => {
    setRefreshKey((prev) => prev + 1)
    setFilteredBooks([]) // Clear filtered books to show all books
  }, [])

  const handleRefresh = useCallback(() => {
    setRefreshKey((prev) => prev + 1)
  }, [])

  return (
    <AuthGuard>
      <DashboardLayout onBookCreated={handleBookCreated}>
        <div className="flex min-h-screen gap-6">
          {/* Left side - Chatbot */}
          <div className="w-1/3 min-w-[400px] ">
            <ChatBot onRecommendations={handleBookRecommendations} />
          </div>

          {/* Right side - Books Display */}
          <div className="flex-1 ooverflow-y-auto ">
            <BooksDisplay key={refreshKey} filteredBooks={filteredBooks} onRefresh={handleRefresh} />
          </div>
        </div>
      </DashboardLayout>
    </AuthGuard>
  )
}
