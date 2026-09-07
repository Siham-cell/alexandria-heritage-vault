/**
 * Identity service for heritage contributors.
 *
 * MOCK IMPLEMENTATION — Replace with a real identity verification
 * system. Options for production:
 *   - Supabase Auth for account-based identity
 *   - Verifiable credentials / DID for decentralized identity
 *   - Government ID verification via a third-party provider
 *
 * This mock simulates identity verification status so the UI can
 * display "Verified Identity" badges on certificates.
 */

export interface IdentityResult {
  status: 'Verified Identity' | 'Pending';
  contributorName: string;
  relationship: string;
  verifiedAt?: string;
}

/**
 * Verifies a contributor's identity.
 * In production: integrate with an identity provider.
 */
export async function verifyIdentity(
  contributorName: string,
  relationship: string
): Promise<IdentityResult> {
  await simulateAsyncDelay(500);

  return {
    status: 'Verified Identity',
    contributorName,
    relationship,
    verifiedAt: new Date().toISOString(),
  };
}

/**
 * Returns the default verified contributor for the demo.
 */
export function getDefaultContributor(): IdentityResult {
  return {
    status: 'Verified Identity',
    contributorName: 'Sara Abdi',
    relationship: 'Granddaughter',
    verifiedAt: new Date().toISOString(),
  };
}

function simulateAsyncDelay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
