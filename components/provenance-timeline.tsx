'use client';

import { CheckCircle2, Fingerprint, KeyRound, ShieldCheck, ArrowDown, Sparkles } from 'lucide-react';
import type { ProvenanceRecord } from '@/lib/types';
import { ProvenanceBadge } from './provenance-badge';
import { cn } from '@/lib/utils';

interface ProvenanceTimelineProps {
  records: ProvenanceRecord[];
}

export function ProvenanceTimeline({ records }: ProvenanceTimelineProps) {
  return (
    <div className="relative">
      {/* Vertical line */}
      <div className="absolute left-[27px] top-4 bottom-4 w-0.5 bg-gradient-to-b from-primary/30 via-primary/20 to-transparent" />

      <div className="space-y-2">
        {records.map((record, idx) => (
          <div
            key={record.id}
            className="relative flex gap-6 animate-fade-in-up"
            style={{ animationDelay: `${idx * 150}ms` }}
          >
            {/* Node */}
            <div className="relative z-10 flex-shrink-0">
              <div
                className={cn(
                  'flex h-14 w-14 items-center justify-center rounded-full border-2 shadow-heritage',
                  record.kind === 'ORIGINAL'
                    ? 'border-primary/30 bg-primary/10'
                    : 'border-heritage-sepia/50 bg-heritage-sepia/20'
                )}
              >
                {record.kind === 'ORIGINAL' ? (
                  <ShieldCheck className="h-6 w-6 text-primary" />
                ) : (
                  <Sparkles className="h-6 w-6 text-heritage-gold" />
                )}
              </div>
            </div>

            {/* Card */}
            <div
              className={cn(
                'flex-1 rounded-xl border p-5 shadow-heritage transition-all hover:shadow-heritage-lg',
                record.kind === 'ORIGINAL'
                  ? 'border-primary/20 bg-card'
                  : 'border-heritage-sepia/40 bg-heritage-sepia/5'
              )}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3">
                    <span className="font-display text-3xl font-bold text-foreground">
                      {record.year}
                    </span>
                    <ProvenanceBadge kind={record.kind} />
                  </div>
                  <h3 className="mt-1.5 font-display text-lg font-semibold text-foreground">
                    {record.title}
                  </h3>
                  {record.transformType && (
                    <p className="mt-0.5 text-xs font-medium text-heritage-gold">
                      Transform: {record.transformType}
                    </p>
                  )}
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {record.description}
                  </p>
                </div>
              </div>

              {/* Verification badges */}
              <div className="mt-4 flex flex-wrap gap-3">
                <VerificationPill
                  icon={Fingerprint}
                  label="Digital DNA"
                  verified={record.hasDigitalDna}
                />
                <VerificationPill icon={KeyRound} label="PQC" verified={record.hasPqc} />
                <VerificationPill
                  icon={ShieldCheck}
                  label="Provenance"
                  verified={record.hasProvenance}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function VerificationPill({
  icon: Icon,
  label,
  verified,
}: {
  icon: typeof CheckCircle2;
  label: string;
  verified: boolean;
}) {
  return (
    <div
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium',
        verified
          ? 'bg-success/10 text-success ring-1 ring-success/20'
          : 'bg-muted text-muted-foreground ring-1 ring-border'
      )}
    >
      {verified ? <CheckCircle2 className="h-3.5 w-3.5" /> : <Icon className="h-3.5 w-3.5" />}
      <span>{label}</span>
      {verified && <span className="text-success">✓</span>}
    </div>
  );
}
