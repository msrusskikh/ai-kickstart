"use client"

import { useEffect, useRef } from "react"
import { Clock, Target, BookOpen } from "lucide-react"
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

  // Simple content rendering (in a real app, this would use MDX)
  const renderContent = () => {
    // This is a simplified content renderer
    // In production, you'd use MDX with proper component mapping
    return (
      <div className="prose prose-gray dark:prose-invert max-w-none">
        <div dangerouslySetInnerHTML={{ __html: content }} />
      </div>
    )
  }

  return (
    <div className="max-w-lesson mx-auto space-y-8" ref={contentRef}>
      {/* Lesson Header */}
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl">{lesson.title}</CardTitle>
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

      {/* Objectives */}
      {lesson.objectives.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Target className="h-5 w-5" />
              <span>Цели обучения</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {lesson.objectives.map((objective, index) => (
                <li key={index} className="flex items-start space-x-2">
                  <span className="text-green-500 mt-1">•</span>
                  <span>{objective}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Prerequisites */}
      {lesson.prerequisites.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Предварительные требования</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Перед началом этого урока убедитесь, что вы завершили: {lesson.prerequisites.join(', ')}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Main Content */}
      <div className="space-y-6">
        {renderContent()}
      </div>

      {/* Quizzes */}
      {lesson.quiz && lesson.quiz.length > 0 && (
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold">Проверьте понимание</h2>
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

      {/* Progress indicator */}
      <div ref={progressRef} className="h-4" />
    </div>
  )
}
