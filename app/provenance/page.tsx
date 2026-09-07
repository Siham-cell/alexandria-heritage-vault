import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { ProvenanceTimeline } from '@/components/provenance-timeline';
import { mockHeritageItems } from '@/lib/mock-data';
import { Sparkles, ShieldCheck } from 'lucide-react';

export default function ProvenancePage() {
  // Use the first heritage item (Grandparents' Wedding) which has a full provenance chain
  const item = mockHeritageItems[0];

  return (
    <div className="min-h-screen bg-paper-grain">
      <SiteHeader />
      <main className="mx-auto max-w-4xl px-6 py-12">
        {/* Header */}
        <div className="mb-10 text-center">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-medium text-primary">
            <ShieldCheck className="h-3.5 w-3.5" />
            Provenance Timeline
          </div>
          <h1 className="font-display text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
            Provenance
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-lg text-muted-foreground">
            Every transformation of a heritage item is tracked. The original can be restored,
            colorized, or enhanced — but its provenance can never be erased.
          </p>
        </div>

        {/* Heritage item context */}
        <div className="mb-10 rounded-xl border border-border/60 bg-card p-6 shadow-heritage">
          <h2 className="font-display text-2xl font-semibold text-foreground">{item.title}</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {item.year} · {item.type} · {item.location}
          </p>
        </div>

        {/* Provenance Timeline */}
        <ProvenanceTimeline records={item.provenance} />

        {/* Core principle banner */}
        <div className="mt-12 rounded-2xl border border-primary/15 bg-primary/5 px-8 py-10 text-center shadow-heritage">
          <Sparkles className="mx-auto h-8 w-8 text-primary" />
          <p className="mt-4 font-display text-2xl font-medium leading-snug text-foreground text-balance">
            "AI can transform heritage, but it cannot erase provenance."
          </p>
          <p className="mt-3 text-sm text-muted-foreground">
            Every derived version links back to the original — always.
          </p>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
