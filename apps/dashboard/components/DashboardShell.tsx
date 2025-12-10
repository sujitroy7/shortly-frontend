"use client"

import * as React from "react"
import { Sidebar } from "@/components/Sidebar"
import { Header } from "@/components/Header"
import { cn } from "@shortly/lib/utils"
import { Button } from "@shortly/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

export default function DashboardShell({
  children,
}: {
  children: React.ReactNode
}) {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false) // Mobile state
  const [isCollapsed, setIsCollapsed] = React.useState(false) // Desktop/Tablet state

  return (
    <div className="flex min-h-screen flex-col lg:flex-row bg-muted/20">
      {/* Mobile Sidebar Overlay */}
        {isSidebarOpen && (
            <div 
                className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden"
                onClick={() => setIsSidebarOpen(false)}
            />
        )}
      
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 -translate-x-full transition-transform lg:static lg:translate-x-0 bg-background border-r",
          isSidebarOpen && "translate-x-0",
           isCollapsed && "lg:w-20"
        )}
      >
        <Sidebar isCollapsed={isCollapsed} />
        
        {/* Collapse Button (Desktop Only) */}
        <div className="hidden lg:flex absolute bottom-4 right-[-12px] z-50">
             <Button 
                variant="outline" 
                size="icon" 
                className="h-6 w-6 rounded-full border shadow-md bg-background"
                onClick={() => setIsCollapsed(!isCollapsed)}
            >
                {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
            </Button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen transition-all duration-300">
        <Header onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} />
        <main className="flex-1 p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  )
}
