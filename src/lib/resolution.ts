import { prisma } from '@/lib/prisma'
import { getCampaignVoteTotals } from './votes'

export async function resolveCampaign(campaignId: string) {
  const campaign = await prisma.campaign.findUnique({
    where: { id: campaignId },
    include: { proposals: true }
  })

  if (!campaign) throw new Error('Campaign not found')
  if (campaign.status === 'WINNER_CONFIRMED') throw new Error('Campaign already resolved')

  // Move to reconciliation first
  await prisma.campaign.update({
    where: { id: campaignId },
    data: { status: 'RECONCILIATION' }
  })

  const voteTotals = await getCampaignVoteTotals(campaignId)

  let winnerId = null;

  let maxVotes = -1;
  let candidates: string[] = [];

  for (const proposal of campaign.proposals) {
    const votes = voteTotals[proposal.id] || 0;
    if (votes > maxVotes) {
      maxVotes = votes;
      candidates = [proposal.id];
    } else if (votes === maxVotes) {
      candidates.push(proposal.id);
    }
  }

  if (candidates.length === 1) {
    winnerId = candidates[0];
  } else {
    // Tie breaker MVP logic
    winnerId = candidates[0];
  }

  if (winnerId) {
    await prisma.campaign.update({
      where: { id: campaignId },
      data: { 
        status: 'WINNER_CONFIRMED',
        winningProposalId: winnerId
      }
    })

    await prisma.auditEvent.create({
      data: {
        eventType: 'CAMPAIGN_RESOLVED',
        entityType: 'Campaign',
        entityId: campaignId,
        campaignId,
        newState: { winnerId, totals: voteTotals }
      }
    })

    return { status: 'WINNER_CONFIRMED', winnerId }
  }

  return { status: 'RECONCILIATION', message: 'Resolution failed or pending tie-break' }
}
