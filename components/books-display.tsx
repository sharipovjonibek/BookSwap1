"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import { BookOpen, MapPin, Phone, User, Search, RefreshCw } from "lucide-react"
import { bookxAPI, type Book } from "@/lib/api"

interface BooksDisplayProps {
  filteredBooks: Book[]
  onRefresh?: () => void
}

export default function BooksDisplay({ filteredBooks, onRefresh }: BooksDisplayProps) {
  const [allBooks, setAllBooks] = useState<Book[]>([])
  const [displayBooks, setDisplayBooks] = useState<Book[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)

  // Fetch all books on component mount
  useEffect(() => {
    fetchAllBooks()
  }, [])

  // Update display books when filtered books change
  useEffect(() => {
    if (filteredBooks.length > 0) {
      setDisplayBooks(filteredBooks)
    } else {
      setDisplayBooks(allBooks)
    }
  }, [filteredBooks, allBooks])

  // Handle search
  useEffect(() => {
    if (searchQuery.trim()) {
      const filtered = allBooks.filter(
        (book) =>
          book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
          book.description.toLowerCase().includes(searchQuery.toLowerCase()),
      )
      setDisplayBooks(filtered)
    } else if (filteredBooks.length === 0) {
      setDisplayBooks(allBooks)
    }
  }, [searchQuery, allBooks, filteredBooks])

  const fetchAllBooks = async () => {
    try {
      const books = await bookxAPI.getAllBooks()
      setAllBooks(books)
      setDisplayBooks(books)
    } catch (error) {
      console.error("Failed to fetch books:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleRefresh = async () => {
    setIsRefreshing(true)
    try {
      await fetchAllBooks()
      if (onRefresh) {
        onRefresh()
      }
    } finally {
      setIsRefreshing(false)
    }
  }

  const handleContactOwner = (book: Book) => {
    if (book.phone_number) {
      window.open(`tel:${book.phone_number}`, "_self")
    } else {
      alert(`Contact ${book.owner_username} for this book`)
    }
  }

  const handleOrderBook = (book: Book) => {
    const contactInfo = book.phone_number ? `at ${book.phone_number}` : "through their profile"
    alert(`Interested in "${book.title}"? Contact ${book.owner_username} ${contactInfo} to arrange the exchange!`)
  }

  if (isLoading) {
    return (
      <Card className="h-full border-border bg-card">
        <CardContent className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading books...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="h-full flex flex-col border-border bg-card">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 text-card-foreground">
              <BookOpen className="h-5 w-5 text-primary" />
              Available Books
            </CardTitle>
            <CardDescription>
              {filteredBooks.length > 0
                ? `AI recommended books (${displayBooks.length})`
                : `${displayBooks.length} books available for exchange`}
            </CardDescription>
          </div>
          <Button variant="ghost" size="sm" onClick={handleRefresh} disabled={isRefreshing}>
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
          </Button>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search books, authors, or descriptions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-input border-border"
          />
        </div>
      </CardHeader>

      <CardContent className="flex-1 p-0 overflow-y-auto ">
        {/* Y bo‘yicha scroll qilish uchun */}
        <ScrollArea className="h-full overflow-y-auto px-4">
          {displayBooks.length === 0 ? (
            <div className="text-center py-12">
              <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                {searchQuery ? "No books found matching your search." : "No books available yet."}
              </p>
              {!searchQuery && (
                <Button
                  variant="outline"
                  onClick={handleRefresh}
                  className="mt-4 bg-transparent"
                  disabled={isRefreshing}
                >
                  <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
                  Refresh
                </Button>
              )}
            </div>
          ) : (
            <div className="grid gap-4 pb-4">
              {displayBooks.map((book) => (
                <Card key={book.id} className="border-border bg-background">
                  <CardContent className="p-4">
                    <div className="flex gap-4">
                      {/* Book Cover */}
                      <div className="w-20 h-28 bg-muted rounded-md flex-shrink-0 overflow-hidden">
                        {book.image_url ? (
                          <img
                            src={book.image_url || "/placeholder.svg"}
                            alt={book.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <BookOpen className="h-8 w-8 text-muted-foreground" />
                          </div>
                        )}
                      </div>

                      {/* Book Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="font-semibold text-foreground text-lg leading-tight">{book.title}</h3>
                            {book.author && <p className="text-muted-foreground text-sm">by {book.author}</p>}
                          </div>
                          <Badge variant="secondary" className="ml-2 flex-shrink-0">
                            Free
                          </Badge>
                        </div>

                        {book.description && (
                          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{book.description}</p>
                        )}

                        {/* Owner and Location Info */}
                        <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
                          <div className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            <span>{book.owner_username}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            <span>{book.location}</span>
                          </div>
                          {book.phone_number && (
                            <div className="flex items-center gap-1">
                              <Phone className="h-3 w-3" />
                              <span>Contact available</span>
                            </div>
                          )}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => handleOrderBook(book)}
                            className="bg-primary hover:bg-primary/90 text-primary-foreground"
                          >
                            Order Book
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => handleContactOwner(book)}>
                            Contact
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
