"use client"

import { notFound, redirect } from "next/navigation"
import Link from "next/link"
import { useProgressStore } from "@/lib/progress"
import { modules, getLesson, lessonContentMap } from "@/lib/content"
import { LessonPlayer } from "@/components/lesson/lesson-player"
import { Button } from "@/components/ui/button"
import { Breadcrumbs } from "@/components/layout/breadcrumbs"
import { ArrowLeft, ArrowRight, CheckCircle, Lock } from "lucide-react"
import { useEffect, useState } from "react"

interface LessonPageProps {
  params: Promise<{
    module: string
    section: string
  }>
}

export default function LessonPage({ params }: LessonPageProps) {
  const [moduleStr, setModuleStr] = useState<string>("")
  const [sectionStr, setSectionStr] = useState<string>("")
  const [isLoading, setIsLoading] = useState(true)
  const { completedSections, currentModule, currentSection, isDevMode } = useProgressStore()

  useEffect(() => {
    const resolveParams = async () => {
      try {
        const resolvedParams = await params
        setModuleStr(resolvedParams.module)
        setSectionStr(resolvedParams.section)
        setIsLoading(false)
      } catch (error) {
        console.error("Error resolving params:", error)
        setIsLoading(false)
      }
    }
    
    resolveParams()
  }, [params])

  if (isLoading) {
    return <div>Loading...</div>
  }
  const moduleId = parseInt(moduleStr)
  const sectionId = parseInt(sectionStr)
  
  const lesson = getLesson(moduleId, sectionId)
  if (!lesson) {
    notFound()
  }
  
  const module = modules.find(m => m.id === moduleId)
  if (!module) {
    notFound()
  }

  // Check if user has access to this lesson (bypass if dev mode is enabled)
  const isFirstSection = sectionId === 1
  const isCompleted = completedSections.has(`${moduleId}-${sectionId}`)
  const hasAccessToPrevious = sectionId > 1 && completedSections.has(`${moduleId}-${sectionId - 1}`)
  const hasAccess = isDevMode || isFirstSection || isCompleted || hasAccessToPrevious

  // If user doesn't have access and dev mode is disabled, redirect to the first accessible lesson
  if (!hasAccess && !isDevMode) {
    // Find the first incomplete lesson they can access
    const firstIncomplete = module.sections.find(section => {
      if (section.section === 1) return true
      return completedSections.has(`${moduleId}-${section.section - 1}`)
    })
    
    if (firstIncomplete) {
      redirect(`/learn/${moduleId}/${firstIncomplete.section}`)
    } else {
      redirect(`/learn/${moduleId}/1`)
    }
  }
  
  const currentIndex = module.sections.findIndex(s => s.section === sectionId)
  const prevSection = currentIndex > 0 ? module.sections[currentIndex - 1] : null
  const nextSection = currentIndex < module.sections.length - 1 ? module.sections[currentIndex + 1] : null
  
  // Get custom content for this lesson, or fall back to sample content
  const contentKey = `${lesson.module}-${lesson.section}`
  const customContent = lessonContentMap[contentKey]
  
  const content = customContent || `
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

  return (
    <div className="min-h-screen bg-background">
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
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
