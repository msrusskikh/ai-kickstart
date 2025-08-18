'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useRouter } from 'next/navigation'

const pitchSlides = [
  {
    id: 0,
    title: "Задача",
    content: "Снизить операционные расходы через AI-автоматизацию бизнес-процессов"
  },
  {
    id: 1,
    title: "Гипотеза",
    content: "Сложные автоматизации внедряют AI-инженеры. Простые создают сами сотрудники. Чем мощнее AI-инструменты, тем больше могут автоматизировать сами сотрудники, тем больше совокупный impact на бизнес от простых автоматизаций."
  },
  {
    id: 2,
    title: "ЦА и боли",
    content: "IT-сотрудники:\n • Нет времени на длинное обучение\n• Не хотят теории без практики\n• Предпочитают видео и интерактив\n• Нужны решения конкретно для их задач\n"
  },
  {
    id: 3,
    title: "Решение",
    content: "AI-онбординг для сотрудников:\n• 1-2 часа обучения\n• Только необходимая теория\n• Видео или текст — выбор формата\n• Интерактивные лабы с ChatGPT\n• На выходе — 1–2 готовые автоматизации для своего workflow"
  },
  {
    id: 4,
    title: "Результат",
    content: "• Сотрудники, не пользующиеся AI-инструментами, автоматизируют 10-20% своих задач\n• Сотрудники, пользующиеся AI-инструментами, автоматизируют 30-40% своих задач\n• Сотрудники, которые используют AI-инструменты для обучения, автоматизируют 50-60% своих задач"
  },
  {
    id: 5,
    title: "Экономика",
    content: "10,000 сотрудников ×\n30-300 запросов в месяц ×\n$X за запрос\n────────\n [сумма] руб. в месяц\nНормельное распределение, $1 = 80р"
  },
  {
    id: 6,
    title: "Roadmap",
    content: "• A/B-тест эффективности обучения: видео vs текст\n• Метрика – сотрудник начал использовать ИИ в работе\n• Библиотека автоматизаций по департаментам\nс персонализированными рекомендациями\n• Advanced программа обучения\n"
  },
  {
    id: 7,
    title: "Vision",
    content: "От быстрого старта к платформе корпоративной AI-трансформации:\n*Обучение → Практика  → Готовые решения → Use-case discovery → Культура AI-enablement*"
  }
]

export default function PitchPage() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const router = useRouter()

  const nextSlide = () => {
    if (currentSlide === pitchSlides.length - 1) {
      // Last slide - redirect to main page
      console.log('Redirecting to main page from slide', currentSlide + 1)
      router.push('/')
      // Fallback redirect
      setTimeout(() => {
        window.location.href = '/'
      }, 100)
    } else {
      setCurrentSlide(currentSlide + 1)
    }
  }

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1)
    }
  }

  const goToSlide = (index: number) => {
    setCurrentSlide(index)
  }



  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-semibold text-foreground leading-tight mb-6 font-source-sans-pro">
            Трансформер
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed font-normal font-source-sans-pro">
            Тестовое задание для AI Marvel
          </p>
        </div>

        {/* Carousel Container with External Arrows */}
        <div className="relative">
          {/* Content Box */}
          <div className="bg-card rounded-2xl border border-border/40 p-12 min-h-[450px] shadow-md max-w-2xl mx-auto ring-1 ring-border/20">
            {/* Slide Content - Grid-based layout */}
            <div className="grid place-items-center h-full">
              <div className="text-center w-full max-w-lg">
                <div className="h-20 flex items-center justify-center mb-8">
                  <h2 className="text-2xl font-medium text-foreground leading-tight">
                    {pitchSlides[currentSlide].title}
                  </h2>
                </div>
                <div className="h-32 flex items-center justify-center">
                                  <div className={`text-base text-muted-foreground leading-relaxed font-normal ${currentSlide >= 2 ? 'text-left' : 'text-center'}`}>
                  {currentSlide >= 2 ? (
                    // For slides 3, 4, 5, 6, 7 (index 2, 3, 4, 5, 6), show as bullet points
                    pitchSlides[currentSlide].content.split('\n').map((line, index) => (
                      <div key={index} className="mb-2">
                        {line.includes('*') ? (
                          <span dangerouslySetInnerHTML={{ 
                            __html: line.replace(/\*(.*?)\*/g, '<em>$1</em>') 
                          }} />
                        ) : (
                          line
                        )}
                      </div>
                    ))
                  ) : (
                    // For slides 1-2 (index 0, 1), show as regular text
                    <div dangerouslySetInnerHTML={{ __html: pitchSlides[currentSlide].content.replace(/\n/g, '<br/>') }} />
                  )}
                </div>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Arrows - Positioned outside content box */}
          {currentSlide > 0 && (
            <button
              onClick={prevSlide}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center text-muted-foreground/70 hover:text-foreground transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-full hover:bg-muted/50"
              aria-label="Предыдущий слайд"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
          )}

          <button
            onClick={nextSlide}
            className={`absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-full ${
              currentSlide === pitchSlides.length - 1
                ? 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg hover:shadow-xl'
                : 'text-muted-foreground/70 hover:text-foreground hover:bg-muted/50'
            }`}
            aria-label={currentSlide === pitchSlides.length - 1 ? "Перейти на главную страницу" : "Следующий слайд"}
          >
            <ChevronRight className="w-6 h-6" />
          </button>
          
          {/* Action label for last slide */}
          {currentSlide === pitchSlides.length - 1 && (
            <div className="absolute right-4 top-1/2 translate-y-16 flex justify-center w-12">
              <p className="text-sm font-medium text-primary whitespace-nowrap">
                К продукту
              </p>
            </div>
          )}
        </div>

        {/* Dots Navigation */}
        <div className="flex justify-center mt-12 space-x-3">
          {pitchSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-2.5 h-2.5 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${
                index === currentSlide
                  ? 'bg-foreground w-8'
                  : 'bg-muted-foreground/40 hover:bg-muted-foreground/60'
              }`}
              aria-label={`Перейти к слайду ${index + 1}`}
            />
          ))}
        </div>

      </div>

      {/* Footer - Fixed at bottom of screen */}
      <div className="fixed bottom-12 left-1/2 transform -translate-x-1/2">
        <div className="flex items-center justify-center space-x-2 text-xs text-muted-foreground/60 font-mono tracking-wide">
          <div className="w-1.5 h-1.5 bg-green-500/70 rounded-full"></div>
          <span>Powered by OpenAI</span>
        </div>
      </div>
    </div>
  )
}
