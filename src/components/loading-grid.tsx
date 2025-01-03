export function LoadingGrid() {
  return (
    <div className="mx-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:mx-0">
      {[...Array(8)].map((_, i) => (
        <div key={i} className="h-72 rounded-lg bg-gray-200 animate-pulse" />
      ))}
    </div>
  );
}
