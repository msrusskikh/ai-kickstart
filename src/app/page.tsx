import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/lesson/card"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="container mx-auto px-6 py-24">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h1 className="text-5xl font-bold tracking-tight">
            Learn at Your Own Pace
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed">
            An ultra-minimal, interactive education platform designed for focused learning. 
            Clean, distraction-free, and built for modern learners.
          </p>
          <div className="flex items-center justify-center space-x-4">
            <Button asChild size="lg">
              <Link href="/learn">
                Start Learning
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/learn">
                Continue Learning
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-6 py-16">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            Why Choose This Platform?
          </h2>
          
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Focused Learning</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Clean, distraction-free interface that helps you concentrate on what matters most - your learning.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Interactive Quizzes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Test your knowledge with multiple-choice questions and reflection prompts that reinforce learning.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Progress Tracking</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Visual progress indicators and completion tracking to keep you motivated and on track.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Keyboard Shortcuts</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Navigate efficiently with keyboard shortcuts designed for power users and accessibility.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Responsive Design</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Learn anywhere with a design that works perfectly on desktop, tablet, and mobile devices.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Dark Mode</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Comfortable reading in any lighting condition with automatic dark/light mode switching.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="container mx-auto px-6 py-16">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <h2 className="text-3xl font-bold">
            Ready to Start Your Learning Journey?
          </h2>
          <p className="text-lg text-muted-foreground">
            Join thousands of learners who have already discovered the power of focused, interactive education.
          </p>
          <Button asChild size="lg">
            <Link href="/learn">
              Get Started Now
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
