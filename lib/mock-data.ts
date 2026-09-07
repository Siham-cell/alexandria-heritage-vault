/**
 * Enriches mock heritage items with real ML-DSA-44 PQC signatures.
 *
 * This module runs at load time, generates a real keypair (deterministic
 * for reproducibility), signs each heritage item's provenance data, and
 * returns the items with the signature data attached.
 *
 * The certificate page then calls verifyProvenance() to actually verify
 * each signature before displaying "PQC Signature — Verified".
 */

import type { HeritageItem } from './types';
import { signHeritageItem, getDemoPublicKeyRef } from './services/pqc-signing';
import { verifyProvenance } from './services/pqc';

const baseItems: Omit<HeritageItem, 'pqcSignature'>[] = [
  {
    id: 'heritage-001',
    title: "Grandparents' Wedding",
    year: 1968,
    type: 'Photograph',
    location: 'Addis Ababa, Ethiopia',
    story:
      'My grandparents on their wedding day, surrounded by family. This photograph has been preserved in our family album for over five decades.',
    imageUrl:
      'https://images.pexels.com/photos/4224927/pexels-photo-4224927.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    verificationStatus: 'Original Preserved',
    digitalDna: '14b7e1c5d9b6299cca983160ab92a12651c9659ac502652d6ac1b3b02b6f5609',
    contributor: {
      name: 'Sara Abdi',
      identityStatus: 'Verified Identity' as const,
      relationship: 'Granddaughter',
    },
    isOriginal: true,
    provenance: [
      {
        id: 'prov-001',
        year: 1968,
        title: 'Original Wedding Photograph',
        kind: 'ORIGINAL' as const,
        hasDigitalDna: true,
        hasPqc: true,
        hasProvenance: true,
        description:
          'The original photograph was scanned at 600 DPI and registered with a digital fingerprint and post-quantum signature.',
      },
      {
        id: 'prov-002',
        year: 2026,
        title: 'AI Restored Version',
        kind: 'DERIVED' as const,
        hasDigitalDna: true,
        hasPqc: false,
        hasProvenance: true,
        description:
          'The photograph was restored using AI to repair creases and fading. The original provenance is preserved.',
        derivedFromId: 'prov-001',
        transformType: 'AI Restoration',
      },
      {
        id: 'prov-003',
        year: 2026,
        title: 'AI Colorized Version',
        kind: 'DERIVED' as const,
        hasDigitalDna: true,
        hasPqc: false,
        hasProvenance: true,
        description:
          'The restored photograph was colorized using AI. This is a derived version — the original remains the source of truth.',
        derivedFromId: 'prov-002',
        transformType: 'AI Colorization',
      },
    ],
    aiEnrichment: {
      estimatedEra: '1960s–1970s',
      suggestedTags: ['Wedding', 'Family', 'Addis Ababa'],
      description:
        'A family wedding photograph showing a formal celebration. The clothing styles and photographic quality suggest the late 1960s. Multiple family members are visible in what appears to be an outdoor ceremony setting.',
      status: 'accepted' as const,
      note: 'AI suggestions are never automatically treated as historical facts.',
    },
  },
  {
    id: 'heritage-002',
    title: "Grandmother's Voice",
    year: 1975,
    type: 'Audio',
    location: 'Dire Dawa, Ethiopia',
    story:
      'A recording of my grandmother singing a traditional lullaby. She recorded this on a cassette tape that was digitized in 2024.',
    imageUrl:
      'https://images.pexels.com/photos/3339218/pexels-photo-3339218.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    verificationStatus: 'Original Preserved',
    digitalDna: '3f9a2c7b8e1d4f6a0c5b3e7d9f1a2c4b',
    contributor: {
      name: 'Sara Abdi',
      identityStatus: 'Verified Identity' as const,
      relationship: 'Granddaughter',
    },
    isOriginal: true,
    provenance: [
      {
        id: 'prov-004',
        year: 1975,
        title: 'Original Voice Recording',
        kind: 'ORIGINAL' as const,
        hasDigitalDna: true,
        hasPqc: true,
        hasProvenance: true,
        description:
          'The original cassette recording was digitized at 96kHz/24-bit and registered with a digital fingerprint.',
      },
    ],
    aiEnrichment: {
      estimatedEra: '1970s',
      suggestedTags: ['Lullaby', 'Voice Recording', 'Traditional Music'],
      description:
        'An audio recording of a woman singing what appears to be a traditional lullaby. The audio quality and background noise suggest an analog cassette recording from the mid-1970s.',
      status: 'accepted' as const,
      note: 'AI suggestions are never automatically treated as historical facts.',
    },
  },
  {
    id: 'heritage-003',
    title: 'Family Letter',
    year: 1982,
    type: 'Document',
    location: 'Addis Ababa, Ethiopia',
    story:
      'A letter written by my grandfather to my grandmother during a period of separation. Written in Amharic, it speaks of love, patience, and hope.',
    imageUrl:
      'https://images.pexels.com/photos/51343/old-letters-old-letter-handwriting-51343.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    verificationStatus: 'Original Preserved',
    digitalDna: '6d1a8e3f5b2c7d9f0a4e1c3b6d8f2a5e',
    contributor: {
      name: 'Sara Abdi',
      identityStatus: 'Verified Identity' as const,
      relationship: 'Granddaughter',
    },
    isOriginal: true,
    provenance: [
      {
        id: 'prov-005',
        year: 1982,
        title: 'Original Family Letter',
        kind: 'ORIGINAL' as const,
        hasDigitalDna: true,
        hasPqc: true,
        hasProvenance: true,
        description:
          'The handwritten letter was scanned at 600 DPI and registered with a digital fingerprint and post-quantum signature.',
      },
    ],
    aiEnrichment: {
      estimatedEra: '1980s',
      suggestedTags: ['Letter', 'Handwritten', 'Amharic', 'Personal'],
      description:
        'A handwritten personal letter. The cursive script and paper quality suggest the early 1980s. The content appears to be in Amharic script.',
      status: 'accepted' as const,
      note: 'AI suggestions are never automatically treated as historical facts.',
    },
  },
  {
    id: 'heritage-004',
    title: 'Family Photograph',
    year: 1992,
    type: 'Photograph',
    location: 'Harar, Ethiopia',
    story:
      'A family gathering during the holidays. Three generations together in one photograph, taken by a visiting relative.',
    imageUrl:
      'https://images.pexels.com/photos/4394514/pexels-photo-4394514.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    verificationStatus: 'Original Preserved',
    digitalDna: '2c5d8e1f3a7b4c6d9f0a2e5b8c1d4f7a',
    contributor: {
      name: 'Sara Abdi',
      identityStatus: 'Verified Identity' as const,
      relationship: 'Granddaughter',
    },
    isOriginal: true,
    provenance: [
      {
        id: 'prov-006',
        year: 1992,
        title: 'Original Family Photograph',
        kind: 'ORIGINAL' as const,
        hasDigitalDna: true,
        hasPqc: true,
        hasProvenance: true,
        description:
          'The original photograph was scanned at 600 DPI and registered with a digital fingerprint and post-quantum signature.',
      },
    ],
    aiEnrichment: {
      estimatedEra: '1990s',
      suggestedTags: ['Family', 'Gathering', 'Harar', 'Holiday'],
      description:
        'A family photograph showing multiple generations gathered together. The clothing and photographic style suggest the early 1990s.',
      status: 'accepted' as const,
      note: 'AI suggestions are never automatically treated as historical facts.',
    },
  },
];

const publicKeys: Record<string, string> = {};

const enrichedItems: HeritageItem[] = baseItems.map((item) => {
  const sigResult = signHeritageItem({
    heritageId: item.id,
    fileHash: item.digitalDna,
    guardian: item.contributor.name,
  });

  publicKeys[item.id] = getDemoPublicKeyRef().publicKeyBase64;

  return {
    ...item,
    pqcSignature: {
      status: 'Verified' as const,
      algorithm: sigResult.algorithm,
      signaturePreview: sigResult.signaturePreview,
      signatureBase64: sigResult.signatureBase64,
      publicKeyBase64: sigResult.signedData
        ? getDemoPublicKeyRef().publicKeyBase64
        : undefined,
      signedData: sigResult.signedData,
    },
  };
});

export const mockHeritageItems: HeritageItem[] = enrichedItems;

export const landingTimeline = [
  { year: 1968, title: "Grandparents' Wedding", type: 'Photograph' },
  { year: 1975, title: "Grandmother's Voice", type: 'Audio' },
  { year: 1982, title: 'Family Letter', type: 'Document' },
  { year: 1992, title: 'Family Photograph', type: 'Photograph' },
];

export function getHeritageById(id: string): HeritageItem | undefined {
  return mockHeritageItems.find((item) => item.id === id);
}

export function getPublicKeyBase64(heritageId: string): string | undefined {
  return publicKeys[heritageId];
}
