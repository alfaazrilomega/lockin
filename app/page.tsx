import SmoothScrolling from '@/components/layout/SmoothScrolling'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Rocket, Brain, Zap } from "lucide-react"
import AmritHero from "@/components/Hero/AmritHero"
import CtaButtons from "@/components/layout/CtaButtons"

/**
 * Root landing page — pure Server Component.
 *
 * Hydration architecture:
 *  - <SmoothScrolling>  →  client boundary (ReactLenis needs browser APIs)
 *  - <AmritHero>        →  "use client" (motion/react + useAuth)
 *  - <CtaButtons>       →  client boundary (useRouter)
 *  Everything else renders on the server, giving full SSR benefits.
 */
export default function Home() {
  return (
    <SmoothScrolling>
      <div className="min-h-screen bg-background tracking-tight">
        <AmritHero />

        {/* Features Section */}
        <section className="py-20 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center space-y-4 mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold text-foreground">
                Everything You Need in One Place
              </h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                From project management to AI-powered notes and adaptive learning,
                LockIn provides the tools you need to stay organized and productive.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <Card className="bg-background border-border hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="w-12 h-12 bg-primary/10 border border-primary/20 rounded-lg flex items-center justify-center mb-4">
                    <Rocket className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-foreground">Project Management</CardTitle>
                  <CardDescription>
                    Organize your projects, track progress, and collaborate with your team seamlessly.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    Task management
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    Team collaboration
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    Progress tracking
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-background border-border hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="w-12 h-12 bg-primary/10 border border-primary/20 rounded-lg flex items-center justify-center mb-4">
                    <Brain className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-foreground">Smart Notes</CardTitle>
                  <CardDescription>
                    AI-powered note taking with transcription, summarization, and intelligent organization.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    Voice transcription
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    AI summarization
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    Smart organization
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-background border-border hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="w-12 h-12 bg-primary/10 border border-primary/20 rounded-lg flex items-center justify-center mb-4">
                    <Zap className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-foreground">Flashcard Learning</CardTitle>
                  <CardDescription>
                    Adaptive learning system with spaced repetition for better knowledge retention.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    Spaced repetition
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    Progress tracking
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    Smart reviews
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-br from-primary/5 to-background">
          <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
            <Card className="bg-background border-border">
              <CardHeader className="space-y-4">
                <CardTitle className="text-3xl lg:text-4xl font-bold text-foreground">
                  Ready to Boost Your Productivity?
                </CardTitle>
                <CardDescription className="text-lg text-muted-foreground">
                  Join thousands of users who have already transformed their workflow with LockIn.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-3 gap-8 text-center">
                  <div>
                    <p className="text-2xl font-bold text-foreground">10K+</p>
                    <p className="text-sm text-muted-foreground">Active Users</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">99.9%</p>
                    <p className="text-sm text-muted-foreground">Uptime</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">24/7</p>
                    <p className="text-sm text-muted-foreground">Support</p>
                  </div>
                </div>

                {/* Client island — useRouter lives here */}
                <CtaButtons />
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </SmoothScrolling>
  )
}
