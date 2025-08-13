'use client'

import { Button } from '@/components/ui/button'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html>
      <body>
        <div className="flex flex-col items-center justify-center min-h-screen space-y-4 p-6">
          <h2 className="text-3xl font-bold text-foreground">Критическая ошибка</h2>
          <p className="text-muted-foreground text-center max-w-md">
            Произошла серьезная ошибка в приложении. Попробуйте обновить страницу.
          </p>
          <Button onClick={reset} variant="default">
            Попробовать снова
          </Button>
        </div>
      </body>
    </html>
  )
}
