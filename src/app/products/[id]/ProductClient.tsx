'use client'

import { useState } from 'react'
import AddToCartButton from '@/components/AddToCartButton'

export default function ProductClient({ product, campaign, proposal }: any) {
  const [selectedVariant, setSelectedVariant] = useState(product.variants[0]?.id || '')

  return (
    <div className="mb-10">
      <label htmlFor="variant" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        Select Option
      </label>
      <select 
        id="variant" 
        name="variant" 
        value={selectedVariant}
        onChange={(e) => setSelectedVariant(e.target.value)}
        className="mt-1 block w-full pl-3 pr-10 py-3 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-xl border bg-white dark:bg-slate-800 dark:border-slate-600"
      >
        {product.variants.map((variant: any) => (
          <option key={variant.id} value={variant.id}>{variant.name}</option>
        ))}
      </select>

      <AddToCartButton 
        product={product} 
        variantId={selectedVariant}
        campaign={campaign}
        proposal={proposal}
      />
    </div>
  )
}
