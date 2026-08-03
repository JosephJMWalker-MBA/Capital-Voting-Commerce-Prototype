import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { getCampaignVoteTotals, getCampaignFinancialProjection } from '@/lib/votes'

export default async function CampaignResultsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const campaign = await prisma.campaign.findUnique({
    where: { slug: slug },
    include: { 
      proposals: true,
      updates: {
        orderBy: { createdAt: 'desc' }
      }
    }
  })

  if (!campaign) notFound()

  if (!['WINNER_CONFIRMED', 'FUNDING_PENDING', 'FUNDED', 'IMPLEMENTATION', 'COMPLETED'].includes(campaign.status)) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-24 text-center">
        <h1 className="text-3xl font-bold mb-4">Results Not Yet Available</h1>
        <p className="text-gray-500 mb-8">This campaign is either still active or in the reconciliation phase.</p>
        <Link href={`/campaigns/${campaign.slug}`} className="text-blue-600 hover:underline">
          Return to Campaign
        </Link>
      </div>
    )
  }

  const voteTotals = await getCampaignVoteTotals(campaign.id)
  const projectedPool = await getCampaignFinancialProjection(campaign.id)

  const winningProposal = campaign.proposals.find(p => p.id === campaign.winningProposalId)
  
  // Calculate total votes and percentage
  const totalVotes = Object.values(voteTotals).reduce((a, b) => a + b, 0)
  const winnerVotes = voteTotals[winningProposal?.id || ''] || 0
  const winnerPercentage = totalVotes > 0 ? (winnerVotes / totalVotes) * 100 : 0

  return (
    <div className="bg-[var(--background)] py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-block mb-4 px-3 py-1 rounded-full text-sm font-bold bg-indigo-100 text-indigo-800 tracking-wide uppercase">
            Official Results
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-4">
            {campaign.title}
          </h1>
          <p className="text-xl text-gray-500">
            The community has spoken. Here are the final audited results.
          </p>
        </div>

        {/* Winner Banner */}
        <div className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-3xl p-8 md:p-12 text-white shadow-xl mb-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 opacity-10 transform translate-x-1/4 -translate-y-1/4">
            <svg className="w-64 h-64" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
          </div>
          
          <div className="relative z-10">
            <h2 className="text-sm font-bold uppercase tracking-widest text-emerald-100 mb-2">Winning Proposal</h2>
            <h3 className="text-4xl font-extrabold mb-4">{winningProposal?.title}</h3>
            <p className="text-lg text-emerald-50 mb-8 max-w-2xl">{winningProposal?.fullDescription}</p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 bg-black bg-opacity-20 rounded-2xl p-6 backdrop-blur-sm">
              <div>
                <p className="text-emerald-200 text-sm font-medium mb-1">Final Votes</p>
                <p className="text-3xl font-bold">{winnerVotes.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-emerald-200 text-sm font-medium mb-1">Vote Share</p>
                <p className="text-3xl font-bold">{winnerPercentage.toFixed(1)}%</p>
              </div>
              <div>
                <p className="text-emerald-200 text-sm font-medium mb-1">Funding Pool</p>
                <p className="text-3xl font-bold">${projectedPool.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</p>
              </div>
              <div>
                <p className="text-emerald-200 text-sm font-medium mb-1">Rule Used</p>
                <p className="text-xl font-bold mt-1 leading-tight">{campaign.votingRule.replace('_', ' ')}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Breakdown */}
        <h3 className="text-2xl font-bold mb-6">Vote Breakdown</h3>
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-slate-900">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Proposal</th>
                <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Total Votes</th>
                <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Share</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {campaign.proposals.map((proposal) => {
                const votes = voteTotals[proposal.id] || 0
                const pct = totalVotes > 0 ? (votes / totalVotes) * 100 : 0
                const isWinner = proposal.id === campaign.winningProposalId
                
                return (
                  <tr key={proposal.id} className={isWinner ? 'bg-emerald-50 dark:bg-emerald-900/10' : ''}>
                    <td className="px-6 py-6">
                      <div className="flex items-center">
                        {isWinner && (
                          <svg className="w-5 h-5 text-emerald-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                        )}
                        <div>
                          <p className={`font-bold ${isWinner ? 'text-emerald-700 dark:text-emerald-400' : 'text-gray-900 dark:text-gray-100'}`}>
                            {proposal.title}
                          </p>
                          <p className="text-sm text-gray-500">{proposal.shortLabel}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-6 text-right font-semibold text-lg text-gray-900 dark:text-white">
                      {votes.toLocaleString()}
                    </td>
                    <td className="px-6 py-6 text-right font-medium text-gray-500">
                      {pct.toFixed(1)}%
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {/* Accountability Box */}
        <div className="mt-12 p-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-2xl flex flex-col md:flex-row items-center gap-6">
          <div className="w-16 h-16 bg-blue-100 dark:bg-blue-800 text-blue-600 dark:text-blue-300 rounded-full flex items-center justify-center flex-shrink-0">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
          </div>
          <div>
            <h4 className="text-lg font-bold text-blue-900 dark:text-blue-200 mb-1">Financial Accountability</h4>
            <p className="text-blue-800 dark:text-blue-300">
              The committed funding pool of <strong>${projectedPool.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</strong> will now be allocated to implementing <em>"{winningProposal?.title}"</em>. Proof of funding and execution updates will be posted as they occur.
            </p>
          </div>
        </div>

        {/* Implementation Updates Timeline */}
        <div className="mt-16">
          <h3 className="text-2xl font-bold mb-8">Implementation Updates</h3>
          
          {campaign.updates.length === 0 ? (
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-12 text-center">
              <p className="text-gray-500">No implementation updates have been posted yet. Check back soon for progress on the winning proposal!</p>
            </div>
          ) : (
            <div className="relative border-l-2 border-gray-200 dark:border-gray-700 ml-3 md:ml-6 space-y-12">
              {campaign.updates.map((update: any) => (
                <div key={update.id} className="relative pl-8 md:pl-12">
                  <div className="absolute w-6 h-6 bg-blue-600 rounded-full -left-[13px] md:-left-[13px] top-1 border-4 border-[var(--background)]"></div>
                  <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                    <div className="flex justify-between items-start mb-4">
                      <h4 className="text-xl font-bold text-gray-900 dark:text-white">{update.title}</h4>
                      <span className="text-sm text-gray-500 whitespace-nowrap ml-4">
                        {new Date(update.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="prose dark:prose-invert max-w-none text-gray-600 dark:text-gray-300">
                      {update.content}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  )
}
