"use client"

import React, { useState, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { Clock, CheckCircle, XCircle, AlertCircle, Download, Trophy, ArrowRight, ArrowLeft } from 'lucide-react'
import { usePromptValidation } from '@/hooks/usePromptValidation'
import { getSystemPrompt } from '@/data/systemPrompts'
import ScenarioPanel from '@/components/ScenarioPanel'

// Types
interface Task {
  description: string
  frequency: string
  duration: string
}

interface WorkflowInputs {
  inputs: string
  outputs: string
  audience: string
  requirements: string
}

interface WorkflowStep {
  title: string
  what: string
  time: string
  tools: string
}

interface GeneratedWorkflow {
  steps: WorkflowStep[]
  timeSavings: {
    current: number
    new: number
    weekly: number
    monthly: number
  }
}

interface ToolRecommendation {
  name: string
  why: string
  cost: string
  learningCurve: string
  bestFor: string
}

interface ImplementationPlan {
  setup: string[]
  testing: string[]
  deployment: string[]
}

interface LabState {
  currentStep: 1 | 2 | 3 | 4 | 5 | 6
  userTasks: Task[]
  analysisResults: any
  selectedTask: Task | null
  workflowInputs: WorkflowInputs
  generatedWorkflow: string | null
  toolRecommendations: string | null
  implementationPlan: string | null
  isLoading: boolean
  error: string | null
}

// Lab content in Russian
const LAB_CONTENT = {
  title: "Конструктор персональных рабочих процессов",
  subtitle: "Интерактивная практика проектирования ИИ-workflow",
  objective: "Выявить повторяющуюся задачу из вашей работы и спроектировать ИИ-workflow для её автоматизации",
  timeTarget: "Время выполнения: 8-10 минут",
  successCriteria: [
    "Определили задачу с наивысшим потенциалом автоматизации",
    "Создали детальный 3-этапный workflow",
    "Получили конкретные рекомендации инструментов",
    "Разработали план внедрения на 7 дней"
  ]
}

const SCENARIO = {
  title: "Сценарий",
  description: "Вы — сотрудник ИТ-корпорации, которому нужно автоматизировать повторяющиеся рабочие задачи. Ваша цель — создать конкретный план действий по внедрению ИИ-workflow, который можно реализовать на этой неделе."
}

// Main lab component
export default function PersonalWorkflowBuilderLab() {
  const [state, setState] = useState<LabState>({
    currentStep: 1,
    userTasks: [{ description: '', frequency: '', duration: '' }], // Start with 1 empty task
    analysisResults: null,
    selectedTask: null,
    workflowInputs: { inputs: '', outputs: '', audience: '', requirements: '' },
    generatedWorkflow: null,
    toolRecommendations: null,
    implementationPlan: null,
    isLoading: false,
    error: null
  })

  // Debug initial state
  useEffect(() => {
    console.log('Initial state set:', state)
    console.log('Initial userTasks length:', state.userTasks.length)
    console.log('Initial userTasks:', state.userTasks)
  }, []) // Empty dependency array - runs only once on mount

  // Debug state changes
  useEffect(() => {
    console.log('State changed:', {
      isLoading: state.isLoading,
      error: state.error,
      analysisResults: state.analysisResults ? `present (length: ${state.analysisResults.length})` : 'null',
      currentStep: state.currentStep,
      userTasksLength: state.userTasks.length
    })
    
    // Additional debugging for analysisResults
    if (state.analysisResults) {
      console.log('Analysis results content preview:', state.analysisResults.substring(0, 200) + '...')
    }
  }, [state.isLoading, state.error, state.analysisResults, state.currentStep, state.userTasks.length])

  // Debug currentStep changes specifically
  useEffect(() => {
    console.log('🔄 Current step changed to:', state.currentStep)
  }, [state.currentStep])

  // Debug generatedWorkflow changes specifically
  useEffect(() => {
    console.log('🔄 Generated workflow changed:', state.generatedWorkflow ? `present (length: ${state.generatedWorkflow.length})` : 'null')
    if (state.generatedWorkflow) {
      console.log('Generated workflow preview:', state.generatedWorkflow.substring(0, 200) + '...')
    }
  }, [state.generatedWorkflow])

  // Component lifecycle logging
  useEffect(() => {
    console.log('PersonalWorkflowBuilderLab mounted')
    
    // Ensure we always have at least one task
    if (state.userTasks.length === 0) {
      console.log('No tasks found, adding initial task')
      setState(prev => ({
        ...prev,
        userTasks: [{ description: '', frequency: '', duration: '' }]
      }))
    }
    
    // Load persisted state from localStorage
    if (typeof window !== 'undefined') {
      const savedWorkflow = localStorage.getItem('pwb_lab_workflow')
      const savedStep = localStorage.getItem('pwb_lab_step')
      const savedAnalysis = localStorage.getItem('pwb_lab_analysis')
      const savedToolRecs = localStorage.getItem('pwb_lab_tool_recs')
      const savedImplPlan = localStorage.getItem('pwb_lab_impl_plan')
      
      if (savedWorkflow) {
        console.log('Restoring saved workflow from localStorage')
        setState(prev => ({ ...prev, generatedWorkflow: savedWorkflow }))
      }
      if (savedStep) {
        const step = parseInt(savedStep) as 1 | 2 | 3 | 4 | 5 | 6
        console.log('Restoring saved step from localStorage:', step)
        setState(prev => ({ ...prev, currentStep: step }))
      }
      if (savedAnalysis) {
        console.log('Restoring saved analysis from localStorage')
        setState(prev => ({ ...prev, analysisResults: savedAnalysis }))
      }
      if (savedToolRecs) {
        console.log('Restoring saved tool recommendations from localStorage')
        setState(prev => ({ ...prev, toolRecommendations: savedToolRecs }))
      }
      if (savedImplPlan) {
        console.log('Restoring saved implementation plan from localStorage')
        setState(prev => ({ ...prev, implementationPlan: savedImplPlan }))
      }
    }
    
    return () => {
      console.log('PersonalWorkflowBuilderLab unmounted')
    }
  }, []) // Empty dependency array - runs only once on mount

  // Persist important state to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (state.generatedWorkflow) {
        localStorage.setItem('pwb_lab_workflow', state.generatedWorkflow)
      }
      if (state.currentStep > 1) {
        localStorage.setItem('pwb_lab_step', state.currentStep.toString())
      }
      if (state.analysisResults) {
        localStorage.setItem('pwb_lab_analysis', state.analysisResults)
      }
      if (state.toolRecommendations) {
        localStorage.setItem('pwb_lab_tool_recs', state.toolRecommendations)
      }
      if (state.implementationPlan) {
        localStorage.setItem('pwb_lab_impl_plan', state.implementationPlan)
      }
    }
  }, [state.generatedWorkflow, state.currentStep, state.analysisResults, state.toolRecommendations, state.implementationPlan])

  // Prevent multiple simultaneous API calls
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [analysisProgress, setAnalysisProgress] = useState<string>('')

  // Debug component re-renders
  console.log('PersonalWorkflowBuilderLab render - current state:', {
    isLoading: state.isLoading,
    error: state.error,
    analysisResults: state.analysisResults ? `present (length: ${state.analysisResults.length})` : 'null',
    currentStep: state.currentStep,
    userTasksLength: state.userTasks.length,
    isSubmitting
  })

  // Debug setState calls
  const debugSetState = (updater: any, description: string) => {
    console.log(`🔄 setState called: ${description}`)
    if (typeof updater === 'function') {
      const prevState = state
      const newState = updater(prevState)
      console.log('Previous state:', prevState)
      console.log('New state:', newState)
      return newState
    } else {
      console.log('New state:', updater)
      return updater
    }
  }

  const setStateWithDebug = (updater: (prev: LabState) => LabState | LabState, description: string) => {
    const newState = debugSetState(updater, description)
    setState(newState)
  }

  const handleTaskSubmit = async () => {
    if (state.userTasks.length < 3 || isSubmitting) return

    console.log('=== handleTaskSubmit START ===')
    console.log('Current state:', state)
    console.log('isSubmitting:', isSubmitting)

    setIsSubmitting(true)
    setStateWithDebug(prev => ({ ...prev, isLoading: true, error: null }), 'Setting loading state to true')
    
    // Add timeout to prevent infinite loading
    const timeoutId = setTimeout(() => {
      console.log('Timeout triggered - API call took too long')
      setStateWithDebug(prev => ({ 
        ...prev, 
        isLoading: false,
        error: 'Превышено время ожидания. Проверьте подключение к интернету и попробуйте еще раз.'
      }), 'Timeout triggered - setting error state')
      setIsSubmitting(false)
    }, 60000) // 60 second timeout (increased from 30)
    
    try {
      console.log('=== API CONNECTIVITY TEST START ===')
      setAnalysisProgress('Проверяем подключение к API...')
      
      const testRes = await fetch('/api/openai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          contextPrompt: "Тест API", 
          testQuestion: "Ответь 'API работает'", 
          model: 'gpt-4o-mini' 
        })
      })
      
      console.log('Test API response status:', testRes.status)
      console.log('Test API response ok:', testRes.ok)
      
      if (!testRes.ok) {
        const errorText = await testRes.text()
        console.error('Test API error response:', errorText)
        throw new Error(`Test API call failed: ${testRes.status} - ${errorText}`)
      }
      
      const testData = await testRes.json()
      console.log('Test API response data:', testData)
      
      if (!testData.content) {
        console.error('Test API returned no content:', testData)
        throw new Error('Test API returned no content')
      }
      
      console.log('=== API CONNECTIVITY TEST PASSED ===')
      console.log('Proceeding with main analysis...')
      setAnalysisProgress('Анализируем ваши задачи...')
      
    } catch (err) {
      console.error('=== API CONNECTIVITY TEST FAILED ===')
      console.error('Error details:', err)
      clearTimeout(timeoutId)
      setStateWithDebug(prev => ({ 
        ...prev, 
        error: `Ошибка подключения к API: ${err instanceof Error ? err.message : 'Неизвестная ошибка'}. Проверьте настройки API.`,
        isLoading: false 
      }), 'Setting error state after API connectivity test failure')
      setIsSubmitting(false)
      return
    }
    
    console.log('=== MAIN ANALYSIS START ===')
    setAnalysisProgress('Отправляем запрос на анализ...')
    
    const analysisPrompt = `Вы эксперт по автоматизации рабочих процессов с помощью ИИ-инструментов. Ваша задача - создать автоматизацию, используя ИМЕННО ИИ-технологии (языковые модели, ИИ-функции), а НЕ традиционные инструменты бизнес-аналитики.

ЗАДАЧИ:
${state.userTasks.map((task, i) => `${i + 1}. ${task.description} (${task.frequency}, ${task.duration})`).join('\n')}

ВАЖНО: Фокусируйтесь на автоматизации с помощью ИИ-инструментов:
- ChatGPT, Claude, Gemini для обработки текста
- ИИ-функции в Google Sheets (=AI, =GOOGLETRANSLATE, etc.)
- ИИ-дополнения для Excel (Copilot, Power Query с ИИ)
- Zapier/Make с ИИ-шагами
- Prompt-инжиниринг для автоматизации

НЕ рекомендуйте: Power BI, Tableau, традиционные BI-инструменты, сложные программы аналитики без ИИ-компонентов.

Для каждой задачи оцените по шкале 1-5:
1. Частота (1=раз в месяц, 5=ежедневно+)
2. Предсказуемость (1=очень переменная, 5=одни и те же шаги каждый раз)
3. Интенсивность языка/данных (1=минимальная обработка текста/данных, 5=интенсивная обработка)
4. Влияние на время (1=экономия <10 мин, 5=экономия часов)
5. Возможность автоматизации (1=требует человеческих суждений, 5=легко автоматизируется)

ВАЖНО: Ответьте ТОЛЬКО в этом JSON формате, без дополнительного текста:

{
  "task1": {
    "name": "извлечённое название задачи",
    "scores": {"frequency": X, "predictability": X, "languageIntensity": X, "timeImpact": X, "feasibility": X},
    "totalScore": X,
    "strengths": "почему хорошо для ИИ",
    "challenges": "потенциальные проблемы"
  },
  "task2": {
    "name": "извлечённое название задачи",
    "scores": {"frequency": X, "predictability": X, "languageIntensity": X, "timeImpact": X, "feasibility": X},
    "totalScore": X,
    "strengths": "почему хорошо для ИИ",
    "challenges": "потенциальные проблемы"
  },
  "task3": {
    "name": "извлечённое название задачи",
    "scores": {"frequency": X, "predictability": X, "languageIntensity": X, "timeImpact": X, "feasibility": X},
    "totalScore": X,
    "strengths": "почему хорошо для ИИ",
    "challenges": "потенциальные проблемы"
  }
}

Не добавляйте никакого текста до или после JSON. Только валидный JSON.`

    try {
      console.log('Submitting analysis prompt...')
      console.log('Current state before API call:', { isLoading: state.isLoading, error: state.error })
      
      // Use the same API format as the working context-window-lab
      const res = await fetch('/api/openai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          contextPrompt: analysisPrompt, 
          testQuestion: "Проанализируйте эти задачи на потенциал автоматизации с ИИ", 
          model: 'gpt-4o-mini' 
        })
      })
      
      console.log('Main analysis API response status:', res.status)
      console.log('Main analysis API response ok:', res.ok)
      
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        console.error('Main analysis API error response:', err)
        throw new Error(`Main analysis API call failed: ${res.status} - ${err?.details || 'Unknown error'}`)
      }
      
      const data = await res.json()
      console.log('Main analysis API response data:', data)
      
      const response = data?.content || 'Ошибка получения ответа'
      
      console.log('Analysis response received, length:', response.length)
      console.log('Response preview:', response.substring(0, 200) + '...')
      
      clearTimeout(timeoutId)
      
      console.log('Setting state with analysis results and advancing to step 2...')
      setState(prev => {
        console.log('Previous state:', prev)
        const newState = { 
          ...prev, 
          analysisResults: response,
          isLoading: false,
          error: null,
          currentStep: 2 as 1 | 2 | 3 | 4 | 5 | 6
        }
        console.log('New state:', newState)
        return newState
      })
      
      console.log('State update completed')
      setIsSubmitting(false)
      
      // Add a small delay to ensure state is properly updated before logging
      setTimeout(() => {
        console.log('State after update (delayed check):', {
          analysisResults: state.analysisResults ? `present (length: ${state.analysisResults.length})` : 'null',
          currentStep: state.currentStep
        })
      }, 100)
      
    } catch (err) {
      console.error('=== MAIN ANALYSIS ERROR ===')
      console.error('Error details:', err)
      clearTimeout(timeoutId)
      
      // Provide fallback response for testing
      const fallbackResponse = `Анализ ваших задач показал следующее:

**Задача 1: [Описание задачи]**
- Оценка автоматизации: 18/25
- Ключевые преимущества: Высокая частота выполнения, предсказуемые шаги
- Потенциальные сложности: Может потребовать человеческой проверки

**Задача 2: [Описание задачи]**
- Оценка автоматизации: 15/25
- Ключевые преимущества: Обработка текста, структурированный результат
- Потенциальные сложности: Разнообразие входных данных

**Задача 3: [Описание задачи]**
- Оценка автоматизации: 12/25
- Ключевые преимущества: Повторяющийся процесс
- Потенциальные сложности: Требует контекстного понимания

**Рекомендация:** Сосредоточьтесь на Задаче 1 для вашего первого ИИ-workflow.`
      
      setStateWithDebug(prev => ({ 
        ...prev, 
        analysisResults: fallbackResponse,
        isLoading: false,
        error: null
      }), 'Setting state with fallback analysis results')
      setIsSubmitting(false)
    }
  }

  const handleWorkflowGeneration = async () => {
    if (!state.selectedTask || !state.workflowInputs.inputs || !state.workflowInputs.outputs || !state.workflowInputs.audience) return

    setState(prev => ({ ...prev, isLoading: true }))
    
    const workflowPrompt = `Вы эксперт по автоматизации рабочих процессов с помощью ИИ-инструментов. Ваша задача - создать автоматизацию, используя ИМЕННО ИИ-технологии (языковые модели, ИИ-функции), а НЕ традиционные инструменты бизнес-аналитики.

ЗАДАЧА: ${state.selectedTask.description}
ВХОДНЫЕ ДАННЫЕ: ${state.workflowInputs.inputs}
ЖЕЛАЕМЫЙ РЕЗУЛЬТАТ: ${state.workflowInputs.outputs}
АУДИТОРИЯ: ${state.workflowInputs.audience}
ТРЕБОВАНИЯ: ${state.workflowInputs.requirements}

ВАЖНО: Фокусируйтесь на автоматизации с помощью ИИ-инструментов:
- ChatGPT, Claude, Gemini для обработки текста
- ИИ-функции в Google Sheets (=AI, =GOOGLETRANSLATE, etc.)
- ИИ-дополнения для Excel (Copilot, Power Query с ИИ)
- Zapier/Make с ИИ-шагами
- Prompt-инжиниринг для автоматизации

НЕ рекомендуйте: Power BI, Tableau, традиционные BI-инструменты, сложные программы аналитики без ИИ-компонентов.

Создайте workflow с этой точной структурой:

## Этап 1: ИИ-подготовка данных
- Что: [конкретные шаги с использованием ИИ-инструментов]
- Время: [оценочные минуты]
- ИИ-инструменты: [конкретные ИИ-функции/инструменты]
- Промпт-пример: [пример промпта для этого этапа]

## Этап 2: ИИ-обработка и анализ
- Что: [описание ИИ-обработки данных]
- ИИ-инструмент: [конкретный ИИ-инструмент]
- Шаблон промпта: 
\`\`\`
Роль: [роль для ИИ]
Цель: [что должен сделать ИИ]
Входные данные: [что дать ИИ]
Формат вывода: [как должен выглядеть результат]
Ограничения: [рамки и требования]
\`\`\`
- Время: [оценочные минуты]

## Этап 3: ИИ-финализация и форматирование
- Что: [финальная ИИ-обработка для готового результата]
- ИИ-инструменты: [конкретные ИИ-функции]
- Проверочный промпт: [промпт для проверки качества]
- Время: [оценочные минуты]

## Анализ экономии времени
- Время текущего процесса: [оценка]
- Время ИИ-процесса: [сумма этапов]
- Еженедельная экономия: [расчёт]
- Месячная экономия: [еженедельная * 4]

Убедитесь, что ВСЕ рекомендации используют ИИ-технологии, а не традиционную аналитику.`

    try {
      const res = await fetch('/api/openai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          contextPrompt: workflowPrompt, 
          testQuestion: "Создайте детальный 3-этапный workflow для автоматизации этой задачи", 
          model: 'gpt-4o-mini' 
        })
      })
      
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err?.details || `API error: ${res.status}`)
      }
      
      const data = await res.json()
      const response = data?.content || 'Ошибка получения ответа'
      
      console.log('About to set state with workflow generation results...')
      console.log('Response content length:', response.length)
      console.log('Response preview:', response.substring(0, 200) + '...')
      
      setState(prev => {
        console.log('Previous state before workflow update:', prev)
        const newState = { 
          ...prev, 
          generatedWorkflow: response,
          isLoading: false,
          currentStep: 4 as 1 | 2 | 3 | 4 | 5 | 6
        }
        console.log('New state for workflow update:', newState)
        return newState
      })
      
      console.log('Workflow generation completed and advanced to step 4')
      console.log('Generated workflow content length:', response.length)
      console.log('Generated workflow preview:', response.substring(0, 200) + '...')
      
      // Add a small delay to ensure state is properly updated before logging
      setTimeout(() => {
        console.log('State after workflow generation (delayed check):', {
          generatedWorkflow: state.generatedWorkflow ? `present (length: ${state.generatedWorkflow.length})` : 'null',
          currentStep: state.currentStep
        })
      }, 100)
      
    } catch (err) {
      setStateWithDebug(prev => ({ 
        ...prev, 
        error: 'Ошибка генерации workflow',
        isLoading: false 
      }), 'Setting error state after workflow generation failure')
    }
  }

  const handleToolRecommendations = async () => {
    if (!state.selectedTask) return

    setStateWithDebug(prev => ({ ...prev, isLoading: true }), 'Setting loading state for tool recommendations')
    
    const toolPrompt = `На основе этого workflow: ${state.generatedWorkflow}

Порекомендуйте ТОЛЬКО ИИ-инструменты для автоматизации. Исключите традиционные BI-инструменты.

РАЗРЕШЕННЫЕ категории инструментов:
1. ИИ-ассистенты: ChatGPT, Claude, Gemini, Copilot
2. ИИ-функции в таблицах: Google Sheets AI, Excel Copilot
3. ИИ-автоматизация: Zapier с ИИ-шагами, Make с ИИ
4. ИИ-дополнения: Office 365 Copilot, Google Workspace AI
5. Специализированные ИИ: для транскрипции, перевода, анализа текста

ЗАПРЕЩЕННЫЕ инструменты: Power BI, Tableau, Qlik, традиционные ETL-инструменты, сложные аналитические платформы БЕЗ ИИ-компонентов.

Для задачи "${state.selectedTask.description}" порекомендуйте:

## Основная рекомендация: [ИИ-инструмент]
- Почему именно ИИ-решение: [конкретные ИИ-возможности]
- ИИ-функции для использования: [список конкретных функций]
- Пример промпта: [готовый к использованию промпт]
- Стоимость: [бесплатно/платно]
- Кривая обучения: [легко/средне/сложно]

## Альтернативные ИИ-варианты:
1. [ИИ-инструмент 2]: [почему может подойти + ИИ-возможности]
2. [ИИ-инструмент 3]: [почему может подойти + ИИ-возможности]

## ИИ-интеграция:
Как соединить ИИ-инструменты в автоматизированный поток:
[Источник данных] → [ИИ-обработка] → [ИИ-форматирование] → [Результат]

## Готовые промпты для использования:
1. Промпт для подготовки данных: [готовый промпт]
2. Промпт для анализа: [готовый промпт] 
3. Промпт для форматирования: [готовый промпт]

## Заметка о данных:
[Рекомендации по безопасности для ИИ-инструментов]

Фокусируйтесь ТОЛЬКО на ИИ-решениях, которые используют языковые модели и машинное обучение.`

    try {
      const res = await fetch('/api/openai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          contextPrompt: toolPrompt, 
          testQuestion: "Рекомендуйте инструменты для автоматизации этой задачи", 
          model: 'gpt-4o-mini' 
        })
      })
      
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err?.details || `API error: ${res.status}`)
      }
      
      const data = await res.json()
      const response = data?.content || 'Ошибка получения ответа'
      
      setState(prev => ({ 
        ...prev, 
        toolRecommendations: response,
        isLoading: false
      }))
      
      console.log('Tool recommendations completed, staying on step 5')
      
    } catch (err) {
      setStateWithDebug(prev => ({ 
        ...prev, 
        error: 'Ошибка получения рекомендаций',
        isLoading: false 
      }), 'Setting error state after tool recommendations failure')
    }
  }

  const handleImplementationPlan = async () => {
    if (!state.selectedTask) return

    setStateWithDebug(prev => ({ ...prev, isLoading: true }), 'Setting loading state for implementation plan')
    
    const planPrompt = `Создайте 7-дневный план внедрения для этой задачи:

ЗАДАЧА: ${state.selectedTask.description}
ИНСТРУМЕНТ: ${state.toolRecommendations ? 'Рекомендуемый инструмент' : 'ИИ-инструмент'}

Создайте план с этой структурой:

## День 1-2: Настройка
- [ ] Конкретные задачи настройки
- [ ] Время: X минут

## День 3-4: Тестирование  
- [ ] Конкретные задачи тестирования
- [ ] Время: X минут

## День 5-7: Внедрение
- [ ] Конкретные задачи внедрения
- [ ] Время: X минут

## Метрики успеха
- Что отслеживать
- Как измерять

## Следующие шаги
- Конкретные действия после завершения`

    try {
      const res = await fetch('/api/openai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          contextPrompt: planPrompt, 
          testQuestion: "Создайте 7-дневный план внедрения для этой задачи", 
          model: 'gpt-4o-mini' 
        })
      })
      
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err?.details || `API error: ${res.status}`)
      }
      
      const data = await res.json()
      const response = data?.content || 'Ошибка получения ответа'
      
      setState(prev => ({ 
        ...prev, 
        implementationPlan: response,
        isLoading: false,
        currentStep: 6 as 1 | 2 | 3 | 4 | 5 | 6
      }))
      
      console.log('Implementation plan completed on step 6')
      
    } catch (err) {
      setStateWithDebug(prev => ({ 
        ...prev, 
        error: 'Ошибка создания плана',
        isLoading: false 
      }), 'Setting error state after implementation plan failure')
    }
  }

  const nextStep = () => {
    setState(prev => ({ ...prev, currentStep: Math.min(6, prev.currentStep + 1) as any }))
  }

  const prevStep = () => {
    setState(prev => ({ ...prev, currentStep: Math.max(1, prev.currentStep - 1) as any }))
  }

  const addTask = () => {
    if (state.userTasks.length < 3) {
      setState(prev => ({
        ...prev,
        userTasks: [...prev.userTasks, { description: '', frequency: '', duration: '' }]
      }))
    }
  }

  const updateTask = (index: number, field: keyof Task, value: string) => {
    setState(prev => ({
      ...prev,
      userTasks: prev.userTasks.map((task, i) => 
        i === index ? { ...task, [field]: value } : task
      )
    }))
  }

  const removeTask = (index: number) => {
    // Prevent removing the last task - always keep at least one
    if (state.userTasks.length > 1) {
      setState(prev => ({
        ...prev,
        userTasks: prev.userTasks.filter((_, i) => i !== index)
      }))
    }
  }

  const canProceedToStep2 = state.userTasks.length >= 3 && 
    state.userTasks.every(task => task.description.trim().length > 5 && task.frequency.trim().length > 0 && task.duration.trim().length > 0)

  const canProceedToStep4 = state.selectedTask && 
    state.workflowInputs.inputs && 
    state.workflowInputs.outputs && 
    state.workflowInputs.audience

  const progress = (state.currentStep / 6) * 100

  // Format JSON response for better readability
  const formatAnalysisResults = (results: string) => {
    try {
      // Extract JSON from the response (handle cases where there's extra text)
      let jsonString = results
      
      // Remove markdown code blocks if present
      jsonString = jsonString.replace(/```json\n?|\n?```/g, '')
      
      // Find the JSON object boundaries
      const jsonStart = jsonString.indexOf('{')
      const jsonEnd = jsonString.lastIndexOf('}')
      
      if (jsonStart === -1 || jsonEnd === -1) {
        throw new Error('No valid JSON found in response')
      }
      
      // Extract only the JSON portion
      jsonString = jsonString.substring(jsonStart, jsonEnd + 1)
      
      console.log('Extracted JSON string:', jsonString.substring(0, 200) + '...')
      
      // Parse the JSON
      const jsonData = JSON.parse(jsonString)
      
      // Extract recommendation text (everything after the JSON)
      const recommendationText = results.substring(jsonEnd + 1).trim()
      
      // Clean up the recommendation text
      const cleanRecommendation = recommendationText
        .replace(/^[^а-яё]*/i, '') // Remove non-Russian text at the beginning
        .replace(/```.*$/, '') // Remove any remaining markdown code blocks
        .replace(/^\s*[}\s]*/, '') // Remove any leftover JSON closing braces and whitespace
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // Convert markdown bold to HTML bold
        .replace(/\(task\d+\)/gi, '') // Remove English task references like (task2)
        .trim()
      
      console.log('Original recommendation text:', recommendationText)
      console.log('Cleaned recommendation text:', cleanRecommendation)
      
      return (
        <div className="space-y-6">
          <div className="bg-blue-50 dark:bg-blue-950/20 border-l-4 border-blue-500 p-4 rounded-r-lg">
            <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">
              📊 Анализ потенциала автоматизации
            </h3>
            <p className="text-blue-800 dark:text-blue-200">
              Я проанализировал ваши задачи и оценил их по 5 критериям (максимум 25 баллов).
            </p>
          </div>
          
          <div className="bg-amber-50 dark:bg-amber-950/20 border-l-4 border-amber-500 p-4 rounded-r-lg">
            <h4 className="text-lg font-semibold text-amber-900 dark:text-amber-100 mb-2">
              🎯 Выберите задачу для автоматизации
            </h4>
            <p className="text-amber-800 dark:text-amber-200">
              Кликните на задачу, которую хотите автоматизировать. Рекомендуется выбрать задачу с наивысшим баллом.
            </p>
          </div>
          
          {Object.entries(jsonData).map(([taskKey, taskData]: [string, any]) => (
            <div key={taskKey} className={`border rounded-lg p-4 cursor-pointer transition-all ${
              state.selectedTask?.description === taskData.name 
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/20' 
                : 'bg-gray-50 dark:bg-gray-900/20 hover:border-gray-300'
            }`} onClick={() => setState(prev => ({ ...prev, selectedTask: { 
              description: taskData.name, 
              frequency: 'регулярно', 
              duration: 'зависит от задачи' 
            }}))}>
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  {taskData.name}
                </h4>
                {state.selectedTask?.description === taskData.name && (
                  <div className="text-blue-600 dark:text-blue-400">
                    <CheckCircle className="w-5 h-5" />
                  </div>
                )}
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Частота:</span>
                    <span className="font-medium">{taskData.scores.frequency}/5</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Предсказуемость:</span>
                    <span className="font-medium">{taskData.scores.predictability}/5</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Интенсивность данных:</span>
                    <span className="font-medium">{taskData.scores.languageIntensity}/5</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Влияние на время:</span>
                    <span className="font-medium">{taskData.scores.timeImpact}/5</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Возможность автоматизации:</span>
                    <span className="font-medium">{taskData.scores.feasibility}/5</span>
                  </div>
                </div>
                
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                    {taskData.totalScore}/25
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Общий балл
                  </div>
                </div>
              </div>
              
              <div className="space-y-3">
                <div>
                  <h5 className="font-medium text-green-700 dark:text-green-300 mb-1">✅ Преимущества:</h5>
                  <p className="text-sm text-gray-700 dark:text-gray-300">{taskData.strengths}</p>
                </div>
                <div>
                  <h5 className="font-medium text-amber-700 dark:text-amber-300 mb-1">⚠️ Сложности:</h5>
                  <p className="text-sm text-gray-700 dark:text-gray-300">{taskData.challenges}</p>
                </div>
              </div>
            </div>
          ))}
          
          <div className="bg-green-50 dark:bg-green-950/20 border-l-4 border-green-500 p-4 rounded-r-lg">
            <h3 className="text-lg font-semibold text-green-900 dark:text-green-100 mb-2">
              🎯 Рекомендация
            </h3>
            <div 
              className="text-green-800 dark:text-green-200"
              dangerouslySetInnerHTML={{ __html: cleanRecommendation || 'Сосредоточьтесь на задаче с наивысшим баллом для вашего первого ИИ-workflow.' }}
            />
          </div>
        </div>
      )
    } catch (error) {
      // Fallback to raw display if JSON parsing fails
      console.warn('Failed to parse JSON, falling back to raw display:', error)
      console.log('Raw response that failed to parse:', results)
      
      // Try to provide a more helpful fallback
      return (
        <div className="space-y-6">
          <div className="bg-red-50 dark:bg-red-950/20 border-l-4 border-red-500 p-4 rounded-r-lg">
            <h3 className="text-lg font-semibold text-red-900 dark:text-red-100 mb-2">
              ⚠️ Ошибка анализа
            </h3>
            <p className="text-red-800 dark:text-red-200">
              Не удалось обработать результаты анализа. Пожалуйста, попробуйте еще раз.
            </p>
          </div>
          
          <div className="prose dark:prose-invert max-w-none">
            <h4 className="text-lg font-semibold mb-3">Полученный ответ:</h4>
            <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded text-sm">
              <pre className="whitespace-pre-wrap">{results}</pre>
            </div>
          </div>
          
          <div className="flex justify-center">
            <Button onClick={() => window.location.reload()} variant="outline">
              Обновить страницу и попробовать снова
            </Button>
          </div>
        </div>
      )
    }
  }

  // Format markdown content for proper HTML rendering
  const formatMarkdownContent = (content: string) => {
    return content
      // Convert markdown headers to HTML (styling handled by CSS)
      .replace(/^## (.*$)/gim, '<h2>$1</h2>')
      .replace(/^### (.*$)/gim, '<h3>$1</h3>')
      .replace(/^#### (.*$)/gim, '<h4>$1</h4>')
      // Convert markdown bold to HTML
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      // Convert markdown italic to HTML
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      // Convert markdown lists to regular paragraphs (remove bullet points)
      .replace(/^- (.*$)/gim, '<p class="mb-2">$1</p>')
      .replace(/^(\d+)\. (.*$)/gim, '<p class="mb-2">$1. $2</p>')
      // Convert single newlines to line breaks
      .replace(/\n/g, '<br>')
      // Clean up extra line breaks
      .replace(/<br><br>/g, '<br>')
      // Clean up line breaks before paragraphs
      .replace(/<br>(<p)/g, '$1')
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold">{LAB_CONTENT.title}</h1>
        <p className="text-xl text-gray-600 dark:text-gray-400">{LAB_CONTENT.subtitle}</p>
        <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
          <Clock className="w-4 h-4" />
          <span>{LAB_CONTENT.timeTarget}</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>Шаг {state.currentStep} из 6</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <Progress value={progress} className="w-full" />
      </div>

      {/* Scenario Panel */}
      <ScenarioPanel 
        title={SCENARIO.title}
        description={SCENARIO.description}
      />

      {/* Step Content */}
      {state.currentStep === 1 && (
        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-4">Шаг 1: Обнаружение задач</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Опишите 3 задачи, которые вы выполняете регулярно (еженедельно или чаще) и которые кажутся повторяющимися или трудозатратными.
          </p>
          
          <div className="space-y-4">
            {state.userTasks.map((task, index) => (
              <div key={index} className="border rounded-lg p-4 space-y-3">
                <div className="flex justify-between items-center">
                  <h3 className="font-medium">Задача {index + 1}</h3>
                  {state.userTasks.length > 1 && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removeTask(index)}
                    >
                      Удалить
                    </Button>
                  )}
                </div>
                
                <div className="space-y-3">
                  <div>
                    <label htmlFor={`task-description-${index}`} className="block text-sm font-medium mb-1">Описание задачи</label>
                    <textarea
                      id={`task-description-${index}`}
                      name={`task-description-${index}`}
                      className="w-full p-2 border rounded-md"
                      placeholder="Опишите, в чём заключается задача..."
                      value={task.description}
                      onChange={(e) => updateTask(index, 'description', e.target.value)}
                      rows={3}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label htmlFor={`task-frequency-${index}`} className="block text-sm font-medium mb-1">Частота</label>
                      <input
                        id={`task-frequency-${index}`}
                        name={`task-frequency-${index}`}
                        type="text"
                        className="w-full p-2 border rounded-md"
                        placeholder="ежедневно, еженедельно..."
                        value={task.frequency}
                        onChange={(e) => updateTask(index, 'frequency', e.target.value)}
                      />
                    </div>
                    
                    <div>
                      <label htmlFor={`task-duration-${index}`} className="block text-sm font-medium mb-1">Время</label>
                      <input
                        id={`task-duration-${index}`}
                        name={`task-duration-${index}`}
                        type="text"
                        className="w-full p-2 border rounded-md"
                        placeholder="30 минут, 2 часа..."
                        value={task.duration}
                        onChange={(e) => updateTask(index, 'duration', e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {state.userTasks.length < 3 && (
              <Button onClick={addTask} variant="outline" className="w-full">
                + Добавить задачу
              </Button>
            )}
          </div>
          
          <div className="mt-6 flex justify-end">
            {/* Debug info */}
            <div className="mr-4 text-sm text-gray-500">
              <div>Задач: {state.userTasks.length}/3</div>
              <div>Валидных: {state.userTasks.filter(task => 
                task.description.trim().length > 5 && 
                task.frequency.trim().length > 0 && 
                task.duration.trim().length > 0
              ).length}/3</div>
            </div>
            <Button 
              onClick={handleTaskSubmit}
              disabled={!canProceedToStep2 || state.isLoading}
              className="ml-auto"
            >
              {state.isLoading 
                ? (analysisProgress || 'Анализируем...') 
                : state.analysisResults 
                  ? 'Продолжить к следующему шагу'
                  : 'Продолжить к анализу'
              }
            </Button>
          </div>
        </Card>
      )}

      {state.currentStep === 2 && (
        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-4">Шаг 2: Анализ результатов</h2>
          
          {/* Debug info */}
          <div className="mb-4 p-3 bg-gray-100 dark:bg-gray-800 rounded text-sm">
            <div>Debug: currentStep = {state.currentStep}</div>
            <div>Debug: analysisResults exists = {state.analysisResults ? 'Yes' : 'No'}</div>
            <div>Debug: analysisResults length = {state.analysisResults ? state.analysisResults.length : 'N/A'}</div>
            <div>Debug: isLoading = {state.isLoading ? 'Yes' : 'No'}</div>
            <div>Debug: error = {state.error || 'None'}</div>
          </div>
          
          {state.analysisResults ? (
            <div className="space-y-4">
              {formatAnalysisResults(state.analysisResults)}
              
              <div className="flex justify-between">
                <Button onClick={prevStep} variant="outline">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Назад
                </Button>
                <Button onClick={nextStep}>
                  Следующий шаг
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-gray-100 mx-auto mb-4"></div>
              <p>Анализируем ваши задачи...</p>
            </div>
          )}
        </Card>
      )}

      {state.currentStep === 3 && (
        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-4">Шаг 3: Дизайн workflow</h2>
          
          {/* Debug info */}
          <div className="mb-4 p-3 bg-gray-100 dark:bg-gray-800 rounded text-sm">
            <div>Debug: currentStep = {state.currentStep}</div>
            <div>Debug: selectedTask = {state.selectedTask ? 'Yes' : 'No'}</div>
            <div>Debug: inputs = {state.workflowInputs.inputs ? 'Yes' : 'No'}</div>
            <div>Debug: outputs = {state.workflowInputs.outputs ? 'Yes' : 'No'}</div>
            <div>Debug: audience = {state.workflowInputs.audience ? 'Yes' : 'No'}</div>
            <div>Debug: canProceedToStep4 = {canProceedToStep4 ? 'Yes' : 'No'}</div>
            <div>Debug: isLoading = {state.isLoading ? 'Yes' : 'No'}</div>
          </div>
          
          {state.selectedTask && (
            <div className="bg-blue-50 dark:bg-blue-950/20 border-l-4 border-blue-500 p-4 rounded-r-lg mb-6">
              <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">
                🎯 Выбранная задача
              </h3>
              <p className="text-blue-800 dark:text-blue-200">
                <strong>{state.selectedTask.description}</strong>
              </p>
            </div>
          )}
          
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Давайте спроектируем ваш ИИ-workflow для выбранной задачи. Мне нужно немного больше деталей, чтобы создать лучший workflow для вас.
          </p>
          
          <div className="space-y-4">
            <div>
              <label htmlFor="workflow-inputs" className="block text-sm font-medium mb-1">Какие обычно входные данные для этой задачи?</label>
              <textarea
                id="workflow-inputs"
                name="workflow-inputs"
                className="w-full p-2 border rounded-md"
                placeholder="электронные письма, документы, данные, и т.д."
                value={state.workflowInputs.inputs}
                onChange={(e) => setState(prev => ({
                  ...prev,
                  workflowInputs: { ...prev.workflowInputs, inputs: e.target.value }
                }))}
                rows={3}
              />
            </div>
            
            <div>
              <label htmlFor="workflow-outputs" className="block text-sm font-medium mb-1">Как выглядит идеальный результат?</label>
              <textarea
                id="workflow-outputs"
                name="workflow-outputs"
                className="w-full p-2 border rounded-md"
                placeholder="формат, длина, стиль..."
                value={state.workflowInputs.outputs}
                onChange={(e) => setState(prev => ({
                  ...prev,
                  workflowInputs: { ...prev.workflowInputs, outputs: e.target.value }
                }))}
                rows={3}
              />
            </div>
            
            <div>
              <label htmlFor="workflow-audience" className="block text-sm font-medium mb-1">Кто является аудиторией для результата?</label>
              <input
                id="workflow-audience"
                name="workflow-audience"
                type="text"
                className="w-full p-2 border rounded-md"
                placeholder="руководство, клиенты, команда..."
                value={state.workflowInputs.audience}
                onChange={(e) => setState(prev => ({
                  ...prev,
                  workflowInputs: { ...prev.workflowInputs, audience: e.target.value }
                }))}
              />
            </div>
            
            <div>
              <label htmlFor="workflow-requirements" className="block text-sm font-medium mb-1">Есть ли какие-то специфические требования или ограничения?</label>
              <textarea
                id="workflow-requirements"
                name="workflow-requirements"
                className="w-full p-2 border rounded-md"
                placeholder="ограничения по времени, формату, безопасности..."
                value={state.workflowInputs.requirements}
                onChange={(e) => setState(prev => ({
                  ...prev,
                  workflowInputs: { ...prev.workflowInputs, requirements: e.target.value }
                }))}
                rows={2}
              />
            </div>
          </div>
          
          <div className="mt-6 flex justify-between">
            <Button onClick={prevStep} variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Назад
            </Button>
            <Button 
              onClick={handleWorkflowGeneration}
              disabled={!canProceedToStep4 || state.isLoading}
            >
              {state.isLoading ? 'Генерируем...' : 'Сгенерировать workflow'}
            </Button>
          </div>
        </Card>
      )}

      {state.currentStep === 4 && (
        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-4">Шаг 4: Сгенерированный workflow</h2>
          
          {/* Debug info */}
          <div className="mb-4 p-3 bg-gray-100 dark:bg-gray-800 rounded text-sm">
            <div>Debug: currentStep = {state.currentStep}</div>
            <div>Debug: generatedWorkflow exists = {state.generatedWorkflow ? 'Yes' : 'No'}</div>
            <div>Debug: generatedWorkflow length = {state.generatedWorkflow ? state.generatedWorkflow.length : 'N/A'}</div>
            <div>Debug: isLoading = {state.isLoading ? 'Yes' : 'No'}</div>
            <div>Debug: error = {state.error || 'None'}</div>
            <div className="mt-2">
              <Button 
                                  onClick={() => {
                    localStorage.removeItem('pwb_lab_workflow')
                    localStorage.removeItem('pwb_lab_step')
                    localStorage.removeItem('pwb_lab_analysis')
                    localStorage.removeItem('pwb_lab_tool_recs')
                    localStorage.removeItem('pwb_lab_impl_plan')
                    window.location.reload()
                  }}
                variant="outline"
                size="sm"
              >
                Clear localStorage & Restart
              </Button>
            </div>
          </div>
          
          {state.generatedWorkflow ? (
            <div className="space-y-4">
              <div className="bg-blue-50 dark:bg-blue-950/20 border-l-4 border-blue-500 p-4 rounded-r-lg">
                <p className="text-blue-800 dark:text-blue-200">
                  <strong>Отлично!</strong> На основе ваших требований, вот ваш индивидуальный ИИ-workflow.
                </p>
              </div>
              
              <div className="prose dark:prose-invert max-w-none">
                <div 
                  className="workflow-content ml-6"
                  dangerouslySetInnerHTML={{ __html: formatMarkdownContent(state.generatedWorkflow) }} 
                />
              </div>
              
              <div className="flex justify-between">
                <Button onClick={prevStep} variant="outline">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Назад
                </Button>
                <Button onClick={nextStep}>
                  Следующий шаг
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-gray-100 mx-auto mb-4"></div>
              <p>Генерируем ваш workflow...</p>
            </div>
          )}
        </Card>
      )}

      {state.currentStep === 5 && (
        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-4">Шаг 5: Рекомендации инструментов</h2>
          
          {/* Debug info */}
          <div className="mb-4 p-3 bg-gray-100 dark:bg-gray-800 rounded text-sm">
            <div>Debug: currentStep = {state.currentStep}</div>
            <div>Debug: toolRecommendations exists = {state.toolRecommendations ? 'Yes' : 'No'}</div>
            <div>Debug: toolRecommendations length = {state.toolRecommendations ? state.toolRecommendations.length : 'N/A'}</div>
            <div>Debug: isLoading = {state.isLoading ? 'Yes' : 'No'}</div>
            <div>Debug: error = {state.error || 'None'}</div>
          </div>
          
          {state.toolRecommendations ? (
            <div className="space-y-4">
              <div className="prose dark:prose-invert max-w-none">
                <div 
                  className="workflow-content ml-6"
                  dangerouslySetInnerHTML={{ __html: formatMarkdownContent(state.toolRecommendations) }} 
                />
              </div>
              
              <div className="flex justify-between">
                <Button onClick={prevStep} variant="outline">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Назад
                </Button>
                <Button onClick={nextStep}>
                  Следующий шаг
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-gray-600 dark:text-gray-400">
                Получите рекомендации по инструментам для вашего workflow.
              </p>
              
              <div className="flex justify-between">
                <Button onClick={prevStep} variant="outline">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Назад
                </Button>
                <Button 
                  onClick={handleToolRecommendations}
                  disabled={state.isLoading}
                >
                  {state.isLoading ? 'Получаем рекомендации...' : 'Получить рекомендации'}
                </Button>
              </div>
            </div>
          )}
        </Card>
      )}

      {state.currentStep === 6 && (
        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-4">Шаг 6: План внедрения и экспорт</h2>
          
          {/* Debug info */}
          <div className="mb-4 p-3 bg-gray-100 dark:bg-gray-800 rounded text-sm">
            <div>Debug: currentStep = {state.currentStep}</div>
            <div>Debug: implementationPlan exists = {state.implementationPlan ? 'Yes' : 'No'}</div>
            <div>Debug: implementationPlan length = {state.implementationPlan ? state.implementationPlan.length : 'N/A'}</div>
            <div>Debug: isLoading = {state.isLoading ? 'Yes' : 'No'}</div>
            <div>Debug: error = {state.error || 'None'}</div>
          </div>
          
          {state.implementationPlan ? (
            <div className="space-y-6">
              <div className="prose dark:prose-invert max-w-none">
                <div 
                  className="workflow-content ml-6"
                  dangerouslySetInnerHTML={{ __html: formatMarkdownContent(state.implementationPlan) }} 
                />
              </div>
              
              <div className="bg-green-50 dark:bg-green-950/20 border-l-4 border-green-500 p-4 rounded-r-lg">
                <h3 className="text-lg font-semibold text-green-800 dark:text-green-200 mb-2">
                  🎉 Поздравляем! Вы только что спроектировали ваш первый ИИ-workflow!
                </h3>
                <p className="text-green-700 dark:text-green-300">
                  У вас есть конкретный план действий, который можно внедрить на этой неделе.
                </p>
              </div>
              
              <div className="flex justify-between">
                <Button onClick={prevStep} variant="outline">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Назад
                </Button>
                <Button onClick={() => window.print()}>
                  <Download className="w-4 h-4 mr-2" />
                  Распечатать план
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-gray-600 dark:text-gray-400">
                Создайте детальный план внедрения вашего workflow.
              </p>
              
              <div className="flex justify-between">
                <Button onClick={prevStep} variant="outline">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Назад
                </Button>
                <Button 
                  onClick={handleImplementationPlan}
                  disabled={state.isLoading}
                >
                  {state.isLoading ? 'Создаём план...' : 'Создать план внедрения'}
                </Button>
              </div>
            </div>
          )}
        </Card>
      )}

      {/* Error Display */}
      {state.error && (
        <Card className="p-4 border-red-200 bg-red-50 dark:bg-red-950/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-red-800 dark:text-red-200">
              <AlertCircle className="w-5 h-5" />
              <span>{state.error}</span>
            </div>
            <Button 
              onClick={() => setState(prev => ({ ...prev, error: null }))}
              variant="outline"
              size="sm"
            >
              Закрыть
            </Button>
          </div>
        </Card>
      )}
    </div>
  )
}
