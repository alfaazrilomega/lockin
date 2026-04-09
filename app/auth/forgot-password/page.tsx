import { ForgotPassword } from "@/components/auth/forgot-password"

export const dynamic = "force-dynamic";

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <ForgotPassword />
    </div>
  )
}