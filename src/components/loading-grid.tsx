interface LoadingGridProps {
  count?: number;
}

// TODO: Add a loading grid component that can be used to display a grid of loading skeletons

export function LoadingGrid({ count = 8 }: LoadingGridProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="h-72 rounded-lg bg-gray-200 animate-pulse" />
      ))}
    </div>
  );
}
