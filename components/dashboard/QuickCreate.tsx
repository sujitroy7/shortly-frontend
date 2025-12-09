"use client"

import * as React from "react"
import { Link, QrCode } from "lucide-react"

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
import { Checkbox } from "@/components/ui/checkbox"

export function QuickCreate() {
  const [slugType, setSlugType] = React.useState<"random" | "custom">("random")

  return (
    <Card className="w-full max-w-2xl shadow-md">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl font-bold">Quick create</CardTitle>
            <CardDescription className="mt-2 text-base">
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
      <CardContent className="space-y-6">
        <div className="flex items-center gap-2 text-sm font-medium">
          <span className="text-muted-foreground">Domain:</span>
          <span className="flex items-center gap-1 font-semibold text-foreground">
            short.ly
            <span className="text-xs text-muted-foreground">🔒</span>
          </span>
        </div>

        <div className="space-y-2">
          <Label htmlFor="destination" className="text-base font-semibold">
            Enter your destination URL
          </Label>
          <Input
            id="destination"
            placeholder="https://example.com/my-long-url"
            className="h-12 text-base"
          />
        </div>

        <div className="space-y-3">
          <Label className="text-base font-semibold">Short Link Type</Label>
          <RadioGroup
            defaultValue="random"
            value={slugType}
            onValueChange={(value: string) => setSlugType(value as "random" | "custom")}
            className="flex flex-col space-y-1"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="random" id="random" />
              <Label htmlFor="random" className="font-normal">Random alias</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="custom" id="custom" />
              <Label htmlFor="custom" className="font-normal">Custom alias</Label>
            </div>
          </RadioGroup>
        </div>

        {slugType === "custom" && (
           <div className="flex items-center gap-2">
             <div className="flex h-12 items-center rounded-md border border-input bg-muted px-3 text-muted-foreground">
               short.ly/
             </div>
             <Input
               placeholder="my-custom-link"
               className="h-12 flex-1 text-base"
             />
           </div>
        )}

        {/* <div className="flex items-center space-x-2">
          <Checkbox id="qr-code" />
          <Label htmlFor="qr-code" className="font-normal">
            Also create a QR code for this link
          </Label>
        </div> */}
      </CardContent>
      <CardFooter>
        <Button className="h-12 w-full text-base font-semibold sm:w-auto px-8" size="lg">
          Create your Short link
        </Button>
      </CardFooter>
    </Card>
  )
}
