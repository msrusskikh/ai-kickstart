"use client"

import Link from "next/link"
import { notFound } from "next/navigation"
import { useProgressStore } from "@/lib/progress"
import { modules } from "@/lib/content"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/lesson/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { CheckCircle, Circle, ArrowRight, Clock } from "lucide-react"
import { Breadcrumbs } from "@/components/layout/breadcrumbs"

interface ModulePageProps {
  params: Promise<{
    module: string
  }>
}

export default async function ModulePage({ params }: ModulePageProps) {
  const { module: moduleStr } = await params
  const moduleId = parseInt(moduleStr)
  const module = modules.find(m => m.id === moduleId)
  
  if (!module) {
    notFound()
  }
  
  return (
    <div className="container mx-auto px-6 py-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <Breadcrumbs />
        
        {/* Module Header */}
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl">{module.title}</CardTitle>
            <p className="text-lg text-muted-foreground">{module.description}</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold text-primary">
                0/{module.sections.length} sections completed
              </div>
              <div className="text-sm text-muted-foreground">
                ~{module.sections.reduce((acc, s) => acc + s.duration, 0)} min total
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progress</span>
                <span>0%</span>
              </div>
              <Progress value={0} className="h-2" />
            </div>
          </CardContent>
        </Card>

        {/* Sections List */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Lessons</h2>
          
          <div className="space-y-3">
            {module.sections.map((section) => {
              const isFirst = section.section === 1
              
              return (
                <Card key={section.section}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <Circle className="h-6 w-6 text-muted-foreground" />
                        
                        <div className="flex-1">
                          <div className="flex items-center space-x-3">
                            <h3 className="text-lg font-semibold">{section.title}</h3>
                            <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                              <Clock className="h-4 w-4" />
                              <span>{section.duration} min</span>
                            </div>
                          </div>
                          <p className="text-muted-foreground mt-1">{section.summary}</p>
                        </div>
                      </div>
                      
                      <Button 
                        asChild 
                        disabled={!isFirst}
                        variant="default"
                      >
                        <Link href={`/learn/${moduleId}/${section.section}`}>
                          Start
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
  )
}
