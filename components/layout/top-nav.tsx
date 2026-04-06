"use client"

import { Button } from "@/components/ui/button"
import { 
  Search, 
  Bell, 
  User,
  Menu,
  Settings,
  LogOut
} from "lucide-react"
import { type User as AppUser } from "@/lib/types"
import { createClientComponentClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface TopNavProps {
  onMobileToggle: () => void
  currentUser?: AppUser
}

export function TopNav({ onMobileToggle, currentUser }: TopNavProps) {
  const router = useRouter()

  const handleSignOut = async () => {
    const supabase = createClientComponentClient()
    await supabase.auth.signOut()
    router.push('/')
  }

  return (
    <div className="md:hidden flex items-center justify-between h-16 px-6 border-b border-border bg-background/80 backdrop-blur-md">
      {/* Left Section */}
      <div className="flex items-center space-x-4">
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={onMobileToggle}
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
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon" className="hover:bg-muted rounded-lg relative">
              <Bell className="h-5 w-5 text-foreground" />
              <span className="absolute top-2 right-2 h-[6px] w-[6px] bg-primary rounded-full animate-pulse" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 mr-4 mt-2" align="end">
            <div className="flex flex-col space-y-2">
              <h4 className="font-semibold text-sm">Notifications</h4>
              <p className="text-sm text-muted-foreground">You have no new notifications.</p>
            </div>
          </PopoverContent>
        </Popover>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="hover:bg-muted rounded-full">
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs ring-2 ring-border transition-all hover:ring-primary/50 overflow-hidden">
                {currentUser?.avatarUrl ? (
                  <img src={currentUser.avatarUrl} alt="Avatar" className="h-full w-full object-cover" />
                ) : (
                  currentUser?.name?.[0]?.toUpperCase() || 'U'
                )}
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 mt-2">
            <DropdownMenuLabel>
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none text-foreground">{currentUser?.name || 'User'}</p>
                <p className="text-xs leading-none text-muted-foreground">{currentUser?.email}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer" onClick={() => router.push('/dashboard')}>
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer" onClick={() => router.push('/dashboard/settings')}>
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer text-destructive focus:bg-destructive/10 focus:text-destructive" onClick={handleSignOut}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}
