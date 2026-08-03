import Link from 'next/link'
import { prisma } from '@/lib/prisma'

export default async function CampaignsPage() {
  let campaigns: any[] = [];
  try {
    campaigns = await prisma.campaign.findMany({
      orderBy: { createdAt: 'desc' }
    })
  } catch (e) {
    console.error('Failed to fetch campaigns', e)
  }

  const activeCampaigns = campaigns.filter(c => c.status === 'LIVE' || c.status === 'SCHEDULED')
  const pastCampaigns = campaigns.filter(c => ['CLOSED', 'RECONCILIATION', 'WINNER_CONFIRMED', 'FUNDING_PENDING', 'FUNDED', 'IMPLEMENTATION', 'COMPLETED'].includes(c.status))

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-12">
        <h1 className="text-4xl font-extrabold tracking-tight mb-4">Campaigns</h1>
        <p className="text-xl text-gray-500">Discover projects. Choose a side. Make an impact.</p>
      </div>

      {activeCampaigns.length > 0 && (
        <div className="mb-16">
          <h2 className="text-2xl font-bold mb-6">Active & Upcoming</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {activeCampaigns.map((campaign) => (
              <Link key={campaign.id} href={`/campaigns/${campaign.slug}`} className="hover-lift glass-panel rounded-2xl overflow-hidden flex flex-col h-full border border-[var(--border)]">
                <div className="h-48 bg-gray-200 relative">
                  <div className="absolute inset-0 bg-gradient-to-tr from-blue-500 to-indigo-400 mix-blend-multiply opacity-80"></div>
                  <div className="absolute top-4 right-4 bg-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider text-gray-900 shadow-sm">
                    {campaign.status}
                  </div>
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <h3 className="text-xl font-bold mb-2 line-clamp-2">{campaign.title}</h3>
                  <p className="text-sm text-gray-500 mb-4 line-clamp-3">{campaign.summary}</p>
                  <div className="mt-auto pt-4 border-t border-[var(--border)] flex justify-between items-center text-sm">
                    <span className="font-semibold text-blue-600">Ends {new Date(campaign.endDate).toLocaleDateString()}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {pastCampaigns.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold mb-6">Completed Campaigns</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pastCampaigns.map((campaign) => (
              <Link key={campaign.id} href={`/campaigns/${campaign.slug}/results`} className="hover-lift glass-panel opacity-80 rounded-2xl overflow-hidden flex flex-col h-full border border-[var(--border)]">
                <div className="h-48 bg-gray-300 relative grayscale">
                  <div className="absolute top-4 right-4 bg-gray-800 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
                    {campaign.status}
                  </div>
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <h3 className="text-xl font-bold mb-2 line-clamp-2">{campaign.title}</h3>
                  <div className="mt-auto pt-4 border-t border-[var(--border)] flex justify-between items-center text-sm">
                    <span className="text-gray-500">Ended {new Date(campaign.endDate).toLocaleDateString()}</span>
                    <span className="font-semibold text-indigo-600">View Results →</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {campaigns.length === 0 && (
        <div className="text-center py-24 bg-gray-50 rounded-2xl border border-dashed border-gray-300">
          <p className="text-gray-500">No campaigns available.</p>
        </div>
      )}
    </div>
  )
}
