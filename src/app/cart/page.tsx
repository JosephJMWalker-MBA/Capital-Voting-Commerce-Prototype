'use client'

import { useCartStore } from '@/lib/cart'
import Link from 'next/link'
import { useState, useEffect } from 'react'

export default function CartPage() {
  const { items, removeItem, updateQuantity, getTotal } = useCartStore()
  const [mounted, setMounted] = useState(false)
  const [loading, setLoading] = useState(false)

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  const handleCheckout = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items }),
      })
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      }
    } catch (err) {
      console.error(err)
      setLoading(false)
    }
  }

  if (!mounted) return null

  // Group items by campaign and proposal for clarity as per Product Brief
  const groupedItems = items.reduce((acc, item) => {
    const key = `${item.campaignName} - ${item.proposalName}`
    if (!acc[key]) acc[key] = []
    acc[key].push(item)
    return acc
  }, {} as Record<string, typeof items>)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 mb-8">Your Cart</h1>
      
      {items.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-gray-200">
          <p className="text-xl text-gray-500 mb-6">Your cart is empty.</p>
          <Link href="/campaigns" className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors">
            Browse Campaigns
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-8">
            {Object.entries(groupedItems).map(([groupKey, groupItems]) => {
              const groupVotes = groupItems.reduce((t, i) => t + (i.voteValue * i.quantity), 0)
              
              return (
                <div key={groupKey} className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
                  <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                    <h3 className="font-bold text-gray-900">{groupKey}</h3>
                    <span className="bg-blue-100 text-blue-800 text-xs font-bold px-3 py-1 rounded-full">
                      {groupVotes} Vote{groupVotes !== 1 ? 's' : ''}
                    </span>
                  </div>
                  <ul className="divide-y divide-gray-200">
                    {groupItems.map((item) => (
                      <li key={item.id} className="p-6 flex flex-col sm:flex-row sm:items-center justify-between">
                        <div className="flex-1 mb-4 sm:mb-0">
                          <h4 className="font-bold text-gray-900">{item.name}</h4>
                          <p className="text-sm text-gray-500">{item.variantName}</p>
                          <p className="text-sm font-medium text-gray-900 mt-1">${item.price.toFixed(2)}</p>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center border border-gray-300 rounded-md">
                            <button 
                              onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                              className="px-3 py-1 hover:bg-gray-50 text-gray-600"
                            >-</button>
                            <span className="px-3 py-1 text-sm font-medium border-l border-r border-gray-300">
                              {item.quantity}
                            </span>
                            <button 
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="px-3 py-1 hover:bg-gray-50 text-gray-600"
                            >+</button>
                          </div>
                          <button 
                            onClick={() => removeItem(item.id)}
                            className="text-red-500 hover:text-red-700 p-2"
                            aria-label="Remove item"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )
            })}
          </div>

          {/* Summary */}
          <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 h-fit">
            <h2 className="text-xl font-bold mb-4">Order Summary</h2>
            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>${getTotal().toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600 text-sm">
                <span>Taxes & Shipping</span>
                <span>Calculated at checkout</span>
              </div>
              <div className="pt-4 border-t border-gray-200 flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>${getTotal().toFixed(2)}</span>
              </div>
            </div>
            <button 
              onClick={handleCheckout}
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-4 rounded-xl shadow-md transition-all hover-lift disabled:opacity-75 disabled:hover-lift-none"
            >
              {loading ? 'Processing...' : 'Checkout'}
            </button>
            <p className="mt-4 text-xs text-gray-500 text-center">
              You will be redirected to our secure payment provider.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
