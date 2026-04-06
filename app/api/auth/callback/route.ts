import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { cookies } from 'next/headers'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const next = requestUrl.searchParams.get('next') || '/dashboard'
  const origin = requestUrl.origin

  if (code) {
    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll()
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) => {
                cookieStore.set(name, value, options)
              })
            } catch {
              // The setAll method was called from a Server Component.
              // This can be ignored if you have middleware refreshing user sessions.
            }
          },
        },
      }
    )

    const { data, error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error && data?.user) {
      // Synchronize the newly authenticated user into our Prisma database
      await prisma.user.upsert({
        where: { id: data.user.id },
        create: {
          id: data.user.id,
          email: data.user.email!,
          name: data.user.user_metadata?.full_name || data.user.email?.split('@')[0] || 'Unknown User',
          avatarUrl: data.user.user_metadata?.avatar_url || null,
        },
        update: {
          email: data.user.email!,
          name: data.user.user_metadata?.full_name || data.user.email?.split('@')[0] || 'Unknown User',
          avatarUrl: data.user.user_metadata?.avatar_url || null,
        }
      });
      return NextResponse.redirect(new URL(next, origin))
    }
  }

  // Return the user to an error page with instructions
  return NextResponse.redirect(new URL('/auth/auth-code-error', origin))
}
