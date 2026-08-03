import { NextResponse } from 'next/server'
import { resolveCampaign } from '@/lib/resolution'

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const result = await resolveCampaign(id)
    return NextResponse.json(result)
  } catch (error: any) {
    return new NextResponse(error.message, { status: 400 })
  }
}
