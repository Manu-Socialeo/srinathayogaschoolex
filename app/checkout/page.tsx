'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function CheckoutRedirect() {
  const router = useRouter()

  useEffect(() => {
    router.replace('/dashboard/checkout')
  }, [router])

  return null
}
