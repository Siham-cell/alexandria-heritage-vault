'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ShieldCheck,
  Fingerprint,
  KeyRound,
  UserCheck,
  Archive,
  CheckCircle2,
  Eye,
  Search,
  Award,
  Calendar,
  MapPin,
  Sparkles,
  XCircle,
  Loader2,
} from 'lucide-react';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { truncateDigest } from '@/lib/services/hashing';
import { verifyProvenance } from '@/lib/services/pqc';
import { mockHeritageItems } from '@/lib/mock-data';

type PqcVerifyState = 'checking' | 'verified' | 'failed';

export default function CertificatePage({ params }: { params: { id: string } }) {
  const item = mockHeritageItems.find((i) => i.id === params.id);
  const [showFullDna, setShowFullDna] = useState(false);
  const [pqcState, setPqcState] = useState<PqcVerifyState>('checking');

  useEffect(() => {
    if (!item?.pqcSignature?.signatureBase64 || !item?.pqcSignature?.publicKeyBase64 || !item?.pqcSignature?.signedData) {
      setPqcState('failed');
      return;
    }

    const isValid = verifyProvenance(
      item.pqcSignature.signedData,
      item.pqcSignature.signatureBase64,
      item.pqcSignature.publicKeyBase64
    );

    setPqcState(isValid ? 'verified' : 'failed');
  }, [item]);

  if (!item) {
    return (
      <div className="min-h-screen bg-paper-grain">
        <SiteHeader />
        <main className="mx-auto max-w-2xl px-6 py-20 text-center">
          <h1 className="font-display text-3xl font-semibold text-foreground">
            Heritage item not found
          </h1>
          <Link href="/vault">
            <Button className="mt-6">Back to Family Vault</Button>
          </Link>
        </main>
        <SiteFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-paper-grain">
      <SiteHeader />
      <main className="mx-auto max-w-4xl px-6 py-12">
        {/* Back link */}
        <Link
          href="/vault"
          className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          ← Back to Family Vault
        </Link>

        {/* Certificate */}
        <div className="animate-scale-in">
          <div className="relative rounded-2xl border-2 border-heritage-gold/30 bg-certificate p-8 shadow-heritage-lg sm:p-12">
            {/* Decorative corners */}
            <div className="pointer-events-none absolute left-3 top-3 h-12 w-12 border-l-2 border-t-2 border-heritage-gold/30 rounded-tl-lg" />
            <div className="pointer-events-none absolute right-3 top-3 h-12 w-12 border-r-2 border-t-2 border-heritage-gold/30 rounded-tr-lg" />
            <div className="pointer-events-none absolute left-3 bottom-3 h-12 w-12 border-l-2 border-b-2 border-heritage-gold/30 rounded-bl-lg" />
            <div className="pointer-events-none absolute right-3 bottom-3 h-12 w-12 border-r-2 border-b-2 border-heritage-gold/30 rounded-br-lg" />

            {/* Certificate header */}
            <div className="text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 ring-1 ring-primary/20">
                <Award className="h-7 w-7 text-primary" />
              </div>
              <p className="mt-4 font-display text-sm font-semibold uppercase tracking-[0.3em] text-primary">
                ALEXANDRIA
              </p>
              <h1 className="mt-1 font-display text-3xl font-semibold tracking-wide text-foreground sm:text-4xl">
                HERITAGE CERTIFICATE
              </h1>
              <div className="mx-auto mt-4 h-px w-32 bg-gradient-to-r from-transparent via-heritage-gold/50 to-transparent" />
            </div>

            {/* Heritage image */}
            <div className="mt-8 flex justify-center">
              <div className="relative h-56 w-56 overflow-hidden rounded-xl border-4 border-card shadow-lg sm:h-64 sm:w-64">
                <Image
                  src={item.imageUrl}
                  alt={item.title}
                  fill
                  className="object-cover"
                  sizes="256px"
                />
              </div>
            </div>

            {/* Title & Year */}
            <div className="mt-8 text-center">
              <h2 className="font-display text-3xl font-semibold text-foreground sm:text-4xl">
                {item.title}
              </h2>
              <p className="mt-2 font-display text-2xl font-medium text-muted-foreground">
                {item.year}
              </p>
              <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-success/10 px-4 py-1.5 text-sm font-semibold text-success ring-1 ring-success/20">
                <CheckCircle2 className="h-4 w-4" />
                ORIGINAL PRESERVED
              </div>
            </div>

            {/* Metadata grid */}
            <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
              <MetaItem icon={Calendar} label="Year" value={item.year.toString()} />
              <MetaItem icon={MapPin} label="Location" value={item.location} />
              <MetaItem icon={Archive} label="Type" value={item.type} />
            </div>

            {/* Verification Details */}
            <div className="mt-8 space-y-4">
              {/* Digital DNA */}
              <div className="flex items-center justify-between rounded-xl border border-border bg-card/80 px-5 py-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 ring-1 ring-primary/15">
                    <Fingerprint className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      Digital DNA
                    </p>
                    <p className="mt-0.5 font-mono text-sm text-foreground">
                      {showFullDna ? item.digitalDna : truncateDigest(item.digitalDna)}
                    </p>
                  </div>
                </div>
                <button
                  className="text-xs text-primary hover:underline"
                  onClick={() => setShowFullDna(!showFullDna)}
                >
                  {showFullDna ? 'Hide' : 'Show'}
                </button>
              </div>

              {/* PQC Signature */}
              <div className="flex items-center justify-between rounded-xl border border-border bg-card/80 px-5 py-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 ring-1 ring-primary/15">
                    <KeyRound className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      PQC Signature
                    </p>
                    <p className="mt-0.5 text-sm text-foreground">
                      {item.pqcSignature.algorithm}
                    </p>
                  </div>
                </div>
                {pqcState === 'checking' && (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground ring-1 ring-border">
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    Verifying...
                  </span>
                )}
                {pqcState === 'verified' && (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-success/10 px-3 py-1 text-xs font-semibold text-success ring-1 ring-success/20">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    Verified
                  </span>
                )}
                {pqcState === 'failed' && (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-destructive/10 px-3 py-1 text-xs font-semibold text-destructive ring-1 ring-destructive/20">
                    <XCircle className="h-3.5 w-3.5" />
                    Unverified
                  </span>
                )}
              </div>

              {/* Contributor */}
              <div className="flex items-center justify-between rounded-xl border border-border bg-card/80 px-5 py-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 ring-1 ring-primary/15">
                    <UserCheck className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      Contributor
                    </p>
                    <p className="mt-0.5 text-sm text-foreground">
                      {item.contributor.name} · {item.contributor.relationship}
                    </p>
                  </div>
                </div>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-success/10 px-3 py-1 text-xs font-semibold text-success ring-1 ring-success/20">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  {item.contributor.identityStatus}
                </span>
              </div>

              {/* Provenance */}
              <div className="flex items-center justify-between rounded-xl border border-border bg-card/80 px-5 py-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 ring-1 ring-primary/15">
                    <Archive className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      Provenance
                    </p>
                    <p className="mt-0.5 text-sm text-foreground">
                      {item.provenance.length} record{item.provenance.length > 1 ? 's' : ''}{' '}
                      registered
                    </p>
                  </div>
                </div>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-success/10 px-3 py-1 text-xs font-semibold text-success ring-1 ring-success/20">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Registered
                </span>
              </div>
            </div>

            {/* Story */}
            {item.story && (
              <div className="mt-6 rounded-xl border border-border/60 bg-secondary/30 px-5 py-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Story
                </p>
                <p className="mt-1.5 font-serif-body text-sm italic leading-relaxed text-foreground">
                  "{item.story}"
                </p>
              </div>
            )}

            {/* AI Enrichment summary */}
            {item.aiEnrichment && (
              <div className="mt-4 rounded-xl border border-heritage-gold/20 bg-heritage-gold/5 px-5 py-4">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-heritage-gold" />
                  <p className="text-xs font-semibold uppercase tracking-wide text-heritage-gold">
                    Alexandria AI · {item.aiEnrichment.status}
                  </p>
                </div>
                <p className="mt-2 text-sm text-foreground">
                  {item.aiEnrichment.description}
                </p>
                <p className="mt-2 text-xs italic text-muted-foreground">
                  {item.aiEnrichment.note}
                </p>
              </div>
            )}

            {/* Certificate footer */}
            <div className="mt-8 border-t border-heritage-gold/20 pt-6 text-center">
              <div className="mx-auto h-px w-24 bg-gradient-to-r from-transparent via-heritage-gold/40 to-transparent" />
              <p className="mt-4 font-display text-xs uppercase tracking-[0.2em] text-muted-foreground">
                Issued by Alexandria Heritage Vault
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                This certificate verifies the provenance and authenticity of the registered
                heritage item.
              </p>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link href="/provenance" className="flex-1">
            <Button variant="outline" size="lg" className="w-full gap-2">
              <Eye className="h-5 w-5" />
              View Provenance
            </Button>
          </Link>
          <Link href="/verify" className="flex-1">
            <Button size="lg" className="w-full gap-2">
              <Search className="h-5 w-5" />
              Verify This File
            </Button>
          </Link>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

function MetaItem({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Calendar;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-border bg-card/80 px-4 py-3">
      <Icon className="h-5 w-5 text-primary" />
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          {label}
        </p>
        <p className="text-sm font-medium text-foreground">{value}</p>
      </div>
    </div>
  );
}
