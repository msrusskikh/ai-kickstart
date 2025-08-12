"use client"

import { TopBar } from "@/components/layout/top-bar"
import { SideNav } from "@/components/layout/side-nav"
import { CommandMenu } from "@/components/layout/command-menu"
import { useKeyboardShortcuts } from "@/lib/keyboard"

export default function LearnLayout({
  children,
}: {
  children: React.ReactNode
}) {
  useKeyboardShortcuts()

  return (
    <div className="min-h-screen bg-background">
      <TopBar />
      <CommandMenu />
      
      <div className="flex h-[calc(100vh-3.5rem)]">
        <SideNav />
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
