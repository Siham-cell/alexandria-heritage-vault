/**
 * Heritage domain types for Alexandria.
 *
 * These types model the core concepts of the family heritage vault:
 * heritage items, provenance records, verification results, and AI enrichment.
 */

export type HeritageType = 'Photograph' | 'Audio' | 'Document' | 'Video' | 'Letter';

export type VerificationStatus =
  | 'Original Preserved'
  | 'Verified'
  | 'Pending Verification'
  | 'Derived Version'
  | 'Unverified';

export type ProvenanceKind = 'ORIGINAL' | 'DERIVED';

export interface HeritageItem {
  id: string;
  title: string;
  year: number;
  type: HeritageType;
  location: string;
  story: string;
  imageUrl: string;
  verificationStatus: VerificationStatus;
  digitalDna: string;
  pqcSignature: PqcSignature;
  contributor: Contributor;
  provenance: ProvenanceRecord[];
  aiEnrichment?: AiEnrichment;
  isOriginal: boolean;
}

export interface PqcSignature {
  status: 'Verified' | 'Pending';
  algorithm: string;
  signaturePreview: string;
  /** Base64-encoded ML-DSA-44 signature — empty string if not yet signed */
  signatureBase64?: string;
  /** Base64-encoded ML-DSA-44 public key for verification */
  publicKeyBase64?: string;
  /** The provenance data that was signed */
  signedData?: {
    heritageId: string;
    fileHash: string;
    timestamp: string;
    guardian: string;
    parentVersion?: string;
  };
}

export interface Contributor {
  name: string;
  identityStatus: 'Verified Identity' | 'Pending';
  relationship: string;
}

export interface ProvenanceRecord {
  id: string;
  year: number;
  title: string;
  kind: ProvenanceKind;
  hasDigitalDna: boolean;
  hasPqc: boolean;
  hasProvenance: boolean;
  description: string;
  derivedFromId?: string;
  transformType?: string;
}

export interface AiEnrichment {
  estimatedEra: string;
  suggestedTags: string[];
  description: string;
  status: 'pending' | 'accepted' | 'edited' | 'rejected';
  note: string;
}

export interface VerificationResult {
  status: 'authentic' | 'different' | 'pending';
  message: string;
  uploadedDna: string;
  registeredDna: string;
  matchPercentage: number;
}

export interface ProcessingStep {
  id: number;
  label: string;
  status: 'pending' | 'active' | 'complete';
}

export interface TimelineEntry {
  year: number;
  title: string;
  type: string;
}
