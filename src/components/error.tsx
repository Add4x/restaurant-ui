'use client'

import { Button } from "@/components/ui/button"
import { AlertCircle } from 'lucide-react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="min-h-screen bg-linear-to-br from-zinc-900 to-black text-white flex items-center justify-center">
      <div className="text-center space-y-4">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto" />
        <h2 className="text-2xl font-bold">Something went wrong!</h2>
        <p className="text-zinc-400">{error.message}</p>
        <Button onClick={() => reset()} variant="secondary">
          Try again
        </Button>
      </div>
    </div>
  )
}

