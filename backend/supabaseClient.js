const { createClient } = require('@supabase/supabase-js');
const { Pool } = require('pg');
const dotenv = require('dotenv');

dotenv.config();

const supabaseReal = createClient(
  process.env.SUPABASE_URL || 'https://placeholder.co',
  process.env.SUPABASE_KEY || 'placeholder'
);

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const supabaseMock = {
  from: (table) => ({
    insert: async (data) => {
      const keys = Object.keys(data);
      const values = Object.values(data);
      const query = `INSERT INTO ${table} (${keys.join(',')}) VALUES (${keys.map((_, i) => `$${i + 1}`).join(',')}) RETURNING *`;
      try {
        const res = await pool.query(query, values);
        return { data: res.rows, error: null };
      } catch (err) {
        return { data: null, error: err };
      }
    },
    select: async () => {
      try {
        const res = await pool.query(`SELECT * FROM ${table}`);
        return { data: res.rows, error: null };
      } catch (err) {
        return { data: null, error: err };
      }
    },
    delete: () => ({
      eq: async (column, value) => {
        try {
          const res = await pool.query(`DELETE FROM ${table} WHERE ${column} = $1`, [value]);
          return { data: res.rows, error: null };
        } catch (err) {
          return { data: null, error: err };
        }
      }
    })
  })
};

const supabase = process.env.NODE_ENV === 'test' ? supabaseMock : supabaseReal;

module.exports = { supabase };