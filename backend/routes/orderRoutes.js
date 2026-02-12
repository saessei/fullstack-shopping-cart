import express from 'express';
import { supabase } from './supabaseClient.js';

const router = express.Router();

// Create order
router.post('/', async (req, res) => {
  const { user_id, items, total } = req.body;

  const { data, error } = await supabase
    .from('orders')
    .insert([{ user_id, items, total }])
    .single();

  if (error) return res.status(400).json({ error: error.message });
  res.status(201).json({ message: 'Order created', order: data });
});

// Get user's orders
router.get('/:user_id', async (req, res) => {
  const { user_id } = req.params;

  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .eq('user_id', user_id)
    .order('created_at', { ascending: false });

  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

export default router;
