import express from 'express';
import { supabase } from './supabaseClient.js';

const router = express.Router();

// Get all products
router.get('/', async (req, res) => {
  try {
    const { data: products, error } = await supabase
      .from('products')
      .select('*')
      .order('id', { ascending: true });

    if (error) throw error;

    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
