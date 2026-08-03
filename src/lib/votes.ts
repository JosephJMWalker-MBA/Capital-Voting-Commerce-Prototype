import { prisma } from '@/lib/prisma'

/**
 * Calculates the current valid vote totals for a campaign.
 */
export async function getCampaignVoteTotals(campaignId: string) {
  const voteEntries = await prisma.voteLedgerEntry.findMany({
    where: { 
      campaignId,
      status: 'VALID' 
    }
  })

  // Group by proposal ID
  const totals = voteEntries.reduce((acc, entry) => {
    if (!acc[entry.proposalId]) {
      acc[entry.proposalId] = 0
    }
    // Multiply quantity by voteValue for the entry
    acc[entry.proposalId] += (entry.quantity * entry.voteValue)
    return acc
  }, {} as Record<string, number>)

  return totals
}

/**
 * Calculates the projected financial pool available for a campaign.
 * This is a simplified projection based on completed payments minus estimated costs.
 */
export async function getCampaignFinancialProjection(campaignId: string) {
  const validVotes = await prisma.voteLedgerEntry.findMany({
    where: { 
      campaignId,
      status: 'VALID' 
    }
  })

  // Fetch all products for this campaign's proposals
  const campaign = await prisma.campaign.findUnique({
    where: { id: campaignId },
    include: { proposals: { include: { products: true } } }
  });

  const productNetContribs: Record<string, number> = {};
  if (campaign) {
    campaign.proposals.forEach(p => {
      p.products.forEach(prod => {
        productNetContribs[prod.id] = Number(prod.estimatedNetContrib);
      });
    });
  }

  const projectedPool = validVotes.reduce((total, vote) => {
    // Total contribution from this ledger entry
    const netContrib = (productNetContribs[vote.productId] || 0) * vote.quantity
    return total + netContrib
  }, 0)

  return projectedPool
}
