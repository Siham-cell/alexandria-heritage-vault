/**
 * PQC signature generation for mock heritage data.
 *
 * This module generates REAL ML-DSA-44 keypairs and signatures for the
 * mock heritage items at module load time. This ensures the Heritage
 * Certificate page can show "PQC Signature — Verified" only after
 * actually verifying the real signature.
 *
 * The keypair is generated from a fixed seed so the demo is reproducible.
 * In production, the seed would be a server-side secret and signing
 * would happen in an Edge Function — the private key would never reach
 * the browser.
 */

import { generatePQCKeyPair, signProvenance, createPublicKeyRef } from './pqc';
import type { PqcKeyPair, PqcPublicKeyRef, ProvenanceData, PqcSignatureResult } from './pqc';

/** Fixed 32-byte seed for the demo guardian keypair (NOT for production use) */
const DEMO_SEED = new Uint8Array(32).map((_, i) => (i * 7 + 13) % 256);

let cachedKeyPair: PqcKeyPair | null = null;
let cachedPublicKeyRef: PqcPublicKeyRef | null = null;

/**
 * Returns the demo guardian's PQC keypair.
 * The keypair is generated once and cached.
 * SECURITY: The secret key must never be sent to the frontend.
 */
export function getDemoKeyPair(): PqcKeyPair {
  if (!cachedKeyPair) {
    cachedKeyPair = generatePQCKeyPair(DEMO_SEED);
  }
  return cachedKeyPair;
}

/**
 * Returns the public key reference for the demo guardian.
 * This is safe to expose to the frontend and store in the database.
 */
export function getDemoPublicKeyRef(): PqcPublicKeyRef {
  if (!cachedPublicKeyRef) {
    cachedPublicKeyRef = createPublicKeyRef(getDemoKeyPair());
  }
  return cachedPublicKeyRef;
}

/**
 * Signs a heritage item's provenance data with the demo guardian's key.
 * Returns a PqcSignatureResult with the real ML-DSA-44 signature.
 */
export function signHeritageItem(params: {
  heritageId: string;
  fileHash: string;
  guardian: string;
  parentVersion?: string;
  timestamp?: string;
}): PqcSignatureResult {
  const data: ProvenanceData = {
    heritageId: params.heritageId,
    fileHash: params.fileHash,
    timestamp: params.timestamp ?? new Date('2026-01-15T10:00:00Z').toISOString(),
    guardian: params.guardian,
    parentVersion: params.parentVersion,
  };

  return signProvenance(data, getDemoKeyPair().secretKey);
}
