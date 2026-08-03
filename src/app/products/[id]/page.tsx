import { notFound } from 'next/navigation'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import ProductClient from './ProductClient'

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await prisma.product.findUnique({
    where: { id: id },
    include: {
      proposal: {
        include: {
          campaign: true
        }
      },
      variants: true
    }
  })

  if (!product) {
    notFound()
  }

  const campaign = product.proposal.campaign

  return (
    <div className="bg-[var(--background)] py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb */}
        <nav className="flex text-sm text-gray-500 mb-8" aria-label="Breadcrumb">
          <ol className="inline-flex items-center space-x-1 md:space-x-3">
            <li>
              <Link href="/campaigns" className="hover:text-blue-600">Campaigns</Link>
            </li>
            <li><span className="mx-2">/</span></li>
            <li>
              <Link href={`/campaigns/${campaign.slug}`} className="hover:text-blue-600">{campaign.title}</Link>
            </li>
            <li><span className="mx-2">/</span></li>
            <li className="text-gray-900 font-medium">{product.name}</li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Product Image Placeholder */}
          <div className="bg-gray-100 rounded-3xl aspect-square flex items-center justify-center relative overflow-hidden border border-gray-200">
             <div className="absolute inset-0 bg-gradient-to-tr from-gray-200 to-gray-50 opacity-50"></div>
             <span className="text-gray-400 font-medium z-10 text-lg">Product Image</span>
          </div>

          {/* Product Details */}
          <div className="flex flex-col">
            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white mb-2">
              {product.name}
            </h1>
            <p className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-6">
              ${Number(product.price).toFixed(2)}
            </p>
            
            <p className="text-gray-600 dark:text-gray-300 mb-8 text-lg">
              {product.description}
            </p>

            {/* Vote Value Badge */}
            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 mb-8">
              <div className="flex items-start">
                <div className="flex-shrink-0 mt-1">
                  <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-lg font-bold text-blue-900">
                    Supports: {product.proposal.title}
                  </h3>
                  <p className="text-blue-800 mt-1">
                    This purchase generates <strong>{product.voteValue} vote</strong> for {product.proposal.shortLabel} in the {campaign.title} campaign.
                  </p>
                </div>
              </div>
            </div>

            <ProductClient product={product} campaign={campaign} proposal={product.proposal} />

            {/* Transparency Specs */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-8 mt-auto">
              <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Financial Transparency</h4>
              <ul className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
                <li className="flex justify-between">
                  <span>Gross Price:</span>
                  <span className="font-medium text-gray-900 dark:text-white">${Number(product.price).toFixed(2)}</span>
                </li>
                <li className="flex justify-between">
                  <span>Estimated Fulfillment/Fees:</span>
                  <span className="font-medium text-gray-900 dark:text-white">${Number(product.estimatedCost).toFixed(2)}</span>
                </li>
                <li className="flex justify-between border-t border-gray-200 dark:border-gray-700 pt-2 font-bold">
                  <span className="text-green-600 dark:text-green-400">Estimated Net Contribution:</span>
                  <span className="text-green-600 dark:text-green-400">${Number(product.estimatedNetContrib).toFixed(2)}</span>
                </li>
              </ul>
              
              <div className="mt-6 space-y-2">
                <p className="text-xs text-gray-500">
                  <strong>Fulfillment:</strong> {product.fulfillmentProvider} • {product.shippingInfo}
                </p>
                <p className="text-xs text-gray-500">
                  <strong>Returns:</strong> {campaign.legalDisclaimer || 'Purchases cannot be refunded once the campaign closes. Refunded orders will have their corresponding votes invalidated.'}
                </p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}
