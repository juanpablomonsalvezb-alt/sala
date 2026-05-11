'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { createCheckoutSession } from '../actions'

export default function CheckoutButton({
  creatorSlug,
  priceLabel,
}: {
  creatorSlug: string
  priceLabel: string
}) {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  function handleClick() {
    setError(null)
    startTransition(async () => {
      const result = await createCheckoutSession(creatorSlug)
      if (result.ok) {
        window.location.href = result.url
        return
      }
      if ('needsAuth' in result) {
        router.push(result.loginUrl)
        return
      }
      if ('alreadySubscribed' in result) {
        router.push(result.profileUrl)
        return
      }
      setError(result.error)
    })
  }

  return (
    <>
      <button
        type="button"
        onClick={handleClick}
        disabled={isPending}
        className="w-full font-sans text-[14px] font-semibold py-4 bg-[#121212] text-white hover:bg-[#C41C1C] transition-colors duration-150 mb-3 disabled:opacity-60"
      >
        {isPending ? 'Conectando con MercadoPago…' : `Suscribirme · ${priceLabel}`}
      </button>
      {error && (
        <div className="border-l-2 border-[#C41C1C] pl-3 py-1 mb-3">
          <p className="font-sans text-[13px] text-[#C41C1C]">{error}</p>
        </div>
      )}
      <p className="font-sans text-[11px] text-[#666666] text-center">
        Pago seguro vía MercadoPago. Cancela en cualquier momento.
      </p>
    </>
  )
}
