"use client"

import React, { useState, useEffect } from 'react'
import { Star, Calendar, User, MessageSquare, Heart, ArrowLeft } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/lesson/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { CustomThemeToggle } from '@/components/ui/custom-theme-toggle'
import { useRouter } from 'next/navigation'

interface ReviewData {
  id: string
  rating: number
  review: string
  timestamp: string
}

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<ReviewData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    fetchReviews()
  }, [])

  const fetchReviews = async () => {
    try {
      const response = await fetch('/api/reviews')
      if (!response.ok) throw new Error('Failed to fetch reviews')
      const data = await response.json()
      setReviews(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getRatingColor = (rating: number) => {
    if (rating >= 4) return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
    if (rating >= 3) return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
    return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
  }

  const averageRating = reviews.length > 0 
    ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1)
    : 0

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-6 py-8">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-6 py-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center text-red-600 dark:text-red-400">
              <p>Ошибка загрузки отзывов: {error}</p>
              <button 
                onClick={fetchReviews}
                className="mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
              >
                Попробовать снова
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-8">
        <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.back()}
                className="flex items-center space-x-2 text-muted-foreground hover:text-foreground bg-card dark:bg-muted/50 border border-border/30 shadow-sm hover:bg-accent hover:text-accent-foreground"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Назад</span>
              </Button>
            </div>
            <CustomThemeToggle />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Отзывы о курсе
          </h1>
          <p className="text-muted-foreground">
            Всего отзывов: {reviews.length}
          </p>
        </div>

        {/* Stats */}
        {reviews.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <Star className="h-5 w-5 text-yellow-500" />
                  <span className="text-sm font-medium text-muted-foreground">
                    Средняя оценка
                  </span>
                </div>
                <p className="text-2xl font-bold text-foreground mt-2">
                  {averageRating}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <MessageSquare className="h-5 w-5 text-blue-500" />
                  <span className="text-sm font-medium text-muted-foreground">
                    Всего отзывов
                  </span>
                </div>
                <p className="text-2xl font-bold text-foreground mt-2">
                  {reviews.length}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <Heart className="h-5 w-5 text-red-500" />
                  <span className="text-sm font-medium text-muted-foreground">
                    Положительных
                  </span>
                </div>
                <p className="text-2xl font-bold text-foreground mt-2">
                  {reviews.filter(r => r.rating >= 4).length}
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Reviews List */}
        {reviews.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">
                Пока нет отзывов
              </h3>
              <p className="text-muted-foreground">
                Отзывы появятся здесь, как только пользователи начнут их оставлять.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {reviews
              .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
              .map((review) => (
                <Card key={review.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                          <User className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground">
                            Анонимный пользователь
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            ID: {review.id.slice(0, 8)}...
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className={getRatingColor(review.rating)}>
                          {review.rating}/5
                        </Badge>
                        <div className="flex items-center text-muted-foreground text-sm">
                          <Calendar className="h-3 w-3 mr-1" />
                          {formatDate(review.timestamp)}
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* Rating Stars */}
                      <div className="flex space-x-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`h-4 w-4 ${
                              star <= review.rating
                                ? 'text-yellow-400 fill-current'
                                : 'text-gray-300 dark:text-gray-600'
                            }`}
                          />
                        ))}
                      </div>

                      {/* Review Text */}
                      <div>
                        <h4 className="font-medium text-foreground mb-2">
                          Отзыв:
                        </h4>
                        <p className="text-foreground leading-relaxed">
                          {review.review}
                        </p>
                      </div>

                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        )}
        </div>
      </div>
    </div>
  )
}
