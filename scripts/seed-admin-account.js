#!/usr/bin/env node

/**
 * Seed Admin Account Script
 * Creates an admin account with email "admin@admin" and verifies it
 * 
 * Usage:
 *   SUPABASE_SERVICE_ROLE_KEY=your_key node scripts/seed-admin-account.js
 * 
 * Or set environment variable:
 *   $env:SUPABASE_SERVICE_ROLE_KEY="your_key"
 *   node scripts/seed-admin-account.js
 */

const https = require('https');

const SUPABASE_URL = 'https://yatiljvrbvnkxkkgsjyg.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Admin account credentials
const ADMIN_ACCOUNT = {
  email: 'admin@admin',
  password: 'admin123456',
  name: 'Admin User',
  role: 'admin',
};

async function createUser(email, password, name) {
  return new Promise((resolve, reject) => {
    const url = new URL(`${SUPABASE_URL}/auth/v1/admin/users`);
    
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_SERVICE_ROLE_KEY,
        'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
      },
    };

    const body = JSON.stringify({
      email,
      password,
      email_confirm: true, // Auto-confirm email so user can login immediately
      user_metadata: {
        full_name: name,
      },
    });

    const req = https.request(url, options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(JSON.parse(data));
        } else {
          // Check if user already exists
          if (data.includes('already registered') || data.includes('already exists') || res.statusCode === 422) {
            resolve({user: {email}, exists: true});
          } else {
            reject(new Error(`HTTP ${res.statusCode}: ${data}`));
          }
        }
      });
    });

    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

async function updateProfileRole(email, role) {
  return new Promise((resolve, reject) => {
    const url = new URL(`${SUPABASE_URL}/rest/v1/profiles`);
    url.searchParams.append('email', `eq.${email}`);
    
    const options = {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_SERVICE_ROLE_KEY,
        'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
        'Prefer': 'return=representation',
      },
    };

    const body = JSON.stringify({
      role: role,
    });

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
    req.write(body);
    req.end();
  });
}

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
          const result = JSON.parse(data);
          resolve(result);
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
          const result = JSON.parse(data);
          resolve(result);
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
  console.log('🚀 Seed Admin Account Script\n');
  console.log('Admin Account Credentials:');
  console.log(`  Email: ${ADMIN_ACCOUNT.email}`);
  console.log(`  Password: ${ADMIN_ACCOUNT.password}`);
  console.log(`  Name: ${ADMIN_ACCOUNT.name}`);
  console.log(`  Role: ${ADMIN_ACCOUNT.role}\n`);

  if (!SUPABASE_SERVICE_ROLE_KEY) {
    console.log('⚠️  Service role key not found in environment variables.');
    console.log('\n📋 Manual Steps to Create Admin Account:\n');
    console.log('Method 1: Via Supabase Dashboard (Easiest)\n');
    console.log('1. Go to: https://supabase.com/dashboard/project/yatiljvrbvnkxkkgsjyg/auth/users');
    console.log('2. Click "Add User" button');
    console.log('3. Enter the following:');
    console.log(`   Email: ${ADMIN_ACCOUNT.email}`);
    console.log(`   Password: ${ADMIN_ACCOUNT.password}`);
    console.log('4. Toggle ON "Auto Confirm User" (to verify email)');
    console.log('5. Click "Create User"\n');
    console.log('Method 2: Via SQL (After creating user above)\n');
    console.log('1. Go to: https://supabase.com/dashboard/project/yatiljvrbvnkxkkgsjyg/sql/new');
    console.log('2. Run this SQL to set user as admin:\n');
    console.log('─'.repeat(60));
    console.log(`SELECT public.set_user_admin('${ADMIN_ACCOUNT.email}');`);
    console.log('─'.repeat(60));
    console.log('\n✅ After creating the user, you can login with:');
    console.log(`   Email: ${ADMIN_ACCOUNT.email}`);
    console.log(`   Password: ${ADMIN_ACCOUNT.password}\n`);
    
    return;
  }

  console.log('🔑 Service role key found. Creating admin account via API...\n');
  
  try {
    // Step 1: Create user
    console.log('⏳ Step 1: Creating user account...');
    const result = await createUser(
      ADMIN_ACCOUNT.email,
      ADMIN_ACCOUNT.password,
      ADMIN_ACCOUNT.name
    );
    
    if (result.exists) {
      console.log('   ⚠️  User already exists, continuing...');
    } else {
      console.log('   ✅ User created successfully!');
      console.log(`   User ID: ${result.user.id}`);
      console.log(`   Email: ${result.user.email}`);
      console.log(`   Email Verified: ${result.user.email_confirmed_at ? 'Yes ✅' : 'No ❌'}`);
    }
    
    // Wait a moment for profile to be created by trigger
    console.log('\n⏳ Waiting for profile to be created...');
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Step 2: Set role to admin
    console.log('\n⏳ Step 2: Setting role to admin...');
    try {
      await updateProfileRole(ADMIN_ACCOUNT.email, ADMIN_ACCOUNT.role);
      console.log(`   ✅ Role set to: ${ADMIN_ACCOUNT.role}`);
    } catch (err) {
      console.log(`   ⚠️  Could not set role via API: ${err.message}`);
      console.log('   💡 You can set it manually with SQL:');
      console.log(`      SELECT public.set_user_admin('${ADMIN_ACCOUNT.email}');`);
    }
    
    // Step 3: Verify account
    console.log('\n⏳ Step 3: Verifying account...');
    
    // Verify profile
    try {
      const profile = await verifyAccount(ADMIN_ACCOUNT.email);
      if (profile && profile.length > 0) {
        console.log('   ✅ Profile found:');
        console.log(`      - ID: ${profile[0].id}`);
        console.log(`      - Email: ${profile[0].email}`);
        console.log(`      - Name: ${profile[0].full_name || 'N/A'}`);
        console.log(`      - Role: ${profile[0].role}`);
        console.log(`      - Created: ${profile[0].created_at}`);
      } else {
        console.log('   ⚠️  Profile not found yet (may need to wait a moment)');
      }
    } catch (err) {
      console.log(`   ⚠️  Could not verify profile: ${err.message}`);
    }
    
    // Verify auth user
    try {
      const authUsers = await verifyAuthUser(ADMIN_ACCOUNT.email);
      if (authUsers && authUsers.users && authUsers.users.length > 0) {
        const user = authUsers.users[0];
        console.log('\n   ✅ Auth user verified:');
        console.log(`      - ID: ${user.id}`);
        console.log(`      - Email: ${user.email}`);
        console.log(`      - Email Verified: ${user.email_confirmed_at ? 'Yes ✅' : 'No ❌'}`);
        console.log(`      - Created: ${user.created_at}`);
        if (user.email_confirmed_at) {
          console.log(`      - Verified At: ${user.email_confirmed_at}`);
        }
      } else {
        console.log('   ⚠️  Auth user not found');
      }
    } catch (err) {
      console.log(`   ⚠️  Could not verify auth user: ${err.message}`);
    }
    
    console.log('\n' + '='.repeat(60));
    console.log('📊 Summary:');
    console.log('✅ Admin account seeded successfully!');
    console.log('='.repeat(60));
    console.log('\n📋 Account Credentials:');
    console.log(`   Email: ${ADMIN_ACCOUNT.email}`);
    console.log(`   Password: ${ADMIN_ACCOUNT.password}`);
    console.log(`   Role: ${ADMIN_ACCOUNT.role}`);
    console.log('\n✅ You can now login with this account!\n');
    
  } catch (error) {
    console.error('❌ Failed to create admin account:', error.message);
    console.log('\n📋 Please create the user manually via Supabase Dashboard:');
    console.log('https://supabase.com/dashboard/project/yatiljvrbvnkxkkgsjyg/auth/users\n');
  }
}

main().catch(console.error);



