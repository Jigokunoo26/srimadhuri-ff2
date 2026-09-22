import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

console.log('--- Testing Supabase Connection ---');
console.log('Target URL:', supabaseUrl);

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY in .env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testConnection() {
  const tables = ['services', 'store_info', 'bookings', 'offers', 'gallery', 'testimonials', 'team'];
  const results = {};

  for (const table of tables) {
    try {
      const { data, error, count } = await supabase
        .from(table)
        .select('*', { count: 'exact', head: true });

      if (error) {
        results[table] = { status: 'Error / Missing', error: error.message };
      } else {
        results[table] = { status: 'Connected ✅', rowCount: count ?? 0 };
      }
    } catch (err) {
      results[table] = { status: 'Exception', error: err.message };
    }
  }

  console.log('\n--- Connection Results ---');
  console.table(results);

  const anyConnected = Object.values(results).some(r => r.status.includes('Connected'));
  if (anyConnected) {
    console.log('\n🎉 Successfully connected to Supabase PostgreSQL database!');
  } else {
    console.log('\n⚠️ Connected to Supabase host, but tables may not be created yet. Please execute supabase/schema.sql in the Supabase SQL Editor.');
  }
}

testConnection();
