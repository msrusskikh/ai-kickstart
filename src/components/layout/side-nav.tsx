"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ChevronDown, ChevronRight, CheckCircle, Circle } from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { useProgressStore } from "@/lib/progress"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { modules } from "@/lib/content"

interface ModuleItemProps {
  module: typeof modules[0]
  isExpanded: boolean
  onToggle: () => void
}

function ModuleItem({ module, isExpanded, onToggle }: ModuleItemProps) {
  const pathname = usePathname()
  const { completedSections } = useProgressStore()
  
  const completedCount = module.sections.filter(section => 
    completedSections.has(`${module.id}-${section.section}`)
  ).length
  
  const progress = (completedCount / module.sections.length) * 100

  return (
    <div className="space-y-1">
      <Button
        variant="ghost"
        size="sm"
        className="w-full justify-between p-2 h-auto"
        onClick={onToggle}
      >
        <div className="flex items-center space-x-2">
          {isExpanded ? (
            <ChevronDown className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
          <span className="font-medium">{module.title}</span>
        </div>
        <div className="text-xs text-muted-foreground">
          {completedCount}/{module.sections.length}
        </div>
      </Button>
      
      {isExpanded && (
        <div className="ml-6 space-y-1">
          {module.sections.map((section) => {
            const isCompleted = completedSections.has(`${module.id}-${section.section}`)
            const isActive = pathname === `/learn/${module.id}/${section.section}`
            
            return (
              <Link
                key={section.section}
                href={`/learn/${module.id}/${section.section}`}
                className={cn(
                  "flex items-center space-x-2 rounded-md px-2 py-1.5 text-sm transition-colors hover:bg-accent hover:text-accent-foreground",
                  isActive && "bg-accent text-accent-foreground"
                )}
              >
                {isCompleted ? (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                ) : (
                  <Circle className="h-4 w-4 text-muted-foreground" />
                )}
                <span className="truncate">{section.title}</span>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}

export function SideNav() {
  const [expandedModules, setExpandedModules] = useState<Set<number>>(new Set([1]))
  
  const toggleModule = (moduleId: number) => {
    setExpandedModules(prev => {
      const newSet = new Set(prev)
      if (newSet.has(moduleId)) {
        newSet.delete(moduleId)
      } else {
        newSet.add(moduleId)
      }
      return newSet
    })
  }

  return (
    <div className="flex h-full w-64 flex-col border-r bg-background">
      <div className="p-4">
        <h2 className="text-lg font-semibold">Содержание</h2>
      </div>
      
      <ScrollArea className="flex-1 px-4">
        <div className="space-y-4">
          {modules.map((module) => (
            <ModuleItem
              key={module.id}
              module={module}
              isExpanded={expandedModules.has(module.id)}
              onToggle={() => toggleModule(module.id)}
            />
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}

