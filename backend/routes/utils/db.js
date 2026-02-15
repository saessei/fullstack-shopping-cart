const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

const testClient = createClient(supabaseUrl, supabaseKey);

const clearDatabase = async(tableName) => {
    const { error } = await testClient.from(tableName).delete().neq("id", 0);

    if (error) {
        throw new Error(`Failed to clear ${tableName}: ${error.message}`);
    }
}

module.exports = { testClient, clearDatabase};