"use client"

import * as React from "react"
import { Link, QrCode } from "lucide-react"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

export function QuickCreate() {
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

  const onSubmit = (data: FormValues) => {
    console.log("Form Data:", {
      destination: data.destination,
      slugType: data.slugType,
      customSlug: data.slugType === "custom" ? data.customSlug : undefined,
    })
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
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          <div className="flex items-center gap-3 p-4 bg-muted/30 rounded-lg border border-border/50">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <Link className="h-5 w-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium text-muted-foreground">Domain</span>
              <span className="flex items-center gap-1.5 font-bold text-foreground text-lg">
                short.ly
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
                    short.ly/
                  </div>
                  <Input
                    id="custom-slug"
                    placeholder="summer-sale-2025"
                    className={`h-14 flex-1 text-lg md:text-lg font-normal border-muted-foreground/20 focus-visible:ring-primary/20 focus-visible:border-primary transition-all shadow-sm ${errors.customSlug ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                    {...register("customSlug")}
                  />
                </div>
                {errors.customSlug && (
                  <p className="text-sm text-red-500">{errors.customSlug.message}</p>
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

          <Button type="submit" className="h-14 w-full text-lg font-bold shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all rounded-xl" size="lg">
            Create Short Link
            <Link className="ml-2 h-5 w-5" />
          </Button>
        </form>
      </CardContent>
      <CardFooter>
      </CardFooter>
    </Card>
  )
}
