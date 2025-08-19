"use client"

import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { useProgressStore } from "@/lib/progress"
import { modules, getLesson, lessonContentMap } from "@/lib/content"
import { LessonPlayer } from "@/components/lesson/lesson-player"
import { Button } from "@/components/ui/button"
import { Breadcrumbs } from "@/components/layout/breadcrumbs"
import { ArrowLeft, ArrowRight, CheckCircle, Lock } from "lucide-react"
import { useEffect, useState } from "react"

export default function LessonPage() {
  const router = useRouter()
  const params = useParams<{ module: string; section: string }>()
  const moduleStr = params?.module || ""
  const sectionStr = params?.section || ""
  const { completedSections, currentModule, currentSection, isDevMode } = useProgressStore()

  if (!moduleStr || !sectionStr) {
    return <div>Loading...</div>
  }
  const moduleId = parseInt(moduleStr)
  const sectionId = parseInt(sectionStr)
  
  const lesson = getLesson(moduleId, sectionId)
  if (!lesson) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <h2 className="text-2xl font-bold text-foreground">Страница не найдена</h2>
        <p className="text-muted-foreground text-center max-w-md">Запрашиваемая страница не существует или была перемещена.</p>
        <Button asChild>
          <Link href="/">Вернуться на главную</Link>
        </Button>
      </div>
    )
  }
  
  const module = modules.find(m => m.id === moduleId)
  if (!module) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <h2 className="text-2xl font-bold text-foreground">Страница не найдена</h2>
        <p className="text-muted-foreground text-center max-w-md">Запрашиваемая страница не существует или была перемещена.</p>
        <Button asChild>
          <Link href="/">Вернуться на главную</Link>
        </Button>
      </div>
    )
  }

  // Check if user has access to this lesson (bypass if dev mode is enabled)
  const isFirstSection = sectionId === 1
  const isCompleted = completedSections.has(`${moduleId}-${sectionId}`)
  const hasAccessToPrevious = sectionId > 1 && completedSections.has(`${moduleId}-${sectionId - 1}`)
  const hasAccess = isDevMode || isFirstSection || isCompleted || hasAccessToPrevious

  // If user doesn't have access and dev mode is disabled, navigate client-side
  useEffect(() => {
    if (!hasAccess && !isDevMode) {
      const firstIncomplete = module.sections.find(section => {
        if (section.section === 1) return true
        return completedSections.has(`${moduleId}-${section.section - 1}`)
      })
      if (firstIncomplete) {
        router.replace(`/learn/${moduleId}/${firstIncomplete.section}`)
      } else {
        router.replace(`/learn/${moduleId}/1`)
      }
    }
  }, [hasAccess, isDevMode, module.sections, completedSections, moduleId, router])
  
  const currentIndex = module.sections.findIndex(s => s.section === sectionId)
  const prevSection = currentIndex > 0 ? module.sections[currentIndex - 1] : null
  const nextSection = currentIndex < module.sections.length - 1 ? module.sections[currentIndex + 1] : null
  
  // Check if this is the last lesson of the current module
  const isLastLessonOfModule = currentIndex === module.sections.length - 1
  const nextModule = modules.find(m => m.id === moduleId + 1)
  
  // Get custom content for this lesson, or fall back to sample content
  // For lab lessons, we don't need content from lessonContentMap
  let content = ''
  if (!lesson.isLab) {
    const contentKey = `${lesson.module}-${lesson.section}`
    console.log('Loading lesson content for:', contentKey)
    console.log('Available keys:', Object.keys(lessonContentMap))
    const customContent = lessonContentMap[contentKey]
    console.log('Custom content found:', !!customContent)
    
    content = customContent || `
      <h2>Welcome to ${lesson.title}</h2>
      <p>This is a sample lesson content. In a real application, this would be loaded from MDX files with rich formatting, code examples, and interactive elements.</p>
      
      <h3>Key Concepts</h3>
      <ul>
        <li>Understanding the fundamentals</li>
        <li>Practical application</li>
        <li>Best practices</li>
      </ul>
      
      <h3>Example Code</h3>
      <p>Here's a simple example to get you started:</p>
      <pre><code>function greet(name) {
  return \`Hello, \${name}!\`;
}

console.log(greet("Learner"));</code></pre>
      
      <h3>Next Steps</h3>
      <p>After completing this lesson, you'll be ready to move on to more advanced topics. Make sure to complete the quiz below to reinforce your understanding.</p>
    `
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-6 py-8">
        <div className="max-w-lesson mx-auto">
          <Breadcrumbs />
          
          {/* Lesson Content */}
          <div className="mt-8">
            <LessonPlayer lesson={lesson} content={content} />
          </div>
          
          {/* Navigation Controls */}
          <div className="mt-12 pt-8 border-t">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                {prevSection && (
                  <Button asChild variant="outline" className="max-w-xs">
                    <Link href={`/learn/${moduleId}/${prevSection.section}`} className="flex items-center">
                      <ArrowLeft className="mr-2 h-4 w-4 flex-shrink-0" />
                      <span className="truncate">Назад: {prevSection.title}</span>
                    </Link>
                  </Button>
                )}
              </div>
              
              <div className="flex items-center space-x-4">
                {nextSection && (
                  <Button asChild className="max-w-xs">
                    <Link href={`/learn/${moduleId}/${nextSection.section}`} className="flex items-center">
                      <span className="truncate">Далее: {nextSection.title}</span>
                      <ArrowRight className="ml-2 h-4 w-4 flex-shrink-0" />
                    </Link>
                  </Button>
                )}
                
                {/* Next Module Button - Show only on last lesson of current module */}
                {isLastLessonOfModule && nextModule && (
                  <Button asChild variant="default" className="max-w-xs bg-primary hover:bg-primary/90">
                    <Link href={`/learn/${nextModule.id}/1`} className="flex items-center">
                      <span className="truncate">К следующему модулю</span>
                      <ArrowRight className="ml-2 h-4 w-4 flex-shrink-0" />
                    </Link>
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
