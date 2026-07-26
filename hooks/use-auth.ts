"use client"

import { useState, useEffect, useCallback } from "react"
import { createClientComponentClient } from "@/lib/supabase/client"

import { type Session } from "@supabase/supabase-js"
import { type User } from "@/lib/types"

interface AuthState {
  user: User | null
  loading: boolean
  error: string | null
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    user: null,
    loading: true,
    error: null
  })

  const supabase = createClientComponentClient()

  const setUserFromSession = useCallback(async (session: Session) => {
    try {
      const user: User = {
        id: session.user.id,
        email: session.user.email || '',
        name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'User',
        avatarUrl: session.user.user_metadata?.avatar_url,
        createdAt: new Date(session.user.created_at || new Date().toISOString()),
        updatedAt: new Date(session.user.updated_at || new Date().toISOString())
      }
      
      setState(prev => ({ ...prev, user, loading: false, error: null }))
    } catch (e) {
      console.error('Failed to set user from session:', e)
      setState(prev => ({ ...prev, loading: false, error: 'Failed to set user from session' }))
    }
  }, [])

  const checkSession = useCallback(async () => {
    try {
      const { data: { session }, error } = await supabase.auth.getSession()
      
      if (error) {
        setState(prev => ({ ...prev, loading: false, error: error.message }))
        return
      }

      if (session) {
        await setUserFromSession(session)
      } else {
        setState(prev => ({ ...prev, loading: false }))
      }
    } catch (e) {
      console.error('Failed to check session:', e)
      setState(prev => ({ ...prev, loading: false, error: 'Failed to check session' }))
    }
  }, [supabase.auth, setUserFromSession])

  useEffect(() => {
    // Check initial session
    const initializeAuth = async () => {
      await checkSession()
    }
    
    initializeAuth()
    
    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        setUserFromSession(session)
      } else if (event === 'SIGNED_OUT') {
        setState(prev => ({ ...prev, user: null, loading: false }))
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [checkSession, setUserFromSession, supabase.auth])

  const signIn = async (email: string, password: string) => {
    setState(prev => ({ ...prev, loading: true, error: null }))
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        setState(prev => ({ ...prev, loading: false, error: error.message }))
        return { success: false, error: error.message }
      }

      return { success: true, data }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Sign in failed'
      setState(prev => ({ ...prev, loading: false, error: message }))
      return { success: false, error: message }
    }
  }

  const signUp = async (email: string, password: string, name: string) => {
    setState(prev => ({ ...prev, loading: true, error: null }))
    
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
          },
          emailRedirectTo: `${window.location.origin}/api/auth/callback`,
        },
      })


      if (error) {
        setState(prev => ({ ...prev, loading: false, error: error.message }))
        return { success: false, error: error.message }
      }

      return { success: true, data }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Sign up failed'
      setState(prev => ({ ...prev, loading: false, error: message }))
      return { success: false, error: message }
    }
  }

  const signOut = async () => {
    setState(prev => ({ ...prev, loading: true }))
    
    try {
      const { error } = await supabase.auth.signOut()
      
      if (error) {
        setState(prev => ({ ...prev, loading: false, error: error.message }))
        return { success: false, error: error.message }
      }

      setState(prev => ({ ...prev, user: null, loading: false }))
      return { success: true }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Sign out failed'
      setState(prev => ({ ...prev, loading: false, error: message }))
      return { success: false, error: message }
    }
  }

  const resetPassword = async (email: string) => {
    setState(prev => ({ ...prev, loading: true, error: null }))
    
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      })

      if (error) {
        setState(prev => ({ ...prev, loading: false, error: error.message }))
        return { success: false, error: error.message }
      }

      setState(prev => ({ ...prev, loading: false }))
      return { success: true }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to send reset email'
      setState(prev => ({ ...prev, loading: false, error: message }))
      return { success: false, error: message }
    }
  }

  const updatePassword = async (newPassword: string) => {
    setState(prev => ({ ...prev, loading: true, error: null }))
    
    try {
      const { data, error } = await supabase.auth.updateUser({
        password: newPassword,
      })

      if (error) {
        setState(prev => ({ ...prev, loading: false, error: error.message }))
        return { success: false, error: error.message }
      }

      setState(prev => ({ ...prev, loading: false }))
      return { success: true, data }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to update password'
      setState(prev => ({ ...prev, loading: false, error: message }))
      return { success: false, error: message }
    }
  }

  return {
    ...state,
    signIn,
    signUp,
    signOut,
    resetPassword,
    updatePassword,
  }
}