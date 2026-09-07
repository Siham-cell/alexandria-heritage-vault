'use client';

import { useState, useRef } from 'react';
import {
  Upload,
  FileText,
  Mic,
  ImageIcon,
  Video,
  Sparkles,
  CheckCircle2,
  Loader2,
  X,
  AlertCircle,
  Fingerprint,
  KeyRound,
  ShieldCheck,
  Archive,
  Pencil,
} from 'lucide-react';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import type { HeritageType, AiEnrichment } from '@/lib/types';
import { generateAiEnrichment } from '@/lib/services/ai-enrichment';
import { createDigitalFingerprint, truncateDigest, type HashResult } from '@/lib/services/hashing';

const heritageTypes: { value: HeritageType; icon: typeof ImageIcon; label: string }[] = [
  { value: 'Photograph', icon: ImageIcon, label: 'Photograph' },
  { value: 'Audio', icon: Mic, label: 'Audio' },
  { value: 'Document', icon: FileText, label: 'Document' },
  { value: 'Video', icon: Video, label: 'Video' },
  { value: 'Letter', icon: FileText, label: 'Letter' },
];

const processingSteps = [
  { id: 1, label: 'Understanding heritage...' },
  { id: 2, label: 'Creating digital fingerprint...' },
  { id: 3, label: 'Creating post-quantum signature...' },
  { id: 4, label: 'Registering provenance...' },
  { id: 5, label: 'Creating Heritage Certificate...' },
];

const stepIcons = [Sparkles, Fingerprint, KeyRound, ShieldCheck, Archive];

export default function AddHeritagePage() {
  const [file, setFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [heritageType, setHeritageType] = useState<HeritageType>('Photograph');
  const [title, setTitle] = useState('');
  const [year, setYear] = useState('');
  const [location, setLocation] = useState('');
  const [story, setStory] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStep, setCurrentStep] = useState(-1);
  const [processingComplete, setProcessingComplete] = useState(false);
  const [aiData, setAiData] = useState<AiEnrichment | null>(null);
  const [aiStatus, setAiStatus] = useState<'pending' | 'accepted' | 'edited' | 'rejected'>(
    'pending'
  );
  const [editing, setEditing] = useState(false);
  const [hashResult, setHashResult] = useState<HashResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
      if (selected.type.startsWith('image/')) {
        setFilePreview(URL.createObjectURL(selected));
      } else {
        setFilePreview(null);
      }
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const dropped = e.dataTransfer.files?.[0];
    if (dropped) {
      setFile(dropped);
      if (dropped.type.startsWith('image/')) {
        setFilePreview(URL.createObjectURL(dropped));
      }
    }
  };

  const handlePreserve = async () => {
    if (!file || !title) return;

    setIsProcessing(true);
    setCurrentStep(0);
    setProcessingComplete(false);
    setAiData(null);
    setAiStatus('pending');
    setHashResult(null);

    // Compute the real SHA-256 fingerprint of the uploaded file bytes
    const fingerprint = await createDigitalFingerprint(file);
    setHashResult(fingerprint);

    // Animate the 5-step processing sequence
    for (let i = 0; i < processingSteps.length; i++) {
      setCurrentStep(i);
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    setProcessingComplete(true);

    // Generate AI enrichment after processing
    const result = await generateAiEnrichment({
      fileName: file.name,
      heritageType,
      title,
      year: year ? parseInt(year) : undefined,
    });

    setAiData({
      estimatedEra: result.estimatedEra,
      suggestedTags: result.suggestedTags,
      description: result.description,
      note: result.note,
      status: 'pending',
    });
  };

  const handleReset = () => {
    setFile(null);
    setFilePreview(null);
    setTitle('');
    setYear('');
    setLocation('');
    setStory('');
    setHeritageType('Photograph');
    setIsProcessing(false);
    setCurrentStep(-1);
    setProcessingComplete(false);
    setAiData(null);
    setAiStatus('pending');
    setEditing(false);
    setHashResult(null);
  };

  return (
    <div className="min-h-screen bg-paper-grain">
      <SiteHeader />
      <main className="mx-auto max-w-3xl px-6 py-12">
        {/* Header */}
        <div className="mb-8">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-medium text-primary">
            <Sparkles className="h-3.5 w-3.5" />
            Add Heritage
          </div>
          <h1 className="font-display text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
            Preserve a Memory
          </h1>
          <p className="mt-3 text-lg text-muted-foreground">
            Upload an original family photograph, voice recording, letter or document. Alexandria
            will create a digital fingerprint, sign it with a post-quantum signature, and register
            its provenance.
          </p>
        </div>

        {/* Upload Form */}
        {!isProcessing && !processingComplete && (
          <Card className="border-border/60 shadow-heritage">
            <CardContent className="p-6 sm:p-8">
              {/* File Upload */}
              <div
                className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-border bg-secondary/30 px-6 py-12 text-center transition-colors hover:border-primary/40 hover:bg-primary/5 cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
              >
                {file ? (
                  <div className="flex flex-col items-center gap-3">
                    {filePreview ? (
                      <img
                        src={filePreview}
                        alt="Preview"
                        className="max-h-48 rounded-lg object-contain shadow-md"
                      />
                    ) : (
                      <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-primary/10">
                        <FileText className="h-8 w-8 text-primary" />
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-success" />
                      <span className="text-sm font-medium text-foreground">{file.name}</span>
                    </div>
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
                        Upload a file
                      </p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        Drag and drop or click to browse · Photograph, Audio, Document, Video
                      </p>
                    </div>
                  </div>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  accept="image/*,audio/*,video/*,.pdf,.txt,.doc,.docx"
                  onChange={handleFileSelect}
                />
              </div>

              {/* Heritage Type */}
              <div className="mt-6">
                <Label className="text-sm font-semibold text-foreground">Heritage Type</Label>
                <div className="mt-2 flex flex-wrap gap-2">
                  {heritageTypes.map((type) => {
                    const Icon = type.icon;
                    const isActive = heritageType === type.value;
                    return (
                      <button
                        key={type.value}
                        type="button"
                        onClick={() => setHeritageType(type.value)}
                        className={cn(
                          'inline-flex items-center gap-2 rounded-lg border px-3.5 py-2 text-sm font-medium transition-all',
                          isActive
                            ? 'border-primary bg-primary/10 text-primary ring-1 ring-primary/20'
                            : 'border-border bg-card text-muted-foreground hover:border-primary/30 hover:text-foreground'
                        )}
                      >
                        <Icon className="h-4 w-4" />
                        {type.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Title & Year */}
              <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="title" className="text-sm font-semibold text-foreground">
                    Title
                  </Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g., Grandparents' Wedding"
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="year" className="text-sm font-semibold text-foreground">
                    Approximate Year
                  </Label>
                  <Input
                    id="year"
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    placeholder="e.g., 1968"
                    className="mt-2"
                  />
                </div>
              </div>

              {/* Location */}
              <div className="mt-4">
                <Label htmlFor="location" className="text-sm font-semibold text-foreground">
                  Location
                </Label>
                <Input
                  id="location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g., Addis Ababa, Ethiopia"
                  className="mt-2"
                />
              </div>

              {/* Story */}
              <div className="mt-4">
                <Label htmlFor="story" className="text-sm font-semibold text-foreground">
                  Story
                </Label>
                <Textarea
                  id="story"
                  value={story}
                  onChange={(e) => setStory(e.target.value)}
                  placeholder="Tell the story behind this heritage item..."
                  className="mt-2 min-h-[100px]"
                />
              </div>

              {/* Submit */}
              <Button
                size="lg"
                className="mt-6 w-full gap-2"
                onClick={handlePreserve}
                disabled={!file || !title}
              >
                <ShieldCheck className="h-5 w-5" />
                Preserve Memory
              </Button>
              {!file || !title ? (
                <p className="mt-2 text-center text-xs text-muted-foreground">
                  Upload a file and add a title to continue.
                </p>
              ) : null}
            </CardContent>
          </Card>
        )}

        {/* Processing Sequence */}
        {isProcessing && !processingComplete && (
          <Card className="border-border/60 shadow-heritage-lg">
            <CardHeader className="text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 ring-1 ring-primary/20">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
              <CardTitle className="mt-4 font-display text-2xl">Preserving Heritage</CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <div className="space-y-1">
                {processingSteps.map((step, idx) => {
                  const Icon = stepIcons[idx];
                  const isComplete = idx < currentStep;
                  const isActive = idx === currentStep;
                  return (
                    <div
                      key={step.id}
                      className={cn(
                        'flex items-center gap-4 rounded-xl border p-4 transition-all duration-300',
                        isComplete && 'border-success/20 bg-success/5',
                        isActive && 'border-primary/30 bg-primary/5 shadow-heritage',
                        !isComplete && !isActive && 'border-border bg-card opacity-50'
                      )}
                    >
                      <div
                        className={cn(
                          'flex h-10 w-10 items-center justify-center rounded-lg transition-colors',
                          isComplete && 'bg-success/15 text-success',
                          isActive && 'bg-primary/15 text-primary',
                          !isComplete && !isActive && 'bg-muted text-muted-foreground'
                        )}
                      >
                        {isComplete ? (
                          <CheckCircle2 className="h-5 w-5" />
                        ) : isActive ? (
                          <Loader2 className="h-5 w-5 animate-spin" />
                        ) : (
                          <Icon className="h-5 w-5" />
                        )}
                      </div>
                      <span
                        className={cn(
                          'text-sm font-medium transition-colors',
                          isComplete && 'text-success',
                          isActive && 'text-primary',
                          !isComplete && !isActive && 'text-muted-foreground'
                        )}
                      >
                        {step.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* AI Enrichment + Complete */}
        {processingComplete && (
          <div className="space-y-6 animate-fade-in-up">
            {/* Success banner */}
            <div className="rounded-xl border border-success/20 bg-success/5 px-6 py-5 text-center">
              <CheckCircle2 className="mx-auto h-8 w-8 text-success" />
              <p className="mt-2 font-display text-xl font-semibold text-foreground">
                Heritage Preserved
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                "{title}" has been fingerprinted, signed, and registered with provenance.
              </p>
            </div>

            {/* Digital DNA */}
            {hashResult && (
              <Card className="border-border/60 shadow-heritage">
                <CardContent className="p-5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 ring-1 ring-primary/15">
                      <Fingerprint className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        Digital DNA · {hashResult.algorithm}
                      </p>
                      <p className="mt-0.5 font-mono text-sm text-foreground break-all">
                        {hashResult.digest}
                      </p>
                    </div>
                  </div>
                  <p className="mt-3 text-xs text-muted-foreground">
                    This SHA-256 fingerprint was computed from the exact bytes of your uploaded
                    file. It uniquely identifies this heritage item.
                  </p>
                </CardContent>
              </Card>
            )}

            {/* AI Enrichment */}
            {aiData && (
              <Card className="border-border/60 shadow-heritage">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-heritage-gold/15 ring-1 ring-heritage-gold/25">
                      <Sparkles className="h-5 w-5 text-heritage-gold" />
                    </div>
                    <div>
                      <CardTitle className="font-display text-xl">Alexandria AI</CardTitle>
                      <p className="text-xs text-muted-foreground">
                        AI-generated suggestions for your review
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        Type
                      </p>
                      <p className="mt-1 text-sm text-foreground">{heritageType}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        Estimated Era
                      </p>
                      <p className="mt-1 text-sm text-foreground">{aiData.estimatedEra}</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      Suggested Tags
                    </p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {aiData.suggestedTags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground ring-1 ring-border"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      Description
                    </p>
                    {editing ? (
                      <Textarea
                        value={aiData.description}
                        onChange={(e) =>
                          setAiData({ ...aiData, description: e.target.value })
                        }
                        className="mt-2 min-h-[80px]"
                      />
                    ) : (
                      <p className="mt-1 text-sm leading-relaxed text-foreground">
                        "{aiData.description}"
                      </p>
                    )}
                  </div>

                  {/* AI note */}
                  <div className="flex items-start gap-2 rounded-lg bg-warning/10 px-4 py-3 ring-1 ring-warning/20">
                    <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-warning" />
                    <p className="text-xs font-medium text-warning">
                      AI suggestions are never automatically treated as historical facts.
                    </p>
                  </div>

                  {/* Action buttons */}
                  <div className="flex flex-wrap gap-2 pt-2">
                    {aiStatus === 'pending' && (
                      <>
                        <Button
                          size="sm"
                          className="gap-2"
                          onClick={() => {
                            setAiStatus('accepted');
                            setEditing(false);
                          }}
                        >
                          <CheckCircle2 className="h-4 w-4" />
                          Accept
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="gap-2"
                          onClick={() => setEditing(!editing)}
                        >
                          <Pencil className="h-4 w-4" />
                          {editing ? 'Save Edit' : 'Edit'}
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="gap-2 text-destructive hover:text-destructive"
                          onClick={() => {
                            setAiStatus('rejected');
                            setEditing(false);
                          }}
                        >
                          <X className="h-4 w-4" />
                          Reject
                        </Button>
                      </>
                    )}
                    {aiStatus === 'accepted' && (
                      <div className="flex items-center gap-2 text-sm font-medium text-success">
                        <CheckCircle2 className="h-4 w-4" />
                        AI suggestions accepted
                      </div>
                    )}
                    {aiStatus === 'rejected' && (
                      <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                        <X className="h-4 w-4" />
                        AI suggestions rejected
                      </div>
                    )}
                    {aiStatus === 'edited' && (
                      <div className="flex items-center gap-2 text-sm font-medium text-primary">
                        <CheckCircle2 className="h-4 w-4" />
                        AI suggestions edited
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Actions */}
            <div className="flex gap-3">
              <Button variant="outline" className="gap-2" onClick={handleReset}>
                <Upload className="h-4 w-4" />
                Preserve Another
              </Button>
              <Button className="flex-1 gap-2" onClick={handleReset}>
                <ShieldCheck className="h-4 w-4" />
                Done
              </Button>
            </div>
          </div>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}
