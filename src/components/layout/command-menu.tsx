"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Search, Command, ArrowRight } from "lucide-react"
import { useCommandMenu } from "@/lib/command-menu"
import { searchLessons } from "@/lib/content"
import { useProgressStore } from "@/lib/progress"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function CommandMenu() {
  const { isOpen, close } = useCommandMenu()
  const router = useRouter()
  const { setCurrentLesson } = useProgressStore()
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<ReturnType<typeof searchLessons>>([])
  const [selectedIndex, setSelectedIndex] = useState(0)

  useEffect(() => {
    if (query.trim()) {
      const searchResults = searchLessons(query)
      setResults(searchResults)
      setSelectedIndex(0)
    } else {
      setResults([])
    }
  }, [query])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault()
          setSelectedIndex((prev) => 
            prev < results.length - 1 ? prev + 1 : 0
          )
          break
        case "ArrowUp":
          e.preventDefault()
          setSelectedIndex((prev) => 
            prev > 0 ? prev - 1 : results.length - 1
          )
          break
        case "Enter":
          e.preventDefault()
          if (results[selectedIndex]) {
            handleSelectResult(results[selectedIndex])
          }
          break
        case "Escape":
          e.preventDefault()
          close()
          break
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [isOpen, results, selectedIndex, close])

  const handleSelectResult = (result: typeof results[0]) => {
    setCurrentLesson(result.module, result.section)
    router.push(`/learn/${result.module}/${result.section}`)
    close()
    setQuery("")
  }

  const handleClose = () => {
    close()
    setQuery("")
    setResults([])
    setSelectedIndex(0)
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] p-0">
        <DialogHeader className="px-6 py-4 border-b">
          <DialogTitle className="flex items-center space-x-2">
            <Command className="h-5 w-5" />
            <span>Command Menu</span>
          </DialogTitle>
        </DialogHeader>
        
        <div className="p-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search lessons..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-10"
              autoFocus
            />
          </div>
          
          {query && (
            <div className="mt-4 space-y-1">
              {results.length > 0 ? (
                results.map((result, index) => (
                  <Button
                    key={`${result.module}-${result.section}`}
                    variant="ghost"
                    className={cn(
                      "w-full justify-between h-auto p-3",
                      index === selectedIndex && "bg-accent"
                    )}
                    onClick={() => handleSelectResult(result)}
                  >
                    <div className="flex-1 text-left">
                      <div className="font-medium">{result.title}</div>
                      <div className="text-sm text-muted-foreground">
                        {result.summary}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <span>Module {result.module}</span>
                      <ArrowRight className="h-4 w-4" />
                    </div>
                  </Button>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No lessons found matching "{query}"
                </div>
              )}
            </div>
          )}
          
          {!query && (
            <div className="mt-8 text-center text-muted-foreground">
              <p className="text-sm">Type to search lessons</p>
              <p className="text-xs mt-2">
                Use ↑↓ to navigate, Enter to select, Esc to close
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
