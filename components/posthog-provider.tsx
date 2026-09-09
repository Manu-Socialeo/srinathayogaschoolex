'use client'

import { useEffect, ReactNode } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import posthog from 'posthog-js'
import { PostHogProvider as PHProvider } from 'posthog-js/react'

export function PostHogProvider({ children }: { children: ReactNode }) {
  const posthogKey = process.env.NEXT_PUBLIC_POSTHOG_KEY
  const posthogHost = process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://us.i.posthog.com'

  useEffect(() => {
    if (!posthogKey) return
    posthog.init(posthogKey, {
      api_host: posthogHost,
      person_profiles: 'identified_only',
      capture_pageview: false,
      loaded: (ph) => {
        if (process.env.NODE_ENV !== 'production') ph.opt_out_capturing()
      },
    })
  }, [posthogKey, posthogHost])

  if (!posthogKey) return <>{children}</>

  return <PHProvider client={posthog}>{children}</PHProvider>
}

export function PostHogPageView() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    if (pathname) {
      let url = window.origin + pathname
      if (searchParams?.toString()) url += '?' + searchParams.toString()
      posthog.capture('$pageview', { $current_url: url })
    }
  }, [pathname, searchParams])

  return null
}
