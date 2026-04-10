import { SignIn } from "@/components/auth/sign-in"
import { Suspense } from "react"

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f7f6f7] dark:bg-[#1c151d] p-4 sm:p-6 lg:p-8">
      <Suspense fallback={
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      }>
        <SignIn />
      </Suspense>
    </div>
  )
}