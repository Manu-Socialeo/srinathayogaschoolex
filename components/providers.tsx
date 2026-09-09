'use client'

import { Suspense, ReactNode } from 'react'
import { CartProvider } from '@/components/cart/cart-context'
import { AuthProvider } from '@/components/auth-provider'
import { PostHogProvider, PostHogPageView } from '@/components/posthog-provider'

export function Providers({ children }: { children: ReactNode }) {
  return (
    <PostHogProvider>
      <AuthProvider>
        <CartProvider>
          <Suspense fallback={null}>
            <PostHogPageView />
          </Suspense>
          {children}
        </CartProvider>
      </AuthProvider>
    </PostHogProvider>
  )
}
