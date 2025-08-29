"use client"

import React, { useState, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { Clock, CheckCircle, XCircle, AlertCircle, Download, Trophy, Paperclip } from 'lucide-react'
import { LAB_CONTENT, CUSTOMER_FEEDBACK, ROUNDS_CONTENT, FRAMEWORK_ELEMENTS, UI_MESSAGES } from '@/data/content'
import { usePromptValidation } from '@/hooks/usePromptValidation'
import { getSystemPrompt } from '@/data/systemPrompts'
import { generatePromptTemplate, generateIterationGuide, generateAnalysisChecklist, downloadTextFile } from '@/utils/downloadAssets'
import ScenarioPanel from '@/components/ScenarioPanel'
import RoundGuidance from '@/components/RoundGuidance'
import ComparisonView from '@/components/ComparisonView'
import CompletionView from '@/components/CompletionView'

// Types
interface RoundData {
  userPrompt: string
  aiResponse: string
  frameworkElements: string[]
  qualityScore: number
  timestamp: Date
}

interface AppState {
  currentRound: 1 | 2 | 3 | 4
  timeRemaining: number
  isCompleted: boolean
  showComparison: boolean
  rounds: Record<number, RoundData>
}

// OpenAI API integration hook
const useOpenAI = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const submitPrompt = async (prompt: string, round: number): Promise<string> => {
    setIsLoading(true)
    setError(null)

    try {
      const systemPrompt = getSystemPrompt(round)
      const response = await fetch('/api/openai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          // Note: AI response limited to 400 tokens max for concise, focused answers
          prompt: `${systemPrompt}

${prompt}

Клиентский фидбек:
${CUSTOMER_FEEDBACK.join('\n')}

Отвечай на русском языке, будь конкретным и структурированным.`,
          model: "gpt-4o-mini",
          temperature: 0.7,
          max_tokens: 400
        }),
      })

      if (!response.ok) {
        throw new Error('API request failed')
      }

      const data = await response.json()
      return data.response || 'Ошибка получения ответа'
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Неизвестная ошибка'
      setError(`Ошибка API: ${errorMessage}`)
      
      // Fallback responses for demo purposes
      const fallbackResponses = {
        1: "Анализ показывает различные мнения клиентов о продукте. Есть как положительные, так и отрицательные отзывы. Пользователи отмечают проблемы с интерфейсом и положительно оценивают обновления.",
        2: "Как customer success менеджер, я проанализировал отзывы и выявил 3 ключевые темы: проблемы с UX/UI, положительная оценка обновлений, и вопросы по ценообразованию.",
        3: "Анализ по шагам: 1) Изучил все 15 отзывов, 2) Сгруппировал по темам, 3) Выделил приоритеты. Результат: UX проблемы (6 упоминаний), обновления (4), ценообразование (3), поддержка (2).",
        4: "Полный анализ с самопроверкой: UX проблемы (6), обновления (4), ценообразование (3), поддержка (2). Каждая тема подтверждена минимум 2 отзывами. Качество анализа: 9/10 - структурированно, конкретно, проверяемо."
      }
      
      return fallbackResponses[round as keyof typeof fallbackResponses] || fallbackResponses[1]
    } finally {
      setIsLoading(false)
    }
  }

  return { submitPrompt, isLoading, error }
}

// Timer hook
const useLabTimer = (initialTime: number, onComplete: () => void) => {
  const [timeRemaining, setTimeRemaining] = useState(initialTime)

  useEffect(() => {
    if (timeRemaining <= 0) {
      onComplete()
      return
    }

    const timer = setInterval(() => {
      setTimeRemaining(prev => prev - 1)
    }, 1000)

    return () => clearInterval(timer)
  }, [timeRemaining])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  return { timeRemaining, formatTime }
}

// Main lab component
interface IterationChallengeLabProps {
  onComplete?: () => void
}

export const IterationChallengeLab: React.FC<IterationChallengeLabProps> = ({ onComplete }) => {
  const [state, setState] = useState<AppState>({
    currentRound: 1,
    timeRemaining: 600, // 10 minutes
    isCompleted: false,
    showComparison: false,
    rounds: {}
  })

  const [currentPrompt, setCurrentPrompt] = useState("")
  const [currentResponse, setCurrentResponse] = useState("")
  const [showCustomerReviews, setShowCustomerReviews] = useState(false)
  const [frameworkFeedback, setFrameworkFeedback] = useState<{
    detectedElements: string[]
    missingElements: string[]
    suggestions: string[]
    score: number
    qualityLevel: string
    isComplete: boolean
    maxScore?: number // Added for relative scoring
  }>({ 
    detectedElements: [], 
    missingElements: [],
    suggestions: [],
    score: 0, 
    qualityLevel: 'low',
    isComplete: false,
    maxScore: 5 // Default max score
  })

  const { submitPrompt, isLoading, error } = useOpenAI()
  const validation = usePromptValidation(currentPrompt, state.currentRound)

  const handleTimerComplete = useCallback(() => {
    setState(prev => ({ ...prev, isCompleted: true }))
  }, [])

  const { timeRemaining, formatTime } = useLabTimer(state.timeRemaining, handleTimerComplete)

  // Update state time remaining
  useEffect(() => {
    setState(prev => ({ ...prev, timeRemaining }))
  }, [timeRemaining])

  // Auto-populate previous prompt for rounds 2-4
  useEffect(() => {
    if (state.currentRound > 1 && state.rounds[state.currentRound - 1]) {
      setCurrentPrompt(state.rounds[state.currentRound - 1].userPrompt)
    }
  }, [state.currentRound, state.rounds])

  // Auto-populate starter prompt for round 1
  useEffect(() => {
    if (state.currentRound === 1 && !currentPrompt) {
      setCurrentPrompt(ROUNDS_CONTENT[1].starterPrompt)
            }
  }, [state.currentRound])

  // Update framework feedback when prompt changes
  useEffect(() => {
    setFrameworkFeedback({
      ...validation,
      maxScore: validation.maxScore || 5
    })
  }, [validation])

  const handlePromptChange = (value: string) => {
    setCurrentPrompt(value)
  }

  const handleSubmit = async () => {
    if (!currentPrompt.trim() || isLoading) return

    const response = await submitPrompt(currentPrompt, state.currentRound)
    setCurrentResponse(response)

    // Save round data
    const roundData: RoundData = {
      userPrompt: currentPrompt,
      aiResponse: response,
      frameworkElements: validation.detectedElements,
      qualityScore: validation.score,
      timestamp: new Date()
    }

    setState(prev => ({
      ...prev,
      rounds: { ...prev.rounds, [state.currentRound]: roundData }
    }))
  }

  const handleNextRound = () => {
    if (state.currentRound < 4) {
      setState(prev => ({ ...prev, currentRound: (prev.currentRound + 1) as 1 | 2 | 3 | 4 }))
      setCurrentResponse("")
    } else {
      setState(prev => ({ ...prev, showComparison: true }))
    }
  }

  const handleComplete = () => {
    setState(prev => ({ ...prev, isCompleted: true, showComparison: true }))
    onComplete?.()
  }

  const handleDownload = (assetName: string) => {
    const round4Data = state.rounds[4]
    const finalPrompt = round4Data?.userPrompt || currentPrompt

    switch (assetName) {
      case "Ваш финальный отшлифованный промпт":
        downloadTextFile(generatePromptTemplate(finalPrompt), 'final-prompt-template.md')
        break
      case "Шаблон для 4-раундового итерационного процесса":
        downloadTextFile(generateIterationGuide(), 'iteration-process-guide.md')
        break
      case "Чеклист анализа фидбека клиентов":
        downloadTextFile(generateAnalysisChecklist(), 'feedback-analysis-checklist.md')
        break
      default:
        break
    }
  }

  if (state.isCompleted && state.showComparison) {
    return (
      <div className="space-y-6">
        <CompletionView onDownload={handleDownload} />
        <ComparisonView rounds={state.rounds} />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Main content grid */}
      <div className="space-y-6">
        {/* Scenario and Customer feedback panel */}
        <ScenarioPanel 
          title={LAB_CONTENT.scenario.title}
          description={LAB_CONTENT.scenario.description}
        />

        {/* Prompt builder */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">ПРОМПТ-КОНСТРУКТОР</h3>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowCustomerReviews(!showCustomerReviews)}
              className="flex items-center space-x-2 text-sm"
            >
              <Paperclip className="h-4 w-4" />
              <span>{showCustomerReviews ? 'Скрыть отзывы' : 'Отзывы'}</span>
            </Button>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Ваш промпт для ИИ:
              </label>
              <textarea
                value={currentPrompt}
                onChange={(e) => handlePromptChange(e.target.value)}
                placeholder={UI_MESSAGES.placeholders.promptInput}
                className="w-full h-32 p-3 border rounded-lg resize-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Framework validation */}
            {(frameworkFeedback.maxScore || 0) > 0 && (
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-sm">
                  <span className="font-medium">Фреймворк:</span>
                  {Object.entries(FRAMEWORK_ELEMENTS).map(([key, element]) => {
                    // Only show elements that are relevant for the current round
                    const roundElements = [1, 2, 3, 4].map(round => 
                      round === 1 ? [] :
                      round === 2 ? ['role', 'goal'] :
                      round === 3 ? ['role', 'goal', 'steps', 'constraints'] :
                      ['role', 'goal', 'steps', 'constraints', 'quality_bar']
                    )[state.currentRound - 1] || [];
                    
                    if (!roundElements.includes(key)) return null;
                    
                    return (
                      <span
                        key={key}
                        className={`px-2 py-1 rounded text-xs ${
                          frameworkFeedback.detectedElements.includes(key)
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        {element.name}
                      </span>
                    );
                  })}
                </div>
                
                {frameworkFeedback.suggestions.length > 0 && (
                  <div className="text-sm text-amber-600 bg-amber-50 p-2 rounded">
                    <AlertCircle className="inline h-4 w-4 mr-1" />
                    {frameworkFeedback.suggestions.join(', ')}
                  </div>
                )}
              </div>
            )}

            <div className="flex space-x-2">
              <Button 
                onClick={handleSubmit} 
                disabled={!currentPrompt.trim() || isLoading}
                className="flex-1"
              >
                {isLoading ? UI_MESSAGES.loading : UI_MESSAGES.buttons.submit}
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setCurrentPrompt("")}
              >
                {UI_MESSAGES.buttons.clear}
              </Button>
            </div>
          </div>
        </Card>

        {/* Customer Reviews */}
        {showCustomerReviews && (
          <Card className="p-6">
            <h4 className="text-lg font-semibold mb-4">Отзывы клиентов</h4>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {CUSTOMER_FEEDBACK.map((feedback, index) => (
                <div key={index} className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border-l-4 border-blue-500">
                  <div className="flex items-start space-x-3">
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400 min-w-[2rem]">
                      {index + 1}
                    </span>
                    <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                      {feedback}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 text-center text-sm text-muted-foreground">
              Всего отзывов: {CUSTOMER_FEEDBACK.length}
            </div>
          </Card>
        )}
      </div>

      {/* AI Response */}
      {currentResponse && (
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">ИИ ОТВЕТ</h3>
            {(frameworkFeedback.maxScore || 0) > 0 && (
              <div className="flex items-center space-x-2">
                <span className="text-sm text-muted-foreground">Качество:</span>
                <span className={`px-2 py-1 rounded text-sm font-medium ${
                  frameworkFeedback.score >= (frameworkFeedback.maxScore || 5) * 0.8 ? 'bg-green-100 text-green-800' :
                  frameworkFeedback.score >= (frameworkFeedback.maxScore || 5) * 0.5 ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {frameworkFeedback.score}/{frameworkFeedback.maxScore || 5}
                </span>
              </div>
            )}
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg mb-4">
            <div className="prose prose-sm max-w-none">
              {currentResponse.split('\n').map((line, index) => {
                const trimmedLine = line.trim()
                if (!trimmedLine) return <div key={index} className="mb-1">&nbsp;</div>
                
                // Enhanced markdown detection
                const isHeading1 = /^#\s/.test(trimmedLine)
                const isHeading2 = /^##\s/.test(trimmedLine)
                const isHeading3 = /^###\s/.test(trimmedLine)
                const isHeading = isHeading1 || isHeading2 || isHeading3
                const isNumberedList = /^\d+\.\s/.test(trimmedLine)
                const isBulletList = /^[\•\-\*]\s/.test(trimmedLine)
                const isSubBullet = /^\s+[\•\-\*]\s/.test(trimmedLine)
                const isBold = /\*\*(.*?)\*\*/.test(trimmedLine)
                const isItalic = /\*(.*?)\*/.test(trimmedLine)
                const isCode = /`(.*?)`/.test(trimmedLine)
                
                // Determine styling and content
                let className = 'mb-2'
                let content: string | JSX.Element | (string | JSX.Element)[] = trimmedLine
                
                if (isHeading1) {
                  className = 'text-xl font-bold text-gray-900 dark:text-gray-100 mb-4 mt-6 first:mt-0'
                  content = trimmedLine.replace(/^#\s/, '')
                } else if (isHeading2) {
                  className = 'text-lg font-bold text-gray-900 dark:text-gray-100 mb-3 mt-5'
                  content = trimmedLine.replace(/^##\s/, '')
                } else if (isHeading3) {
                  className = 'text-base font-bold text-gray-900 dark:text-gray-100 mb-3 mt-4'
                  content = trimmedLine.replace(/^###\s/, '')
                } else if (isNumberedList) {
                  className = 'ml-6 mb-2 flex items-start'
                  content = (
                    <>
                      <span className="text-gray-600 dark:text-gray-400 font-medium mr-2 flex-shrink-0">
                        {trimmedLine.match(/^\d+\./)?.[0]}
                      </span>
                      <span>{trimmedLine.replace(/^\d+\.\s/, '')}</span>
                    </>
                  )
                } else if (isBulletList) {
                  className = 'ml-6 mb-2 flex items-start'
                  content = (
                    <>
                      <span className="text-gray-600 dark:text-gray-400 mr-2 flex-shrink-0">•</span>
                      <span>{trimmedLine.replace(/^[\•\-\*]\s/, '')}</span>
                    </>
                  )
                } else if (isSubBullet) {
                  className = 'ml-12 mb-2 flex items-start'
                  content = (
                    <>
                      <span className="text-gray-600 dark:text-gray-400 mr-2 flex-shrink-0">◦</span>
                      <span>{trimmedLine.replace(/^\s+[\•\-\*]\s/, '')}</span>
                    </>
                  )
                }
                
                // Process inline markdown formatting
                const processInlineMarkdown = (text: string) => {
                  const parts = []
                  let currentIndex = 0
                  
                  // Process **bold** text
                  const boldRegex = /\*\*(.*?)\*\*/g
                  let boldMatch
                  while ((boldMatch = boldRegex.exec(text)) !== null) {
                    if (boldMatch.index > currentIndex) {
                      parts.push(text.slice(currentIndex, boldMatch.index))
                    }
                    parts.push(
                      <strong key={`bold-${currentIndex}`} className="font-bold">
                        {boldMatch[1]}
                      </strong>
                    )
                    currentIndex = boldMatch.index + boldMatch[0].length
                  }
                  
                  // Process *italic* text
                  const italicRegex = /\*(.*?)\*/g
                  let italicMatch
                  while ((italicMatch = italicRegex.exec(text)) !== null) {
                    if (italicMatch.index > currentIndex) {
                      parts.push(text.slice(currentIndex, italicMatch.index))
                    }
                    parts.push(
                      <em key={`italic-${currentIndex}`} className="italic">
                        {italicMatch[1]}
                      </em>
                    )
                    currentIndex = italicMatch.index + italicMatch[0].length
                  }
                  
                  // Process `code` text
                  const codeRegex = /`(.*?)`/g
                  let codeMatch
                  while ((codeMatch = codeRegex.exec(text)) !== null) {
                    if (codeMatch.index > currentIndex) {
                      parts.push(text.slice(currentIndex, codeMatch.index))
                    }
                    parts.push(
                      <code key={`code-${currentIndex}`} className="bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded text-sm font-mono">
                        {codeMatch[1]}
                      </code>
                    )
                    currentIndex = codeMatch.index + codeMatch[0].length
                  }
                  
                  // Add remaining text
                  if (currentIndex < text.length) {
                    parts.push(text.slice(currentIndex))
                  }
                  
                  return parts.length > 0 ? parts : text
                }
                
                // Apply inline markdown processing to all content types
                if (typeof content === 'string') {
                  content = processInlineMarkdown(content)
                } else if (Array.isArray(content) && content.length > 1) {
                  // For JSX arrays (like bullet points), process the text part
                  const textPart = content[1]
                  if (typeof textPart === 'string') {
                    content[1] = processInlineMarkdown(textPart)
                  }
                }
                
                return (
                  <div key={index} className={className}>
                    {content}
                  </div>
                )
              })}
            </div>
          </div>

          {error && (
            <div className="text-red-600 bg-red-50 p-3 rounded mb-4">
              <XCircle className="inline h-4 w-4 mr-1" />
              {error}
            </div>
          )}

          <div className="flex justify-between items-center">
            <Button 
              onClick={handleNextRound}
              disabled={state.currentRound === 4}
              className="bg-amber-100 hover:bg-amber-200 dark:bg-amber-950/20 dark:hover:bg-amber-950/40 text-amber-900 dark:text-amber-100"
            >
              {state.currentRound === 4 ? 'Завершить' : UI_MESSAGES.buttons.nextRound}
            </Button>
            
            {state.currentRound === 4 && (
              <Button 
                onClick={handleComplete}
                className="bg-green-600 hover:bg-green-700"
              >
                Завершить лабораторную работу
              </Button>
            )}
          </div>
        </Card>
      )}

      {/* Round Guidance */}
      <RoundGuidance 
        currentRound={state.currentRound}
        detectedElements={frameworkFeedback.detectedElements}
      />

      {/* Footer */}
      <div className="text-center text-sm text-muted-foreground mt-8">
        <div className="flex items-center justify-center space-x-2">
          <div className="w-1.5 h-1.5 bg-green-500/70 rounded-full"></div>
          <span>Powered by OpenAI</span>
        </div>
      </div>
    </div>
  )
}
