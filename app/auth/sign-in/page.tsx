import { SignIn } from "@/components/auth/sign-in"
import { Suspense } from "react"

export default function SignInPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#0D0D0D] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white/30"></div>
      </div>
    }>
      <SignIn />
    </Suspense>
  )
}