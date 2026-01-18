#!/usr/bin/env node

/**
 * Verify Admin Account Script
 * Verifies that the admin@admin account exists and is properly configured
 * 
 * Usage:
 *   SUPABASE_SERVICE_ROLE_KEY=your_key node scripts/verify-admin-account.js
 */

const https = require('https');

const SUPABASE_URL = 'https://yatiljvrbvnkxkkgsjyg.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

const ADMIN_EMAIL = 'admin@admin';

async function verifyAccount(email) {
  return new Promise((resolve, reject) => {
    const url = new URL(`${SUPABASE_URL}/rest/v1/profiles`);
    url.searchParams.append('email', `eq.${email}`);
    url.searchParams.append('select', '*');
    
    const options = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_SERVICE_ROLE_KEY,
        'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
      },
    };

    const req = https.request(url, options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(JSON.parse(data));
        } else {
          reject(new Error(`HTTP ${res.statusCode}: ${data}`));
        }
      });
    });

    req.on('error', reject);
    req.end();
  });
}

async function verifyAuthUser(email) {
  return new Promise((resolve, reject) => {
    const url = new URL(`${SUPABASE_URL}/auth/v1/admin/users`);
    url.searchParams.append('email', email);
    
    const options = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_SERVICE_ROLE_KEY,
        'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
      },
    };

    const req = https.request(url, options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(JSON.parse(data));
        } else {
          reject(new Error(`HTTP ${res.statusCode}: ${data}`));
        }
      });
    });

    req.on('error', reject);
    req.end();
  });
}

async function main() {
  console.log('🔍 Verify Admin Account Script\n');
  console.log(`Checking account: ${ADMIN_EMAIL}\n`);

  if (!SUPABASE_SERVICE_ROLE_KEY) {
    console.log('⚠️  Service role key not found in environment variables.');
    console.log('\n📋 To verify manually, run this SQL in Supabase SQL Editor:\n');
    console.log('─'.repeat(60));
    console.log(`SELECT 
  p.id,
  p.email,
  p.full_name,
  p.role,
  p.created_at,
  u.email_confirmed_at,
  CASE 
    WHEN u.email_confirmed_at IS NOT NULL THEN '✅ Verified'
    ELSE '❌ Not Verified'
  END as verification_status
FROM public.profiles p
LEFT JOIN auth.users u ON p.id = u.id
WHERE p.email = '${ADMIN_EMAIL}';`);
    console.log('─'.repeat(60));
    console.log('\n');
    return;
  }

  console.log('🔑 Service role key found. Verifying account...\n');
  
  let allGood = true;
  
  // Verify profile
  try {
    console.log('⏳ Checking profile...');
    const profile = await verifyAccount(ADMIN_EMAIL);
    if (profile && profile.length > 0) {
      const p = profile[0];
      console.log('   ✅ Profile found:');
      console.log(`      - ID: ${p.id}`);
      console.log(`      - Email: ${p.email}`);
      console.log(`      - Name: ${p.full_name || 'N/A'}`);
      console.log(`      - Role: ${p.role}`);
      
      if (p.role !== 'admin') {
        console.log(`      ⚠️  WARNING: Role is '${p.role}', expected 'admin'`);
        allGood = false;
      } else {
        console.log(`      ✅ Role is correct: admin`);
      }
      console.log(`      - Created: ${p.created_at}`);
    } else {
      console.log('   ❌ Profile not found');
      allGood = false;
    }
  } catch (err) {
    console.log(`   ❌ Error checking profile: ${err.message}`);
    allGood = false;
  }
  
  // Verify auth user
  try {
    console.log('\n⏳ Checking auth user...');
    const authUsers = await verifyAuthUser(ADMIN_EMAIL);
    if (authUsers && authUsers.users && authUsers.users.length > 0) {
      const user = authUsers.users[0];
      console.log('   ✅ Auth user found:');
      console.log(`      - ID: ${user.id}`);
      console.log(`      - Email: ${user.email}`);
      
      if (user.email_confirmed_at) {
        console.log(`      ✅ Email Verified: Yes`);
        console.log(`      - Verified At: ${user.email_confirmed_at}`);
      } else {
        console.log(`      ❌ Email Verified: No`);
        allGood = false;
      }
      console.log(`      - Created: ${user.created_at}`);
    } else {
      console.log('   ❌ Auth user not found');
      allGood = false;
    }
  } catch (err) {
    console.log(`   ❌ Error checking auth user: ${err.message}`);
    allGood = false;
  }
  
  console.log('\n' + '='.repeat(60));
  if (allGood) {
    console.log('✅ Account Verification: PASSED');
    console.log('   The admin@admin account is properly configured and verified!');
  } else {
    console.log('❌ Account Verification: FAILED');
    console.log('   Please check the issues above and fix them.');
  }
  console.log('='.repeat(60));
  console.log('\n');
}

main().catch(console.error);



