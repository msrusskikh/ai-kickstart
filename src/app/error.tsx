'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
      <h2 className="text-2xl font-bold text-foreground">Что-то пошло не так!</h2>
      <p className="text-muted-foreground text-center max-w-md">
        Произошла ошибка при загрузке страницы. Попробуйте обновить страницу или вернуться назад.
      </p>
      <div className="flex space-x-3">
        <Button onClick={reset} variant="default">
          Попробовать снова
        </Button>
        <Button onClick={() => window.history.back()} variant="outline">
          Назад
        </Button>
      </div>
    </div>
  )
}
