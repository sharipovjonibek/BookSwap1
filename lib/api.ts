import { authService } from "./auth"

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://swapbook-1.onrender.com"

export interface Book {
  id: number
  title: string
  author: string
  description: string
  image_url: string
  phone_number: string
  location: string
  owner_username: string
  created_at: string
  updated_at: string
  is_active: boolean
}

export interface CreateBookData {
  title: string
  author?: string
  description?: string
  location: string
  phone_number?: string
  image?: File
}

export interface AIAdviceResponse {
  ai: {
    query_intent: string
    topics: string[]
    suggested_books: {
      title: string
      author: string
      why: string
    }[]
  }
  matched_books: Book[]
  filter_query: {
    titles?: string[]
    authors?: string[]
  }
}

class BookXAPI {
  // Books API
  async getAllBooks(): Promise<Book[]> {
    const response = await authService.makeAuthenticatedRequest(`${BASE_URL}/api/books/`)
    if (!response.ok) {
      throw new Error("Failed to fetch books")
    }
    return response.json()
  }

  async searchBooks(params: {
    q?: string
    titles?: string[]
    authors?: string[]
  }): Promise<Book[]> {
    const searchParams = new URLSearchParams()

    if (params.q) {
      searchParams.append("q", params.q)
    }

    if (params.titles) {
      params.titles.forEach((title) => searchParams.append("titles", title))
    }

    if (params.authors) {
      params.authors.forEach((author) => searchParams.append("authors", author))
    }

    const response = await authService.makeAuthenticatedRequest(
      `${BASE_URL}/api/books/search/?${searchParams.toString()}`,
    )

    if (!response.ok) {
      throw new Error("Failed to search books")
    }
    return response.json()
  }

  async getBook(id: number): Promise<Book> {
    const response = await authService.makeAuthenticatedRequest(`${BASE_URL}/api/books/${id}/`)
    if (!response.ok) {
      throw new Error("Failed to fetch book")
    }
    return response.json()
  }

  async createBook(bookData: CreateBookData): Promise<Book> {
    const formData = new FormData()

    formData.append("title", bookData.title)
    formData.append("location", bookData.location)

    if (bookData.author) {
      formData.append("author", bookData.author)
    }

    if (bookData.description) {
      formData.append("description", bookData.description)
    }

    if (bookData.phone_number) {
      formData.append("phone_number", bookData.phone_number)
    }

    if (bookData.image) {
      formData.append("image", bookData.image)
    }

    const response = await authService.makeAuthenticatedRequest(`${BASE_URL}/api/books/`, {
      method: "POST",
      body: formData,
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.detail || "Failed to create book")
    }

    return response.json()
  }

  async updateBook(id: number, bookData: Partial<CreateBookData>): Promise<Book> {
    const formData = new FormData()

    Object.entries(bookData).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (key === "image" && value instanceof File) {
          formData.append(key, value)
        } else if (typeof value === "string") {
          formData.append(key, value)
        }
      }
    })

    const response = await authService.makeAuthenticatedRequest(`${BASE_URL}/api/books/${id}/`, {
      method: "PATCH",
      body: formData,
    })

    if (!response.ok) {
      throw new Error("Failed to update book")
    }

    return response.json()
  }

  async deleteBook(id: number): Promise<void> {
    const response = await authService.makeAuthenticatedRequest(`${BASE_URL}/api/books/${id}/`, {
      method: "DELETE",
    })

    if (!response.ok) {
      throw new Error("Failed to delete book")
    }
  }

  // AI Advice API
  async getBookAdvice(prompt: string): Promise<AIAdviceResponse> {
    const response = await authService.makeAuthenticatedRequest(
      `${BASE_URL}/api/ai/books/advice/?prompt=${encodeURIComponent(prompt)}`,
    )

    if (!response.ok) {
      throw new Error("Failed to get AI advice")
    }

    return response.json()
  }

  async getBookAdvicePost(prompt: string): Promise<AIAdviceResponse> {
    const response = await authService.makeAuthenticatedRequest(`${BASE_URL}/api/ai/books/advice/`, {
      method: "POST",
      body: JSON.stringify({ prompt }),
    })

    if (!response.ok) {
      throw new Error("Failed to get AI advice")
    }

    return response.json()
  }

  // Health check
  async healthCheck(): Promise<boolean> {
    try {
      const response = await fetch(`${BASE_URL}/api/health/`)
      return response.ok
    } catch {
      return false
    }
  }
}

export const bookxAPI = new BookXAPI()
