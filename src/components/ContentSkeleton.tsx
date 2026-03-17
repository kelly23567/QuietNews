export function ContentSkeleton() {
  return (
    <div className="animate-pulse">
      {/* Insight skeleton */}
      <div className="px-4 md:px-12 py-8">
        <div className="mx-auto max-w-lg space-y-3">
          <div className="w-full h-6 bg-ink/[0.05] rounded-sm" />
          <div className="w-3/4 h-6 bg-ink/[0.05] rounded-sm mx-auto" />
        </div>
      </div>

      {/* Summary skeleton */}
      <div className="mt-8 px-2 md:px-8 space-y-4">
        <div className="w-full h-4 bg-ink/[0.04] rounded-sm" />
        <div className="w-full h-4 bg-ink/[0.04] rounded-sm" />
        <div className="w-5/6 h-4 bg-ink/[0.04] rounded-sm" />
        <div className="w-full h-4 bg-ink/[0.04] rounded-sm" />
        <div className="w-4/6 h-4 bg-ink/[0.04] rounded-sm" />
      </div>
    </div>
  );
}
