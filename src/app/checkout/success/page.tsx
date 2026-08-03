'use client'

import { useEffect, useState } from 'react'
import { useCartStore } from '@/lib/cart'
import Link from 'next/link'

export default function CheckoutSuccessPage() {
  const clearCart = useCartStore(state => state.clearCart)
  const [cleared, setCleared] = useState(false)

  useEffect(() => {
    if (!cleared) {
      clearCart()
      setCleared(true)
    }
  }, [clearCart, cleared])

  return (
    <div className="max-w-3xl mx-auto px-4 py-24 text-center">
      <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-sm">
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
        </svg>
      </div>
      
      <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 mb-4">
        Thank You for Your Support!
      </h1>
      
      <p className="text-xl text-gray-600 mb-8">
        Your order has been confirmed. Your votes are being securely recorded on the Capital Voting ledger.
      </p>

      <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6 text-left mb-10 max-w-lg mx-auto">
        <h3 className="font-bold text-blue-900 mb-2">What happens next?</h3>
        <ul className="list-disc pl-5 space-y-2 text-blue-800 text-sm">
          <li>You will receive an email confirmation with your order details.</li>
          <li>Your votes are now provisional and will become <strong>valid</strong> once payment fully settles.</li>
          <li>If you request a refund before the campaign closes, your votes will be invalidated.</li>
          <li>Merchandise ships within 5-7 business days.</li>
        </ul>
      </div>

      <div className="space-x-4">
        <Link href="/campaigns" className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-8 rounded-xl transition-colors inline-block shadow-sm">
          Back to Campaigns
        </Link>
      </div>
    </div>
  )
}
