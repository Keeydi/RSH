#!/usr/bin/env node

/**
 * Migration Runner Script
 * Runs database/database.sql (complete database setup) in Supabase
 * 
 * Usage:
 *   node scripts/run-migration.js
 * 
 * Or with service role key:
 *   SUPABASE_SERVICE_ROLE_KEY=your_key node scripts/run-migration.js
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

const SUPABASE_URL = 'https://yatiljvrbvnkxkkgsjyg.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Read SQL file
const sqlFilePath = path.join(__dirname, '..', 'database', 'database.sql');
const sql = fs.readFileSync(sqlFilePath, 'utf8');

console.log('🚀 Database Migration Runner\n');
console.log('SQL File:', sqlFilePath);
console.log('SQL Length:', sql.length, 'characters\n');

// Function to execute SQL via Supabase REST API
async function executeSQL(sql) {
  return new Promise((resolve, reject) => {
    const url = new URL(`${SUPABASE_URL}/rest/v1/rpc/exec_sql`);
    
    const options = {
      method: 'POST',
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
    req.write(JSON.stringify({ query: sql }));
    req.end();
  });
}

// Main execution
async function main() {
  if (!SUPABASE_SERVICE_ROLE_KEY) {
    console.log('⚠️  Service role key not found in environment variables.');
    console.log('\n📋 Manual Migration Steps:\n');
    console.log('1. Open Supabase SQL Editor:');
    console.log('   https://supabase.com/dashboard/project/yatiljvrbvnkxkkgsjyg/sql/new\n');
    console.log('2. Copy the SQL below and paste it into the editor:\n');
    console.log('─'.repeat(60));
    console.log(sql);
    console.log('─'.repeat(60));
    console.log('\n3. Click "Run" button (or press Ctrl+Enter)');
    console.log('\n4. Verify success - you should see "Success" message');
    console.log('\n✅ Migration complete!\n');
    
    // Try to open browser (optional)
    const { exec } = require('child_process');
    const url = 'https://supabase.com/dashboard/project/yatiljvrbvnkxkkgsjyg/sql/new';
    
    const platform = process.platform;
    let command;
    if (platform === 'win32') {
      command = `start ${url}`;
    } else if (platform === 'darwin') {
      command = `open ${url}`;
    } else {
      command = `xdg-open ${url}`;
    }
    
    console.log('🌐 Opening SQL Editor in browser...\n');
    exec(command, (error) => {
      if (error) {
        console.log('Could not open browser automatically. Please open the URL manually.');
      }
    });
    
    return;
  }

  // Try to execute via API
  console.log('🔑 Service role key found. Attempting to execute SQL via API...\n');
  
  try {
    console.log('⏳ Executing migration...');
    const result = await executeSQL(sql);
    console.log('✅ Migration executed successfully!');
    console.log('Result:', result);
  } catch (error) {
    console.error('❌ API execution failed:', error.message);
    console.log('\n📋 Falling back to manual migration...\n');
    console.log('Please run the SQL manually in Supabase SQL Editor:');
    console.log('https://supabase.com/dashboard/project/yatiljvrbvnkxkkgsjyg/sql/new\n');
    console.log('SQL to execute:');
    console.log('─'.repeat(60));
    console.log(sql);
    console.log('─'.repeat(60));
  }
}

main().catch(console.error);

