"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Link as LinkIcon, BarChart3, Globe, User } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  isCollapsed?: boolean
}

const sidebarItems = [
  { name: "Home", href: "/dashboard", icon: LayoutDashboard },
  { name: "Links", href: "/dashboard/links", icon: LinkIcon },
  { name: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
  { name: "Custom Domain", href: "/dashboard/domains", icon: Globe },
  { name: "Account", href: "/dashboard/account", icon: User },
]

export function Sidebar({ className, isCollapsed }: SidebarProps) {
  const pathname = usePathname()

  return (
    <div className={cn("pb-12 h-screen border-r bg-background", className)}>
      <div className="space-y-4 py-4">
        <div className={cn("px-3 py-2", isCollapsed ? "text-center" : "")}>
          <h2 className={cn("mb-2 px-4 text-lg font-semibold tracking-tight text-primary", isCollapsed && "hidden")}>
            Shortly
          </h2>
             {isCollapsed && (
                <div className="flex justify-center mb-4">
                    <span className="text-primary font-bold text-xl">S</span>
                </div>
            )}
          <div className="space-y-1">
            {sidebarItems.map((item) => (
              <Button
                key={item.href}
                variant={pathname === item.href ? "secondary" : "ghost"}
                size="lg"
                className={cn("w-full justify-start mb-1", isCollapsed && "justify-center px-2")}
                asChild
              >
                <Link href={item.href}>
                  <item.icon className={cn("h-6 w-6", !isCollapsed && "mr-3")} strokeWidth={2.5} />
                  {!isCollapsed && <span className="text-base font-semibold">{item.name}</span>}
                </Link>
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
