"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { Loader2, Eye, EyeOff, ArrowRight } from "lucide-react"
import Link from "next/link"
import { Logo } from "@/components/shared/Logo"

// Stagger hover text — same mechanic as contact page button
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

export function SignIn() {
  const searchParams = useSearchParams()
  const { signIn, loading } = useAuth()

  const [formData, setFormData] = useState({ email: "", password: "" })
  const [showPassword, setShowPassword] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  const [hasStarted, setHasStarted] = useState(false)

  const redirectUrl = searchParams.get("redirect") || "/dashboard"

  useEffect(() => {
    const timer = setTimeout(() => setHasStarted(true), 100)
    return () => clearTimeout(timer)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError(null)

    if (!formData.email || !formData.password) {
      setFormError("Please fill in all fields")
      return
    }
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setFormError("Please enter a valid email address")
      return
    }

    const result = await signIn(formData.email, formData.password)
    if (result.success) {
      window.location.assign(redirectUrl)
    } else {
      setFormError(result.error || "Sign in failed")
    }
  }

  const fields = [
    { id: "email", label: "Enter your email*", type: "email", key: "email" as const },
    { id: "password", label: "Enter your password*", type: showPassword ? "text" : "password", key: "password" as const },
  ]

  return (
    <div className="w-full min-h-screen bg-[#F8F9FA] flex flex-col md:flex-row overflow-hidden">

      {/* ── LEFT: Branding Visual Column ─────────────────── */}
      <div className="relative w-full md:w-[45%] min-h-[35vh] md:min-h-screen overflow-hidden flex-shrink-0">
        {/* Video background */}
        <video
          autoPlay loop muted playsInline
          className="absolute inset-0 w-full h-full object-cover object-center"
        >
          <source src="/video/Gradient-background.mp4" type="video/mp4" />
        </video>

        {/* Deep dark overlay for contrast */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/20 to-black/75" />
        {/* Noise texture */}
        <div className="absolute inset-0 bg-[url('/images/noise.png')] opacity-[0.04] pointer-events-none mix-blend-overlay z-10" />

        {/* Content overlay */}
        <div className="relative z-20 h-full flex flex-col justify-between p-10 md:p-14">
          {/* Top: Logo */}
          <div
            className={`transition-all duration-[1.1s] ease-[cubic-bezier(0.16,1,0.3,1)] ${hasStarted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
            style={{ transitionDelay: "100ms" }}
          >
            <Logo className="size-10 brightness-0 invert" />
            {/* invert keeps logo white on the dark video side */}
          </div>

          {/* Middle/Bottom: Big editorial headline */}
          <div className="mt-auto">
            <div className="overflow-hidden mb-3">
              <div
                className={`transition-transform duration-[1.3s] ease-[cubic-bezier(0.16,1,0.3,1)] ${hasStarted ? "translate-y-0" : "translate-y-[110%]"}`}
                style={{ transitionDelay: "200ms" }}
              >
                <p className="font-satoshi text-white/50 text-sm font-medium tracking-widest uppercase mb-4">Welcome back</p>
              </div>
            </div>

            {["Lock", "In."].map((word, i) => (
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
                  Your workspace, your rules. Pick up right where you left off.
                </p>
              </div>
            </div>

            {/* Bottom divider + link */}
            <div
              className={`mt-10 pt-6 border-t border-white/10 transition-all duration-[1s] ease-[cubic-bezier(0.16,1,0.3,1)] ${hasStarted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
              style={{ transitionDelay: "800ms" }}
            >
              <p className="font-satoshi text-sm text-white/40">
                New here?{" "}
                <Link href="/auth/sign-up" className="text-white/70 hover:text-white transition-colors underline underline-offset-4">
                  Create your account
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── RIGHT: Form Column ────────────────────────────── */}
      <div className="w-full md:w-[55%] flex flex-col justify-center px-8 md:px-16 lg:px-24 py-16 md:py-0 bg-[#F8F9FA]">
        <div className="max-w-md w-full mx-auto md:mx-0">

          {/* Heading */}
          <div className="mb-14">
            <div className="overflow-hidden mb-3">
              <div
                className={`transition-transform duration-[1.1s] ease-[cubic-bezier(0.16,1,0.3,1)] ${hasStarted ? "translate-y-0" : "translate-y-[110%]"}`}
                style={{ transitionDelay: "400ms" }}
              >
                <p className="font-satoshi text-black/40 text-xs font-medium tracking-widest uppercase">Sign in</p>
              </div>
            </div>
            <div className="overflow-hidden">
              <div
                className={`transition-transform duration-[1.3s] ease-[cubic-bezier(0.16,1,0.3,1)] ${hasStarted ? "translate-y-0" : "translate-y-[110%]"}`}
                style={{ transitionDelay: "500ms" }}
              >
                <h2 className="font-satoshi text-[clamp(2.2rem,4vw,3.2rem)] font-bold text-black leading-[1] tracking-tight">
                  Good to see<br />you again.
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

          {/* Form — floating label, bottom border, same as contact */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-10">
            {fields.map((field, idx) => (
              <div key={field.id} className="relative group/field overflow-hidden">
                <div
                  className={`transition-transform duration-[1.1s] ease-[cubic-bezier(0.16,1,0.3,1)] ${hasStarted ? "translate-y-0" : "translate-y-[120%]"}`}
                  style={{ transitionDelay: `${700 + idx * 150}ms` }}
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
                    {field.key === "password" && (
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-0 top-3 text-black/30 hover:text-black/60 transition-colors"
                      >
                        {showPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {/* Forgot password */}
            <div
              className={`-mt-6 text-right transition-all duration-[1s] ease-[cubic-bezier(0.16,1,0.3,1)] ${hasStarted ? "opacity-100" : "opacity-0"}`}
              style={{ transitionDelay: "1050ms" }}
            >
              <Link href="/auth/forgot-password" className="font-satoshi text-sm text-black/40 hover:text-black transition-colors">
                Forgot password?
              </Link>
            </div>

            {/* Submit */}
            <div className="overflow-hidden">
              <div
                className={`transition-transform duration-[1.1s] ease-[cubic-bezier(0.16,1,0.3,1)] ${hasStarted ? "translate-y-0" : "translate-y-[120%]"}`}
                style={{ transitionDelay: "1100ms" }}
              >
                <button
                  type="submit"
                  disabled={loading}
                  className="group/btn w-full bg-[#111] hover:bg-black text-white font-satoshi font-bold tracking-wide py-5 rounded-[2rem] transition-colors duration-300 active:scale-[0.98] shadow-lg disabled:opacity-60 flex items-center justify-center gap-3"
                >
                  {loading ? (
                    <><Loader2 className="size-4 animate-spin" /> SIGNING IN...</>
                  ) : (
                    <><StaggeredHoverText text="ENTER WORKSPACE" /><ArrowRight className="size-4" /></>
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