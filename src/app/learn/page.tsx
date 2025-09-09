"use client"

import Link from "next/link"
import { useProgressStore } from "@/lib/progress"
import { modules } from "@/lib/content"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/lesson/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { ArrowRight, Play } from "lucide-react"

export default function LearnPage() {
  const { currentModule, currentSection, completedSections } = useProgressStore()
  
  const currentModuleData = modules.find(m => m.id === currentModule)
  const currentSectionData = currentModuleData?.sections.find(s => s.section === currentSection)
  
  // Check if user is a new learner (no progress)
  const isNewLearner = completedSections.size === 0
  
  // Get first lesson data for new learners
  const firstLesson = modules[0]?.sections[0]
  
  // Find the next incomplete lesson
  const getNextIncompleteLesson = () => {
    for (const module of modules) {
      for (const section of module.sections) {
        const key = `${module.id}-${section.section}`
        if (!completedSections.has(key)) {
          return { module, section }
        }
      }
    }
    return null // All lessons completed
  }
  
  const nextLesson = getNextIncompleteLesson()
  
  const getModuleProgress = (moduleId: number) => {
    const module = modules.find(m => m.id === moduleId)
    if (!module) return 0
    
    const completed = module.sections.filter(section => 
      completedSections.has(`${moduleId}-${section.section}`)
    ).length
    
    return (completed / module.sections.length) * 100
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
        {/* Banner for new learners */}
        {isNewLearner && firstLesson && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Play className="h-5 w-5" />
                <span>Начать обучение</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-xl font-semibold">{firstLesson.title}</h3>
                <p className="text-muted-foreground">{firstLesson.summary}</p>
              </div>
              <Button asChild>
                <Link href={`/learn/1/1`}>
                  Начать урок
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Продолжить обучение - only show if user has progress and is not a new learner */}
        {nextLesson && !isNewLearner && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Play className="h-5 w-5" />
                <span>{nextLesson.section.title}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-muted-foreground">{nextLesson.section.summary}</p>
              </div>
              <Button asChild>
                <Link href={`/learn/${nextLesson.module.id}/${nextLesson.section.section}`}>
                  Продолжить
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Modules Overview */}
        <div className="space-y-6">
          <h2 className="text-3xl font-bold">Модули</h2>
          
          <div className="grid gap-6">
            {modules.map((module) => {
              const progress = getModuleProgress(module.id)
              const completedCount = module.sections.filter(section => 
                completedSections.has(`${module.id}-${section.section}`)
              ).length
              
              return (
                <Card key={module.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <Link href={`/learn/${module.id}`} className="hover:opacity-80 transition-opacity">
                          <CardTitle className="text-xl cursor-pointer">{module.title}</CardTitle>
                        </Link>
                        <p className="text-muted-foreground mt-1">{module.description}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-primary">
                          {completedCount}/{module.sections.length}
                        </div>
                        <div className="text-sm text-muted-foreground">уроков</div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Прогресс</span>
                        <span>{Math.round(progress)}%</span>
                      </div>
                      <Progress value={progress} className="h-2" />
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div className="text-sm text-muted-foreground">
                        {module.sections.length} уроков • ~{module.sections.reduce((acc, s) => acc + s.duration, 0)} мин
                      </div>
                      <Button asChild variant="outline">
                        <Link href={`/learn/${module.id}`}>
                          Посмотреть уроки
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
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
