import { prisma } from '@/lib/prisma'
import Link from 'next/link'

export default async function AdminFinancesPage() {
  const campaigns = await prisma.campaign.findMany({
    where: { 
      status: { in: ['RECONCILIATION', 'WINNER_CONFIRMED', 'FUNDING_PENDING', 'FUNDED', 'IMPLEMENTATION', 'COMPLETED'] }
    },
    include: {
      proposals: {
        include: {
          voteLedgerEntries: {
            where: { status: 'VALID' },
            include: { order: true }
          }
        }
      },
      financialPlan: true
    },
    orderBy: { endDate: 'desc' }
  })

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Financial Accountability</h1>
          <p className="text-gray-500 mt-2">Track real-world fulfillment costs and net allocations for resolved campaigns.</p>
        </div>
        <Link href="/admin" className="text-blue-600 hover:text-blue-800 font-medium">
          ← Back to Admin
        </Link>
      </div>

      <div className="space-y-8">
        {campaigns.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 text-center text-gray-500">
            No resolved campaigns to display financial data for.
          </div>
        ) : (
          campaigns.map((campaign) => {
            // Calculate totals from VALID vote ledger entries which are tied to PAID orders
            let totalGross = 0;
            campaign.proposals.forEach(p => {
              p.voteLedgerEntries.forEach(entry => {
                // In a real app we'd find the exact OrderItem cost, but for MVP we approximate based on the order total vs items
                totalGross += Number(entry.order.totalAmount);
              })
            })
            // Since multiple entries can belong to the same order, we need to deduplicate orders first to get true gross
            const uniqueOrderIds = new Set();
            let trueGross = 0;
            campaign.proposals.forEach(p => {
              p.voteLedgerEntries.forEach(entry => {
                if (!uniqueOrderIds.has(entry.orderId)) {
                  uniqueOrderIds.add(entry.orderId);
                  trueGross += Number(entry.order.totalAmount);
                }
              })
            })

            const defaultAllocation = {
              manufacturingPct: campaign.financialPlan?.manufacturingPct || 50,
              paymentFeesPct: campaign.financialPlan?.paymentFeesPct || 3,
              platformFeesPct: campaign.financialPlan?.platformFeesPct || 5,
              winnerReservePct: campaign.financialPlan?.winnerReservePct || 42,
            }

            const estimatedCost = trueGross * (Number(defaultAllocation.manufacturingPct) + Number(defaultAllocation.paymentFeesPct) + Number(defaultAllocation.platformFeesPct)) / 100;
            const netProceeds = trueGross - estimatedCost;

            return (
              <div key={campaign.id} className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="px-6 py-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
                  <div>
                    <h3 className="font-bold text-gray-900">{campaign.title}</h3>
                    <span className="text-xs text-gray-500">Status: {campaign.status}</span>
                  </div>
                  <button className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50">
                    Post Update
                  </button>
                </div>
                
                <div className="p-6 grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                    <p className="text-sm font-medium text-gray-500 mb-1">Gross Revenue</p>
                    <p className="text-2xl font-bold text-gray-900">${trueGross.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</p>
                    <p className="text-xs text-gray-400 mt-2">From {uniqueOrderIds.size} unique orders</p>
                  </div>
                  
                  <div className="bg-red-50 p-4 rounded-xl border border-red-100">
                    <p className="text-sm font-medium text-red-600 mb-1">Estimated Costs & Fees</p>
                    <p className="text-2xl font-bold text-red-700">-${estimatedCost.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</p>
                    <p className="text-xs text-red-500 mt-2">{100 - Number(defaultAllocation.winnerReservePct)}% of gross</p>
                  </div>
                  
                  <div className="bg-green-50 p-4 rounded-xl border border-green-100">
                    <p className="text-sm font-medium text-green-600 mb-1">Net Proceeds</p>
                    <p className="text-2xl font-bold text-green-700">${netProceeds.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</p>
                    <p className="text-xs text-green-500 mt-2">Allocated to Winner</p>
                  </div>

                  <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                    <p className="text-sm font-medium text-blue-600 mb-1">Reconciliation Status</p>
                    {campaign.status === 'RECONCILIATION' ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mt-1">
                        Pending Audit
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 mt-1">
                        Locked & Audited
                      </span>
                    )}
                    <button className="text-xs text-blue-600 font-semibold hover:underline block mt-4">
                      View Audit Log →
                    </button>
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
