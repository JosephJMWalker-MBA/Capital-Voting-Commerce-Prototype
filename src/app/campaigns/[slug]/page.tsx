import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import ProposalComparison from '@/components/ProposalComparison'
import { getCampaignVoteTotals, getCampaignFinancialProjection } from '@/lib/votes'

export default async function CampaignDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const campaign = await prisma.campaign.findUnique({
    where: { slug: slug },
    include: {
      proposals: {
        include: {
          products: {
            include: {
              variants: true
            }
          }
        }
      }
    }
  })

  if (!campaign) {
    notFound()
  }

  const voteTotals = await getCampaignVoteTotals(campaign.id)
  const projectedPool = await getCampaignFinancialProjection(campaign.id)

  // Calculate days remaining
  const now = new Date()
  const end = new Date(campaign.endDate)
  const diffTime = end.getTime() - now.getTime()
  const daysRemaining = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)))

  return (
    <div className="bg-[var(--background)]">
      {/* Campaign Header */}
      <div className="bg-white dark:bg-slate-900 border-b border-[var(--border)] pt-16 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-block mb-4 px-3 py-1 rounded-full text-sm font-bold bg-gray-100 text-gray-800 tracking-wide uppercase">
            {campaign.status === 'LIVE' ? (
              <span className="flex items-center text-blue-600">
                <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse mr-2"></span>
                Active Campaign
              </span>
            ) : campaign.status}
          </div>
          
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-6">
            {campaign.title}
          </h1>
          
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto mb-10 leading-relaxed">
            {campaign.problemStatement}
          </p>

          <div className="flex flex-wrap justify-center gap-8 text-sm font-medium text-gray-500">
            <div className="flex flex-col items-center">
              <span className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{daysRemaining}</span>
              <span className="uppercase tracking-wider text-xs">Days Left</span>
            </div>
            <div className="w-px h-12 bg-gray-200 dark:bg-gray-700"></div>
            <div className="flex flex-col items-center">
              <span className="text-2xl font-bold text-green-600 dark:text-green-400 mb-1">
                ${projectedPool.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
              </span>
              <span className="uppercase tracking-wider text-xs">Projected Funding Pool</span>
            </div>
            <div className="w-px h-12 bg-gray-200 dark:bg-gray-700"></div>
            <div className="flex flex-col items-center">
              <span className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                {campaign.votingRule.replace('_', ' ')}
              </span>
              <span className="uppercase tracking-wider text-xs">Voting Rule</span>
            </div>
            <div className="w-px h-12 bg-gray-200 dark:bg-gray-700"></div>
            <div className="flex flex-col items-center">
              <span className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{campaign.organizer}</span>
              <span className="uppercase tracking-wider text-xs">Organizer</span>
            </div>
          </div>
        </div>
      </div>

      {/* Proposals Comparison */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold tracking-tight">The Proposals</h2>
          <p className="text-gray-500 mt-2">Compare the options and choose a side by purchasing their merchandise.</p>
        </div>

        <ProposalComparison proposals={campaign.proposals} voteTotals={voteTotals} />

        <div className="mt-16 bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-8 border border-blue-100 dark:border-blue-800">
          <h3 className="font-bold text-blue-900 dark:text-blue-200 mb-2 flex items-center">
            <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Transparency Note
          </h3>
          <p className="text-blue-800 dark:text-blue-300 text-sm">
            {campaign.legalDisclaimer || 'Capital Voting ensures all purchases are traceable to votes. After campaign closure, the winning proposal will receive the designated portion of the net proceeds. In case of a tie, the tie-breaking policy is: ' + campaign.tiePolicy.replace(/_/g, ' ') + '.'}
          </p>
        </div>
      </div>
    </div>
  )
}
