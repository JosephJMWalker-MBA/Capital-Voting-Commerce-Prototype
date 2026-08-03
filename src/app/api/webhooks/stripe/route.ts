import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { prisma } from '@/lib/prisma'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_mock', {
  apiVersion: '2023-10-16' as any,
})

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET

export async function POST(req: Request) {
  const payload = await req.text()
  const sig = req.headers.get('stripe-signature') as string

  let event: Stripe.Event;

  try {
    if (!endpointSecret) {
      // For local testing without a webhook secret
      event = JSON.parse(payload)
    } else {
      event = stripe.webhooks.constructEvent(payload, sig, endpointSecret)
    }
  } catch (err: any) {
    console.error(`Webhook Error: ${err.message}`)
    return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 })
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const orderId = session.metadata?.orderId

        if (!orderId) {
          throw new Error('No orderId in session metadata')
        }

        // Idempotency check: see if payment already exists for this order
        const existingOrder = await prisma.order.findUnique({
          where: { id: orderId },
          include: { payments: true }
        })

        if (!existingOrder) {
          throw new Error(`Order ${orderId} not found`)
        }

        if (existingOrder.status === 'PAID') {
          // Already processed
          break;
        }

        // 1. Update Order Status
        const updatedOrder = await prisma.order.update({
          where: { id: orderId },
          data: { status: 'PAID' },
          include: {
            items: {
              include: {
                variant: {
                  include: {
                    product: {
                      include: {
                        proposal: {
                          include: { campaign: true }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        })

        // 2. Create Payment Record
        const payment = await prisma.payment.create({
          data: {
            orderId: orderId,
            stripePaymentIntentId: (session.payment_intent as string) || session.id,
            amount: updatedOrder.totalAmount,
            currency: updatedOrder.currency,
            status: 'succeeded'
          }
        })

        // 3. Create Immutable Vote Ledger Entries
        // Every vote must be traceable to a successful payment and order item
        const voteEntries = updatedOrder.items.map(item => {
          const product = item.variant.product
          const proposal = product.proposal
          const campaign = proposal.campaign

          return {
            campaignId: campaign.id,
            proposalId: proposal.id,
            orderId: orderId,
            productId: product.id,
            quantity: item.quantity,
            voteValue: product.voteValue,
            votingRule: campaign.votingRule,
            status: 'VALID' as const, // Because payment is successful
          }
        })

        await prisma.voteLedgerEntry.createMany({
          data: voteEntries
        })

        // Log audit event
        await prisma.auditEvent.create({
          data: {
            eventType: 'PAYMENT_RECEIVED_VOTES_CREATED',
            entityType: 'Order',
            entityId: orderId,
            campaignId: voteEntries[0]?.campaignId,
            newState: JSON.parse(JSON.stringify(voteEntries)),
          }
        })

        break;
      }

      case 'charge.refunded': {
        const charge = event.data.object as Stripe.Charge;
        const paymentIntentId = charge.payment_intent as string

        const payment = await prisma.payment.findUnique({
          where: { stripePaymentIntentId: paymentIntentId },
          include: { order: true }
        })

        if (!payment) break;

        // Create Refund record
        await prisma.refund.create({
          data: {
            paymentId: payment.id,
            amount: charge.amount_refunded / 100,
            status: 'completed',
            reason: charge.refunds?.data[0]?.reason || 'customer_requested'
          }
        })

        // If fully refunded, mark order as REFUNDED and invalidate votes
        if (charge.refunded) {
          await prisma.order.update({
            where: { id: payment.orderId },
            data: { status: 'REFUNDED' }
          })

          // Invalidate votes
          await prisma.voteLedgerEntry.updateMany({
            where: { orderId: payment.orderId },
            data: { 
              status: 'INVALIDATED',
              invalidationReason: 'REFUNDED'
            }
          })

          await prisma.auditEvent.create({
            data: {
              eventType: 'VOTES_INVALIDATED_REFUND',
              entityType: 'Order',
              entityId: payment.orderId,
            }
          })
        }
        break;
      }
      
      default:
        console.log(`Unhandled event type ${event.type}`)
    }

    return new NextResponse('Webhook processed', { status: 200 })
  } catch (error: any) {
    console.error('Error processing webhook:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}
