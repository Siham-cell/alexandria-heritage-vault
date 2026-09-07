// Test: PQC (ML-DSA-44) signature service
// Run with: npx tsx tests/pqc.test.ts

import {
  generatePQCKeyPair,
  signProvenance,
  verifyProvenance,
  createPublicKeyRef,
  canonicalizeProvenanceData,
  type ProvenanceData,
} from '../lib/services/pqc';

async function runTests() {
  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, message: string) {
    if (condition) {
      console.log(`  ✓ ${message}`);
      passed++;
    } else {
      console.error(`  ✗ ${message}`);
      failed++;
    }
  }

  console.log('\nML-DSA-44 (FIPS-204) PQC Signature Tests\n');

  // Setup: generate a real keypair
  const keyPair = generatePQCKeyPair();
  const publicKeyRef = createPublicKeyRef(keyPair);

  const baseData: ProvenanceData = {
    heritageId: 'heritage-001',
    fileHash: '14b7e1c5d9b6299cca983160ab92a12651c9659ac502652d6ac1b3b02b6f5609',
    timestamp: '2026-01-15T10:00:00.000Z',
    guardian: 'Sara Abdi',
  };

  // Test 1: Correct signature verifies
  console.log('Test 1: Correct signature verifies');
  const signature = signProvenance(baseData, keyPair.secretKey);
  const isValid = verifyProvenance(
    baseData,
    signature.signatureBase64,
    publicKeyRef.publicKeyBase64
  );
  assert(isValid === true, 'Signature over correct provenance data verifies successfully');
  assert(signature.algorithm === 'ML-DSA-44 (FIPS-204)', 'Algorithm is ML-DSA-44 (FIPS-204)');
  assert(signature.signatureBase64.length > 0, 'Signature is non-empty');
  assert(signature.signaturePreview.length > 0, 'Signature preview is non-empty');

  // Test 2: Modified data fails verification
  console.log('\nTest 2: Modified data fails verification');
  const modifiedData: ProvenanceData = {
    ...baseData,
    fileHash: '0000000000000000000000000000000000000000000000000000000000000000',
  };
  const isModifiedValid = verifyProvenance(
    modifiedData,
    signature.signatureBase64,
    publicKeyRef.publicKeyBase64
  );
  assert(isModifiedValid === false, 'Signature over modified file hash fails verification');

  // Test 2b: Modified guardian fails
  const modifiedGuardian: ProvenanceData = {
    ...baseData,
    guardian: 'Someone Else',
  };
  const isGuardianValid = verifyProvenance(
    modifiedGuardian,
    signature.signatureBase64,
    publicKeyRef.publicKeyBase64
  );
  assert(isGuardianValid === false, 'Signature over modified guardian fails verification');

  // Test 2c: Modified timestamp fails
  const modifiedTimestamp: ProvenanceData = {
    ...baseData,
    timestamp: '2027-01-01T00:00:00.000Z',
  };
  const isTimestampValid = verifyProvenance(
    modifiedTimestamp,
    signature.signatureBase64,
    publicKeyRef.publicKeyBase64
  );
  assert(isTimestampValid === false, 'Signature over modified timestamp fails verification');

  // Test 2d: Modified heritage ID fails
  const modifiedId: ProvenanceData = {
    ...baseData,
    heritageId: 'heritage-999',
  };
  const isIdValid = verifyProvenance(
    modifiedId,
    signature.signatureBase64,
    publicKeyRef.publicKeyBase64
  );
  assert(isIdValid === false, 'Signature over modified heritage ID fails verification');

  // Test 3: Wrong public key fails verification
  console.log('\nTest 3: Wrong public key fails verification');
  const otherKeyPair = generatePQCKeyPair();
  const otherPublicKeyRef = createPublicKeyRef(otherKeyPair);
  const isWrongKeyValid = verifyProvenance(
    baseData,
    signature.signatureBase64,
    otherPublicKeyRef.publicKeyBase64
  );
  assert(isWrongKeyValid === false, 'Signature verified with wrong public key fails');

  // Test 4: Signature cannot be reused for modified provenance data
  console.log('\nTest 4: Signature cannot be reused for modified provenance data');
  // Sign data A, then try to verify the same signature against data B
  const dataA: ProvenanceData = {
    heritageId: 'heritage-001',
    fileHash: 'aaa',
    timestamp: '2026-01-15T10:00:00.000Z',
    guardian: 'Sara Abdi',
    parentVersion: 'prov-001',
  };
  const dataB: ProvenanceData = {
    heritageId: 'heritage-002',
    fileHash: 'bbb',
    timestamp: '2026-01-15T10:00:00.000Z',
    guardian: 'Sara Abdi',
    parentVersion: 'prov-001',
  };
  const sigA = signProvenance(dataA, keyPair.secretKey);
  const verifiesAgainstB = verifyProvenance(
    dataB,
    sigA.signatureBase64,
    publicKeyRef.publicKeyBase64
  );
  assert(verifiesAgainstB === false, 'Signature from data A does not verify against data B');

  // Test 4b: But it does verify against the original data A
  const verifiesAgainstA = verifyProvenance(
    dataA,
    sigA.signatureBase64,
    publicKeyRef.publicKeyBase64
  );
  assert(verifiesAgainstA === true, 'Signature from data A still verifies against data A');

  // Test 5: Parent version is included in signed data
  console.log('\nTest 5: Parent version is included in signed data');
  const dataWithParent: ProvenanceData = {
    ...baseData,
    parentVersion: 'prov-001',
  };
  const sigWithParent = signProvenance(dataWithParent, keyPair.secretKey);
  const verifiesWithParent = verifyProvenance(
    dataWithParent,
    sigWithParent.signatureBase64,
    publicKeyRef.publicKeyBase64
  );
  assert(verifiesWithParent === true, 'Signature with parent version verifies');

  // Removing parent version should fail
  const dataWithoutParent: ProvenanceData = {
    heritageId: baseData.heritageId,
    fileHash: baseData.fileHash,
    timestamp: baseData.timestamp,
    guardian: baseData.guardian,
  };
  const verifiesWithoutParent = verifyProvenance(
    dataWithoutParent,
    sigWithParent.signatureBase64,
    publicKeyRef.publicKeyBase64
  );
  assert(
    verifiesWithoutParent === false,
    'Signature with parent version does not verify when parent version is removed'
  );

  // Test 6: Canonicalization is deterministic
  console.log('\nTest 6: Canonicalization is deterministic');
  const canon1 = canonicalizeProvenanceData(baseData);
  const canon2 = canonicalizeProvenanceData(baseData);
  assert(
    Array.from(canon1).join(',') === Array.from(canon2).join(','),
    'Same data produces identical canonical bytes'
  );

  // Test 7: Public key ref does not contain secret key
  console.log('\nTest 7: Public key ref does not contain secret key');
  assert(
    !('secretKey' in publicKeyRef) && !('secretKey' in publicKeyRef),
    'Public key ref contains no secret key field'
  );
  assert(publicKeyRef.publicKeyBase64.length > 0, 'Public key ref has non-empty base64 key');
  assert(publicKeyRef.algorithm === 'ML-DSA-44 (FIPS-204)', 'Public key ref has correct algorithm');

  // Test 8: Different keypairs produce different public keys
  console.log('\nTest 8: Different keypairs produce different public keys');
  assert(
    publicKeyRef.publicKeyBase64 !== otherPublicKeyRef.publicKeyBase64,
    'Two different keypairs have different public keys'
  );

  // Test 9: Deterministic keygen from same seed
  console.log('\nTest 9: Deterministic keygen from same seed');
  const seed = new Uint8Array(32).map((_, i) => i + 1);
  const kp1 = generatePQCKeyPair(seed);
  const kp2 = generatePQCKeyPair(seed);
  assert(
    Array.from(kp1.publicKey).join(',') === Array.from(kp2.publicKey).join(','),
    'Same seed produces same public key'
  );

  // Test 10: Corrupted signature fails
  console.log('\nTest 10: Corrupted signature fails verification');
  const corruptedSig = signature.signatureBase64.slice(0, -4) + 'AAAA';
  const isCorruptedValid = verifyProvenance(
    baseData,
    corruptedSig,
    publicKeyRef.publicKeyBase64
  );
  assert(isCorruptedValid === false, 'Corrupted signature fails verification');

  console.log(`\n${passed} passed, ${failed} failed\n`);
  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch((err) => {
  console.error('Test runner error:', err);
  process.exit(1);
});
