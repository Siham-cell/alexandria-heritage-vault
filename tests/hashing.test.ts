// Test: SHA-256 hashing service
// Run with: node --experimental-vm-modules node_modules/.bin/jest tests/hashing.test.ts
// Or: npx tsx tests/hashing.test.ts

import { createDigitalFingerprint, compareFingerprints, truncateDigest } from '../lib/services/hashing';

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

  console.log('\nSHA-256 Hashing Service Tests\n');

  // Test 1: Same content produces the same hash
  console.log('Test 1: Same content produces the same hash');
  const contentA = 'Alexandria Heritage Sample File\nGrandparents Wedding - 1968\nOriginal preserved photograph from the Abdi Family Archive.\n';
  const hashA1 = await createDigitalFingerprint(contentA);
  const hashA2 = await createDigitalFingerprint(contentA);
  assert(hashA1.digest === hashA2.digest, 'Identical content produces identical SHA-256 digests');
  assert(hashA1.algorithm === 'SHA-256', 'Algorithm is reported as SHA-256');
  assert(hashA1.digest.length === 64, 'SHA-256 digest is 64 hex characters');

  // Test 2: Modified content produces a different hash
  console.log('\nTest 2: Modified content produces a different hash');
  const contentB = contentA.replace('1968', '1969');
  const hashB = await createDigitalFingerprint(contentB);
  assert(hashA1.digest !== hashB.digest, 'Modified content produces a different SHA-256 digest');

  // Test 3: Known SHA-256 value is correct
  console.log('\nTest 3: Hash matches known SHA-256 value');
  assert(
    hashA1.digest === '14b7e1c5d9b6299cca983160ab92a12651c9659ac502652d6ac1b3b02b6f5609',
    `Digest matches independently computed SHA-256 value (${hashA1.digest})`
  );

  // Test 4: ArrayBuffer input produces the same hash as string input
  console.log('\nTest 4: ArrayBuffer input matches string input');
  const encoder = new TextEncoder();
  const buffer = encoder.encode(contentA);
  const hashFromBuffer = await createDigitalFingerprint(buffer);
  assert(hashA1.digest === hashFromBuffer.digest, 'ArrayBuffer input produces the same digest as string input');

  // Test 5: Uint8Array input produces the same hash
  console.log('\nTest 5: Uint8Array input matches string input');
  const uint8 = encoder.encode(contentA);
  const hashFromUint8 = await createDigitalFingerprint(uint8);
  assert(hashA1.digest === hashFromUint8.digest, 'Uint8Array input produces the same digest as string input');

  // Test 6: compareFingerprints detects a match
  console.log('\nTest 6: compareFingerprints correctly detects matches');
  const matchResult = compareFingerprints(hashA1.digest, hashA2.digest);
  assert(matchResult.isMatch === true, 'Matching digests return isMatch=true');
  assert(matchResult.matchPercentage === 100, 'Matching digests return 100% match');

  // Test 7: compareFingerprints detects a mismatch
  console.log('\nTest 7: compareFingerprints correctly detects mismatches');
  const mismatchResult = compareFingerprints(hashA1.digest, hashB.digest);
  assert(mismatchResult.isMatch === false, 'Different digests return isMatch=false');
  assert(mismatchResult.matchPercentage === 0, 'Different digests return 0% match');

  // Test 8: truncateDigest formats correctly
  console.log('\nTest 8: truncateDigest formats correctly');
  const truncated = truncateDigest(hashA1.digest);
  assert(truncated.includes('...'), 'Truncated digest contains ellipsis');
  assert(truncated.length < hashA1.digest.length, 'Truncated digest is shorter than full digest');

  // Test 9: Empty content produces a valid hash
  console.log('\nTest 9: Empty content produces a valid hash');
  const emptyHash = await createDigitalFingerprint('');
  assert(emptyHash.digest.length === 64, 'Empty content produces a 64-char SHA-256 digest');
  assert(
    emptyHash.digest === 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    'Empty content matches known SHA-256 of empty string'
  );

  // Test 10: Single byte change produces completely different hash (avalanche effect)
  console.log('\nTest 10: Avalanche effect — single byte change');
  const content1 = 'Alexandria';
  const content2 = 'alexandria'; // lowercase 'a'
  const h1 = await createDigitalFingerprint(content1);
  const h2 = await createDigitalFingerprint(content2);
  assert(h1.digest !== h2.digest, 'Single character change produces completely different hash');

  console.log(`\n${passed} passed, ${failed} failed\n`);
  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch((err) => {
  console.error('Test runner error:', err);
  process.exit(1);
});
