/**
 * CareerConnect — E2E Upload Persistence Verification Script
 * 
 * Tests that avatar and resume uploads actually persist in MongoDB
 * for ALL 7 user roles. Uses Axios to hit the real backend API.
 * 
 * Usage:  node tests/verify-uploads.test.js
 * Prereq: Backend must be running on http://localhost:5000
 */

import axios from 'axios';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import FormData from 'form-data';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const API = 'http://localhost:5000/api';

// ── Test credentials for each role ──
// IMPORTANT: Replace these with real test account credentials 
// that exist in your MongoDB database!
const TEST_ACCOUNTS = [
  { role: 'student',      email: 'student@test.com',      password: 'Test@1234' },
  { role: 'aspirant',     email: 'aspirant@test.com',     password: 'Test@1234' },
  { role: 'organization', email: 'org@test.com',          password: 'Test@1234' },
  { role: 'professor',    email: 'professor@test.com',    password: 'Test@1234' },
  { role: 'professional', email: 'professional@test.com', password: 'Test@1234' },
  { role: 'recruiter',    email: 'recruiter@test.com',    password: 'Test@1234' },
  { role: 'others',       email: 'others@test.com',       password: 'Test@1234' },
];

// ── Create a tiny test image (1x1 PNG) ──
function createTestImage() {
  const testImgPath = path.join(__dirname, 'test-avatar.png');
  if (!fs.existsSync(testImgPath)) {
    // Minimal valid PNG (1x1 red pixel)
    const pngBuffer = Buffer.from(
      '89504e470d0a1a0a0000000d4948445200000001000000010802000000907753de0000000c4944415408d76360f8cf00000001010000189dd35f0000000049454e44ae426082',
      'hex'
    );
    fs.writeFileSync(testImgPath, pngBuffer);
  }
  return testImgPath;
}

// ── Create a tiny test PDF ──
function createTestPDF() {
  const testPdfPath = path.join(__dirname, 'test-resume.pdf');
  if (!fs.existsSync(testPdfPath)) {
    const pdfContent = `%PDF-1.4
1 0 obj
<< /Type /Catalog /Pages 2 0 R >>
endobj
2 0 obj
<< /Type /Pages /Kids [3 0 R] /Count 1 >>
endobj
3 0 obj
<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] >>
endobj
xref
0 4
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
trailer
<< /Size 4 /Root 1 0 R >>
startxref
190
%%EOF`;
    fs.writeFileSync(testPdfPath, pdfContent);
  }
  return testPdfPath;
}

// ── Main test runner ──
async function runTests() {
  console.log('\n╔══════════════════════════════════════════════════════╗');
  console.log('║   CareerConnect — Upload Persistence E2E Test       ║');
  console.log('╚══════════════════════════════════════════════════════╝\n');

  const testImgPath = createTestImage();
  const testPdfPath = createTestPDF();
  const results = [];

  for (const account of TEST_ACCOUNTS) {
    const result = { role: account.role, login: '❌', avatarUpload: '❌', resumeUpload: '❌', avatarPersists: '❌', resumePersists: '❌' };

    try {
      // Step 1: Login
      const loginRes = await axios.post(`${API}/auth/login`, {
        email: account.email,
        password: account.password,
      });
      const token = loginRes.data.token;
      if (!token) throw new Error('No token received');
      result.login = '✅';

      const headers = { Authorization: `Bearer ${token}` };

      // Step 2: Upload Avatar
      try {
        const avatarForm = new FormData();
        avatarForm.append('avatar', fs.createReadStream(testImgPath), 'test-avatar.png');
        const avatarRes = await axios.post(`${API}/users/upload-avatar`, avatarForm, {
          headers: { ...headers, ...avatarForm.getHeaders() },
        });
        if (avatarRes.data.avatarUrl) result.avatarUpload = '✅';
      } catch (e) {
        result.avatarUpload = `❌ ${e.response?.data?.error || e.message}`;
      }

      // Step 3: Upload Resume
      try {
        const resumeForm = new FormData();
        resumeForm.append('resume', fs.createReadStream(testPdfPath), 'test-resume.pdf');
        const resumeRes = await axios.post(`${API}/users/upload-resume`, resumeForm, {
          headers: { ...headers, ...resumeForm.getHeaders() },
        });
        if (resumeRes.data.resumeUrl) result.resumeUpload = '✅';
      } catch (e) {
        result.resumeUpload = `❌ ${e.response?.data?.error || e.message}`;
      }

      // Step 4: Re-fetch profile (simulates page refresh)
      const profileRes = await axios.get(`${API}/users/profile`, { headers });
      const profile = profileRes.data;

      result.avatarPersists = profile.avatar ? '✅' : '❌ avatar is empty';
      result.resumePersists = profile.resume ? '✅' : '❌ resume is empty';

    } catch (e) {
      if (e.response?.status === 401 || e.response?.status === 400) {
        result.login = `❌ ${e.response?.data?.message || 'Auth failed'}`;
      } else {
        result.login = `❌ ${e.message}`;
      }
    }

    results.push(result);
  }

  // ── Output Results Table ──
  console.log('\n┌────────────────┬────────┬──────────────┬──────────────┬────────────────┬────────────────┐');
  console.log('│ Role           │ Login  │ Avatar Upload │ Resume Upload│ Avatar Persist │ Resume Persist │');
  console.log('├────────────────┼────────┼──────────────┼──────────────┼────────────────┼────────────────┤');
  for (const r of results) {
    const role = r.role.padEnd(14);
    const login = (r.login === '✅' ? '✅    ' : '❌    ');
    const au = (r.avatarUpload === '✅' ? '✅           ' : '❌           ');
    const ru = (r.resumeUpload === '✅' ? '✅           ' : '❌           ');
    const ap = (r.avatarPersists === '✅' ? '✅             ' : '❌             ');
    const rp = (r.resumePersists === '✅' ? '✅             ' : '❌             ');
    console.log(`│ ${role} │ ${login} │ ${au} │ ${ru} │ ${ap} │ ${rp} │`);
  }
  console.log('└────────────────┴────────┴──────────────┴──────────────┴────────────────┴────────────────┘');

  const allPassed = results.every(r => r.login === '✅' && r.avatarUpload === '✅' && r.resumeUpload === '✅' && r.avatarPersists === '✅' && r.resumePersists === '✅');
  console.log(allPassed ? '\n🎉 ALL TESTS PASSED!' : '\n⚠️  Some tests failed. Check the table above.');

  // Cleanup test files
  if (fs.existsSync(testImgPath)) fs.unlinkSync(testImgPath);
  if (fs.existsSync(testPdfPath)) fs.unlinkSync(testPdfPath);

  process.exit(allPassed ? 0 : 1);
}

runTests();
