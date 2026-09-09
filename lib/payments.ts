// Payment integration placeholder
// Swap implementation by uncommenting the desired provider

type PaymentProvider = 'razorpay' | 'stripe'

const ACTIVE_PROVIDER: PaymentProvider = 'razorpay'

export interface PaymentSession {
  id: string
  amount: number
  currency: string
  status: 'created' | 'paid' | 'failed'
}

export interface CreateOrderParams {
  amount: number
  currency?: string
  description?: string
  metadata?: Record<string, string>
}

// Razorpay
async function createRazorpayOrder(params: CreateOrderParams): Promise<PaymentSession | null> {
  const res = await fetch('/api/payments/razorpay/create-order', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  })
  if (!res.ok) return null
  return res.json()
}

async function verifyRazorpayPayment(
  orderId: string,
  paymentId: string,
  signature: string
): Promise<boolean> {
  const res = await fetch('/api/payments/razorpay/verify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ orderId, paymentId, signature }),
  })
  return res.ok
}

// Stripe
async function createStripePaymentIntent(params: CreateOrderParams): Promise<PaymentSession | null> {
  const res = await fetch('/api/payments/stripe/create-intent', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  })
  if (!res.ok) return null
  return res.json()
}

// Unified API
export async function createPayment(params: CreateOrderParams): Promise<PaymentSession | null> {
  switch (ACTIVE_PROVIDER) {
    case 'razorpay':
      return createRazorpayOrder(params)
    case 'stripe':
      return createStripePaymentIntent(params)
    default:
      return null
  }
}

export async function verifyPayment(
  provider: PaymentProvider,
  ...args: string[]
): Promise<boolean> {
  switch (provider) {
    case 'razorpay':
      return verifyRazorpayPayment(args[0], args[1], args[2])
    case 'stripe':
      return true
    default:
      return false
  }
}

export function getActiveProvider(): PaymentProvider {
  return ACTIVE_PROVIDER
}
