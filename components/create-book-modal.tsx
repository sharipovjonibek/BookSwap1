"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { X, Upload, BookOpen } from "lucide-react"
import { bookxAPI } from "@/lib/api"

interface CreateBookModalProps {
  isOpen: boolean
  onClose: () => void
  onBookCreated?: () => void
}

export default function CreateBookModal({ isOpen, onClose, onBookCreated }: CreateBookModalProps) {
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    description: "",
    location: "",
    phone_number: "",
  })
  const [image, setImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImage(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      await bookxAPI.createBook({
        title: formData.title.trim(),
        author: formData.author.trim() || undefined,
        description: formData.description.trim() || undefined,
        location: formData.location.trim(),
        phone_number: formData.phone_number.trim() || undefined,
        image: image || undefined,
      })

      // Success - reset form and close modal
      setFormData({
        title: "",
        author: "",
        description: "",
        location: "",
        phone_number: "",
      })
      setImage(null)
      setImagePreview(null)
      onClose()

      // Notify parent component to refresh books list
      if (onBookCreated) {
        onBookCreated()
      }
    } catch (error: any) {
      setError(error.message || "Failed to create book ad. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    if (!isLoading) {
      onClose()
      // Reset form when closing
      setFormData({
        title: "",
        author: "",
        description: "",
        location: "",
        phone_number: "",
      })
      setImage(null)
      setImagePreview(null)
      setError("")
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-lg bg-card border-border max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-primary/10 rounded-lg">
                <BookOpen className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-card-foreground">Create Book Ad</CardTitle>
                <CardDescription>Share a book with the community for free exchange</CardDescription>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={handleClose} disabled={isLoading}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="text-destructive text-sm bg-destructive/10 p-3 rounded-md border border-destructive/20">
                {error}
              </div>
            )}

            {/* Book Cover Image */}
            <div className="space-y-2">
              <Label htmlFor="image">Book Cover Image</Label>
              <div className="flex items-center gap-4">
                <div className="w-20 h-28 bg-muted rounded-md flex-shrink-0 overflow-hidden border-2 border-dashed border-border">
                  {imagePreview ? (
                    <img
                      src={imagePreview || "/placeholder.svg"}
                      alt="Book cover preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Upload className="h-6 w-6 text-muted-foreground" />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <Input
                    id="image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="bg-input border-border"
                    disabled={isLoading}
                  />
                  <p className="text-xs text-muted-foreground mt-1">Optional: Upload a photo of your book cover</p>
                </div>
              </div>
            </div>

            {/* Book Title */}
            <div className="space-y-2">
              <Label htmlFor="title">Book Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Enter the book title"
                required
                className="bg-input border-border"
                disabled={isLoading}
              />
            </div>

            {/* Author */}
            <div className="space-y-2">
              <Label htmlFor="author">Author</Label>
              <Input
                id="author"
                value={formData.author}
                onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                placeholder="Enter the author's name"
                className="bg-input border-border"
                disabled={isLoading}
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe the book's condition, genre, or why you're sharing it..."
                className="bg-input border-border resize-none"
                rows={3}
                disabled={isLoading}
              />
            </div>

            {/* Location */}
            <div className="space-y-2">
              <Label htmlFor="location">Location *</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="City, neighborhood, or general area"
                required
                className="bg-input border-border"
                disabled={isLoading}
              />
              <p className="text-xs text-muted-foreground">This helps people find books near them</p>
            </div>

            {/* Phone Number */}
            <div className="space-y-2">
              <Label htmlFor="phone">Contact Phone Number</Label>
              <Input
                id="phone"
                value={formData.phone_number}
                onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
                placeholder="Your phone number for contact"
                className="bg-input border-border"
                disabled={isLoading}
              />
              <p className="text-xs text-muted-foreground">
                Optional: Provide a way for people to contact you directly
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                className="flex-1 bg-transparent"
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isLoading || !formData.title.trim() || !formData.location.trim()}
                className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                {isLoading ? "Creating..." : "Create Ad"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
