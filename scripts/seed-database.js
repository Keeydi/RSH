#!/usr/bin/env node

/**
 * Database Seeding Script
 * Seeds the Supabase database with all required tables, functions, and initial data
 * 
 * Usage:
 *   node scripts/seed-database.js
 * 
 * This script will run all SQL files in the correct order:
 * 1. setup.sql - Core tables and functions
 * 2. emergency_contacts.sql - Emergency contacts table
 * 3. emergency_requests.sql - Emergency requests table
 * 4. otp_setup.sql - OTP configuration
 * 5. seed_admin_account.sql - Admin user setup (optional)
 */

const fs = require('fs');
const path = require('path');
const { Client } = require('pg');

// Database connection from connection string
// Note: Password is URL-encoded (special characters encoded)
const DATABASE_URL = 'postgresql://postgres:Karldarn25%21@db.yatiljvrbvnkxkkgsjyg.supabase.co:5432/postgres';

// SQL files to run in order
const SQL_FILES = [
  'setup.sql',
  'emergency_contacts.sql',
  'emergency_requests.sql',
  'otp_setup.sql',
  // 'seed_admin_account.sql', // Uncomment if you want to seed admin account
];

const client = new Client({
  connectionString: DATABASE_URL,
  ssl: {
    rejectUnauthorized: false // Supabase requires SSL
  }
});

async function readSQLFile(filename) {
  const filePath = path.join(__dirname, '..', 'database', filename);
  if (!fs.existsSync(filePath)) {
    throw new Error(`SQL file not found: ${filePath}`);
  }
  return fs.readFileSync(filePath, 'utf8');
}

async function executeSQL(sql, filename) {
  try {
    console.log(`\n📄 Executing: ${filename}`);
    console.log('─'.repeat(60));
    
    // Split SQL by semicolons and execute each statement
    // Note: This is a simple approach. For complex SQL with functions/triggers,
    // we execute the entire file as one query
    await client.query(sql);
    
    console.log(`✅ Successfully executed: ${filename}`);
    return true;
  } catch (error) {
    console.error(`❌ Error executing ${filename}:`, error.message);
    // Continue with other files even if one fails
    return false;
  }
}

async function main() {
  console.log('🚀 RHS ArchAID Database Seeding Script\n');
  console.log('Connecting to database...');
  
  try {
    await client.connect();
    console.log('✅ Connected to database\n');
    
    let successCount = 0;
    let failCount = 0;
    
    for (const filename of SQL_FILES) {
      try {
        const sql = await readSQLFile(filename);
        const success = await executeSQL(sql, filename);
        
        if (success) {
          successCount++;
        } else {
          failCount++;
        }
      } catch (error) {
        console.error(`❌ Failed to process ${filename}:`, error.message);
        failCount++;
      }
    }
    
    console.log('\n' + '='.repeat(60));
    console.log('📊 Seeding Summary:');
    console.log(`✅ Successful: ${successCount}`);
    console.log(`❌ Failed: ${failCount}`);
    console.log('='.repeat(60));
    
    if (failCount === 0) {
      console.log('\n🎉 Database seeding completed successfully!');
    } else {
      console.log('\n⚠️  Some files failed. Please check the errors above.');
      console.log('You may need to run failed SQL files manually in Supabase SQL Editor:');
      console.log('https://supabase.com/dashboard/project/yatiljvrbvnkxkkgsjyg/sql/new');
    }
    
  } catch (error) {
    console.error('❌ Database connection error:', error.message);
    console.log('\n📋 Alternative: Run SQL files manually in Supabase SQL Editor');
    console.log('https://supabase.com/dashboard/project/yatiljvrbvnkxkkgsjyg/sql/new');
    process.exit(1);
  } finally {
    await client.end();
    console.log('\n🔌 Database connection closed');
  }
}

main().catch(console.error);

