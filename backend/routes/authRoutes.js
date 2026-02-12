const express = require('express');
const router = express.Router();
const { supabase } = require('../supabaseClient');
const jwt = require('jsonwebtoken');

// Register
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const { data: existingUser } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    const { data, error } = await supabase
      .from('users')
      .insert([{ name, email, password }])
      .select();

    if (error) throw error;
    res.status(201).json(data[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const { data } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (!data) return res.status(400).json({ message: 'User not found' });
    if (data.password !== password) return res.status(400).json({ message: 'Incorrect password' });

    const token = jwt.sign({ id: data.id, email: data.email }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });
    res.json({ user: data, token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
