import { Skeleton } from "@/components/ui/skeleton";

export default function AboutLoading() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl">
      <Skeleton className="h-12 w-48 mx-auto mb-8" />

      <div className="grid md:grid-cols-2 gap-8 items-center mb-12">
        <Skeleton className="h-[400px] w-full rounded-lg" />
        <div className="space-y-4">
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="p-6 border rounded-lg">
            <Skeleton className="h-6 w-32 mb-3" />
            <Skeleton className="h-24 w-full" />
          </div>
        ))}
      </div>
    </div>
  );
}
