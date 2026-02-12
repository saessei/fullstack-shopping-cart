import express from 'express';
import { supabase } from './supabaseClient.js';

const router = express.Router();

// Signup
router.post('/signup', async (req, res) => {
  const { email, password } = req.body;

  const { data, error } = await supabase.auth.signUp({ email, password });

  if (error) return res.status(400).json({ error: error.message });
  res.status(201).json({ message: 'User created', user: data.user });
});

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) return res.status(400).json({ error: error.message });
  res.json({ message: 'Login successful', session: data.session });
});

// Get user info (requires Supabase session header)
router.get('/me', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) return res.status(401).json({ error: 'Missing token' });

  const { data: { user }, error } = await supabase.auth.getUser(token);

  if (error) return res.status(400).json({ error: error.message });
  res.json({ user });
});

export default router;
