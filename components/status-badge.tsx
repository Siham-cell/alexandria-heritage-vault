import { CheckCircle2, ShieldCheck, Clock, AlertCircle } from 'lucide-react';
import type { VerificationStatus } from '@/lib/types';
import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  status: VerificationStatus;
  className?: string;
}

const statusConfig: Record<
  VerificationStatus,
  { icon: typeof CheckCircle2; className: string; label: string }
> = {
  'Original Preserved': {
    icon: CheckCircle2,
    className: 'bg-success/10 text-success ring-1 ring-success/20',
    label: 'Original Preserved',
  },
  Verified: {
    icon: ShieldCheck,
    className: 'bg-success/10 text-success ring-1 ring-success/20',
    label: 'Verified',
  },
  'Pending Verification': {
    icon: Clock,
    className: 'bg-warning/10 text-warning ring-1 ring-warning/20',
    label: 'Pending Verification',
  },
  'Derived Version': {
    icon: AlertCircle,
    className: 'bg-accent text-accent-foreground ring-1 ring-accent',
    label: 'Derived Version',
  },
  Unverified: {
    icon: AlertCircle,
    className: 'bg-muted text-muted-foreground ring-1 ring-border',
    label: 'Unverified',
  },
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold',
        config.className,
        className
      )}
    >
      <Icon className="h-3.5 w-3.5" />
      {config.label}
    </span>
  );
}
