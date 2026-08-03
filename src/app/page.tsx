import Link from 'next/link'
import { prisma } from '@/lib/prisma'

export default async function HomePage() {
  let campaigns: any[] = [];
  try {
    campaigns = await prisma.campaign.findMany({
      where: { status: 'LIVE' },
      orderBy: { endDate: 'asc' },
      take: 3
    })
  } catch (e) {
    console.error('Failed to fetch campaigns', e)
  }

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative pt-24 pb-32 overflow-hidden gradient-bg">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6">
            Choose a side.<br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
              Wear your vote.
            </span><br/>
            Fund the winner.
          </h1>
          <p className="mt-4 max-w-2xl text-xl text-gray-600 dark:text-gray-300 mx-auto mb-10">
            Capital Voting is a participatory funding platform where your merchandise purchases determine which community proposal becomes a reality.
          </p>
          <div className="flex justify-center gap-4">
            <Link href="/campaigns" className="hover-lift bg-blue-600 text-white px-8 py-4 rounded-full font-semibold text-lg shadow-lg hover:bg-blue-700 transition-all">
              Browse Campaigns
            </Link>
            <Link href="/about" className="hover-lift glass-panel px-8 py-4 rounded-full font-semibold text-lg shadow-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition-all">
              How It Works
            </Link>
          </div>
        </div>
      </section>

      {/* Value Props */}
      <section className="py-20 bg-[var(--background)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm transform rotate-3">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
              </div>
              <h3 className="text-xl font-bold mb-3">Real Commitment</h3>
              <p className="text-gray-500 dark:text-gray-400">A preference without commitment is just a poll. Here, every counted vote is connected to a completed financial transaction.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm transform -rotate-3">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
              </div>
              <h3 className="text-xl font-bold mb-3">Full Transparency</h3>
              <p className="text-gray-500 dark:text-gray-400">See exactly how your purchase is allocated. Track fulfillment costs, fees, and the net proceeds going to the winner.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm transform rotate-3">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"></path></svg>
              </div>
              <h3 className="text-xl font-bold mb-3">Auditable Results</h3>
              <p className="text-gray-500 dark:text-gray-400">An immutable vote ledger ensures that rules cannot change silently and refunded orders are properly invalidated.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Active Campaigns */}
      <section className="py-24 bg-[var(--surface)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">Active Campaigns</h2>
              <p className="mt-2 text-gray-500">Make your voice heard by funding what matters to you.</p>
            </div>
            <Link href="/campaigns" className="text-blue-600 font-semibold hover:text-blue-800 flex items-center">
              View all
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {campaigns.length === 0 ? (
              <div className="col-span-3 text-center py-12">
                <p className="text-gray-500">No active campaigns at the moment. Check back soon!</p>
              </div>
            ) : (
              campaigns.map((campaign) => (
                <Link key={campaign.id} href={`/campaigns/${campaign.slug}`} className="hover-lift glass-panel rounded-2xl overflow-hidden flex flex-col h-full border border-[var(--border)]">
                  <div className="h-48 bg-gray-200 relative">
                    {/* Placeholder for Campaign Image */}
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
                      <span className="text-gray-400">By {campaign.organizer}</span>
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      </section>
    </div>
  )
}
