'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function ResolveButton({ campaignId, disabled }: { campaignId: string, disabled: boolean }) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleResolve = async () => {
    if (!confirm('Are you sure you want to resolve this campaign? This will calculate the winner and lock voting.')) return;
    
    setLoading(true)
    try {
      const res = await fetch(`/api/admin/resolve/${campaignId}`, { method: 'POST' })
      if (!res.ok) {
        alert(await res.text())
      } else {
        alert('Campaign resolved successfully')
        router.refresh()
      }
    } catch (e: any) {
      alert(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <button 
      onClick={handleResolve} 
      disabled={disabled || loading}
      className="ml-4 text-emerald-600 hover:text-emerald-900 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {loading ? 'Resolving...' : 'Resolve'}
    </button>
  )
}
