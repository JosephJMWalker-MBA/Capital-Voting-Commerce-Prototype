'use client'

import { useCartStore } from '@/lib/cart'
import { useState } from 'react'

interface AddToCartButtonProps {
  product: any;
  variantId: string;
  campaign: any;
  proposal: any;
}

export default function AddToCartButton({ product, variantId, campaign, proposal }: AddToCartButtonProps) {
  const addItem = useCartStore((state) => state.addItem)
  const [added, setAdded] = useState(false)

  const handleAdd = () => {
    const variant = product.variants.find((v: any) => v.id === variantId)
    if (!variant) return;

    addItem({
      id: `${product.id}-${variant.id}`,
      productId: product.id,
      variantId: variant.id,
      name: product.name,
      variantName: variant.name,
      price: Number(product.price),
      quantity: 1,
      proposalId: proposal.id,
      proposalName: proposal.title,
      campaignId: campaign.id,
      campaignName: campaign.title,
      voteValue: product.voteValue
    })

    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <button 
      onClick={handleAdd}
      className={`mt-6 w-full border border-transparent rounded-xl py-4 px-8 flex items-center justify-center text-lg font-bold text-white transition-all ${
        added 
          ? 'bg-green-500 hover:bg-green-600 shadow-lg shadow-green-200 dark:shadow-none' 
          : 'bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-200 dark:shadow-none hover-lift'
      }`}
    >
      {added ? (
        <span className="flex items-center">
          <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          Added to Cart
        </span>
      ) : (
        'Add to Cart'
      )}
    </button>
  )
}
