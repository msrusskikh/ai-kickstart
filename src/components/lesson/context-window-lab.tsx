'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Textarea } from '@/components/ui/textarea'
import { Separator } from '@/components/ui/separator'
import { CheckCircle, Circle, ArrowRight, Clock, AlertTriangle, Lightbulb, Zap } from 'lucide-react'

interface ConversationExchange {
  id: number
  human: string
  ai: string
  isContradiction?: boolean
}

interface ContextItem {
  id: number
  text: string
  category: string
  isSelected: boolean
}

interface Phase {
  id: number
  title: string
  description: string
  duration: string
}

const phases: Phase[] = [
  {
    id: 1,
    title: "Сценарий",
    description: "Познакомьтесь с ситуацией и задачей",
    duration: "1 мин"
  },
  {
    id: 2,
    title: "Диагностика",
    description: "Найдите, где ИИ начал противоречить себе",
    duration: "2 мин"
  },
  {
    id: 3,
    title: "Потерянный контекст",
    description: "Выберите 3 самых важных элемента",
    duration: "3 мин"
  },
  {
    id: 4,
    title: "Обновление контекста",
    description: "Создайте промпт для восстановления памяти",
    duration: "3 мин"
  },
  {
    id: 5,
    title: "Тест и сравнение",
    description: "Проверьте результат и извлеките уроки",
    duration: "2 мин"
  }
]

const conversationHistory: ConversationExchange[] = [
  {
    id: 1,
    human: "Мне нужно спланировать запуск CloudSync Pro. Наш бюджет $150K, дата запуска 15 марта, целевой рынок - средние производственные компании. Основная команда включает Сару (маркетинг), Майка (инжиниринг) и Лизу (продажи).",
    ai: "Отлично! Я помогу спланировать запуск CloudSync Pro. С вашим бюджетом $150K и дедлайном 15 марта, нацеленным на средние производства, мы можем создать комплексную стратегию. Начнем с ключевых этапов..."
  },
  {
    id: 2,
    human: "CEO конкретно сказал, что никаких выставок в этом квартале из-за бюджетных ограничений от расширения офиса.",
    ai: "Понял. Мы сосредоточимся на цифровом маркетинге и прямых продажах вместо выставок, соблюдая ваш бюджет $150K для запуска CloudSync Pro 15 марта."
  },
  {
    id: 3,
    human: "Сара упомянула, что наш главный конкурент только что запустил похожий продукт за $299/месяц. Нам нужно осторожно позиционироваться.",
    ai: "Важная конкурентная информация. Нам следует рассмотреть стратегию ценообразования и точки дифференциации для CloudSync Pro, чтобы эффективно конкурировать с конкурентами за $299/месяц."
  },
  {
    id: 4,
    human: "Какие маркетинговые каналы нам следует приоритизировать с нашим бюджетом?",
    ai: "Для запуска CloudSync Pro, нацеленного на средние производства, я рекомендую: LinkedIn реклама ($40K), контент-маркетинг ($25K), серия вебинаров ($15K) и email кампании ($10K). Это держит нас в рамках бюджета $150K."
  },
  {
    id: 5,
    human: "Майк говорит, что бета-тестирование показало, что наш главный дифференциатор - функция реального времени синхронизации - ни у одного конкурента этого нет.",
    ai: "Отлично! Функция реального времени синхронизации должна быть краеугольным камнем нашего сообщения. Эта уникальная возможность поможет CloudSync Pro выделиться на переполненном рынке."
  },
  {
    id: 6,
    human: "Нам нужно координироваться с юридической командой, потому что есть новые требования соответствия для инструментов интеграции данных.",
    ai: "Хороший момент. Я добавлю юридический обзор в график. Соответствие требованиям критично для продуктов интеграции данных для предприятий."
  },
  {
    id: 7,
    human: "Как выглядит наш график для создания контента?",
    ai: "Для создания контента я предлагаю начать немедленно, чтобы успеть к дедлайну. У нас должны быть готовы посты в блоге, кейс-стади и демо продукта за 4 недели до запуска."
  },
  {
    id: 8,
    human: "Команда продаж хочет знать нашу стратегию ценообразования. Что вы рекомендуете?",
    ai: "Для стратегии ценообразования я рекомендую позиционироваться немного ниже конкурента за $279/месяц, чтобы захватить долю рынка, подчеркивая ваши превосходные функции."
  },
  {
    id: 9,
    human: "На самом деле, давайте изучим премиум стратегию ценообразования. Как это будет выглядеть?",
    ai: "Для премиум позиционирования рассмотрите $349/месяц. Это позиционирует вас как высокоценную опцию и может увеличить воспринимаемое качество и эксклюзивность."
  },
  {
    id: 10,
    human: "Инжиниринг команде нужно знать - должны ли мы планировать большое событие запуска?",
    ai: "Абсолютно! Событие запуска создаст ажиотаж и продемонстрирует возможности вашего продукта. Я предлагаю виртуальное событие для управления затратами и охвата более широкой аудитории."
  },
  {
    id: 11,
    human: "А что насчет участия в выставках для максимизации видимости?",
    ai: "Отличная идея! Выставки отлично подходят для B2B продуктов. Я рекомендую забронировать место на ManufacturingTech Expo в феврале - это идеальное время перед вашим запуском.",
    isContradiction: true
  },
  {
    id: 12,
    human: "Сколько бюджета нам следует выделить на события и выставки?",
    ai: "Я бы предложил $60K на события и выставки. Это значительная инвестиция, но критичная для B2B запусков продуктов.",
    isContradiction: true
  }
]

const contextItems: ContextItem[] = [
  {
    id: 1,
    text: "Бюджетное ограничение: Общий бюджет запуска $150K (упомянуто в обмене 1)",
    category: "constraint",
    isSelected: false
  },
  {
    id: 2,
    text: "Дата запуска: Дедлайн 15 марта (упомянуто в обмене 1)",
    category: "timeline",
    isSelected: false
  },
  {
    id: 3,
    text: "Целевой рынок: Средние производственные компании (упомянуто в обмене 1)",
    category: "market",
    isSelected: false
  },
  {
    id: 4,
    text: "Члены команды: Сара (маркетинг), Майк (инжиниринг), Лиза (продажи) (упомянуто в обмене 1)",
    category: "team",
    isSelected: false
  },
  {
    id: 5,
    text: "Директива CEO: НИКАКИХ выставок в этом квартале из-за затрат на расширение офиса (упомянуто в обмене 2)",
    category: "constraint",
    isSelected: false
  },
  {
    id: 6,
    text: "Конкурентная разведка: Основной конкурент ценообразование $299/месяц (упомянуто в обмене 3)",
    category: "competition",
    isSelected: false
  },
  {
    id: 7,
    text: "Ключевой дифференциатор: Функция реального времени синхронизации - уникальна на рынке (упомянуто в обмене 5)",
    category: "differentiator",
    isSelected: false
  },
  {
    id: 8,
    text: "Требование соответствия: Новые юридические требования для инструментов интеграции данных (упомянуто в обмене 6)",
    category: "compliance",
    isSelected: false
  }
]

const correctAnswers = [5, 1, 7] // CEO directive, budget constraint, key differentiator

interface ContextWindowLabProps {
  onComplete?: () => void
}

export default function ContextWindowLab({ onComplete }: ContextWindowLabProps) {
  const [currentPhase, setCurrentPhase] = useState(1)
  const [selectedContextItems, setSelectedContextItems] = useState<number[]>([])
  const [contextRefreshPrompt, setContextRefreshPrompt] = useState('')
  const [apiResponse, setApiResponse] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [score, setScore] = useState(0)
  const [selectedQuestion, setSelectedQuestion] = useState('')
  const [model, setModel] = useState('gpt-4o-mini')
  const [showCompletionModal, setShowCompletionModal] = useState(false)
  const [showHint, setShowHint] = useState(false)

  const handleContextItemToggle = (itemId: number) => {
    if (selectedContextItems.includes(itemId)) {
      setSelectedContextItems(selectedContextItems.filter(id => id !== itemId))
    } else if (selectedContextItems.length < 3) {
      setSelectedContextItems([...selectedContextItems, itemId])
    }
  }

  const handlePhaseComplete = () => {
    if (currentPhase < 5) {
      setCurrentPhase(currentPhase + 1)
    }
  }

  const handleContextSelectionComplete = () => {
    const correctCount = selectedContextItems.filter(id => correctAnswers.includes(id)).length
    setScore(correctCount)
    setShowResults(true)
    handlePhaseComplete()
  }

  const handleLabComplete = () => {
    setShowCompletionModal(true)
    onComplete?.()
  }

  // Load/persist local state for better UX
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedModel = localStorage.getItem('ck_lab_model')
      const savedPrompt = localStorage.getItem('ck_lab_prompt')
      const savedQuestion = localStorage.getItem('ck_lab_question')
      if (savedModel) setModel(savedModel)
      if (savedPrompt) setContextRefreshPrompt(savedPrompt)
      if (savedQuestion) setSelectedQuestion(savedQuestion)
    }
  }, [])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('ck_lab_model', model)
      localStorage.setItem('ck_lab_prompt', contextRefreshPrompt)
      localStorage.setItem('ck_lab_question', selectedQuestion)
    }
  }, [model, contextRefreshPrompt, selectedQuestion])

  const handlePromptSubmit = async () => {
    if (!contextRefreshPrompt.trim() || !selectedQuestion.trim()) return
    
    setIsLoading(true)
    setApiResponse('')
    try {
      const res = await fetch('/api/openai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contextPrompt: contextRefreshPrompt, testQuestion: selectedQuestion, model })
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err?.details || 'API error')
      }
      const data = await res.json()
      setApiResponse(data?.content || '')
      handlePhaseComplete()
    } catch (e) {
      setApiResponse('Ошибка вызова API. Проверьте ключ и попробуйте ещё раз.')
    } finally {
      setIsLoading(false)
    }
  }

  const renderPhase1 = () => (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <h2 className="text-2xl font-semibold">Добро пожаловать в TechFlow Inc!</h2>
        <p className="text-lg text-muted-foreground">
          Это самый большой запуск продукта в этом году! Вы - менеджер проекта для CloudSync Pro, 
          новой платформы интеграции данных для предприятий.
        </p>
      </div>
      
      <Card className="bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
        <CardContent className="p-6">
          <div className="flex items-start space-x-3">
            <Lightbulb className="h-6 w-6 text-blue-600 dark:text-blue-400 mt-1 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                🎯 Вы научитесь:
              </h3>
              <p className="text-blue-800 dark:text-blue-200">
                Как распознать, когда ИИ достиг лимитов окна контекста, и спасти важную информацию 
                от «забывания»
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <h3 className="font-semibold mb-3">Сценарий:</h3>
          <p className="text-muted-foreground mb-4">
            ИИ начал хорошо, помогая вам планировать график, бюджет и назначения команды. 
            Но по мере роста разговора он начал противоречить более ранним решениям и «забывать» 
            ключевые ограничения.
          </p>
          <p className="text-muted-foreground">
            Это классическое ограничение окна контекста - давайте исправим это!
          </p>
        </CardContent>
      </Card>
    </div>
  )

  const renderPhase2 = () => (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <h2 className="text-2xl font-semibold">Диагностика проблемы</h2>
        <p className="text-muted-foreground">
          Просмотрите историю разговора и найдите, где ИИ начал противоречить себе
        </p>
      </div>

      <Card>
        <CardContent className="p-6">
          <h3 className="font-semibold mb-4">История разговора:</h3>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {conversationHistory.map((exchange) => (
              <div key={exchange.id} className={`space-y-2 ${exchange.isContradiction ? 'bg-red-50 dark:bg-red-950/20 border-l-4 border-red-500 pl-4' : ''}`}>
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-sm font-medium text-blue-700 dark:text-blue-300 flex-shrink-0">
                    {exchange.id}
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg">
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">Вы:</p>
                      <p className="text-sm text-gray-700 dark:text-gray-300">{exchange.human}</p>
                    </div>
                    <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-lg">
                      <p className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-1">ИИ:</p>
                      <p className="text-sm text-blue-700 dark:text-blue-300">{exchange.ai}</p>
                    </div>
                  </div>
                </div>
                {exchange.isContradiction && (
                  <div className="flex items-center space-x-2 text-red-600 dark:text-red-400 text-sm">
                    <AlertTriangle className="h-4 w-4" />
                    <span className="font-medium">ПРОТИВОРЕЧИЕ!</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800">
        <CardContent className="p-6">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="h-6 w-6 text-amber-600 dark:text-amber-400 mt-1 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-amber-900 dark:text-amber-100 mb-2">
                Что произошло?
              </h3>
              <p className="text-amber-800 dark:text-amber-200">
                В обменах 11-12 ИИ полностью забыл директиву CEO о запрете выставок и предложил 
                выделить $60K на выставки, что превышает общий бюджет $150K!
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const renderPhase3 = () => (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <h2 className="text-2xl font-semibold">Определите потерянный контекст</h2>
        <p className="text-muted-foreground">
          Выберите 3 самых критичных элемента, которые ИИ «забыл»
        </p>
      </div>

      <Card className="bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800">
        <CardContent className="p-6">
          <div className="flex items-start space-x-3">
            <Lightbulb className="h-6 w-6 text-amber-600 dark:text-amber-400 mt-1 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-amber-900 dark:text-amber-100 mb-2">
                💡 Подсказка:
              </h3>
              <p className="text-amber-800 dark:text-amber-200">
                Ищите элементы, которые ИИ нарушил в последних ответах. Особенно обратите внимание на бюджетные ограничения и директивы руководства.
              </p>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setShowHint(!showHint)}
                className="mt-3"
              >
                {showHint ? 'Скрыть подсказку' : 'Показать подсказку'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {showHint && (
        <Card className="bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
          <CardContent className="p-6">
            <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-3">
              🎯 Ключевые элементы для выбора:
            </h4>
            <div className="space-y-2 text-sm text-blue-800 dark:text-blue-200">
              <div className="flex items-start space-x-2">
                <span className="font-medium">1.</span>
                <span>Директива CEO о запрете выставок (обмен 2)</span>
              </div>
              <div className="flex items-start space-x-2">
                <span className="font-medium">2.</span>
                <span>Бюджетное ограничение $150K (обмен 1)</span>
              </div>
              <div className="flex items-start space-x-2">
                <span className="font-medium">3.</span>
                <span>Уникальный дифференциатор - реальное время синхронизации (обмен 5)</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {contextItems.map((item) => (
              <div
                key={item.id}
                onClick={() => handleContextItemToggle(item.id)}
                className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                  selectedContextItems.includes(item.id)
                    ? 'border-primary bg-primary/5'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
              >
                <div className="flex items-start space-x-3">
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mt-0.5 ${
                    selectedContextItems.includes(item.id)
                      ? 'border-primary bg-primary text-white'
                      : 'border-gray-300 dark:border-gray-600'
                  }`}>
                    {selectedContextItems.includes(item.id) && <CheckCircle className="w-3 h-3" />}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{item.text}</p>
                    <span className="inline-block px-2 py-1 text-xs bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded mt-2">
                      {item.category}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground mb-4">
              Выбрано: {selectedContextItems.length}/3
            </p>
            <Button 
              onClick={handleContextSelectionComplete}
              disabled={selectedContextItems.length !== 3}
              className="w-full md:w-auto"
            >
              Проверить выбор
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {showResults && (
        <Card className={score === 3 ? 'bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800' : 'bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800'}>
          <CardContent className="p-6">
            <div className="text-center space-y-4">
              <div className={`w-16 h-16 rounded-full mx-auto flex items-center justify-center ${
                score === 3 ? 'bg-green-100 dark:bg-green-900' : 'bg-amber-100 dark:bg-amber-900'
              }`}>
                {score === 3 ? (
                  <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
                ) : (
                  <AlertTriangle className="w-8 h-8 text-amber-600 dark:text-amber-400" />
                )}
              </div>
              <div>
                <h3 className={`font-semibold text-lg ${
                  score === 3 ? 'text-green-900 dark:text-green-100' : 'text-amber-900 dark:text-amber-100'
                }`}>
                  {score === 3 ? 'Отлично!' : 'Хорошо, но можно лучше'}
                </h3>
                <p className={`text-sm ${
                  score === 3 ? 'text-green-800 dark:text-green-200' : 'text-amber-800 dark:text-amber-200'
                }`}>
                  Вы правильно выбрали {score} из 3 критичных элементов
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )

  const renderPhase4 = () => (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <h2 className="text-2xl font-semibold">Создайте обновление контекста</h2>
        <p className="text-muted-foreground">
          Постройте промпт, который восстановит память ИИ
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Шаблоны промптов</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <h4 className="font-medium text-sm mb-2">Шаблон 1: Краткий формат</h4>
                <p className="text-xs text-muted-foreground">
                  Быстрый сброс контекста с ключевыми ограничениями
                </p>
                <pre className="text-xs whitespace-pre-wrap text-muted-foreground mt-2 bg-white dark:bg-gray-900 p-2 rounded">
{`Context: Budget $150K, NO trade shows, 
Launch March 15, Real-time sync differentiator.
Answer based on these constraints.`}</pre>
              </div>
              <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <h4 className="font-medium text-sm mb-2">Шаблон 2: Структурированный</h4>
                <p className="text-xs text-muted-foreground">
                  Организованный формат с категориями
                </p>
                <pre className="text-xs whitespace-pre-wrap text-muted-foreground mt-2 bg-white dark:bg-gray-900 p-2 rounded">
{`CONTEXT REFRESH:
- Budget: $150K total
- Timeline: March 15 launch
- Constraints: NO trade shows
- Differentiator: Real-time sync
- Team: Sarah, Mike, Lisa`}</pre>
              </div>
              <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <h4 className="font-medium text-sm mb-2">Шаблон 3: Проблема-решение</h4>
                <p className="text-xs text-muted-foreground">
                  Формат с объяснением контекста
                </p>
                <pre className="text-xs whitespace-pre-wrap text-muted-foreground mt-2 bg-white dark:bg-gray-900 p-2 rounded">
{`IMPORTANT: Earlier in our conversation, 
I mentioned we have a $150K budget and 
CEO specifically banned trade shows. 
Please remember these constraints.`}</pre>
              </div>
              <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <h4 className="font-medium text-sm mb-2">Пример структуры</h4>
                <pre className="text-xs whitespace-pre-wrap text-muted-foreground">{`Context Refresh: CloudSync Pro Launch Planning

KEY CONSTRAINTS:
- Budget: $150K total
- Launch: March 15th
- CEO directive: NO trade shows this quarter
- Target: Mid-size manufacturing

ESTABLISHED DECISIONS:
- Real-time sync is our unique differentiator
- Digital marketing focus (LinkedIn, content, webinars)
- Team: Sarah (marketing), Mike (engineering), Lisa (sales)

CURRENT QUESTION: [ваш вопрос]
`}</pre>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Ваш промпт</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-muted-foreground">Модель</label>
                <select
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  className="mt-1 w-full border rounded-md bg-background p-2 text-sm"
                >
                  <option value="gpt-4o-mini">gpt-4o-mini</option>
                  <option value="gpt-4o">gpt-4o</option>
                </select>
              </div>
            </div>

            <Textarea
              placeholder="Введите ваш промпт для обновления контекста..."
              value={contextRefreshPrompt}
              onChange={(e) => setContextRefreshPrompt(e.target.value)}
              className="min-h-[200px]"
            />
            <div>
              <label className="text-sm font-medium">Тестовый вопрос</label>
              <select
                value={selectedQuestion}
                onChange={(e) => setSelectedQuestion(e.target.value)}
                className="mt-2 w-full border rounded-md bg-background p-2 text-sm"
              >
                <option value="">Выберите вопрос...</option>
                <option value="What events and marketing activities should we prioritize for maximum impact?">Какие маркетинговые активности приоритизировать для максимального эффекта?</option>
                <option value="How should we allocate our remaining marketing budget?">Как распределить оставшийся маркетинговый бюджет?</option>
                <option value="What's our go-to-market strategy summary?">Какова краткая GTM-стратегия?</option>
              </select>
            </div>
            <Button 
              onClick={handlePromptSubmit}
              disabled={!contextRefreshPrompt.trim() || !selectedQuestion.trim() || isLoading}
              className="w-full"
            >
              {isLoading ? 'Отправка...' : 'Отправить промпт'}
              <Zap className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )

  const renderPhase5 = () => (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <h2 className="text-2xl font-semibold">Тест и сравнение</h2>
        <p className="text-muted-foreground">
          Посмотрите, как ваш промпт улучшил ответы ИИ
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800">
          <CardHeader>
            <CardTitle className="text-lg text-red-900 dark:text-red-100">
              До обновления контекста
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-red-800 dark:text-red-200">
              ИИ предложил выставки и $60K на события, полностью забыв директиву CEO 
              и бюджетные ограничения. Это привело бы к превышению бюджета и нарушению 
              корпоративных указаний.
            </p>
          </CardContent>
        </Card>

        <Card className="bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800">
          <CardHeader>
            <CardTitle className="text-lg text-green-900 dark:text-green-100">
              После обновления контекста
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-green-800 dark:text-green-200">
              {apiResponse || 'Ваш промпт эффективно восстановил контекст и предотвратил противоречия.'}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
        <CardContent className="p-6">
          <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-4">
            🎯 Ключевые выводы
          </h3>
          <div className="space-y-3 text-sm text-blue-800 dark:text-blue-200">
            <div className="flex items-start space-x-2">
              <CheckCircle className="h-4 w-4 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
              <span><strong>Окна контекста имеют лимиты:</strong> Даже продвинутые модели ИИ могут «помнить» только ограниченное количество недавнего разговора</span>
            </div>
            <div className="flex items-start space-x-2">
              <CheckCircle className="h-4 w-4 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
              <span><strong>Критичная информация теряется:</strong> Важные ограничения и решения исчезают из активной памяти ИИ</span>
            </div>
            <div className="flex items-start space-x-2">
              <CheckCircle className="h-4 w-4 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
              <span><strong>Проактивное управление контекстом:</strong> Регулярно обновляйте ключевую информацию вместо надежды, что ИИ помнит</span>
            </div>
            <div className="flex items-start space-x-2">
              <CheckCircle className="h-4 w-4 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
              <span><strong>Шаблонный подход работает:</strong> Наличие стандартных форматов для обновления контекста экономит время</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <h3 className="font-semibold mb-4">Примените к своей работе:</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <h4 className="font-medium mb-2">📅 Еженедельные проверки проекта</h4>
              <p className="text-sm text-muted-foreground">
                Начинайте каждую сессию с повторения ключевых ограничений и решений
              </p>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <h4 className="font-medium mb-2">📝 Документирование решений</h4>
              <p className="text-sm text-muted-foreground">
                Ведите текущую сводку критичных моментов для повторного внедрения
              </p>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <h4 className="font-medium mb-2">📋 Шаблоны контекста</h4>
              <p className="text-sm text-muted-foreground">
                Создавайте стандартные форматы для ваших общих случаев использования
              </p>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <h4 className="font-medium mb-2">⚠️ Ранние предупреждения</h4>
              <p className="text-sm text-muted-foreground">
                Следите за ответами ИИ, которые противоречат более ранним соглашениям
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const renderCurrentPhase = () => {
    switch (currentPhase) {
      case 1: return renderPhase1()
      case 2: return renderPhase2()
      case 3: return renderPhase3()
      case 4: return renderPhase4()
      case 5: return renderPhase5()
      default: return renderPhase1()
    }
  }

  return (
    <div className="container mx-auto px-6 py-8 max-w-6xl">
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-semibold">Context Window Rescue Mission</h1>
          <p className="text-lg text-muted-foreground">
            Спасите важную информацию от «забывания» в длинных разговорах с ИИ
          </p>
        </div>

        {/* Progress Bar */}
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex justify-between text-sm">
                <span>Прогресс</span>
                <span>{currentPhase}/5</span>
              </div>
              <Progress value={(currentPhase / 5) * 100} className="h-3" />
              <div className="flex justify-between text-xs text-muted-foreground">
                {phases.map((phase) => (
                  <div key={phase.id} className="text-center">
                    <div className={`w-8 h-8 rounded-full mx-auto mb-2 flex items-center justify-center text-xs font-medium ${
                      phase.id <= currentPhase
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                    }`}>
                      {phase.id < currentPhase ? <CheckCircle className="w-4 h-4" /> : phase.id}
                    </div>
                    <p className="font-medium">{phase.title}</p>
                    <p className="text-xs">{phase.duration}</p>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Current Phase Content */}
        {renderCurrentPhase()}

        {/* Navigation */}
        {currentPhase < 5 && (
          <div className="flex justify-center">
            <Button 
              onClick={handlePhaseComplete}
              className="px-8"
            >
              Следующий этап
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        )}

        {/* Lab Completion */}
        {currentPhase === 5 && (
          <div className="flex justify-center">
            <Button 
              onClick={handleLabComplete}
              className="px-8 bg-green-600 hover:bg-green-700"
            >
              Завершить лабораторную работу
              <CheckCircle className="ml-2 h-4 w-4" />
            </Button>
          </div>
        )}

        {/* Completion Modal */}
        {showCompletionModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-background rounded-lg p-8 max-w-md mx-4 text-center space-y-6">
              <div className="w-20 h-20 rounded-full bg-green-100 dark:bg-green-900 mx-auto flex items-center justify-center">
                <CheckCircle className="w-12 h-12 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-foreground mb-2">
                  Поздравляем!
                </h3>
                <p className="text-muted-foreground">
                  Вы успешно завершили лабораторную работу по управлению окном контекста ИИ
                </p>
              </div>
              <div className="space-y-3 text-sm">
                <div className="flex items-center space-x-2 justify-center">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>Научились диагностировать потерю контекста</span>
                </div>
                <div className="flex items-center space-x-2 justify-center">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>Освоили техники восстановления памяти ИИ</span>
                </div>
                <div className="flex items-center space-x-2 justify-center">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>Получили практический опыт работы с API</span>
                </div>
              </div>
              <Button 
                onClick={() => setShowCompletionModal(false)}
                className="w-full"
              >
                Продолжить обучение
              </Button>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="text-center text-sm text-muted-foreground">
          <div className="flex items-center justify-center space-x-2">
            <div className="w-1.5 h-1.5 bg-green-500/70 rounded-full"></div>
            <span>Powered by OpenAI</span>
          </div>
        </div>
      </div>
    </div>
  )
}
