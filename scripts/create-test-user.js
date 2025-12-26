#!/usr/bin/env node

/**
 * Create Test User Script
 * Creates a test user account in Supabase that you can use to log in
 * 
 * Usage:
 *   node scripts/create-test-user.js
 * 
 * This will:
 * 1. Check if database tables exist
 * 2. Create a test user via Supabase Admin API
 * 3. Set up the user profile
 */

const https = require('https');

const SUPABASE_URL = 'https://yatiljvrbvnkxkkgsjyg.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Test user credentials
const TEST_USER = {
  email: 'test@example.com',
  password: 'test123456',
  name: 'Test User',
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
          reject(new Error(`HTTP ${res.statusCode}: ${data}`));
        }
      });
    });

    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

async function main() {
  console.log('🚀 Create Test User Script\n');
  console.log('Test User Credentials:');
  console.log(`  Email: ${TEST_USER.email}`);
  console.log(`  Password: ${TEST_USER.password}`);
  console.log(`  Name: ${TEST_USER.name}\n`);

  if (!SUPABASE_SERVICE_ROLE_KEY) {
    console.log('⚠️  Service role key not found in environment variables.');
    console.log('\n📋 Manual Steps to Create Test User:\n');
    console.log('Method 1: Via Supabase Dashboard (Easiest)\n');
    console.log('1. Go to: https://supabase.com/dashboard/project/yatiljvrbvnkxkkgsjyg/auth/users');
    console.log('2. Click "Add User" button');
    console.log('3. Enter the following:');
    console.log(`   Email: ${TEST_USER.email}`);
    console.log(`   Password: ${TEST_USER.password}`);
    console.log('4. Toggle ON "Auto Confirm User" (so you can login immediately)');
    console.log('5. Click "Create User"\n');
    console.log('Method 2: Via SQL (After creating user above)\n');
    console.log('1. Go to: https://supabase.com/dashboard/project/yatiljvrbvnkxkkgsjyg/sql/new');
    console.log('2. Run this SQL to set user as admin (optional):\n');
    console.log('─'.repeat(60));
    console.log(`UPDATE public.profiles`);
    console.log(`SET role = 'admin'`);
    console.log(`WHERE email = '${TEST_USER.email}';`);
    console.log('─'.repeat(60));
    console.log('\n✅ After creating the user, you can login with:');
    console.log(`   Email: ${TEST_USER.email}`);
    console.log(`   Password: ${TEST_USER.password}\n`);
    
    return;
  }

  console.log('🔑 Service role key found. Attempting to create user via API...\n');
  
  try {
    console.log('⏳ Creating user...');
    const result = await createUser(
      TEST_USER.email,
      TEST_USER.password,
      TEST_USER.name
    );
    
    console.log('✅ User created successfully!');
    console.log('User ID:', result.user.id);
    console.log('Email:', result.user.email);
    console.log('\n✅ You can now login with:');
    console.log(`   Email: ${TEST_USER.email}`);
    console.log(`   Password: ${TEST_USER.password}\n`);
    
    // Optionally set as admin
    console.log('💡 To set this user as admin, run this SQL in Supabase SQL Editor:');
    console.log('─'.repeat(60));
    console.log(`UPDATE public.profiles`);
    console.log(`SET role = 'admin'`);
    console.log(`WHERE email = '${TEST_USER.email}';`);
    console.log('─'.repeat(60));
    console.log('\n');
    
  } catch (error) {
    console.error('❌ Failed to create user:', error.message);
    console.log('\n📋 Please create the user manually via Supabase Dashboard:');
    console.log('https://supabase.com/dashboard/project/yatiljvrbvnkxkkgsjyg/auth/users\n');
  }
}

main().catch(console.error);



