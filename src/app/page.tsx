"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/lesson/card"
import { useProgressStore } from "@/lib/progress"
import { modules } from "@/lib/content"
import { Moon, Sun } from "lucide-react"
import { useState, useEffect } from "react"

export default function HomePage() {
  const { completedSections, currentModule, currentSection, isDevMode } = useProgressStore()
  const [theme, setTheme] = useState('light')
  
  // Theme toggle function
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light'
    setTheme(newTheme)
    document.documentElement.classList.toggle('dark')
    localStorage.setItem('theme', newTheme)
  }
  
  // Initialize theme on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light'
    setTheme(savedTheme)
    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark')
    }
    
    // Add debug function to window for console access
    ;(window as any).debugTheme = () => {
      const root = document.documentElement
      const computedStyle = getComputedStyle(root)
      
      console.log('=== Theme Debug Info ===')
      console.log('Current theme:', theme)
      console.log('HTML classes:', root.className)
      console.log('CSS Variables:')
      console.log('--background:', computedStyle.getPropertyValue('--background'))
      console.log('--foreground:', computedStyle.getPropertyValue('--foreground'))
      console.log('--primary:', computedStyle.getPropertyValue('--primary'))
      console.log('--muted-foreground:', computedStyle.getPropertyValue('--muted-foreground'))
      console.log('Computed colors:')
      console.log('Background:', computedStyle.backgroundColor)
      console.log('Color:', computedStyle.color)
      console.log('=======================')
    }
  }, [theme])
  
  // Function to get current lesson title
  const getCurrentLessonTitle = () => {
    if (currentModule === 0 || currentSection === 0) {
      return "Начало обучения"
    }
    
    const module = modules.find(m => m.id === currentModule)
    if (!module) {
      return "Модуль не найден"
    }
    
    const section = module.sections.find(s => s.section === currentSection)
    if (!section) {
      return "Урок не найден"
    }
    
    return section.title
  }
  
  // Check if user has any progress to continue from
  const hasProgress = completedSections.size > 0 || currentModule > 1 || currentSection > 1
  
  // Calculate overall progress
  const totalSections = 47 // Total sections across all modules (updated for new quiz lessons)
  const progressPercentage = Math.round((completedSections.size / totalSections) * 100)
  
  // Determine the best destination for "Continue Learning"
  const getContinueDestination = () => {
    // If user has completed sections, find the next incomplete section
    if (completedSections.size > 0) {
      // Find the highest completed module-section
      const completedArray = Array.from(completedSections).map(s => {
        const [mod, sec] = s.split('-').map(Number)
        return { module: mod, section: sec }
      }).sort((a, b) => {
        if (a.module !== b.module) return b.module - a.module
        return b.section - a.section
      })
      
      if (completedArray.length > 0) {
        const lastCompleted = completedArray[0]
        // Try to go to the next section, or next module if at end
        if (lastCompleted.section < 12) { // Max sections per module is 12
          return `/learn/${lastCompleted.module}/${lastCompleted.section + 1}`
        } else if (lastCompleted.module < 4) { // Max modules is 4
          return `/learn/${lastCompleted.module + 1}/1`
        }
      }
    }
    
    // Fallback to current progress or start of first module
    if (currentModule > 1 || currentSection > 1) {
      return `/learn/${currentModule}/${currentSection}`
    }
    
    return `/learn/1/1`
  }
  
  return (
    <div className="min-h-screen bg-background">
      {/* Header with Трансформер text */}
      <header className="sticky top-0 z-40 w-full border-b border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
        <div className="container flex h-14 items-center px-4 justify-between">
          <div className="flex items-center space-x-2">
            <h1 className="text-lg font-semibold text-foreground">Трансформер</h1>
          </div>
          
          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-md hover:bg-muted/50 transition-colors"
            aria-label="Toggle theme"
          >
            {theme === 'light' ? (
              <Moon className="h-4 w-4 text-muted-foreground" />
            ) : (
              <Sun className="h-4 w-4 text-muted-foreground" />
            )}
          </button>
        </div>
      </header>


      
      {/* Hero Section */}
      <div className="container mx-auto px-6 py-28">
        <div className="max-w-4xl mx-auto text-center space-y-10">
          <h1 className="text-6xl font-bold tracking-tight text-foreground leading-tight">
            Интерактивный курс
            <br />
            <span className="text-primary">AI Fundamentals</span>
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto">
            Освойте фундаментальные принципы работы с ИИ за 2 часа. Увеличьте эффективность работы и освободите время для важного
          </p>
          
          {/* Progress Indicator */}
          {hasProgress && (
            <div className="bg-card/50 rounded-xl p-7 max-w-lg mx-auto border border-border/30 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium text-foreground">Ваш прогресс</span>
                <span className="text-2xl font-bold text-foreground">{progressPercentage}%</span>
              </div>
              <div className="w-full bg-muted/50 rounded-full h-2 mb-4">
                <div 
                  className="bg-primary h-2 rounded-full transition-all duration-500 ease-out" 
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  {completedSections.size} из {totalSections} уроков завершено
                </p>
                <p className="text-sm font-medium text-foreground">
                  Ваш текущий урок: {getCurrentLessonTitle()}
                </p>
              </div>
            </div>
          )}
          
          <div className="flex items-center justify-center space-x-5 pt-6">
            <Button asChild size="lg" className="hover:scale-105 transition-transform duration-200 shadow-sm px-8">
              <Link href="/learn">
                Начать обучение
              </Link>
            </Button>
            {hasProgress && (
              <Button asChild variant="outline" size="lg" className="hover:scale-105 transition-transform duration-200 hover:bg-accent/50 px-8">
                <Link href={getContinueDestination()}>
                  Продолжить обучение
                </Link>
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Footer with OpenAI Brand Reference - Fixed positioning */}
      <footer className="py-8 border-t border-border/30">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-center space-x-2 text-xs text-muted-foreground/60 font-mono tracking-wide">
            <div className="w-1.5 h-1.5 bg-green-500/70 rounded-full"></div>
            <span>Powered by OpenAI</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
