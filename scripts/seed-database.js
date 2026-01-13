#!/usr/bin/env node

/**
 * Database Seeding Script
 * Seeds the Supabase database with all required tables, functions, and initial data
 * 
 * Usage:
 *   node scripts/seed-database.js
 * 
 * This script runs the complete database setup from database.sql which includes:
 * - Extensions setup
 * - Profiles table with RLS policies
 * - Emergency contacts table with triggers
 * - Emergency requests table with admin policies
 * - OTP codes table with functions
 * - Utility functions for fixing profiles and setting admin users
 */

const fs = require('fs');
const path = require('path');
const { Client } = require('pg');

// Database connection from connection string
// Note: Password is URL-encoded (special characters encoded)
const DATABASE_URL = 'postgresql://postgres:Karldarn25%21@db.yatiljvrbvnkxkkgsjyg.supabase.co:5432/postgres';

// SQL file to run (consolidated complete setup)
const SQL_FILE = 'database.sql';

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
    
    try {
      const sql = await readSQLFile(SQL_FILE);
      const success = await executeSQL(sql, SQL_FILE);
      
      if (success) {
        console.log('\n' + '='.repeat(60));
        console.log('📊 Seeding Summary:');
        console.log('✅ Database setup completed successfully!');
        console.log('='.repeat(60));
        console.log('\n🎉 All tables, functions, triggers, and policies have been created.');
        console.log('\n💡 Next steps:');
        console.log('   1. Create users via Supabase Dashboard > Auth > Users');
        console.log('   2. Or use the app\'s sign-up feature');
        console.log('   3. To set an admin user, run: SELECT public.set_user_admin(\'email@example.com\');');
        console.log('   4. To fix missing profiles, run: SELECT public.fix_missing_profiles();');
      } else {
        console.log('\n⚠️  Database setup failed. Please check the errors above.');
        console.log('You may need to run the SQL manually in Supabase SQL Editor:');
        console.log('https://supabase.com/dashboard/project/yatiljvrbvnkxkkgsjyg/sql/new');
      }
    } catch (error) {
      console.error(`❌ Failed to process ${SQL_FILE}:`, error.message);
      console.log('\n📋 Alternative: Run SQL file manually in Supabase SQL Editor');
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

