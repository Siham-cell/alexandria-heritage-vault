import './globals.css';
import type { Metadata } from 'next';
import { Inter, Cormorant_Garamond, Lora } from 'next/font/google';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });
const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-serif-display',
});
const lora = Lora({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  style: ['normal', 'italic'],
  variable: '--font-serif-body',
});

export const metadata: Metadata = {
  title: 'Alexandria — Family Heritage Vault',
  description:
    'Alexandria preserves family memories, stories and original sources with verifiable provenance for future generations.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${cormorant.variable} ${lora.variable}`}>
      <body className="font-serif-body antialiased">{children}</body>
    </html>
  );
}
