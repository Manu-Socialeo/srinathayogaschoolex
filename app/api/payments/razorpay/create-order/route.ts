import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const { amount, currency = 'INR', description, metadata } = await req.json()

    const keyId = process.env.RAZORPAY_KEY_ID
    const keySecret = process.env.RAZORPAY_KEY_SECRET

    if (!keyId || !keySecret) {
      return NextResponse.json({ error: 'Razorpay not configured' }, { status: 500 })
    }

    const auth = Buffer.from(`${keyId}:${keySecret}`).toString('base64')
    const res = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${auth}`,
      },
      body: JSON.stringify({
        amount: amount * 100,
        currency,
        receipt: `receipt_${Date.now()}`,
        notes: metadata || {},
      }),
    })

    if (!res.ok) {
      const err = await res.text()
      return NextResponse.json({ error: err }, { status: 400 })
    }

    const order = await res.json()
    return NextResponse.json({
      id: order.id,
      amount: order.amount / 100,
      currency: order.currency,
      status: 'created',
    })
  } catch (err) {
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 })
  }
}
