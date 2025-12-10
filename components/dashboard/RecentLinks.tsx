"use client"

import { useEffect, useState } from "react"
import { get } from "@/lib/api"
import { ExternalLink, Link2, ArrowRight, Clock, MousePointerClick, Loader2, Copy, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

interface UrlData {
  id: number
  slug: string
  destination_url: string
  created_at: string
  click_count?: number
}

interface RecentLinksResponse {
  data: UrlData[]
}

export function RecentLinks() {
  const baseUrl = process.env.NEXT_PUBLIC_CLIENT_URL
  const [links, setLinks] = useState<UrlData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [copiedId, setCopiedId] = useState<number | null>(null)

  useEffect(() => {
    const fetchRecentLinks = async () => {
      try {
        setIsLoading(true)
        const response = await get<RecentLinksResponse>("/recent?limit=5")
        setLinks(response.data || [])
      } catch (err: any) {
        console.error("Failed to fetch recent links:", err)
        setError("Failed to load recent links")
      } finally {
        setIsLoading(false)
      }
    }

    fetchRecentLinks()
  }, [])

  const copyToClipboard = async (slug: string, id: number) => {
    const shortUrl = `${baseUrl}/${slug}`
    try {
      await navigator.clipboard.writeText(shortUrl)
      setCopiedId(id)
      setTimeout(() => setCopiedId(null), 2000)
    } catch (error) {
      console.error("Failed to copy to clipboard:", error)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInMs = now.getTime() - date.getTime()
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60))
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60))
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24))

    if (diffInMinutes < 1) return "Just now"
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`
    if (diffInHours < 24) return `${diffInHours}h ago`
    if (diffInDays < 7) return `${diffInDays}d ago`
    
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    })
  }

  const truncateUrl = (url: string, maxLength: number = 40) => {
    if (url.length <= maxLength) return url
    return url.substring(0, maxLength) + "..."
  }

  if (isLoading) {
    return (
      <Card className="w-full shadow-sm border-none mt-8">
        <CardHeader>
          <CardTitle className="text-2xl font-bold tracking-tight">Recent Links</CardTitle>
          <CardDescription className="text-muted-foreground">
            Your recently created short links
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="w-full shadow-sm border-none mt-8">
        <CardHeader>
          <CardTitle className="text-2xl font-bold tracking-tight">Recent Links</CardTitle>
          <CardDescription className="text-muted-foreground">
            Your recently created short links
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <p className="text-muted-foreground">{error}</p>
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={() => window.location.reload()}
            >
              Try again
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (links.length === 0) {
    return (
      <Card className="w-full shadow-sm border-none mt-8">
        <CardHeader>
          <CardTitle className="text-2xl font-bold tracking-tight">Recent Links</CardTitle>
          <CardDescription className="text-muted-foreground">
            Your recently created short links
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="h-16 w-16 rounded-full bg-muted/50 flex items-center justify-center mb-4">
              <Link2 className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="text-lg font-medium text-foreground">No links yet</p>
            <p className="text-muted-foreground mt-1">
              Create your first short link above to get started!
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full shadow-sm border-none mt-8">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl font-bold tracking-tight">Recent Links</CardTitle>
            <CardDescription className="text-muted-foreground mt-1">
              Your recently created short links
            </CardDescription>
          </div>
          <Button 
            variant="outline" 
            className="gap-2 rounded-full"
            asChild
          >
            <a href="/dashboard/links">
              View all
              <ArrowRight className="h-4 w-4" />
            </a>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {links.map((link) => (
            <div
              key={link.id}
              className="group flex items-center justify-between p-4 rounded-xl border border-border/50 bg-muted/20 hover:bg-muted/40 hover:border-border transition-all"
            >
              <div className="flex items-center gap-4 min-w-0 flex-1">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                  <Link2 className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <a 
                      href={`${baseUrl}/${link.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-semibold text-primary hover:underline truncate"
                    >
                      {baseUrl}/{link.slug}
                    </a>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => copyToClipboard(link.slug, link.id)}
                    >
                      {copiedId === link.id ? (
                        <Check className="h-3.5 w-3.5 text-green-500" />
                      ) : (
                        <Copy className="h-3.5 w-3.5" />
                      )}
                    </Button>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <ExternalLink className="h-3 w-3 text-muted-foreground shrink-0" />
                    <a 
                      href={link.destination_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-muted-foreground hover:text-foreground truncate"
                      title={link.destination_url}
                    >
                      {truncateUrl(link.destination_url)}
                    </a>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-6 shrink-0 ml-4">
                {link.click_count !== undefined && (
                  <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <MousePointerClick className="h-4 w-4" />
                    <span className="font-medium">{link.click_count}</span>
                    <span className="hidden sm:inline">clicks</span>
                  </div>
                )}
                <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>{formatDate(link.created_at)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {links.length >= 10 && (
          <div className="mt-6 flex justify-center">
            <Button 
              variant="ghost" 
              className="gap-2 text-primary hover:text-primary hover:bg-primary/10"
              asChild
            >
              <a href="/dashboard/links">
                View all links
                <ArrowRight className="h-4 w-4" />
              </a>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
