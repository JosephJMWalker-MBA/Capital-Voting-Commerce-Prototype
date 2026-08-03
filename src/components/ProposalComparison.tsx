import React from 'react'
import Link from 'next/link'

export default function ProposalComparison({ proposals, voteTotals }: { proposals: any[], voteTotals?: Record<string, number> }) {
  if (!proposals || proposals.length < 2) return null;

  const [propA, propB] = proposals;
  
  const votesA = voteTotals?.[propA.id] || 0;
  const votesB = voteTotals?.[propB.id] || 0;
  
  const totalVotes = votesA + votesB;
  const percentA = totalVotes > 0 ? (votesA / totalVotes) * 100 : 50;
  const percentB = totalVotes > 0 ? (votesB / totalVotes) * 100 : 50;

  return (
    <div>
      {/* Live Vote Projection Bar */}
      <div className="mb-12">
        <div className="flex justify-between text-sm font-bold mb-2">
          <span className="text-blue-600">{votesA.toLocaleString()} Votes</span>
          <span className="text-gray-500 text-xs uppercase tracking-widest">Live Projection</span>
          <span className="text-emerald-600">{votesB.toLocaleString()} Votes</span>
        </div>
        <div className="h-4 bg-gray-200 rounded-full overflow-hidden flex shadow-inner">
          <div 
            className="bg-blue-500 h-full transition-all duration-1000 ease-in-out" 
            style={{ width: `${percentA}%` }}
          ></div>
          <div 
            className="bg-emerald-500 h-full transition-all duration-1000 ease-in-out" 
            style={{ width: `${percentB}%` }}
          ></div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-12">
        {/* Proposal A */}
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 dark:border-gray-700 relative overflow-hidden transition-all hover-lift">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-400 to-blue-600"></div>
          <div className="flex justify-between items-start mb-6">
            <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">{propA.title}</h2>
            <span className="bg-blue-100 text-blue-800 text-xs font-bold px-3 py-1 rounded-full">{propA.shortLabel}</span>
          </div>
          
          <p className="text-gray-600 dark:text-gray-300 text-lg mb-8 leading-relaxed">
            {propA.fullDescription}
          </p>
          
          <div className="space-y-6">
            <div>
              <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Implementation Plan</h4>
              <p className="text-gray-700 dark:text-gray-200">{propA.implementationPlan}</p>
            </div>
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100 dark:border-gray-700">
              <div>
                <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-1">Budget</h4>
                <p className="font-semibold">${Number(propA.estimatedBudget).toLocaleString()}</p>
              </div>
              <div>
                <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-1">Timeline</h4>
                <p className="font-semibold">{propA.estimatedTimeline}</p>
              </div>
            </div>
          </div>

          {/* Products */}
          <div className="mt-10 pt-8 border-t border-gray-100 dark:border-gray-700">
            <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Support this proposal</h4>
            <div className="space-y-4">
              {propA.products.map((product: any) => (
                <div key={product.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-700/50 rounded-xl border border-gray-200 dark:border-gray-600">
                  <div>
                    <h5 className="font-bold text-gray-900 dark:text-white">{product.name}</h5>
                    <p className="text-sm text-gray-500">${Number(product.price).toFixed(2)} • Generates {product.voteValue} vote</p>
                  </div>
                  <Link href={`/products/${product.id}`} className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg shadow-sm transition-colors text-sm text-center">
                    View & Support
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Proposal B */}
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 dark:border-gray-700 relative overflow-hidden transition-all hover-lift">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-emerald-400 to-emerald-600"></div>
          <div className="flex justify-between items-start mb-6">
            <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">{propB.title}</h2>
            <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full">{propB.shortLabel}</span>
          </div>
          
          <p className="text-gray-600 dark:text-gray-300 text-lg mb-8 leading-relaxed">
            {propB.fullDescription}
          </p>
          
          <div className="space-y-6">
            <div>
              <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Implementation Plan</h4>
              <p className="text-gray-700 dark:text-gray-200">{propB.implementationPlan}</p>
            </div>
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100 dark:border-gray-700">
              <div>
                <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-1">Budget</h4>
                <p className="font-semibold">${Number(propB.estimatedBudget).toLocaleString()}</p>
              </div>
              <div>
                <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-1">Timeline</h4>
                <p className="font-semibold">{propB.estimatedTimeline}</p>
              </div>
            </div>
          </div>

          {/* Products */}
          <div className="mt-10 pt-8 border-t border-gray-100 dark:border-gray-700">
            <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Support this proposal</h4>
            <div className="space-y-4">
              {propB.products.map((product: any) => (
                <div key={product.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-700/50 rounded-xl border border-gray-200 dark:border-gray-600">
                  <div>
                    <h5 className="font-bold text-gray-900 dark:text-white">{product.name}</h5>
                    <p className="text-sm text-gray-500">${Number(product.price).toFixed(2)} • Generates {product.voteValue} vote</p>
                  </div>
                  <Link href={`/products/${product.id}`} className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2 px-4 rounded-lg shadow-sm transition-colors text-sm text-center">
                    View & Support
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
