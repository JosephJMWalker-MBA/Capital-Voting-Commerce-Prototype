import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { prisma } from '@/lib/prisma'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_mock', {
  apiVersion: '2023-10-16' as any, // Using a recent API version
})

export async function POST(req: Request) {
  try {
    const { items } = await req.json()

    if (!items || items.length === 0) {
      return new NextResponse('Cart is empty', { status: 400 })
    }

    // Phase 1: We'll create an Order in our DB first as "PENDING"
    // so we can attach the Stripe session ID to it.
    
    // Calculate total amount
    const totalAmount = items.reduce((acc: number, item: any) => acc + (item.price * item.quantity), 0)

    const order = await prisma.order.create({
      data: {
        totalAmount,
        currency: 'USD',
        status: 'PENDING',
        items: {
          create: items.map((item: any) => ({
            variantId: item.variantId,
            quantity: item.quantity,
            unitPrice: item.price,
            totalPrice: item.price * item.quantity,
          }))
        }
      }
    })

    const lineItems = items.map((item: any) => ({
      price_data: {
        currency: 'usd',
        product_data: {
          name: `${item.name} (${item.variantName})`,
          description: `Supports: ${item.proposalName} (${item.campaignName}) - Generates ${item.voteValue * item.quantity} votes`,
          metadata: {
            productId: item.productId,
            variantId: item.variantId,
            proposalId: item.proposalId,
            campaignId: item.campaignId,
            voteValue: item.voteValue
          }
        },
        unit_amount: Math.round(item.price * 100), // Stripe expects cents
      },
      quantity: item.quantity,
    }))

    // In a real environment with missing Stripe keys, we simulate success
    if (!process.env.STRIPE_SECRET_KEY || process.env.STRIPE_SECRET_KEY === 'sk_test_mock') {
      console.warn("Using mock Stripe flow because STRIPE_SECRET_KEY is missing.")
      return NextResponse.json({ url: `/checkout/success?session_id=mock_session_${order.id}` })
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/cart`,
      metadata: {
        orderId: order.id
      }
    })

    // Update order with session ID
    await prisma.order.update({
      where: { id: order.id },
      data: { stripeSessionId: session.id }
    })

    return NextResponse.json({ url: session.url })
  } catch (error: any) {
    console.error('Checkout error:', error)
    return new NextResponse(error.message || 'Internal Server Error', { status: 500 })
  }
}
