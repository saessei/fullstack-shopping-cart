const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

const testClient = createClient(supabaseUrl, supabaseKey);

const clearDatabase = async() => {
    const { error } = await testClient.from('cart_items').delete().neq("id", 0);

    if (error) {
        throw new Error(`Failed to clear database: ${error.message}`);
    }
}

module.exports = { testClient, clearDatabase};
