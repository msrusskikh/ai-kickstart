"use client"

import { notFound } from "next/navigation"
import Link from "next/link"
import { useProgressStore } from "@/lib/progress"
import { modules, getLesson } from "@/lib/content"
import { LessonPlayer } from "@/components/lesson/lesson-player"
import { Button } from "@/components/ui/button"
import { Breadcrumbs } from "@/components/layout/breadcrumbs"
import { ArrowLeft, ArrowRight, CheckCircle } from "lucide-react"

interface LessonPageProps {
  params: Promise<{
    module: string
    section: string
  }>
}

export default async function LessonPage({ params }: LessonPageProps) {
  const { module: moduleStr, section: sectionStr } = await params
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
  
  const currentIndex = module.sections.findIndex(s => s.section === sectionId)
  const prevSection = currentIndex > 0 ? module.sections[currentIndex - 1] : null
  const nextSection = currentIndex < module.sections.length - 1 ? module.sections[currentIndex + 1] : null
  
  // Sample content for demonstration
  const sampleContent = `
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
            <LessonPlayer lesson={lesson} content={sampleContent} />
          </div>
          
          {/* Navigation Controls */}
          <div className="mt-12 pt-8 border-t">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                {prevSection && (
                  <Button asChild variant="outline">
                    <Link href={`/learn/${moduleId}/${prevSection.section}`}>
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Previous: {prevSection.title}
                    </Link>
                  </Button>
                )}
              </div>
              
              <div className="flex items-center space-x-4">
                {nextSection && (
                  <Button asChild>
                    <Link href={`/learn/${moduleId}/${nextSection.section}`}>
                      Next: {nextSection.title}
                      <ArrowRight className="ml-2 h-4 w-4" />
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
