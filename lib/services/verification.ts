/**
 * Verification service for comparing an uploaded file against
 * a registered heritage original.
 *
 * Uses real SHA-256 hashing: the uploaded file's bytes are hashed
 * and compared against the registered digital fingerprint. If the
 * digests match, the file is authentic; otherwise it is a different
 * version and can be registered as derived.
 */

import type { VerificationResult } from '../types';
import { createDigitalFingerprint, compareFingerprints } from './hashing';

export async function verifyFile(
  file: File,
  registeredDna: string
): Promise<VerificationResult> {
  const result = await createDigitalFingerprint(file);
  const uploadedDna = result.digest;
  const { isMatch, matchPercentage } = compareFingerprints(uploadedDna, registeredDna);

  if (isMatch) {
    return {
      status: 'authentic',
      message: 'This file matches the registered original.',
      uploadedDna,
      registeredDna,
      matchPercentage,
    };
  }

  return {
    status: 'different',
    message: 'This file does not match the registered original.',
    uploadedDna,
    registeredDna,
    matchPercentage,
  };
}
