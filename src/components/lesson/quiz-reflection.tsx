"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Save } from "lucide-react"
import type { QuizReflection } from "@/lib/types"

interface QuizReflectionProps {
  quiz: QuizReflection
  onComplete?: () => void
}

export function QuizReflection({ quiz, onComplete }: QuizReflectionProps) {
  const [response, setResponse] = useState("")
  const [isSaved, setIsSaved] = useState(false)
  const [wordCount, setWordCount] = useState(0)

  // Load saved response from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(`reflection-${quiz.prompt}`)
    if (saved) {
      setResponse(saved)
      setIsSaved(true)
    }
  }, [quiz.prompt])

  // Update word count
  useEffect(() => {
    const words = response.trim().split(/\s+/).filter(Boolean).length
    setWordCount(words)
  }, [response])

  const handleSave = () => {
    localStorage.setItem(`reflection-${quiz.prompt}`, response)
    setIsSaved(true)
    if (onComplete) {
      onComplete()
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    handleSave()
  }

  return (
    <div className="space-y-4 p-7 border border-border/30 rounded-xl bg-card/50">
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Reflection</h3>
        <p className="text-sm text-muted-foreground">{quiz.prompt}</p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Textarea
            placeholder="Write your thoughts here..."
            value={response}
            onChange={(e) => setResponse(e.target.value)}
            className="min-h-[120px] resize-none"
            rows={5}
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Your response will be saved locally</span>
            <span>{wordCount} words</span>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <Button
            type="submit"
            onClick={handleSave}
            disabled={!response.trim()}
            className="flex items-center space-x-2"
          >
            <Save className="h-4 w-4" />
            <span>{isSaved ? "Update Response" : "Save Response"}</span>
          </Button>
          
          {isSaved && (
            <span className="text-sm text-green-600 dark:text-green-400">
              ✓ Response saved
            </span>
          )}
        </div>
      </form>
    </div>
  )
}
