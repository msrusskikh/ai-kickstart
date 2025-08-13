"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { modules } from "@/lib/content"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

export function Breadcrumbs() {
  const pathname = usePathname()
  
  if (!pathname.startsWith('/learn/')) {
    return null
  }

  const pathParts = pathname.split('/').filter(Boolean)
  if (pathParts.length < 3) return null

  const moduleId = parseInt(pathParts[1])
  const sectionId = parseInt(pathParts[2])
  
  const module = modules.find(m => m.id === moduleId)
  const section = module?.sections.find(s => s.section === sectionId)

  if (!module || !section) return null

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href="/learn">Главная</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href={`/learn/${module.id}`}>{module.title}</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage className="truncate max-w-[200px]">{section.title}</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  )
}

