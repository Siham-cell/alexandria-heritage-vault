import { cn } from '@/lib/utils';

interface ProvenanceBadgeProps {
  kind: 'ORIGINAL' | 'DERIVED';
  className?: string;
}

export function ProvenanceBadge({ kind, className }: ProvenanceBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-md px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em]',
        kind === 'ORIGINAL'
          ? 'bg-success/10 text-success ring-1 ring-success/25'
          : 'bg-heritage-sepia/40 text-heritage-ink ring-1 ring-heritage-sepia/50',
        className
      )}
    >
      {kind}
    </span>
  );
}


