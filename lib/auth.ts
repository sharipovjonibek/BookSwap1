export interface AuthTokens {
  access: string
  refresh: string
}

export interface User {
  id: number
  username: string
}

class AuthService {
  private baseURL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://swapbook-1.onrender.com"

  async login(username: string, password: string): Promise<AuthTokens> {
    const response = await fetch(`${this.baseURL}/api/auth/token/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    })

    if (!response.ok) {
      throw new Error("Login failed")
    }

    return response.json()
  }

  async refreshToken(refreshToken: string): Promise<{ access: string }> {
    const response = await fetch(`${this.baseURL}/api/auth/token/refresh/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refresh: refreshToken }),
    })

    if (!response.ok) {
      throw new Error("Token refresh failed")
    }

    return response.json()
  }

  getAccessToken(): string | null {
    if (typeof window === "undefined") return null
    return localStorage.getItem("access_token")
  }

  getRefreshToken(): string | null {
    if (typeof window === "undefined") return null
    return localStorage.getItem("refresh_token")
  }

  setTokens(tokens: AuthTokens): void {
    if (typeof window === "undefined") return
    localStorage.setItem("access_token", tokens.access)
    localStorage.setItem("refresh_token", tokens.refresh)
  }

  clearTokens(): void {
    if (typeof window === "undefined") return
    localStorage.removeItem("access_token")
    localStorage.removeItem("refresh_token")
  }

  isAuthenticated(): boolean {
    return !!this.getAccessToken()
  }

  async makeAuthenticatedRequest(url: string, options: RequestInit = {}): Promise<Response> {
    const token = this.getAccessToken()

    const response = await fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        Authorization: token ? `Bearer ${token}` : "",
        "Content-Type": "application/json",
      },
    })

    // If token expired, try to refresh
    if (response.status === 401) {
      const refreshToken = this.getRefreshToken()
      if (refreshToken) {
        try {
          const newTokens = await this.refreshToken(refreshToken)
          localStorage.setItem("access_token", newTokens.access)

          // Retry the original request
          return fetch(url, {
            ...options,
            headers: {
              ...options.headers,
              Authorization: `Bearer ${newTokens.access}`,
              "Content-Type": "application/json",
            },
          })
        } catch (error) {
          this.clearTokens()
          window.location.href = "/"
        }
      }
    }

    return response
  }
}

export const authService = new AuthService()
