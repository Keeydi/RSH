#!/usr/bin/env node

/**
 * Seed Test Accounts Script
 * Creates multiple test user accounts in Supabase
 * 
 * Usage:
 *   SUPABASE_SERVICE_ROLE_KEY=your_key node scripts/seed-accounts.js
 * 
 * Or set environment variable:
 *   $env:SUPABASE_SERVICE_ROLE_KEY="your_key"
 *   node scripts/seed-accounts.js
 */

const https = require('https');

const SUPABASE_URL = 'https://yatiljvrbvnkxkkgsjyg.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Test accounts to create
const TEST_ACCOUNTS = [
  {
    email: 'student@test.com',
    password: 'test123456',
    name: 'Test Student',
    role: 'student',
  },
  {
    email: 'teacher@test.com',
    password: 'test123456',
    name: 'Test Teacher',
    role: 'teacher',
  },
  {
    email: 'admin@test.com',
    password: 'test123456',
    name: 'Test Admin',
    role: 'admin',
  },
  {
    email: 'test@example.com',
    password: 'test123456',
    name: 'Test User',
    role: 'student',
  },
];

async function createUser(email, password, name, role) {
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
      email_confirm: true, // Auto-confirm so users can login immediately
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
          const result = JSON.parse(data);
          resolve({...result, role});
        } else {
          // Check if user already exists
          if (data.includes('already registered') || data.includes('already exists')) {
            resolve({user: {email}, exists: true, role});
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
          // Profile might not exist yet, that's okay
          resolve(null);
        }
      });
    });

    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

async function main() {
  console.log('🚀 Seed Test Accounts Script\n');
  console.log(`Creating ${TEST_ACCOUNTS.length} test accounts...\n`);

  if (!SUPABASE_SERVICE_ROLE_KEY) {
    console.log('⚠️  Service role key not found in environment variables.');
    console.log('\n📋 Manual Steps to Create Test Accounts:\n');
    console.log('1. Go to: https://supabase.com/dashboard/project/yatiljvrbvnkxkkgsjyg/auth/users');
    console.log('2. Click "Add User" for each account:\n');
    
    TEST_ACCOUNTS.forEach(account => {
      console.log(`   Email: ${account.email}`);
      console.log(`   Password: ${account.password}`);
      console.log(`   Name: ${account.name}`);
      console.log(`   Role: ${account.role}`);
      console.log(`   Auto Confirm: ON ✅\n`);
    });
    
    console.log('3. After creating users, run this SQL to set roles:');
    console.log('   Go to: https://supabase.com/dashboard/project/yatiljvrbvnkxkkgsjyg/sql/new');
    console.log('   Run: database/seed_test_accounts.sql\n');
    
    return;
  }

  console.log('🔑 Service role key found. Creating accounts via API...\n');
  
  const results = [];
  let successCount = 0;
  let existsCount = 0;
  let failCount = 0;

  for (const account of TEST_ACCOUNTS) {
    try {
      console.log(`⏳ Creating: ${account.email} (${account.role})...`);
      const result = await createUser(
        account.email,
        account.password,
        account.name,
        account.role
      );
      
      if (result.exists) {
        console.log(`   ⚠️  User already exists, skipping...`);
        existsCount++;
      } else {
        console.log(`   ✅ User created successfully!`);
        successCount++;
        
        // Wait a moment for profile to be created by trigger
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Update role
        try {
          await updateProfileRole(account.email, account.role);
          console.log(`   ✅ Role set to: ${account.role}`);
        } catch (err) {
          console.log(`   ⚠️  Could not set role (profile might not exist yet): ${err.message}`);
        }
      }
      
      results.push({...account, success: true});
    } catch (error) {
      console.error(`   ❌ Failed: ${error.message}`);
      failCount++;
      results.push({...account, success: false, error: error.message});
    }
    console.log('');
  }

  console.log('='.repeat(60));
  console.log('📊 Summary:');
  console.log(`✅ Created: ${successCount}`);
  console.log(`⚠️  Already exists: ${existsCount}`);
  console.log(`❌ Failed: ${failCount}`);
  console.log('='.repeat(60));
  
  console.log('\n📋 Test Account Credentials:\n');
  results.forEach(account => {
    if (account.success || account.exists) {
      console.log(`${account.role.toUpperCase()}:`);
      console.log(`  Email: ${account.email}`);
      console.log(`  Password: ${account.password}`);
      console.log('');
    }
  });
  
  console.log('✅ You can now login with any of these accounts!\n');
}

main().catch(console.error);


