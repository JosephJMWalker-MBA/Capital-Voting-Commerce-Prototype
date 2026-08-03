import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentAdmin } from '@/lib/auth'

export async function POST(req: Request) {
  try {
    const admin = await getCurrentAdmin()
    const body = await req.json()
    
    // In a real app, use Zod to validate the payload
    const { title, slug, summary, problemStatement, organizer, startDate, endDate } = body

    if (!title || !slug || !summary || !problemStatement || !organizer) {
      return new NextResponse('Missing required fields', { status: 400 })
    }

    const campaign = await prisma.campaign.create({
      data: {
        title,
        slug,
        summary,
        problemStatement,
        organizer,
        startDate,
        endDate,
        status: 'DRAFT',
      }
    })

    // Log the audit event
    await prisma.auditEvent.create({
      data: {
        eventType: 'CAMPAIGN_CREATED',
        actorId: admin.id,
        campaignId: campaign.id,
        entityType: 'Campaign',
        entityId: campaign.id,
        newState: JSON.stringify(campaign),
      }
    })

    return NextResponse.json(campaign)
  } catch (error: any) {
    console.error('Error creating campaign:', error)
    return new NextResponse(error.message || 'Internal Server Error', { status: 500 })
  }
}
