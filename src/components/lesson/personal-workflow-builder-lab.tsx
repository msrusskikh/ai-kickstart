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

// OpenAI API integration hook
const useOpenAI = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const submitPrompt = async (prompt: string, step: number): Promise<string> => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/openai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: prompt,
          model: "gpt-4o-mini",
          temperature: 0.7,
          max_tokens: 800
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
        2: `Анализ ваших задач показал следующее:

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

**Рекомендация:** Сосредоточьтесь на Задаче 1 для вашего первого ИИ-workflow.`,
        4: `Отлично! На основе ваших требований, вот ваш индивидуальный ИИ-workflow:

## **Ваш 3-этапный ИИ-Workflow**

### **Этап 1: Подготовка данных**
- **Что**: Сбор и структурирование входных данных
- **Время**: 5 минут
- **Инструменты**: Google Sheets, Excel

### **Этап 2: ИИ-обработка**
- **Что**: Автоматическая обработка с помощью ИИ
- **Шаблон промпта**: Используйте структуру Роль→Цель→Шаги→Ограничения→Стандарт качества
- **Время**: 2 минуты

### **Этап 3: Проверка и финализация**
- **Что**: Контроль качества и финальные корректировки
- **Ключевые моменты для проверки**: Точность, полнота, соответствие требованиям
- **Время**: 3 минуты

## **Ожидаемая экономия времени**
- **Текущее время**: 30 минут
- **Время нового процесса**: 10 минут
- **Еженедельная экономия**: 100 минут
- **Месячная экономия**: 400 минут`,
        5: `## **Рекомендуемые инструменты для вашего workflow**

### **Основная рекомендация: ChatGPT**
- **Почему**: Отлично подходит для обработки текста и структурирования данных
- **Стоимость**: Бесплатный план доступен
- **Кривая обучения**: Легко
- **Лучше всего для**: Анализа, резюмирования, структурирования

### **Альтернативные варианты:**
1. **Claude**: Более детальный анализ, но требует подписки
2. **Gemini**: Хорошая интеграция с Google Workspace

### **Интеграция:**
Если вы хотите автоматизировать дальше, можете соединить:
- Google Sheets → ChatGPT → Готовый результат
- Используя: Zapier или Make

**Заметка о безопасности данных:** Для корпоративных данных используйте только одобренные внутренние инструменты.`,
        6: `## **Ваш 7-дневный план внедрения**

### **День 1-2: Настройка**
- [ ] Зарегистрироваться в ChatGPT
- [ ] Собрать примеры входных данных для тестирования
- [ ] Настроить рабочее пространство/папки
- **Необходимое время**: 30 минут

### **День 3-4: Тестирование**
- [ ] Протестировать workflow на 2-3 реальных примерах
- [ ] Доработать шаблон промпта
- [ ] Задокументировать, что работает лучше всего
- **Необходимое время**: 45 минут

### **День 5-7: Внедрение**
- [ ] Запустить workflow для реальной работы
- [ ] Отслеживать экономию времени
- [ ] Поделиться результатами с командой (опционально)
- **Необходимое время**: Обычное время задачи (но автоматизированное!)

## **Метрики успеха**
Отслеживайте это для измерения вашего успеха:
- Время, сэкономленное на задачу
- Качество по сравнению с ручной работой
- Консистентность результатов
- Обратная связь команды (если делитесь)

## **Следующие шаги**
1. **Начать немедленно**: Попробуйте workflow на этой неделе
2. **Итерировать**: Корректируйте на основе результатов
3. **Масштабировать**: Применяйте полученные знания к другим задачам
4. **Делиться**: Рассказывайте коллегам о ваших победах`
      }
      
      return fallbackResponses[step as keyof typeof fallbackResponses] || fallbackResponses[2]
    } finally {
      setIsLoading(false)
    }
  }

  return { submitPrompt, isLoading, error }
}

// Main lab component
export default function PersonalWorkflowBuilderLab() {
  const [state, setState] = useState<LabState>({
    currentStep: 1,
    userTasks: [],
    analysisResults: null,
    selectedTask: null,
    workflowInputs: { inputs: '', outputs: '', audience: '', requirements: '' },
    generatedWorkflow: null,
    toolRecommendations: null,
    implementationPlan: null,
    isLoading: false,
    error: null
  })

  const { submitPrompt, isLoading, error } = useOpenAI()

  const handleTaskSubmit = async () => {
    if (state.userTasks.length < 3) return

    setState(prev => ({ ...prev, isLoading: true }))
    
    const analysisPrompt = `Вы эксперт по автоматизации рабочих процессов с ИИ. Проанализируйте эти рабочие задачи на потенциал автоматизации:

ЗАДАЧИ:
${state.userTasks.map((task, i) => `${i + 1}. ${task.description} (${task.frequency}, ${task.duration})`).join('\n')}

Для каждой задачи оцените по шкале 1-5:
1. Частота (1=раз в месяц, 5=ежедневно+)
2. Предсказуемость (1=очень переменная, 5=одни и те же шаги каждый раз)
3. Интенсивность языка/данных (1=минимальная обработка текста/данных, 5=интенсивная обработка)
4. Влияние на время (1=экономия <10 мин, 5=экономия часов)
5. Возможность автоматизации (1=требует человеческих суждений, 5=легко автоматизируется)

Ответьте в этом JSON формате:
{
  "task1": {
    "name": "извлечённое название задачи",
    "scores": {"frequency": X, "predictability": X, "languageIntensity": X, "timeImpact": X, "feasibility": X},
    "totalScore": X,
    "strengths": "почему хорошо для ИИ",
    "challenges": "потенциальные проблемы"
  },
  "task2": {...},
  "task3": {...}
}

Порекомендуйте задачу с наивысшим баллом для автоматизации.`

    try {
      const response = await submitPrompt(analysisPrompt, 2)
      setState(prev => ({ 
        ...prev, 
        analysisResults: response,
        isLoading: false 
      }))
    } catch (err) {
      setState(prev => ({ 
        ...prev, 
        error: 'Ошибка анализа задач',
        isLoading: false 
      }))
    }
  }

  const handleWorkflowGeneration = async () => {
    if (!state.selectedTask || !state.workflowInputs.inputs || !state.workflowInputs.outputs || !state.workflowInputs.audience) return

    setState(prev => ({ ...prev, isLoading: true }))
    
    const workflowPrompt = `Вы дизайнер ИИ-рабочих процессов. Создайте детальный 3-этапный workflow для этой задачи:

ЗАДАЧА: ${state.selectedTask.description}
ВХОДНЫЕ ДАННЫЕ: ${state.workflowInputs.inputs}
ЖЕЛАЕМЫЙ РЕЗУЛЬТАТ: ${state.workflowInputs.outputs}
АУДИТОРИЯ: ${state.workflowInputs.audience}
ТРЕБОВАНИЯ: ${state.workflowInputs.requirements}

Создайте workflow с этой точной структурой:

## Этап 1: Подготовка данных
- Что: [конкретные шаги подготовки]
- Время: [оценочные минуты]
- Инструменты: [рекомендуемые инструменты]

## Этап 2: ИИ-обработка
- Что: [описание задачи для ИИ]
- Шаблон промпта: [конкретный промпт, использующий Роль→Цель→Шаги→Ограничения→Стандарт качества]
- Время: [оценочные минуты]

## Этап 3: Проверка и финализация
- Что: [шаги проверки качества]
- Чек-лист проверки: [конкретные пункты для проверки]
- Время: [оценочные минуты]

## Анализ экономии времени
- Время текущего процесса: [оценка]
- Время нового процесса: [сумма этапов]
- Еженедельная экономия: [расчёт]
- Месячная экономия: [еженедельная * 4]

Убедитесь, что все оценки времени реалистичны и консервативны.`

    try {
      const response = await submitPrompt(workflowPrompt, 4)
      setState(prev => ({ 
        ...prev, 
        generatedWorkflow: response,
        isLoading: false 
      }))
    } catch (err) {
      setState(prev => ({ 
        ...prev, 
        error: 'Ошибка генерации workflow',
        isLoading: false 
      }))
    }
  }

  const handleToolRecommendations = async () => {
    if (!state.selectedTask) return

    setState(prev => ({ ...prev, isLoading: true }))
    
    const toolPrompt = `Рекомендуйте инструменты для автоматизации этой задачи:

ЗАДАЧА: ${state.selectedTask.description}
ТИП: ${state.workflowInputs.inputs.includes('текст') ? 'текстовая обработка' : 'анализ данных'}

Рекомендуйте 3 инструмента с объяснением:

1. **Основная рекомендация** (название, почему подходит, стоимость, кривая обучения, лучшие случаи использования)
2. **Альтернатива 1** (название, краткое описание)
3. **Альтернатива 2** (название, краткое описание)

Также включите рекомендации по интеграции и заметки о безопасности данных.`

    try {
      const response = await submitPrompt(toolPrompt, 5)
      setState(prev => ({ 
        ...prev, 
        toolRecommendations: response,
        isLoading: false 
      }))
    } catch (err) {
      setState(prev => ({ 
        ...prev, 
        error: 'Ошибка получения рекомендаций',
        isLoading: false 
      }))
    }
  }

  const handleImplementationPlan = async () => {
    if (!state.selectedTask) return

    setState(prev => ({ ...prev, isLoading: true }))
    
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
      const response = await submitPrompt(planPrompt, 6)
      setState(prev => ({ 
        ...prev, 
        implementationPlan: response,
        isLoading: false 
      }))
    } catch (err) {
      setState(prev => ({ 
        ...prev, 
        error: 'Ошибка создания плана',
        isLoading: false 
      }))
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
    setState(prev => ({
      ...prev,
      userTasks: prev.userTasks.filter((_, i) => i !== index)
    }))
  }

  const canProceedToStep2 = state.userTasks.length >= 3 && 
    state.userTasks.every(task => task.description.trim().length > 5 && task.frequency.trim().length > 0 && task.duration.trim().length > 0)

  const canProceedToStep4 = state.selectedTask && 
    state.workflowInputs.inputs && 
    state.workflowInputs.outputs && 
    state.workflowInputs.audience

  const progress = (state.currentStep / 6) * 100

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
                    <label className="block text-sm font-medium mb-1">Описание задачи</label>
                    <textarea
                      className="w-full p-2 border rounded-md"
                      placeholder="Опишите, в чём заключается задача..."
                      value={task.description}
                      onChange={(e) => updateTask(index, 'description', e.target.value)}
                      rows={3}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium mb-1">Частота</label>
                      <input
                        type="text"
                        className="w-full p-2 border rounded-md"
                        placeholder="ежедневно, еженедельно..."
                        value={task.frequency}
                        onChange={(e) => updateTask(index, 'frequency', e.target.value)}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-1">Время</label>
                      <input
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
              disabled={!canProceedToStep2 || isLoading}
              className="ml-auto"
            >
              {isLoading ? 'Анализируем...' : 'Продолжить к анализу'}
            </Button>
          </div>
        </Card>
      )}

      {state.currentStep === 2 && (
        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-4">Шаг 2: Анализ результатов</h2>
          
          {state.analysisResults ? (
            <div className="space-y-4">
              <div className="bg-green-50 dark:bg-green-950/20 border-l-4 border-green-500 p-4 rounded-r-lg">
                <p className="text-green-800 dark:text-green-200">
                  <strong>Отлично!</strong> Я проанализировал ваши задачи на потенциал автоматизации с ИИ.
                </p>
              </div>
              
              <div className="prose dark:prose-invert max-w-none">
                <div dangerouslySetInnerHTML={{ __html: state.analysisResults.replace(/\n/g, '<br>') }} />
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
              <p>Анализируем ваши задачи...</p>
            </div>
          )}
        </Card>
      )}

      {state.currentStep === 3 && (
        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-4">Шаг 3: Дизайн workflow</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Давайте спроектируем ваш ИИ-workflow для выбранной задачи. Мне нужно немного больше деталей, чтобы создать лучший workflow для вас.
          </p>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Какие обычно входные данные для этой задачи?</label>
              <textarea
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
              <label className="block text-sm font-medium mb-1">Как выглядит идеальный результат?</label>
              <textarea
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
              <label className="block text-sm font-medium mb-1">Кто является аудиторией для результата?</label>
              <input
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
              <label className="block text-sm font-medium mb-1">Есть ли какие-то специфические требования или ограничения?</label>
              <textarea
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
              disabled={!canProceedToStep4 || isLoading}
            >
              {isLoading ? 'Генерируем...' : 'Сгенерировать workflow'}
            </Button>
          </div>
        </Card>
      )}

      {state.currentStep === 4 && (
        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-4">Шаг 4: Сгенерированный workflow</h2>
          
          {state.generatedWorkflow ? (
            <div className="space-y-4">
              <div className="bg-blue-50 dark:bg-blue-950/20 border-l-4 border-blue-500 p-4 rounded-r-lg">
                <p className="text-blue-800 dark:text-blue-200">
                  <strong>Отлично!</strong> На основе ваших требований, вот ваш индивидуальный ИИ-workflow.
                </p>
              </div>
              
              <div className="prose dark:prose-invert max-w-none">
                <div dangerouslySetInnerHTML={{ __html: state.generatedWorkflow.replace(/\n/g, '<br>') }} />
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
          
          {state.toolRecommendations ? (
            <div className="space-y-4">
              <div className="prose dark:prose-invert max-w-none">
                <div dangerouslySetInnerHTML={{ __html: state.toolRecommendations.replace(/\n/g, '<br>') }} />
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
                  disabled={isLoading}
                >
                  {isLoading ? 'Получаем рекомендации...' : 'Получить рекомендации'}
                </Button>
              </div>
            </div>
          )}
        </Card>
      )}

      {state.currentStep === 6 && (
        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-4">Шаг 6: План внедрения и экспорт</h2>
          
          {state.implementationPlan ? (
            <div className="space-y-6">
              <div className="prose dark:prose-invert max-w-none">
                <div dangerouslySetInnerHTML={{ __html: state.implementationPlan.replace(/\n/g, '<br>') }} />
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
                  disabled={isLoading}
                >
                  {isLoading ? 'Создаём план...' : 'Создать план внедрения'}
                </Button>
              </div>
            </div>
          )}
        </Card>
      )}

      {/* Error Display */}
      {state.error && (
        <Card className="p-4 border-red-200 bg-red-50 dark:bg-red-950/20">
          <div className="flex items-center space-x-2 text-red-800 dark:text-red-200">
            <AlertCircle className="w-5 h-5" />
            <span>{state.error}</span>
          </div>
        </Card>
      )}
    </div>
  )
}
