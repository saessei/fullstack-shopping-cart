require('dotenv').config()

const { createClient } = require('@supabase/supabase-js');
const { Pool } = require('pg');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

// In test mode, use local Postgres. Otherwise use Supabase.
let testClient;
if (process.env.NODE_ENV === 'test' || !supabaseUrl || supabaseUrl.includes('placeholder')) {
  testClient = new Pool({
    connectionString: process.env.DATABASE_URL,
  });
} else {
  testClient = createClient(supabaseUrl, supabaseKey);
}

const clearDatabase = async(tableName) => {
    try {
      if (process.env.NODE_ENV === 'test' || !process.env.SUPABASE_URL || process.env.SUPABASE_URL.includes('placeholder')) {
        // Using local Postgres pool
        await testClient.query(`DELETE FROM "${tableName}"`);
      } else {
        // Using Supabase client
        const { error } = await testClient
            .from(tableName)
            .delete()
            .not("created_at", "is", null);
        
        if (error) {
            throw new Error(`Failed to clear ${tableName}: ${error.message}`);
        }
      }
    } catch (error) {
        throw new Error(`Failed to clear ${tableName}: ${error.message}`);
    }
}

module.exports = { testClient, clearDatabase};