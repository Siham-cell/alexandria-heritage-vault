import Link from 'next/link';
import Image from 'next/image';
import { MapPin, FileText, Mic, ImageIcon, Video } from 'lucide-react';
import type { HeritageItem, HeritageType } from '@/lib/types';
import { StatusBadge } from './status-badge';
import { Card, CardContent } from '@/components/ui/card';
import { truncateDigest } from '@/lib/services/hashing';
import { cn } from '@/lib/utils';

const typeIconMap: Record<HeritageType, typeof ImageIcon> = {
  Photograph: ImageIcon,
  Audio: Mic,
  Document: FileText,
  Video: Video,
  Letter: FileText,
};

interface HeritageCardProps {
  item: HeritageItem;
  href?: string;
  className?: string;
}

export function HeritageCard({ item, href, className }: HeritageCardProps) {
  const TypeIcon = typeIconMap[item.type] || ImageIcon;
  const cardContent = (
    <Card
      className={cn(
        'group cursor-pointer overflow-hidden border-border/60 transition-all duration-300 hover:shadow-heritage-lg hover:-translate-y-1',
        className
      )}
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        <Image
          src={item.imageUrl}
          alt={item.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
        <div className="absolute left-3 top-3 flex items-center gap-1.5 rounded-full bg-background/90 px-2.5 py-1 text-xs font-medium text-foreground shadow-sm backdrop-blur-sm">
          <TypeIcon className="h-3.5 w-3.5 text-primary" />
          {item.type}
        </div>
        <div className="absolute bottom-3 left-3">
          <span className="font-display text-3xl font-semibold text-white drop-shadow-sm">
            {item.year}
          </span>
        </div>
      </div>

      <CardContent className="p-5">
        <h3 className="font-display text-xl font-semibold leading-tight text-foreground">
          {item.title}
        </h3>
        <p className="mt-1.5 flex items-center gap-1.5 text-sm text-muted-foreground">
          <MapPin className="h-3.5 w-3.5" />
          {item.location}
        </p>

        <div className="mt-3 flex items-center justify-between">
          <StatusBadge status={item.verificationStatus} />
          <span className="font-mono text-xs text-muted-foreground/70">
            DNA: {truncateDigest(item.digitalDna)}
          </span>
        </div>
      </CardContent>
    </Card>
  );

  if (href) {
    return (
      <Link href={href} className="block">
        {cardContent}
      </Link>
    );
  }
  return cardContent;
}
