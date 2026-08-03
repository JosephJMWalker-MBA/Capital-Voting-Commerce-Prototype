import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding demonstration campaign...')

  // Clean existing data for safety (in reverse dependency order)
  await prisma.productVariant.deleteMany()
  await prisma.product.deleteMany()
  await prisma.proposal.deleteMany()
  await prisma.campaign.deleteMany()
  await prisma.user.deleteMany()

  // Create an Admin User
  const admin = await prisma.user.create({
    data: {
      email: 'admin@capitalvoting.demo',
      name: 'Platform Admin',
      role: 'PLATFORM_ADMIN',
    },
  })

  const now = new Date()
  const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)

  // Create the "Neighborhood Lot Decision" Campaign
  const campaign = await prisma.campaign.create({
    data: {
      title: 'Neighborhood Lot Decision (Demonstration)',
      slug: 'neighborhood-lot-decision',
      summary: 'A fictional neighborhood has funding available to improve an unused lot.',
      problemStatement: 'The lot at 5th and Main has been vacant for 10 years. We have secured funding to revitalize this space, but the community is split on the best use. Should it be a Community Garden or a Pocket Park?',
      organizer: 'Neighborhood Association (Fictional)',
      startDate: now,
      endDate: thirtyDaysFromNow,
      status: 'LIVE',
      votingRule: 'UNIT_VOTING',
      tiePolicy: 'EXTEND_72_HOURS',
      legalDisclaimer: 'Demonstration campaign. No real-world funding decision will occur.',
      
      proposals: {
        create: [
          {
            title: 'Community Garden',
            shortLabel: 'Garden',
            summary: 'Convert the lot into raised garden beds, shared growing space, and a small educational area.',
            fullDescription: 'The Community Garden proposal envisions 20 raised beds, a compost station, and a small greenhouse. It provides fresh produce to participants and serves as an educational hub for urban agriculture.',
            implementationPlan: 'Month 1: Clear lot. Month 2: Build raised beds and install water lines. Month 3: Planting.',
            intendedBeneficiary: 'Local residents interested in gardening and sustainable food.',
            estimatedBudget: 15000,
            estimatedTimeline: '3 Months',
            responsibleEntity: 'GreenThumb Co-op',
            successCriteria: '20 beds leased, first harvest completed.',
            risksLimitations: 'Requires ongoing volunteer maintenance.',
            
            products: {
              create: [
                {
                  name: 'Garden Supporter T-Shirt',
                  description: 'A 100% cotton t-shirt showing your support for the Community Garden.',
                  productType: 'Apparel',
                  price: 25.00,
                  estimatedCost: 10.00,
                  estimatedNetContrib: 15.00,
                  inventoryStatus: 'In Stock',
                  fulfillmentProvider: 'Printful Simulated',
                  shippingInfo: 'Standard Shipping (5-7 days)',
                  voteValue: 1,
                  variants: {
                    create: [
                      { name: 'Small', sku: 'GARDEN-TEE-S' },
                      { name: 'Medium', sku: 'GARDEN-TEE-M' },
                      { name: 'Large', sku: 'GARDEN-TEE-L' },
                    ]
                  }
                },
                {
                  name: 'Garden Canvas Tote Bag',
                  description: 'A durable canvas tote bag perfect for carrying groceries or garden tools.',
                  productType: 'Accessories',
                  price: 15.00,
                  estimatedCost: 5.00,
                  estimatedNetContrib: 10.00,
                  inventoryStatus: 'In Stock',
                  fulfillmentProvider: 'Printful Simulated',
                  shippingInfo: 'Standard Shipping (5-7 days)',
                  voteValue: 1,
                  variants: {
                    create: [
                      { name: 'One Size', sku: 'GARDEN-TOTE' },
                    ]
                  }
                }
              ]
            }
          },
          {
            title: 'Pocket Park',
            shortLabel: 'Park',
            summary: 'Convert the lot into trees, seating, open green space, and a small play area.',
            fullDescription: 'The Pocket Park proposal creates a relaxing green space with native trees, benches, and a small playground for children. It offers a free public gathering space for the entire neighborhood.',
            implementationPlan: 'Month 1: Site leveling and soil prep. Month 2: Plant trees, install benches. Month 3: Install playground equipment.',
            intendedBeneficiary: 'Families and all local residents looking for recreational space.',
            estimatedBudget: 18000,
            estimatedTimeline: '3 Months',
            responsibleEntity: 'Parks Alliance',
            successCriteria: 'Park opens to public, positive community feedback.',
            risksLimitations: 'Higher upfront cost for playground equipment.',
            
            products: {
              create: [
                {
                  name: 'Park Supporter T-Shirt',
                  description: 'A comfortable t-shirt showing your support for the Pocket Park.',
                  productType: 'Apparel',
                  price: 25.00,
                  estimatedCost: 10.00,
                  estimatedNetContrib: 15.00,
                  inventoryStatus: 'In Stock',
                  fulfillmentProvider: 'Printful Simulated',
                  shippingInfo: 'Standard Shipping (5-7 days)',
                  voteValue: 1,
                  variants: {
                    create: [
                      { name: 'Small', sku: 'PARK-TEE-S' },
                      { name: 'Medium', sku: 'PARK-TEE-M' },
                      { name: 'Large', sku: 'PARK-TEE-L' },
                    ]
                  }
                },
                {
                  name: 'Park Canvas Tote Bag',
                  description: 'A durable canvas tote bag for everyday use.',
                  productType: 'Accessories',
                  price: 15.00,
                  estimatedCost: 5.00,
                  estimatedNetContrib: 10.00,
                  inventoryStatus: 'In Stock',
                  fulfillmentProvider: 'Printful Simulated',
                  shippingInfo: 'Standard Shipping (5-7 days)',
                  voteValue: 1,
                  variants: {
                    create: [
                      { name: 'One Size', sku: 'PARK-TOTE' },
                    ]
                  }
                }
              ]
            }
          }
        ]
      }
    }
  })

  console.log(`Campaign Created: ${campaign.title} (ID: ${campaign.id})`)
  console.log('Seeding complete.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
