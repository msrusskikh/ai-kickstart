"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import { type ThemeProviderProps } from "next-themes/dist/types"

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  // Ensure theme is properly initialized
  React.useEffect(() => {
    // Force light mode as default if no theme is set
    const currentTheme = localStorage.getItem('theme')
    if (!currentTheme) {
      localStorage.setItem('theme', 'light')
      document.documentElement.classList.remove('dark')
      document.documentElement.classList.add('light')
    }
    
    // Ensure CSS variables are loaded
    const root = document.documentElement
    if (!root.style.getPropertyValue('--background')) {
      console.warn('CSS variables not loaded, applying fallback colors')
      root.classList.add('fallback-colors')
    }
  }, [])

  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}
