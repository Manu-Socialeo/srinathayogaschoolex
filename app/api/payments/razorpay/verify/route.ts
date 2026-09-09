import { NextResponse } from 'next/server'
import crypto from 'crypto'

export async function POST(req: Request) {
  try {
    const { orderId, paymentId, signature } = await req.json()
    const keySecret = process.env.RAZORPAY_KEY_SECRET

    if (!keySecret) {
      return NextResponse.json({ error: 'Razorpay not configured' }, { status: 500 })
    }

    const expected = crypto
      .createHmac('sha256', keySecret)
      .update(`${orderId}|${paymentId}`)
      .digest('hex')

    if (
      !signature ||
      typeof signature !== 'string' ||
      expected.length !== signature.length ||
      !crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature))
    ) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
    }

    return NextResponse.json({ verified: true })
  } catch (err) {
    return NextResponse.json({ error: 'Verification failed' }, { status: 500 })
  }
}
