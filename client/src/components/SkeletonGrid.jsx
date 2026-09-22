export default function SkeletonGrid({ count = 12 }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-5 xl:grid-cols-6">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]">
          <div className="aspect-[2/3] animate-pulse bg-white/10" />
          <div className="space-y-2 p-3.5">
            <div className="h-4 animate-pulse rounded bg-white/10" />
            <div className="h-3 w-1/2 animate-pulse rounded bg-white/10" />
          </div>
        </div>
      ))}
    </div>
  );
}
