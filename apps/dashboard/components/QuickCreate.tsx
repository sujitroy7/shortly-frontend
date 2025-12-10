"use client"

import { Link, Check, X, Loader2, Copy } from "lucide-react"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { get, post } from "@shortly/lib/api"
import { useState, useEffect, useCallback, useRef } from "react"

import { Button } from "@shortly/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@shortly/ui/card"
import { Input } from "@shortly/ui/input"
import { Label } from "@shortly/ui/label"
import { RadioGroup, RadioGroupItem } from "@shortly/ui/radio-group"

export function QuickCreate() {
  const baseUrl = process.env.NEXT_PUBLIC_CLIENT_URL
  
  const formSchema = z.object({
    destination: z.string().url({ message: "Please enter a valid URL (e.g., https://example.com)" }),
    slugType: z.enum(["random", "custom"]),
    customSlug: z.string().optional(),
  }).refine((data) => {
    if (data.slugType === "custom") {
      return !!data.customSlug && data.customSlug.length >= 3
    }
    return true
  }, {
    message: "Custom alias must be at least 3 characters",
    path: ["customSlug"],
  })

  type FormValues = z.infer<typeof formSchema>

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      slugType: "random",
      destination: "",
      customSlug: "",
    },
  })

  const slugType = watch("slugType")
  const customSlug = watch("customSlug")
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [generatedUrl, setGeneratedUrl] = useState<string | null>(null)
  const [isCopied, setIsCopied] = useState(false)
  const [isFadingOut, setIsFadingOut] = useState(false)
  const [countdown, setCountdown] = useState<number>(15)
  
  // Alias availability checking state
  const [isCheckingAlias, setIsCheckingAlias] = useState(false)
  const [isAliasAvailable, setIsAliasAvailable] = useState<boolean | null>(null)
  const [aliasError, setAliasError] = useState<string | null>(null)
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Debounced alias availability check
  const checkAliasAvailability = useCallback(async (slug: string) => {
    if (!slug || slug.length < 3) {
      setIsAliasAvailable(null)
      setAliasError(null)
      return
    }

    setIsCheckingAlias(true)
    setAliasError(null)

    try {
      const response = await get<{ available: boolean }>(`/check/${slug}`)
      setIsAliasAvailable(response.available)
      if (!response.available) {
        setAliasError("This alias is already taken")
      }
    } catch (error: any) {
      console.error("Failed to check alias availability:", error)
      setAliasError("Failed to check availability")
      setIsAliasAvailable(null)
    } finally {
      setIsCheckingAlias(false)
    }
  }, [])

  // Effect to trigger debounced alias check
  useEffect(() => {
    if (slugType !== "custom" || !customSlug) {
      setIsAliasAvailable(null)
      setAliasError(null)
      return
    }

    // Clear previous timeout
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current)
    }

    // Reset state while typing
    setIsAliasAvailable(null)
    setAliasError(null)

    // Set new debounced check (500ms delay)
    debounceTimeoutRef.current = setTimeout(() => {
      checkAliasAvailability(customSlug)
    }, 500)

    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current)
      }
    }
  }, [customSlug, slugType, checkAliasAvailability])

  // Auto-hide success section after 15 seconds with fade-out animation
  useEffect(() => {
    if (generatedUrl) {
      // Reset countdown when a new URL is generated
      setCountdown(15)
      setIsFadingOut(false)
      
      // Start fade-out animation after 14.5 seconds
      const fadeTimer = setTimeout(() => {
        setIsFadingOut(true)
      }, 14500)

      // Clear the URL after fade-out animation completes (15 seconds total)
      const clearTimer = setTimeout(() => {
        setGeneratedUrl(null)
        setIsCopied(false)
        setIsFadingOut(false)
      }, 15000)

      return () => {
        clearTimeout(fadeTimer)
        clearTimeout(clearTimer)
      }
    }
  }, [generatedUrl])

  // Countdown timer effect
  useEffect(() => {
    if (generatedUrl && countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(prev => prev - 1)
      }, 1000)

      return () => clearTimeout(timer)
    }
  }, [generatedUrl, countdown])

  // Determine if form can be submitted
  const canSubmit = slugType === "random" || (slugType === "custom" && isAliasAvailable === true)

  const onSubmit = async (data: FormValues) => {
    console.log(data, 'test-log data')
    setSubmitError(null)
    setGeneratedUrl(null)
    setIsCopied(false)
    setIsFadingOut(false)
    try {
      const payload = {
        destination_url: data.destination,
        slug: data.slugType === "custom" ? data.customSlug : undefined,
      }
      
      const response = await post<any>('/shorten', payload)
      
      console.log('API Response:', response)
      
      // Extract the short URL from the response
      // The API returns data in format: { data: [{ short_url, slug, ... }] }
      let shortUrl: string
      const responseData = (response.data && Array.isArray(response.data) && response.data.length > 0) 
        ? response.data[0] 
        : (response.data || response);
      
      if (responseData && responseData.short_url) {
        shortUrl = responseData.short_url
      } else if (responseData && responseData.slug) {
        shortUrl = `${baseUrl}/${responseData.slug}`
      } else if (response.short_url) {
        shortUrl = response.short_url
      } else if (response.slug) {
        shortUrl = `${baseUrl}/${response.slug}`
      } else {
        // Fallback: log the response to help debug
        console.error('Unexpected API response structure:', response)
        throw new Error('Unable to extract short URL from response')
      }
      
      setGeneratedUrl(shortUrl)
      // Optional: Reset form or redirect
    } catch (error: any) {
      console.error("Failed to create short link:", error)
      const debugUrl = error.config?.baseURL + error.config?.url;
      const errorMessage = error.message || "Failed to create short link. Please try again."
      setSubmitError(`${errorMessage} (Attempted: ${debugUrl})`)
    }
  }

  const copyToClipboard = async () => {
    if (!generatedUrl) return
    
    try {
      await navigator.clipboard.writeText(generatedUrl)
      setIsCopied(true)
      setTimeout(() => setIsCopied(false), 2000)
    } catch (error) {
      console.error("Failed to copy to clipboard:", error)
    }
  }

  return (
    <Card className="w-full shadow-sm border-none">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-3xl font-bold tracking-tight">Quick create</CardTitle>
            <CardDescription className="mt-2 text-lg text-muted-foreground">
              You can create <span className="font-semibold text-foreground">3</span> more short links this month.
            </CardDescription>
          </div>
          {/* <div className="flex gap-2">
             <Button variant="outline" className="gap-2 rounded-full">
               <Link className="h-4 w-4" />
               Short link
             </Button>
             <Button variant="ghost" className="gap-2 rounded-full text-muted-foreground">
               <QrCode className="h-4 w-4" />
               QR Code
             </Button>
          </div> */}
        </div>
      </CardHeader>
      <CardContent className="space-y-8">
        {submitError && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-md text-sm">
            {submitError}
          </div>
        )}
        {generatedUrl && (
          <div className={`p-6 bg-gradient-to-br from-primary/5 to-primary/10 border-2 border-primary/20 rounded-xl space-y-3 transition-all duration-500 ${
            isFadingOut 
              ? 'animate-out fade-out slide-out-to-top-2 opacity-0 max-h-0 !p-0 !m-0 overflow-hidden' 
              : 'animate-in fade-in slide-in-from-top-2'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Check className="h-5 w-5 text-green-600" />
                <h3 className="text-lg font-semibold text-foreground">Your short link is ready!</h3>
              </div>
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <span>Disappears in</span>
                <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-primary/10 text-primary font-semibold text-xs">
                  {countdown}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2 p-3 bg-background rounded-lg border border-border">
              <div className="flex-1 overflow-hidden">
                <p className="text-sm text-muted-foreground mb-1">Short URL</p>
                <a 
                  href={generatedUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary font-semibold text-lg hover:underline truncate block"
                >
                  {generatedUrl}
                </a>
              </div>
              <Button
                type="button"
                variant={isCopied ? "default" : "outline"}
                size="icon"
                onClick={copyToClipboard}
                className="h-12 w-12 shrink-0 transition-all"
              >
                {isCopied ? (
                  <Check className="h-5 w-5" />
                ) : (
                  <Copy className="h-5 w-5" />
                )}
              </Button>
            </div>
          </div>
        )}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          <div className="flex items-center gap-3 p-4 bg-muted/30 rounded-lg border border-border/50">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <Link className="h-5 w-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium text-muted-foreground">Domain</span>
              <span className="flex items-center gap-1.5 font-bold text-foreground text-lg">
               {baseUrl}
                <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-[3px] text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                  Secure
                </span>
              </span>
            </div>
          </div>

          <div className="space-y-4">
            <Label htmlFor="destination" className="text-lg font-semibold text-foreground mb-1 block">
              Destination URL
            </Label>
            <div className="relative">
              <Input
                id="destination"
                placeholder="https://example.com/my-super-long-link-that-needs-shortening"
                className={`h-14 px-4 text-lg md:text-lg font-normal shadow-sm border-muted-foreground/20 focus-visible:ring-primary/20 focus-visible:border-primary transition-all ${errors.destination ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                {...register("destination")}
              />
              {errors.destination && (
                <p className="text-sm text-red-500 mt-2">{errors.destination.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <Label className="text-lg font-semibold text-foreground mb-1 block">Short Link Type</Label>
            <RadioGroup
              value={slugType}
              onValueChange={(value) => setValue("slugType", value as "random" | "custom", { shouldValidate: true })}
              className="grid grid-cols-1 sm:grid-cols-2 gap-4"
            >
              <label
                htmlFor="option-random"
                className={`flex items-start space-x-3 rounded-xl border p-4 transition-all hover:bg-muted/50 cursor-pointer ${slugType === 'random' ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'border-border'}`}
              >
                <RadioGroupItem value="random" id="option-random" className="mt-1" />
                <div className="space-y-1">
                  <div className="font-semibold text-sm leading-none">Random alias</div>
                  <p className="text-sm text-muted-foreground">Auto-generated random characters</p>
                </div>
              </label>
              <label
                htmlFor="option-custom"
                className={`flex items-start space-x-3 rounded-xl border p-4 transition-all hover:bg-muted/50 cursor-pointer ${slugType === 'custom' ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'border-border'}`}
              >
                <RadioGroupItem value="custom" id="option-custom" className="mt-1" />
                <div className="space-y-1">
                  <div className="font-semibold text-sm leading-none">Custom alias</div>
                  <p className="text-sm text-muted-foreground">Choose your own custom slug</p>
                </div>
              </label>
            </RadioGroup>
          </div>

          {slugType === "custom" && (
            <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
              <Label htmlFor="custom-slug" className="text-lg font-semibold text-foreground mb-1 block">
                Your custom alias
              </Label>
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <div className="flex h-14 items-center rounded-md border border-input bg-muted/50 px-4 text-muted-foreground font-normal text-lg min-w-fit">
                    {baseUrl}/
                  </div>
                  <div className="relative flex-1">
                    <Input
                      id="custom-slug"
                      placeholder="summer-sale-2025"
                      className={`h-14 w-full text-lg md:text-lg font-normal border-muted-foreground/20 focus-visible:ring-primary/20 focus-visible:border-primary transition-all shadow-sm pr-12 ${
                        errors.customSlug || aliasError
                          ? "border-red-500 focus-visible:ring-red-500"
                          : isAliasAvailable === true
                          ? "border-green-500 focus-visible:ring-green-500"
                          : ""
                      }`}
                      {...register("customSlug")}
                    />
                    {/* Availability status indicator */}
                    <div className="absolute right-4 top-1/2 -translate-y-1/2">
                      {isCheckingAlias && (
                        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                      )}
                      {!isCheckingAlias && isAliasAvailable === true && (
                        <Check className="h-5 w-5 text-green-500" />
                      )}
                      {!isCheckingAlias && isAliasAvailable === false && (
                        <X className="h-5 w-5 text-red-500" />
                      )}
                    </div>
                  </div>
                </div>
                {errors.customSlug && (
                  <p className="text-sm text-red-500">{errors.customSlug.message}</p>
                )}
                {aliasError && !errors.customSlug && (
                  <p className="text-sm text-red-500">{aliasError}</p>
                )}
                {isAliasAvailable === true && (
                  <p className="text-sm text-green-500">This alias is available!</p>
                )}
              </div>
            </div>
          )}

          {/* <div className="flex items-center space-x-2">
            <Checkbox id="qr-code" />
            <Label htmlFor="qr-code" className="font-normal">
              Also create a QR code for this link
            </Label>
          </div> */}

          <Button 
            type="submit" 
            disabled={!canSubmit || isCheckingAlias}
            className="h-14 w-full text-lg font-bold shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all rounded-xl disabled:opacity-50 disabled:cursor-not-allowed" 
            size="lg"
          >
            {isCheckingAlias ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Checking availability...
              </>
            ) : (
              <>
                Create Short Link
                <Link className="ml-2 h-5 w-5" />
              </>
            )}
          </Button>
        </form>
      </CardContent>
      <CardFooter>
      </CardFooter>
    </Card>
  )
}
