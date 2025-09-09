import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
      <h2 className="text-2xl font-bold text-foreground">Страница не найдена</h2>
      <p className="text-muted-foreground text-center max-w-md">
        Запрашиваемая страница не существует или была перемещена.
      </p>
      <Button asChild>
        <Link href="/learn">
          Вернуться на главную
        </Link>
      </Button>
    </div>
  )
}
