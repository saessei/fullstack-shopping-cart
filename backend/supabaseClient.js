const { createClient } = require('@supabase/supabase-js');
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

let instance;

// If we are in Test mode OR if the Supabase keys are placeholders/missing
if (process.env.NODE_ENV === 'test' || !process.env.SUPABASE_URL || process.env.SUPABASE_URL.includes('placeholder')) {
  console.log("🛠️  Running in Test Mode: Using Local Postgres Proxy");
  instance = {
    from: (table) => {
      const handler = {
        select: async () => {
          const res = await pool.query(`SELECT * FROM ${table}`);
          return { data: res.rows, error: null };
        },
        insert: async (data) => {
          const keys = Object.keys(data);
          const values = Object.values(data);
          const query = `INSERT INTO ${table} (${keys.join(',')}) VALUES (${keys.map((_, i) => `$${i + 1}`).join(',')}) RETURNING *`;
          const res = await pool.query(query, values);
          return { data: res.rows, error: null };
        },
        delete: () => handler,
        eq: async (col, val) => {
          const res = await pool.query(`DELETE FROM ${table} WHERE ${col} = $1`, [val]);
          return { data: res.rows, error: null };
        }
      };
      return handler;
    }
  };
} else {
  instance = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);
}

module.exports = { supabase: instance };