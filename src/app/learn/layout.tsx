"use client"

import { TopBar } from "@/components/layout/top-bar"
import { SideNav } from "@/components/layout/side-nav"
import { CommandMenu } from "@/components/layout/command-menu"
import { useKeyboardShortcuts } from "@/lib/keyboard"
import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"

export default function LearnLayout({
  children,
}: {
  children: React.ReactNode
}) {
  useKeyboardShortcuts()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  const handleMobileMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const handleMobileMenuClose = () => {
    setIsMobileMenuOpen(false)
  }

  // Close mobile menu when pathname changes
  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [pathname])

  return (
    <div className="min-h-screen bg-background w-full max-w-full overflow-x-hidden">
      <TopBar 
        onMobileMenuToggle={handleMobileMenuToggle}
        isMobileMenuOpen={isMobileMenuOpen}
      />
      <CommandMenu />
      
      <div className="flex h-[calc(100vh-3.5rem)] w-full max-w-full overflow-x-hidden">
        <SideNav 
          isMobileMenuOpen={isMobileMenuOpen}
          onMobileMenuClose={handleMobileMenuClose}
        />
        <main className="flex-1 overflow-auto w-full max-w-full">
          {children}
        </main>
      </div>
    </div>
  )
}
