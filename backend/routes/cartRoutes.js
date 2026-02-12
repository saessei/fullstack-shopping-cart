const express = require("express");
const { supabase } = require("../supabaseClient");

const router = express.Router();

// Add item to cart
router.post('/', async (req, res) => {
  const { user_id, product_id, quantity } = req.body;

  const { data, error } = await supabase
    .from('carts')
    .insert([{ user_id, product_id, quantity }]);

  if (error) return res.status(400).json({ error: error.message });
  res.json({ message: 'Item added', cart: data[0] });
});

// Get user's cart
router.get('/:user_id', async (req, res) => {
  const { user_id } = req.params;

  const { data, error } = await supabase
    .from('carts')
    .select('id, product_id, quantity, products(name, price)')
    .eq('user_id', user_id)
    .order('id');

  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

// Update cart item quantity
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { quantity } = req.body;

  const { data, error } = await supabase
    .from('carts')
    .update({ quantity })
    .eq('id', id)
    .single();

  if (error) return res.status(400).json({ error: error.message });
  res.json({ message: 'Cart updated', cart: data });
});

// Delete cart item
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  const { data, error } = await supabase
    .from('carts')
    .delete()
    .eq('id', id)
    .single();

  if (error) return res.status(400).json({ error: error.message });
  res.json({ message: 'Item removed', cart: data });
});

module.exports = router;
