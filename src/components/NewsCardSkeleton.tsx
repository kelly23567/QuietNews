import { cn } from '../lib/utils';

export function NewsCardSkeleton() {
  const cards = Array.from({ length: 9 });

  return (
    <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 md:gap-16">
      {cards.map((_, i) => (
        <div key={i} className="flex flex-col">
          <div
            className={cn(
              'relative flex-grow flex flex-col p-8 md:p-10 min-h-[32rem] max-w-[20rem] mx-auto w-full',
              'bg-quiet-fog/30 rounded-[2px] border border-black/[0.04]',
              'animate-pulse'
            )}
          >
            {/* Tape placeholder */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-16 h-5 bg-ink/[0.03] rounded-[1px]" />

            {/* Tag placeholder */}
            <div className="mt-4 mb-6 w-16 h-6 bg-ink/[0.04] rounded-sm" />

            {/* Title lines */}
            <div className="space-y-3 flex-grow">
              <div className="w-full h-5 bg-ink/[0.05] rounded-sm" />
              <div className="w-5/6 h-5 bg-ink/[0.05] rounded-sm" />
              <div className="w-4/6 h-5 bg-ink/[0.05] rounded-sm" />
            </div>

            {/* Footer placeholder */}
            <div className="mt-auto pt-6 border-t border-ink/5 flex justify-between">
              <div className="w-20 h-3 bg-ink/[0.04] rounded-sm" />
              <div className="w-12 h-3 bg-ink/[0.04] rounded-sm" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
