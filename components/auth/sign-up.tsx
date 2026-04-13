"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/hooks/use-auth"
import { Loader2, Eye, EyeOff, ArrowRight } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import Link from "next/link"
import { Logo } from "@/components/shared/Logo"

// Same stagger hover mechanic as contact page
const StaggeredHoverText = ({ text }: { text: string }) => {
  return (
    <span className="relative inline-flex overflow-hidden">
      <span className="flex items-center">
        {text.split("").map((char, i) => (
          <span
            key={`p-${i}`}
            className="inline-block transition-transform duration-[0.4s] ease-[cubic-bezier(0.85,0,0.15,1)] group-hover/btn:-translate-y-full"
            style={{ transitionDelay: `${i * 12}ms` }}
          >
            {char === " " ? "\u00A0" : char}
          </span>
        ))}
      </span>
      <span className="absolute left-0 top-0 flex items-center h-full">
        {text.split("").map((char, i) => (
          <span
            key={`s-${i}`}
            className="inline-block transition-transform duration-[0.4s] ease-[cubic-bezier(0.85,0,0.15,1)] translate-y-full group-hover/btn:translate-y-0"
            style={{ transitionDelay: `${i * 12}ms` }}
          >
            {char === " " ? "\u00A0" : char}
          </span>
        ))}
      </span>
    </span>
  )
}

export function SignUp() {
  const { signUp, loading } = useAuth()
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  const [hasStarted, setHasStarted] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setHasStarted(true), 100)
    return () => clearTimeout(timer)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError(null)

    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      setFormError("Please fill in all fields")
      return
    }
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setFormError("Please enter a valid email address")
      return
    }
    if (formData.password.length < 6) {
      setFormError("Password must be at least 6 characters long")
      return
    }
    if (formData.password !== formData.confirmPassword) {
      setFormError("Passwords do not match")
      return
    }

    const result = await signUp(formData.email, formData.password, formData.name)
    if (result.success) {
      window.location.assign("/auth/verify-email")
    } else {
      toast({
        title: "Registration Error",
        description: result.error || "User already exists or sign up failed.",
        variant: "destructive",
      })
    }
  }

  const fields = [
    { id: "name", label: "Your full name*", type: "text", key: "name" as const, toggle: false },
    { id: "email", label: "Your email address*", type: "email", key: "email" as const, toggle: false },
    { id: "password", label: "Create a password*", type: showPassword ? "text" : "password", key: "password" as const, toggle: true, show: showPassword, setShow: setShowPassword },
    { id: "confirmPassword", label: "Confirm your password*", type: showConfirmPassword ? "text" : "password", key: "confirmPassword" as const, toggle: true, show: showConfirmPassword, setShow: setShowConfirmPassword },
  ]

  return (
    <div className="w-full min-h-screen bg-[#F8F9FA] flex flex-col md:flex-row-reverse overflow-hidden">

      {/* ── RIGHT (visually): Branding Visual Column ─────── */}
      {/* Note: flex-row-reverse so the visual is on the RIGHT for sign-up, 
          creating a mirror of the sign-in layout — same family, different position */}
      <div className="relative w-full md:w-[42%] min-h-[35vh] md:min-h-screen overflow-hidden flex-shrink-0">
        <video
          autoPlay loop muted playsInline
          className="absolute inset-0 w-full h-full object-cover object-center"
        >
          <source src="/video/Gradient-background.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/20 to-black/80" />
        <div className="absolute inset-0 bg-[url('/images/noise.png')] opacity-[0.04] pointer-events-none mix-blend-overlay z-10" />

        <div className="relative z-20 h-full flex flex-col justify-between p-10 md:p-14">
          <div
            className={`transition-all duration-[1.1s] ease-[cubic-bezier(0.16,1,0.3,1)] ${hasStarted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
            style={{ transitionDelay: "100ms" }}
          >
            <Logo className="size-10 brightness-0 invert" />
          </div>

          <div className="mt-auto">
            <div className="overflow-hidden mb-3">
              <div
                className={`transition-transform duration-[1.3s] ease-[cubic-bezier(0.16,1,0.3,1)] ${hasStarted ? "translate-y-0" : "translate-y-[110%]"}`}
                style={{ transitionDelay: "200ms" }}
              >
                <p className="font-satoshi text-white/50 text-sm font-medium tracking-widest uppercase mb-4">Get started</p>
              </div>
            </div>

            {["Start", "Fresh."].map((word, i) => (
              <div key={i} className="overflow-hidden">
                <div
                  className={`transition-transform duration-[1.3s] ease-[cubic-bezier(0.16,1,0.3,1)] ${hasStarted ? "translate-y-0" : "translate-y-[110%]"}`}
                  style={{ transitionDelay: `${300 + i * 150}ms` }}
                >
                  <h1 className="font-satoshi text-[clamp(4rem,8vw,8rem)] font-bold leading-[0.88] tracking-tighter text-white">
                    {word}
                  </h1>
                </div>
              </div>
            ))}

            <div className="overflow-hidden mt-6">
              <div
                className={`transition-transform duration-[1.1s] ease-[cubic-bezier(0.16,1,0.3,1)] ${hasStarted ? "translate-y-0" : "translate-y-[110%]"}`}
                style={{ transitionDelay: "650ms" }}
              >
                <p className="font-satoshi text-white/60 text-base leading-relaxed max-w-[280px]">
                  One workspace for everything. Calendar, notes, and AI — all in one place.
                </p>
              </div>
            </div>

            <div
              className={`mt-10 pt-6 border-t border-white/10 transition-all duration-[1s] ease-[cubic-bezier(0.16,1,0.3,1)] ${hasStarted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
              style={{ transitionDelay: "800ms" }}
            >
              <p className="font-satoshi text-sm text-white/40">
                Already have an account?{" "}
                <Link href="/auth/sign-in" className="text-white/70 hover:text-white transition-colors underline underline-offset-4">
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── LEFT: Form Column ─────────────────────────────── */}
      <div className="w-full md:w-[58%] flex flex-col justify-center px-8 md:px-16 lg:px-24 py-16 md:py-0 bg-[#F8F9FA]">
        <div className="max-w-md w-full mx-auto md:mx-0">

          {/* Heading */}
          <div className="mb-12">
            <div className="overflow-hidden mb-3">
              <div
                className={`transition-transform duration-[1.1s] ease-[cubic-bezier(0.16,1,0.3,1)] ${hasStarted ? "translate-y-0" : "translate-y-[110%]"}`}
                style={{ transitionDelay: "400ms" }}
              >
                <p className="font-satoshi text-black/40 text-xs font-medium tracking-widest uppercase">Create account</p>
              </div>
            </div>
            <div className="overflow-hidden">
              <div
                className={`transition-transform duration-[1.3s] ease-[cubic-bezier(0.16,1,0.3,1)] ${hasStarted ? "translate-y-0" : "translate-y-[110%]"}`}
                style={{ transitionDelay: "500ms" }}
              >
                <h2 className="font-satoshi text-[clamp(2.2rem,4vw,3.2rem)] font-bold text-black leading-[1] tracking-tight">
                  Join the<br />workspace.
                </h2>
              </div>
            </div>
          </div>

          {/* Error */}
          {formError && (
            <div className="mb-8 bg-red-50 border border-red-200 text-red-600 rounded-xl p-3 text-sm font-satoshi">
              {formError}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-9">
            {fields.map((field, idx) => (
              <div key={field.id} className="relative overflow-hidden">
                <div
                  className={`transition-transform duration-[1.1s] ease-[cubic-bezier(0.16,1,0.3,1)] ${hasStarted ? "translate-y-0" : "translate-y-[120%]"}`}
                  style={{ transitionDelay: `${700 + idx * 130}ms` }}
                >
                  <div className="relative">
                    <input
                      id={field.id}
                      type={field.type}
                      required
                      disabled={loading}
                      value={formData[field.key]}
                      onChange={(e) => setFormData(prev => ({ ...prev, [field.key]: e.target.value }))}
                      placeholder={field.label}
                      className="w-full bg-transparent border-b border-black/20 py-3 text-lg font-satoshi text-black focus:outline-none focus:border-black transition-colors peer placeholder-transparent disabled:opacity-50"
                    />
                    <label
                      htmlFor={field.id}
                      className="absolute left-0 top-3 text-black/50 font-satoshi text-lg transition-all peer-focus:-top-6 peer-focus:text-sm peer-focus:text-black peer-[:not(:placeholder-shown)]:-top-6 peer-[:not(:placeholder-shown)]:text-sm peer-[:not(:placeholder-shown)]:text-black pointer-events-none"
                    >
                      {field.label}
                    </label>
                    {field.toggle && (
                      <button
                        type="button"
                        onClick={() => field.setShow?.(!field.show)}
                        className="absolute right-0 top-3 text-black/30 hover:text-black/60 transition-colors"
                      >
                        {field.show ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {/* Submit */}
            <div className="overflow-hidden mt-2">
              <div
                className={`transition-transform duration-[1.1s] ease-[cubic-bezier(0.16,1,0.3,1)] ${hasStarted ? "translate-y-0" : "translate-y-[120%]"}`}
                style={{ transitionDelay: "1250ms" }}
              >
                <button
                  type="submit"
                  disabled={loading}
                  className="group/btn w-full bg-[#111] hover:bg-black text-white font-satoshi font-bold tracking-wide py-5 rounded-[2rem] transition-colors duration-300 active:scale-[0.98] shadow-lg disabled:opacity-60 flex items-center justify-center gap-3"
                >
                  {loading ? (
                    <><Loader2 className="size-4 animate-spin" /> CREATING ACCOUNT...</>
                  ) : (
                    <><StaggeredHoverText text="JOIN LOCKIN" /><ArrowRight className="size-4" /></>
                  )}
                </button>
              </div>
            </div>
          </form>

        </div>
      </div>
    </div>
  )
}