import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { HeritageCard } from '@/components/heritage-card';
import { mockHeritageItems } from '@/lib/mock-data';
import { Archive, ShieldCheck, Fingerprint } from 'lucide-react';

export default function VaultPage() {
  const originalCount = mockHeritageItems.filter((i) => i.isOriginal).length;
  const verifiedCount = mockHeritageItems.filter(
    (i) => i.verificationStatus === 'Original Preserved' || i.verificationStatus === 'Verified'
  ).length;

  return (
    <div className="min-h-screen bg-paper-grain">
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-6 py-12">
        {/* Header */}
        <div className="mb-10">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-medium text-primary">
            <Archive className="h-3.5 w-3.5" />
            Family Archive
          </div>
          <h1 className="font-display text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
            The Abdi Family Archive
          </h1>
          <p className="mt-3 max-w-2xl text-lg text-muted-foreground">
            A private collection of original family photographs, voice recordings, letters and
            documents — preserved with verifiable provenance for future generations.
          </p>
        </div>

        {/* Stats */}
        <div className="mb-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <StatCard
            icon={Archive}
            label="Heritage Items"
            value={mockHeritageItems.length.toString()}
          />
          <StatCard
            icon={ShieldCheck}
            label="Verified Originals"
            value={verifiedCount.toString()}
          />
          <StatCard
            icon={Fingerprint}
            label="Digital Fingerprints"
            value={originalCount.toString()}
          />
          <StatCard icon={Archive} label="Contributors" value="1" />
        </div>

        {/* Heritage Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {mockHeritageItems.map((item, idx) => (
            <div
              key={item.id}
              className="animate-fade-in-up"
              style={{ animationDelay: `${idx * 80}ms` }}
            >
              <HeritageCard item={item} href={`/certificate/${item.id}`} />
            </div>
          ))}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Archive;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-border/60 bg-card p-5 shadow-heritage">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 ring-1 ring-primary/15">
          <Icon className="h-5 w-5 text-primary" />
        </div>
        <div>
          <p className="font-display text-2xl font-bold text-foreground">{value}</p>
          <p className="text-xs text-muted-foreground">{label}</p>
        </div>
      </div>
    </div>
  );
}
