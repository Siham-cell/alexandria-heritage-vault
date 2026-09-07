import Link from 'next/link';
import Image from 'next/image';
import {
  ShieldCheck,
  Fingerprint,
  KeyRound,
  Sparkles,
  ArrowRight,
  Archive,
  Mic,
  FileText,
  ImageIcon,
  CheckCircle2,
} from 'lucide-react';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { landingTimeline, mockHeritageItems } from '@/lib/mock-data';

export default function Home() {
  return (
    <div className="min-h-screen bg-paper-grain">
      <SiteHeader />
      <main>
        {/* Hero */}
        <section className="relative overflow-hidden px-6 pt-16 pb-20 sm:pt-24 sm:pb-28">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-medium text-primary animate-fade-in">
              <ShieldCheck className="h-3.5 w-3.5" />
              Private-first · Post-quantum signatures · Verifiable provenance
            </div>

            <h1 className="font-display text-4xl font-semibold leading-[1.15] tracking-tight text-foreground text-balance sm:text-5xl md:text-6xl animate-fade-in-up">
              What if future generations could{' '}
              <span className="italic text-primary">hear history</span> from the people who lived
              it?
            </h1>

            <p className="mx-auto mt-6 max-w-2xl font-serif-body text-lg leading-relaxed text-muted-foreground text-balance animate-fade-in-up [animation-delay:100ms]">
              Alexandria preserves family memories, stories and original sources with verifiable
              provenance.
            </p>

            <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row animate-fade-in-up [animation-delay:200ms]">
              <Link href="/vault">
                <Button size="lg" className="w-full sm:w-auto gap-2">
                  Explore Family Vault
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/add">
                <Button size="lg" variant="outline" className="w-full sm:w-auto gap-2">
                  <Sparkles className="h-4 w-4" />
                  Preserve a Memory
                </Button>
              </Link>
            </div>
          </div>

          {/* Visual Timeline */}
          <div className="mx-auto mt-20 max-w-5xl">
            <div className="mb-6 flex items-center gap-3">
              <div className="h-px flex-1 bg-border" />
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                The Abdi Family Archive · A Visual Timeline
              </span>
              <div className="h-px flex-1 bg-border" />
            </div>

            <div className="relative">
              {/* Horizontal line */}
              <div className="absolute left-0 right-0 top-[42px] hidden h-0.5 bg-gradient-to-r from-transparent via-primary/30 to-transparent md:block" />

              <div className="grid grid-cols-2 gap-6 md:grid-cols-4 md:gap-4">
                {landingTimeline.map((entry, idx) => {
                  const Icon = getTimelineIcon(entry.type);
                  return (
                    <div
                      key={entry.year}
                      className="relative flex flex-col items-center text-center animate-fade-in-up"
                      style={{ animationDelay: `${300 + idx * 120}ms` }}
                    >
                      <div className="relative z-10 flex h-[84px] w-[84px] items-center justify-center rounded-full border-2 border-primary/20 bg-card shadow-heritage">
                        <Icon className="h-7 w-7 text-primary" />
                      </div>
                      <span className="mt-4 font-display text-2xl font-bold text-foreground">
                        {entry.year}
                      </span>
                      <span className="mt-1 text-sm font-medium text-foreground">{entry.title}</span>
                      <span className="mt-0.5 text-xs text-muted-foreground">{entry.type}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* Featured Heritage Cards */}
        <section className="px-6 py-16">
          <div className="mx-auto max-w-6xl">
            <div className="mb-8 flex items-end justify-between">
              <div>
                <h2 className="font-display text-3xl font-semibold text-foreground">
                  Preserved Heritage
                </h2>
                <p className="mt-2 text-muted-foreground">
                  Original sources with verified provenance, protected for future generations.
                </p>
              </div>
              <Link href="/vault">
                <Button variant="ghost" className="gap-2 text-primary">
                  View all
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {mockHeritageItems.slice(0, 4).map((item, idx) => (
                <Link
                  key={item.id}
                  href={`/certificate/${item.id}`}
                  className="group block animate-fade-in-up"
                  style={{ animationDelay: `${idx * 80}ms` }}
                >
                  <Card className="overflow-hidden border-border/60 transition-all duration-300 hover:shadow-heritage-lg hover:-translate-y-1">
                    <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                      <Image
                        src={item.imageUrl}
                        alt={item.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, 25vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                      <span className="absolute bottom-3 left-3 font-display text-2xl font-bold text-white drop-shadow">
                        {item.year}
                      </span>
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-display text-base font-semibold leading-tight text-foreground">
                        {item.title}
                      </h3>
                      <p className="mt-1 text-xs text-muted-foreground">{item.type}</p>
                      <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-success/10 px-2.5 py-1 text-xs font-semibold text-success ring-1 ring-success/20">
                        <CheckCircle2 className="h-3 w-3" />
                        {item.verificationStatus}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Core Principles */}
        <section className="px-6 py-16">
          <div className="mx-auto max-w-5xl">
            <div className="mb-10 text-center">
              <h2 className="font-display text-3xl font-semibold text-foreground">
                How Alexandria Protects Heritage
              </h2>
              <p className="mt-3 text-muted-foreground">
                Every original source receives a digital fingerprint, a post-quantum signature, and a
                registered provenance record.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              <PrincipleCard
                icon={Fingerprint}
                title="Digital DNA"
                description="Every file is fingerprinted with a cryptographic hash, creating a unique digital identity that can verify authenticity."
                delay={0}
              />
              <PrincipleCard
                icon={KeyRound}
                title="Post-Quantum Signature"
                description="Each heritage item is signed with a post-quantum cryptographic signature, protecting provenance against future quantum attacks."
                delay={80}
              />
              <PrincipleCard
                icon={Archive}
                title="Verifiable Provenance"
                description="Every original and derived version is tracked through a provenance timeline, so history can be transformed but never erased."
                delay={160}
              />
            </div>
          </div>
        </section>

        {/* Core Principle Banner */}
        <section className="px-6 py-16">
          <div className="mx-auto max-w-4xl">
            <div className="rounded-2xl border border-primary/15 bg-primary/5 px-8 py-10 text-center shadow-heritage">
              <Sparkles className="mx-auto h-8 w-8 text-primary" />
              <p className="mt-4 font-display text-2xl font-medium leading-snug text-foreground text-balance">
                "AI can interpret heritage. AI must never silently rewrite the original."
              </p>
              <p className="mt-3 text-sm text-muted-foreground">
                The founding principle of Alexandria.
              </p>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}

function PrincipleCard({
  icon: Icon,
  title,
  description,
  delay,
}: {
  icon: typeof ShieldCheck;
  title: string;
  description: string;
  delay: number;
}) {
  return (
    <Card
      className="border-border/60 p-6 animate-fade-in-up"
      style={{ animationDelay: `${delay}ms` }}
    >
      <CardContent className="p-0">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 ring-1 ring-primary/15">
          <Icon className="h-6 w-6 text-primary" />
        </div>
        <h3 className="mt-4 font-display text-xl font-semibold text-foreground">{title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}

function getTimelineIcon(type: string) {
  switch (type) {
    case 'Photograph':
      return ImageIcon;
    case 'Audio':
      return Mic;
    case 'Document':
    case 'Letter':
      return FileText;
    default:
      return Archive;
  }
}
