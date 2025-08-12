"use client"

import { Search } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { useCommandMenu } from "@/lib/command-menu"

export function TopBar() {
  const { open } = useCommandMenu()

  const handleCommandMenuOpen = () => {
    try {
      open()
    } catch (error) {
      console.warn('Failed to open command menu:', error)
    }
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between px-4">
        <div className="flex items-center space-x-2">
          <Link href="/learn" className="hover:opacity-80 transition-opacity">
            <h1 className="text-lg font-semibold cursor-pointer">Трансформер</h1>
          </Link>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleCommandMenuOpen}
            className="h-9 w-9"
          >
            <Search className="h-4 w-4" />
            <span className="sr-only">Open command menu</span>
          </Button>
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
