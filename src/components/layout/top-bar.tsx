"use client"

import { Search, Lock, Unlock } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { useCommandMenu } from "@/lib/command-menu"
import { useProgressStore } from "@/lib/progress"

export function TopBar() {
  const { open } = useCommandMenu()
  const { isDevMode, toggleDevMode } = useProgressStore()

  const handleCommandMenuOpen = () => {
    try {
      open()
    } catch (error) {
      console.warn('Failed to open command menu:', error)
    }
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="container flex h-14 items-center justify-between px-4">
        <div className="flex items-center space-x-2">
          <Link href="/learn" className="hover:opacity-80 transition-opacity">
            <h1 className="text-lg font-semibold cursor-pointer text-foreground">Трансформер</h1>
          </Link>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleCommandMenuOpen}
            className="h-9 w-9 hover:bg-accent/50 transition-all duration-200"
          >
            <Search className="h-4 w-4" />
            <span className="sr-only">Open command menu</span>
          </Button>
          
          {/* Developer Mode Toggle */}
          <Button
            variant={isDevMode ? "default" : "outline"}
            size="sm"
            onClick={toggleDevMode}
            className={`h-9 px-3 transition-all duration-200 ${isDevMode ? 'bg-green-600 hover:bg-green-700 shadow-sm' : 'hover:bg-accent/50'}`}
            title={isDevMode ? "Disable Developer Mode" : "Enable Developer Mode"}
          >
            {isDevMode ? (
              <>
                <Unlock className="h-4 w-4 mr-2" />
                <span className="text-xs">Dev Mode</span>
              </>
            ) : (
              <>
                <Lock className="h-4 w-4 mr-2" />
                <span className="text-xs">Dev Mode</span>
              </>
            )}
          </Button>
          
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
