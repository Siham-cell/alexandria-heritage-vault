import Link from 'next/link';
import { Archive, ShieldCheck } from 'lucide-react';

export function SiteFooter() {
  return (
    <footer className="mt-20 border-t border-border/60 bg-secondary/30">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 ring-1 ring-primary/20">
              <Archive className="h-4.5 w-4.5 text-primary" />
            </div>
            <div className="flex flex-col leading-none">
              <span className="font-display text-lg font-semibold text-foreground">
                Alexandria
              </span>
              <span className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                Heritage Vault
              </span>
            </div>
          </div>

          <p className="text-center text-sm text-muted-foreground sm:text-right">
            AI can interpret heritage. AI must never silently rewrite the original.
          </p>
        </div>

        <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t border-border/40 pt-6 sm:flex-row">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Alexandria. A private-first digital family heritage vault.
          </p>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <ShieldCheck className="h-4 w-4 text-primary" />
            <span>Post-quantum signatures · Verifiable provenance</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
