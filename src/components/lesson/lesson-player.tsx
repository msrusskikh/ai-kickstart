"use client"

import { useEffect, useRef } from "react"
import { Clock, BookOpen } from "lucide-react"
import { useProgressStore } from "@/lib/progress"
import { QuizMCQ } from "./quiz-mcq"
import { QuizReflection } from "./quiz-reflection"
import { Callout } from "./callout"
import { Card, CardContent, CardHeader, CardTitle } from "./card"
import { CodeBlock } from "./code-block"
import type { LessonFrontmatter, Quiz } from "@/lib/types"

interface LessonPlayerProps {
  lesson: LessonFrontmatter
  content: string
}

export function LessonPlayer({ lesson, content }: LessonPlayerProps) {
  const { markSectionComplete } = useProgressStore()
  const contentRef = useRef<HTMLDivElement>(null)

  // Track scroll progress and mark as complete at 80% (internal tracking only)
  useEffect(() => {
    const handleScroll = () => {
      if (!contentRef.current) return
      
      const scrollTop = window.scrollY
      const contentTop = contentRef.current.offsetTop
      const contentHeight = contentRef.current.offsetHeight
      const windowHeight = window.innerHeight
      
      const scrollProgress = (scrollTop + windowHeight - contentTop) / contentHeight
      
      if (scrollProgress >= 0.8) {
        markSectionComplete(lesson.module, lesson.section)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [lesson.module, lesson.section, markSectionComplete])

  const handleQuizComplete = () => {
    markSectionComplete(lesson.module, lesson.section)
  }

  // Enhanced content rendering with better styling
  const renderContent = () => {
    return (
      <div className="prose prose-gray dark:prose-invert max-w-none prose-headings:scroll-mt-20 prose-h1:text-3xl prose-h1:font-bold prose-h1:mb-6 prose-h1:text-foreground prose-h2:text-2xl prose-h2:font-semibold prose-h2:mb-4 prose-h2:mt-8 prose-h2:text-foreground prose-h3:text-xl prose-h3:font-medium prose-h3:mb-3 prose-h3:mt-6 prose-h3:text-foreground prose-p:text-base prose-p:leading-relaxed prose-p:mb-4 prose-p:text-foreground prose-ul:my-4 prose-li:mb-2 prose-li:text-foreground prose-strong:font-semibold prose-strong:text-foreground">
        <div dangerouslySetInnerHTML={{ __html: content }} />
      </div>
    )
  }

  return (
    <div className="max-w-lesson mx-auto space-y-8" ref={contentRef}>
      {/* Lesson Header */}
      <Card className="shadow-sm border-border/50">
        <CardHeader>
          <CardTitle className="text-3xl text-foreground">{lesson.title}</CardTitle>
          <div className="flex items-center space-x-6 text-sm text-muted-foreground">
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4" />
              <span>{lesson.duration} мин</span>
            </div>
            <div className="flex items-center space-x-2">
              <BookOpen className="h-4 w-4" />
              <span>Модуль {lesson.module}, Урок {lesson.section}</span>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <p className="text-lg text-muted-foreground leading-relaxed">
            {lesson.summary}
          </p>
        </CardContent>
      </Card>

      {/* Main Content */}
      <div className="space-y-6">
        <div className="lesson-content bg-card/30 rounded-lg p-6 border border-border/30">
          {renderContent()}
        </div>
      </div>

      {/* Quizzes */}
      {lesson.quiz && lesson.quiz.length > 0 && (
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold text-foreground">Проверьте понимание</h2>
          {lesson.quiz.map((quiz, index) => (
            <div key={index}>
              {quiz.type === 'mcq' && (
                <QuizMCQ quiz={quiz} onComplete={handleQuizComplete} />
              )}
              {quiz.type === 'reflection' && (
                <QuizReflection quiz={quiz} onComplete={handleQuizComplete} />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
