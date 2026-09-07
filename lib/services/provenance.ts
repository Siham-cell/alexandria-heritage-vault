/**
 * Provenance service for registering and tracking heritage provenance.
 *
 * MOCK IMPLEMENTATION — Replace with a real provenance registry.
 * Options for production:
 *   - Supabase table storing provenance records linked to heritage items
 *   - On-chain provenance registry (future phase — NOT in this MVP)
 *   - Decentralized storage (IPFS/Arweave) for the original files
 *
 * This mock simulates provenance registration so the UI can display
 * the full provenance timeline and verification pipeline.
 */

import type { ProvenanceRecord } from '../types';

export interface ProvenanceRegistrationResult {
  registered: boolean;
  registrationId: string;
  registeredAt: string;
  record: ProvenanceRecord;
}

/**
 * Registers provenance for a new heritage item.
 * In production: write to a provenance table or on-chain registry.
 */
export async function registerProvenance(params: {
  heritageTitle: string;
  year: number;
  fingerprint: string;
  description: string;
}): Promise<ProvenanceRegistrationResult> {
  await simulateAsyncDelay(700);

  const record: ProvenanceRecord = {
    id: `prov-${Date.now().toString(36)}`,
    year: params.year,
    title: `Original ${params.heritageTitle}`,
    kind: 'ORIGINAL',
    hasDigitalDna: true,
    hasPqc: true,
    hasProvenance: true,
    description: params.description,
  };

  return {
    registered: true,
    registrationId: `prov-${Date.now().toString(36)}`,
    registeredAt: new Date().toISOString(),
    record,
  };
}

/**
 * Registers a derived version of an existing heritage item.
 * In production: create a new provenance record linked to the original.
 */
export async function registerDerivedVersion(params: {
  originalId: string;
  title: string;
  transformType: string;
  fingerprint: string;
  description: string;
}): Promise<ProvenanceRegistrationResult> {
  await simulateAsyncDelay(600);

  const record: ProvenanceRecord = {
    id: `prov-${Date.now().toString(36)}`,
    year: new Date().getFullYear(),
    title: params.title,
    kind: 'DERIVED',
    hasDigitalDna: true,
    hasPqc: false,
    hasProvenance: true,
    description: params.description,
    derivedFromId: params.originalId,
    transformType: params.transformType,
  };

  return {
    registered: true,
    registrationId: `prov-${Date.now().toString(36)}`,
    registeredAt: new Date().toISOString(),
    record,
  };
}

function simulateAsyncDelay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
