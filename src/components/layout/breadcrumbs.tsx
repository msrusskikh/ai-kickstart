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
  if (pathParts.length < 2) return null

  const moduleId = parseInt(pathParts[1])
  const module = modules.find(m => m.id === moduleId)

  if (!module) return null

  // If we're on a lesson page (3+ path parts)
  if (pathParts.length >= 3) {
    const sectionId = parseInt(pathParts[2])
    const section = module.sections.find(s => s.section === sectionId)

    if (!section) return null

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

  // If we're on a module page (2 path parts)
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
          <BreadcrumbPage className="truncate max-w-[200px]">{module.title}</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  )
}

