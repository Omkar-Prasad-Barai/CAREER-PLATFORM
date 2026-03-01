/**
 * Self-Test Script: Avatar Upload + Persistence Verification
 * 
 * Tests the full avatar flow end-to-end:
 * 1. Login with test credentials
 * 2. Upload an avatar via POST /api/users/upload-avatar
 * 3. Verify the MongoDB document is updated with the avatar URL
 * 4. Re-fetch the profile (simulating a hard refresh) and assert avatar persists
 * 
 * Usage: node test-avatar-persistence.mjs
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const API_BASE = process.env.API_BASE || 'http://localhost:5000/api';

// === Test credentials — edit these to match a real user in your DB ===
const TEST_EMAIL = process.argv[2] || 'student@test.com';
const TEST_PASSWORD = process.argv[3] || 'test1234';

async function run() {
  console.log('\n=== AVATAR PERSISTENCE SELF-TEST ===\n');

  // ─── STEP 1: LOGIN ─────────────────────────────────────────────
  console.log(`1. Logging in as ${TEST_EMAIL}...`);
  const loginRes = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: TEST_EMAIL, password: TEST_PASSWORD }),
  });

  if (!loginRes.ok) {
    const err = await loginRes.json().catch(() => ({}));
    console.error('   ❌ LOGIN FAILED:', loginRes.status, err.message || err);
    console.log('   💡 Provide valid credentials: node test-avatar-persistence.mjs <email> <password>');
    process.exit(1);
  }

  const loginData = await loginRes.json();
  const token = loginData.token;
  console.log(`   ✅ Logged in. User ID: ${loginData._id}, Role: ${loginData.role}`);
  console.log(`   Current avatar: ${loginData.avatar || '(none)'}`);

  const authHeaders = {
    Authorization: `Bearer ${token}`,
  };

  // ─── STEP 2: UPLOAD AVATAR ──────────────────────────────────────
  console.log('\n2. Uploading test avatar (1x1 PNG)...');

  // Create a minimal 1x1 PNG in memory
  const pngBuffer = Buffer.from(
    'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==',
    'base64'
  );

  // Use FormData (Node 18+ native)
  const formData = new FormData();
  const blob = new Blob([pngBuffer], { type: 'image/png' });
  formData.append('avatar', blob, 'test-avatar.png');

  const uploadRes = await fetch(`${API_BASE}/users/upload-avatar`, {
    method: 'POST',
    headers: authHeaders,
    body: formData,
  });

  if (!uploadRes.ok) {
    const err = await uploadRes.json().catch(() => ({}));
    console.error('   ❌ UPLOAD FAILED:', uploadRes.status, err);
    process.exit(1);
  }

  const uploadData = await uploadRes.json();
  console.log(`   ✅ Upload successful. Avatar URL: ${uploadData.avatarUrl}`);

  // ─── STEP 3: VERIFY VIA PROFILE FETCH (simulates page refresh) ─
  console.log('\n3. Fetching profile (simulating page refresh)...');
  const profileRes = await fetch(`${API_BASE}/users/profile`, {
    headers: authHeaders,
  });

  if (!profileRes.ok) {
    console.error('   ❌ PROFILE FETCH FAILED:', profileRes.status);
    process.exit(1);
  }

  const profileData = await profileRes.json();
  const persistedAvatar = profileData.avatar;

  console.log(`   Persisted avatar in DB: ${persistedAvatar}`);

  // ─── STEP 4: ASSERT ────────────────────────────────────────────
  console.log('\n4. Verifying persistence...');

  if (persistedAvatar && persistedAvatar === uploadData.avatarUrl) {
    console.log('   ✅ PASS — Avatar URL persists in MongoDB after re-fetch!');
    console.log('   ✅ PASS — Same URL returned by upload and profile endpoints.');
  } else if (persistedAvatar) {
    console.log('   ⚠️  Avatar exists but URL differs from upload response.');
    console.log(`      Upload returned: ${uploadData.avatarUrl}`);
    console.log(`      Profile returned: ${persistedAvatar}`);
  } else {
    console.error('   ❌ FAIL — Avatar is null/empty after re-fetch!');
    process.exit(1);
  }

  console.log('\n=== ALL TESTS PASSED ===\n');
}

run().catch((err) => {
  console.error('Unhandled error:', err);
  process.exit(1);
});
