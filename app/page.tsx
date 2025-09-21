"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, Users, Sparkles, ArrowRight } from "lucide-react"
import LoginForm from "@/components/login-form"

export default function LandingPage() {
  const [showLogin, setShowLogin] = useState(false)

  if (showLogin) {
    return <LoginForm onBack={() => setShowLogin(false)} />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-card">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold text-foreground">BookX</span>
          </div>
          <Button onClick={() => setShowLogin(true)} className="bg-primary hover:bg-primary/90">
            Login
          </Button>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-12">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-balance mb-6 text-foreground">Share Books, Build Community</h1>
          <p className="text-xl text-muted-foreground text-balance mb-8 max-w-2xl mx-auto">
            Exchange books for free with AI-powered recommendations. Connect with fellow readers and discover your next
            favorite book.
          </p>
          <div className="flex gap-4 justify-center">
            <Button
              size="lg"
              onClick={() => setShowLogin(true)}
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              Get Started <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button size="lg" variant="outline">
              Browse Books
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Card className="text-center border-border bg-card">
            <CardHeader>
              <div className="mx-auto w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Sparkles className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="text-card-foreground">AI Recommendations</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Get personalized book suggestions powered by AI based on your reading preferences and goals.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center border-border bg-card">
            <CardHeader>
              <div className="mx-auto w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-secondary" />
              </div>
              <CardTitle className="text-card-foreground">Community Driven</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Connect with book lovers in your area and build lasting relationships through shared literature.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center border-border bg-card">
            <CardHeader>
              <div className="mx-auto w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                <BookOpen className="h-6 w-6 text-accent" />
              </div>
              <CardTitle className="text-card-foreground">Free Exchange</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                No money involved - just the joy of sharing great books and discovering new stories.
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-card rounded-lg p-8 border border-border">
          <h2 className="text-3xl font-bold mb-4 text-card-foreground">Ready to Start Exchanging?</h2>
          <p className="text-muted-foreground mb-6">
            Join thousands of readers who are already sharing their favorite books.
          </p>
          <Button
            size="lg"
            onClick={() => setShowLogin(true)}
            className="bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            Join BookX Today
          </Button>
        </div>
      </main>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 mt-16 border-t border-border">
        <div className="text-center text-muted-foreground">
          <p>&copy; 2024 BookX. Building communities through books.</p>
        </div>
      </footer>
    </div>
  )
}
