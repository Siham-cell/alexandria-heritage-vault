'use client';

import { useState, useRef } from 'react';
import {
  Upload,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  Loader2,
  FileText,
  Fingerprint,
  ArrowRight,
  RotateCcw,
} from 'lucide-react';
import Link from 'next/link';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { verifyFile } from '@/lib/services/verification';
import { truncateDigest } from '@/lib/services/hashing';
import { mockHeritageItems } from '@/lib/mock-data';
import type { VerificationResult } from '@/lib/types';

export default function VerifyPage() {
  const [file, setFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [selectedHeritageId, setSelectedHeritageId] = useState(mockHeritageItems[0].id);
  const [isVerifying, setIsVerifying] = useState(false);
  const [result, setResult] = useState<VerificationResult | null>(null);
  const [showDerivedOption, setShowDerivedOption] = useState(false);
  const [derivedRegistered, setDerivedRegistered] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const selectedItem = mockHeritageItems.find((i) => i.id === selectedHeritageId)!;

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
      if (selected.type.startsWith('image/')) {
        setFilePreview(URL.createObjectURL(selected));
      } else {
        setFilePreview(null);
      }
      setResult(null);
      setShowDerivedOption(false);
      setDerivedRegistered(false);
    }
  };

  const handleVerify = async () => {
    if (!file) return;
    setIsVerifying(true);
    setResult(null);
    setShowDerivedOption(false);
    setDerivedRegistered(false);

    const verifyResult = await verifyFile(file, selectedItem.digitalDna);
    setResult(verifyResult);
    setIsVerifying(false);

    if (verifyResult.status === 'different') {
      setShowDerivedOption(true);
    }
  };

  const handleReset = () => {
    setFile(null);
    setFilePreview(null);
    setResult(null);
    setShowDerivedOption(false);
    setDerivedRegistered(false);
  };

  return (
    <div className="min-h-screen bg-paper-grain">
      <SiteHeader />
      <main className="mx-auto max-w-3xl px-6 py-12">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-medium text-primary">
            <ShieldCheck className="h-3.5 w-3.5" />
            Verify Authenticity
          </div>
          <h1 className="font-display text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
            Is this the original?
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-lg text-muted-foreground">
            Upload a file to compare it against the registered digital fingerprint of an original
            heritage item.
          </p>
        </div>

        {/* Upload + Select */}
        {!result && !isVerifying && (
          <Card className="border-border/60 shadow-heritage">
            <CardContent className="p-6 sm:p-8 space-y-6">
              {/* Heritage selection */}
              <div>
                <Label className="text-sm font-semibold text-foreground">
                  Compare Against
                </Label>
                <Select value={selectedHeritageId} onValueChange={setSelectedHeritageId}>
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {mockHeritageItems.map((item) => (
                      <SelectItem key={item.id} value={item.id}>
                        {item.title} · {item.year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="mt-3 flex items-center gap-2 rounded-lg bg-secondary/50 px-4 py-2.5">
                  <Fingerprint className="h-4 w-4 flex-shrink-0 text-primary" />
                  <span className="font-mono text-xs text-muted-foreground">
                    Registered DNA: {truncateDigest(selectedItem.digitalDna)}
                  </span>
                </div>
              </div>

              {/* File upload */}
              <div
                className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-border bg-secondary/30 px-6 py-12 text-center transition-colors hover:border-primary/40 hover:bg-primary/5 cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  const dropped = e.dataTransfer.files?.[0];
                  if (dropped) {
                    setFile(dropped);
                    if (dropped.type.startsWith('image/')) {
                      setFilePreview(URL.createObjectURL(dropped));
                    }
                  }
                }}
              >
                {file ? (
                  <div className="flex flex-col items-center gap-3">
                    {filePreview ? (
                      <img
                        src={filePreview}
                        alt="Preview"
                        className="max-h-40 rounded-lg object-contain shadow-md"
                      />
                    ) : (
                      <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-primary/10">
                        <FileText className="h-8 w-8 text-primary" />
                      </div>
                    )}
                    <span className="text-sm font-medium text-foreground">{file.name}</span>
                    <button
                      className="text-xs text-muted-foreground hover:text-destructive"
                      onClick={(e) => {
                        e.stopPropagation();
                        setFile(null);
                        setFilePreview(null);
                      }}
                    >
                      Remove file
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-3">
                    <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-primary/10 ring-1 ring-primary/15">
                      <Upload className="h-8 w-8 text-primary" />
                    </div>
                    <div>
                      <p className="font-display text-lg font-semibold text-foreground">
                        Upload a file to verify
                      </p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        Drag and drop or click to browse
                      </p>
                    </div>
                  </div>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  onChange={handleFileSelect}
                />
              </div>

              <Button
                size="lg"
                className="w-full gap-2"
                onClick={handleVerify}
                disabled={!file}
              >
                <ShieldCheck className="h-5 w-5" />
                Verify This File
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Loading */}
        {isVerifying && (
          <Card className="border-border/60 shadow-heritage-lg">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
              <p className="mt-4 font-display text-xl font-semibold text-foreground">
                Verifying file...
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                Comparing digital fingerprint against the registered original
              </p>
            </CardContent>
          </Card>
        )}

        {/* Results */}
        {result && (
          <div className="space-y-6 animate-fade-in-up">
            {/* Authentic */}
            {result.status === 'authentic' && (
              <Card className="border-success/30 shadow-heritage-lg overflow-hidden">
                <div className="bg-success/5 px-6 py-8 text-center">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-success/15 ring-2 ring-success/30">
                    <CheckCircle2 className="h-8 w-8 text-success" />
                  </div>
                  <h2 className="mt-4 font-display text-3xl font-bold text-success">
                    AUTHENTIC ORIGINAL
                  </h2>
                  <p className="mt-2 text-foreground">
                    This file matches the registered original.
                  </p>
                </div>
                <CardContent className="p-6 space-y-4">
                  <DnaComparison
                    uploaded={result.uploadedDna}
                    registered={result.registeredDna}
                    match={true}
                  />
                  <div className="flex items-center justify-between rounded-lg bg-secondary/50 px-4 py-3">
                    <span className="text-sm text-muted-foreground">Match</span>
                    <span className="font-display text-2xl font-bold text-success">
                      {result.matchPercentage}%
                    </span>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Different */}
            {result.status === 'different' && (
              <Card className="border-destructive/30 shadow-heritage-lg overflow-hidden">
                <div className="bg-destructive/5 px-6 py-8 text-center">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-destructive/15 ring-2 ring-destructive/30">
                    <AlertCircle className="h-8 w-8 text-destructive" />
                  </div>
                  <h2 className="mt-4 font-display text-3xl font-bold text-destructive">
                    DIFFERENT VERSION
                  </h2>
                  <p className="mt-2 text-foreground">
                    This file does not match the registered original.
                  </p>
                </div>
                <CardContent className="p-6 space-y-4">
                  <DnaComparison
                    uploaded={result.uploadedDna}
                    registered={result.registeredDna}
                    match={false}
                  />
                  <div className="flex items-center justify-between rounded-lg bg-secondary/50 px-4 py-3">
                    <span className="text-sm text-muted-foreground">Match</span>
                    <span className="font-display text-2xl font-bold text-destructive">
                      {result.matchPercentage}%
                    </span>
                  </div>

                  {/* Register as Derived */}
                  {showDerivedOption && !derivedRegistered && (
                    <div className="rounded-xl border border-heritage-sepia/40 bg-heritage-sepia/10 p-5">
                      <p className="text-sm font-medium text-foreground">
                        This file may be a transformed or derived version of the original.
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        Register it as a derived version to preserve the provenance chain.
                      </p>
                      <Button
                        className="mt-3 w-full gap-2"
                        onClick={() => setDerivedRegistered(true)}
                      >
                        <ArrowRight className="h-4 w-4" />
                        Register as Derived Version
                      </Button>
                    </div>
                  )}

                  {derivedRegistered && (
                    <div className="flex items-center gap-2 rounded-lg bg-success/10 px-4 py-3 ring-1 ring-success/20">
                      <CheckCircle2 className="h-5 w-5 text-success" />
                      <span className="text-sm font-medium text-success">
                        Registered as derived version. Provenance chain updated.
                      </span>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Actions */}
            <div className="flex gap-3">
              <Button variant="outline" className="gap-2" onClick={handleReset}>
                <RotateCcw className="h-4 w-4" />
                Verify Another File
              </Button>
              <Link href="/provenance" className="flex-1">
                <Button className="w-full gap-2">
                  <ShieldCheck className="h-4 w-4" />
                  View Provenance Timeline
                </Button>
              </Link>
            </div>
          </div>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}

function DnaComparison({
  uploaded,
  registered,
  match,
}: {
  uploaded: string;
  registered: string;
  match: boolean;
}) {
  return (
    <div className="space-y-3">
      <div className="rounded-lg border border-border bg-secondary/30 px-4 py-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Uploaded File DNA
        </p>
        <p className="mt-1 font-mono text-sm text-foreground break-all">{uploaded}</p>
      </div>
      <div className="rounded-lg border border-border bg-secondary/30 px-4 py-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Registered Original DNA
        </p>
        <p className="mt-1 font-mono text-sm text-foreground break-all">{registered}</p>
      </div>
      <div
        className={cn(
          'flex items-center gap-2 rounded-lg px-4 py-3 text-sm font-medium',
          match
            ? 'bg-success/10 text-success ring-1 ring-success/20'
            : 'bg-destructive/10 text-destructive ring-1 ring-destructive/20'
        )}
      >
        {match ? (
          <>
            <CheckCircle2 className="h-4 w-4" />
            Fingerprints match — file is authentic
          </>
        ) : (
          <>
            <AlertCircle className="h-4 w-4" />
            Fingerprints differ — file is a different version
          </>
        )}
      </div>
    </div>
  );
}
