"use client"

import Link from "next/link"
import { notFound } from "next/navigation"
import { useProgressStore } from "@/lib/progress"
import { modules } from "@/lib/content"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/lesson/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { CheckCircle, Circle, ArrowRight, Clock, Lock, Unlock } from "lucide-react"
import { Breadcrumbs } from "@/components/layout/breadcrumbs"
import { useEffect, useState } from "react"

interface ModulePageProps {
  params: Promise<{
    module: string
  }>
}

export default function ModulePage({ params }: ModulePageProps) {
  const [moduleStr, setModuleStr] = useState<string>("")
  const [isLoading, setIsLoading] = useState(true)
  const { completedSections, isDevMode } = useProgressStore()

  useEffect(() => {
    const resolveParams = async () => {
      try {
        const resolvedParams = await params
        setModuleStr(resolvedParams.module)
        setIsLoading(false)
      } catch (error) {
        console.error("Error resolving params:", error)
        setIsLoading(false)
      }
    }
    
    resolveParams()
  }, [params])

  if (isLoading) {
    return <div>Loading...</div>
  }
  const moduleId = parseInt(moduleStr)
  const module = modules.find(m => m.id === moduleId)
  
  if (!module) {
    notFound()
  }

  // Calculate actual progress for this module
  const completedCount = module.sections.filter(section => 
    completedSections.has(`${moduleId}-${section.section}`)
  ).length
  
  const progressPercentage = module.sections.length > 0 ? (completedCount / module.sections.length) * 100 : 0
  
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-6 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          <Breadcrumbs />
        
        {/* Module Header */}
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl">{module.title}</CardTitle>
            <p className="text-lg text-muted-foreground">{module.description}</p>
            {isDevMode && (
              <div className="flex items-center space-x-2 text-sm text-green-600 dark:text-green-400">
                <Unlock className="h-4 w-4" />
                <span>Developer Mode: All lessons accessible</span>
              </div>
            )}
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold text-primary">
                {completedCount}/{module.sections.length} уроков завершено
              </div>
              <div className="text-sm text-muted-foreground">
                ~{module.sections.reduce((acc, s) => acc + s.duration, 0)} мин
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Прогресс</span>
                <span>{Math.round(progressPercentage)}%</span>
              </div>
              <Progress value={progressPercentage} className="h-2" />
              {completedCount === module.sections.length && module.sections.length > 0 && (
                <p className="text-sm text-green-600 dark:text-green-400 font-medium">
                  🎉 Модуль завершен! Отличная работа!
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Sections List */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Уроки</h2>
          
          <div className="space-y-3">
            {module.sections.map((section) => {
              const isCompleted = completedSections.has(`${moduleId}-${section.section}`)
              const isFirst = section.section === 1
              const hasAccessToPrevious = section.section > 1 && completedSections.has(`${moduleId}-${section.section - 1}`)
              const isAccessible = isDevMode || isFirst || isCompleted || hasAccessToPrevious
              
              return (
                <Card key={section.section} className={!isAccessible ? "opacity-60" : ""}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        {isCompleted ? (
                          <CheckCircle className="h-6 w-6 text-green-500" />
                        ) : isAccessible ? (
                          <Circle className="h-6 w-6 text-muted-foreground" />
                        ) : (
                          <Lock className="h-6 w-6 text-muted-foreground" />
                        )}
                        
                        <div className="flex-1">
                          <div className="flex items-center space-x-3">
                            {isAccessible ? (
                              <Link 
                                href={`/learn/${moduleId}/${section.section}`}
                                className={`text-lg font-semibold ${!isAccessible ? "text-muted-foreground" : ""} truncate hover:text-primary transition-colors cursor-pointer`}
                              >
                                {section.title}
                              </Link>
                            ) : (
                              <h3 className={`text-lg font-semibold ${!isAccessible ? "text-muted-foreground" : ""} truncate`}>
                                {section.title}
                              </h3>
                            )}
                            <div className="flex items-center space-x-1 text-sm text-muted-foreground flex-shrink-0">
                              <Clock className="h-4 w-4" />
                              <span>{section.duration} мин</span>
                            </div>
                          </div>
                          <p className="text-muted-foreground mt-1 line-clamp-2">{section.summary}</p>
                          {!isAccessible && !isDevMode && (
                            <p className="text-xs text-amber-600 dark:text-amber-400 mt-2">
                              🔒 Завершите предыдущий урок для доступа
                            </p>
                          )}
                          {isDevMode && !isAccessible && (
                            <p className="text-xs text-green-600 dark:text-green-400 mt-2">
                              🔓 Developer Mode: Lesson accessible
                            </p>
                          )}
                        </div>
                      </div>
                      
                      {isAccessible ? (
                        <Button 
                          asChild 
                          variant={isCompleted ? "outline" : "default"}
                        >
                          <Link href={`/learn/${moduleId}/${section.section}`}>
                            {isCompleted ? "Повторить" : "Начать"}
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </Link>
                        </Button>
                      ) : (
                        <Button disabled variant="outline" className="opacity-50">
                          <Lock className="mr-2 h-4 w-4" />
                          Заблокировано
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </div>
    </div>
    </div>
  )
}
