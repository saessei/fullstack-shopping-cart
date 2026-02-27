require('dotenv').config()

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

let testClient = null;
if (supabaseUrl && supabaseKey) {
  testClient = createClient(supabaseUrl, supabaseKey);
}

const clearDatabase = async(tableName) => {
    if (!testClient) {
      console.warn("Supabase client not initialized - skipping database clear");
      return;
    }
    
    const { error } = await testClient
        .from(tableName)
        .delete()
        .not("created_at", "is", null); 

    if (error) {
        throw new Error(`Failed to clear ${tableName}: ${error.message}`);
    }
}

module.exports = { testClient, clearDatabase};