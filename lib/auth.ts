import { createBrowserClient } from './supabase'
import type { Profile } from './supabase-types'

function sb() {
  return createBrowserClient()
}

function getRedirectBase(): string {
  return process.env.NEXT_PUBLIC_APP_URL || (typeof window !== 'undefined' ? window.location.origin : '')
}

export async function signUpWithEmail(email: string, password: string, name: string) {
  const { data, error } = await sb().auth.signUp({
    email,
    password,
    options: { data: { name } },
  })
  if (error) throw error
  return data
}

export async function signInWithEmail(email: string, password: string) {
  const { data, error } = await sb().auth.signInWithPassword({ email, password })
  if (error) throw error
  return data
}

export async function signInWithOtp(email: string) {
  const { error } = await sb().auth.signInWithOtp({
    email,
    options: {
      shouldCreateUser: true,
      emailRedirectTo: `${getRedirectBase()}/auth/callback`,
    },
  })
  if (error) throw error
}

export async function signInWithGoogle() {
  const { error } = await sb().auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo: `${getRedirectBase()}/auth/callback` },
  })
  if (error) throw error
}

export async function signOut() {
  const { error } = await sb().auth.signOut()
  if (error) throw error
}

export async function getCurrentUser() {
  const { data: { user }, error } = await sb().auth.getUser()
  if (error || !user) return null
  return user
}

export async function getCurrentProfile(): Promise<Profile | null> {
  const user = await getCurrentUser()
  if (!user) return null
  let { data } = await sb()
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()
  if (!data) {
    const name = user.user_metadata?.name || user.email?.split('@')[0] || ''
    const { data: inserted, error } = await sb()
      .from('profiles')
      .insert({
        id: user.id,
        email: user.email || '',
        name,
        password_set: !!(user.encrypted_password),
      })
      .select()
      .single()
    if (!error && inserted) data = inserted
  }
  return data
}

export async function resetPassword(email: string) {
  const { error } = await sb().auth.resetPasswordForEmail(email, {
    redirectTo: `${getRedirectBase()}/auth/callback?next=/dashboard/reset-password`,
  })
  if (error) throw error
}

export async function updateProfile(updates: Omit<Partial<Profile>, 'id' | 'created_at'>) {
  const user = await getCurrentUser()
  if (!user) throw new Error('Not authenticated')
  const { error } = await sb()
    .from('profiles')
    .update(updates)
    .eq('id', user.id)
  if (error) throw error
}
