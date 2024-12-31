import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-900 to-black text-white">
      <div className="max-w-7xl mx-auto px-4 py-16">
        <Skeleton className="h-12 w-48 mb-12 bg-zinc-800" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="space-y-4">
              <Skeleton className="aspect-square w-full bg-zinc-800" />
              <Skeleton className="h-4 w-3/4 bg-zinc-800" />
              <Skeleton className="h-4 w-full bg-zinc-800" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

