"use client"

import { Button } from "@/components/ui/button"
import { 
  Search, 
  Bell, 
  User,
  Menu
} from "lucide-react"
import { useState } from "react"

export function TopNav() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <div className="flex items-center justify-between h-16 px-6 border-b border-border bg-background/80 backdrop-blur-md">
      {/* Left Section */}
      <div className="flex items-center space-x-4">
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <Menu className="h-5 w-5 text-foreground" />
        </Button>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search..."
            className="pl-10 pr-4 py-2 w-64 bg-muted border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center space-x-2">
        <Button variant="ghost" size="icon" className="hover:bg-muted rounded-lg">
          <Bell className="h-5 w-5 text-foreground" />
        </Button>
        
        <Button variant="ghost" size="icon" className="hover:bg-muted rounded-lg">
          <User className="h-5 w-5 text-foreground" />
        </Button>
      </div>
    </div>
  )
}
