"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

/**
 * Isolated client island for the CTA button interactions.
 * Extracted so app/page.tsx can remain a pure Server Component.
 */
export default function CtaButtons() {
  const router = useRouter()

  return (
    <div className="flex flex-col sm:flex-row gap-4 justify-center">
      <Button
        size="lg"
        className="bg-primary hover:bg-primary/90 text-primary-foreground text-lg px-8 py-6"
        onClick={() => router.push('/dashboard')}
      >
        Start Free Trial
        <ArrowRight className="ml-2 h-5 w-5" />
      </Button>
      <Button
        size="lg"
        variant="outline"
        className="text-lg px-8 py-6 border-border"
        onClick={() => router.push('/auth/sign-in')}
      >
        Sign In
      </Button>
    </div>
  )
}
