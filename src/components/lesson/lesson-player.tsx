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
  const progressRef = useRef<HTMLDivElement>(null)

  // Track scroll progress and mark as complete at 80%
  useEffect(() => {
    const handleScroll = () => {
      if (!contentRef.current || !progressRef.current) return
      
      const scrollTop = window.scrollY
      const contentTop = contentRef.current.offsetTop
      const contentHeight = contentRef.current.offsetHeight
      const windowHeight = window.innerHeight
      
      const scrollProgress = (scrollTop + windowHeight - contentTop) / contentHeight
      const clampedProgress = Math.max(0, Math.min(100, scrollProgress * 100))
      
      // Update progress bar
      if (progressRef.current) {
        progressRef.current.style.width = `${clampedProgress}%`
      }
      
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
      <div className="prose prose-gray dark:prose-invert max-w-none prose-headings:scroll-mt-20 prose-h1:text-3xl prose-h1:font-bold prose-h1:mb-6 prose-h1:text-foreground prose-h2:text-2xl prose-h2:font-semibold prose-h2:mb-4 prose-h2:mt-8 prose-h2:text-foreground prose-h3:text-xl prose-h3:font-medium prose-h3:mb-3 prose-h3:mt-6 prose-h3:text-foreground prose-p:text-base prose-p:leading-relaxed prose-p:mb-4 prose-p:text-foreground prose-ul:my-4 prose-li:mb-2 prose-li:text-foreground prose-strong:font-semibold prose-strong:text-foreground prose-table:w-full prose-table:border-collapse prose-table:my-6 prose-th:border prose-th:border-border prose-th:bg-muted prose-th:px-4 prose-th:py-3 prose-th:text-left prose-th:text-sm prose-th:font-semibold prose-th:text-foreground prose-td:border prose-td:border-border prose-td:px-4 prose-td:py-3 prose-td:text-sm prose-td:text-foreground">
        <div dangerouslySetInnerHTML={{ __html: content }} />
      </div>
    )
  }

  return (
    <div className="max-w-lesson mx-auto space-y-8" ref={contentRef}>
      {/* Progress Indicator */}
      <div className="sticky top-20 z-10 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60 border border-border/30 rounded-lg p-3 shadow-sm">
        <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
          <span>Прогресс чтения</span>
          <span>80% для завершения</span>
        </div>
        <div className="w-full bg-muted/30 rounded-full h-2">
          <div 
            className="bg-primary/60 h-2 rounded-full transition-all duration-500 ease-out"
            style={{ width: '0%' }}
            ref={progressRef}
          />
        </div>
      </div>
      
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
