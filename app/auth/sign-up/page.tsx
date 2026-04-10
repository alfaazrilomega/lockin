import { SignUp } from "@/components/auth/sign-up"

export const dynamic = "force-dynamic";

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f7f6f7] dark:bg-[#1c151d] p-4 sm:p-6 lg:p-8">
      <SignUp />
    </div>
  )
}