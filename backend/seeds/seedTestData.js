import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

async function seed() {
  await supabase.from('products').delete(); // clear old data
  await supabase.from('products').insert([
    { id: 1, name: 'Product 1', price: 10 },
    { id: 2, name: 'Product 2', price: 20 }
  ]);
  console.log('Test data seeded.');
}

seed();