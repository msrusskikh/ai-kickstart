"use client"

import { useState } from "react"
import { CheckCircle, XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { QuizMCQ } from "@/lib/types"

interface QuizMCQProps {
  quiz: QuizMCQ
  onComplete?: () => void
}

export function QuizMCQ({ quiz, onComplete }: QuizMCQProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [isAnswered, setIsAnswered] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)

  const handleAnswerSelect = (choice: string) => {
    if (isAnswered) return
    
    setSelectedAnswer(choice)
    const correct = choice === quiz.answer
    setIsCorrect(correct)
    setIsAnswered(true)
    
    if (correct && onComplete) {
      onComplete()
    }
  }

  const getChoiceStyle = (choice: string) => {
    if (!isAnswered) {
      return "hover:bg-accent hover:text-accent-foreground"
    }
    
    if (choice === quiz.answer) {
      return "bg-green-100 text-green-900 border-green-300 dark:bg-green-900 dark:text-green-100 dark:border-green-700"
    }
    
    if (choice === selectedAnswer && !isCorrect) {
      return "bg-red-100 text-red-900 border-red-300 dark:bg-red-900 dark:text-red-100 dark:border-red-700"
    }
    
    return "opacity-50"
  }

  return (
    <div className="space-y-4 p-6 border rounded-lg bg-card">
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Question</h3>
        <p className="text-sm text-muted-foreground">{quiz.question}</p>
      </div>
      
      <div className="space-y-2">
        {quiz.choices.map((choice, index) => (
          <Button
            key={index}
            variant="outline"
            className={cn(
              "w-full justify-start h-auto p-4 text-left",
              getChoiceStyle(choice)
            )}
            onClick={() => handleAnswerSelect(choice)}
            disabled={isAnswered}
          >
            <div className="flex items-center space-x-3">
              {isAnswered && choice === quiz.answer && (
                <CheckCircle className="h-5 w-5 text-green-600" />
              )}
              {isAnswered && choice === selectedAnswer && choice !== quiz.answer && (
                <XCircle className="h-5 w-5 text-red-600" />
              )}
              <span className="font-mono text-sm text-muted-foreground w-6">
                {String.fromCharCode(65 + index)}
              </span>
              <span>{choice}</span>
            </div>
          </Button>
        ))}
      </div>
      
      {isAnswered && (
        <div className={cn(
          "p-3 rounded-md text-sm",
          isCorrect 
            ? "bg-green-50 text-green-800 dark:bg-green-900 dark:text-green-100" 
            : "bg-red-50 text-red-800 dark:bg-red-900 dark:text-red-100"
        )}>
          {isCorrect ? (
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4" />
              <span>Correct! Well done.</span>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <XCircle className="h-4 w-4" />
              <span>Incorrect. The correct answer is: {quiz.answer}</span>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
