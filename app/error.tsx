'use client'

import { useEffect } from 'react'
import Link from 'next/link'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="text-box max-w-2xl">
        <h2 className="text-2xl text-nes-red mb-4">
          ⚠️ ERROR
        </h2>
        <p className="text-sm mb-6">
          Something went wrong on your adventure!
        </p>
        <div className="flex gap-4">
          <button
            onClick={reset}
            className="pixel-button"
          >
            TRY AGAIN
          </button>
          <Link href="/">
            <button className="pixel-button">
              RETURN HOME
            </button>
          </Link>
        </div>
      </div>
    </div>
  )
}