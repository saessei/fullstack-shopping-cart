const express = require('express');
const { supabase } = require('../supabaseClient');
const router = express.Router();

// Create user (matches your integration tests)
router.post('/', async (req, res) => {
  const { username, email } = req.body;

  if (!email) return res.status(400).json({ message: 'Email is required.' });
  if (!username) return res.status(400).json({ message: 'Username is required.' });

  // Insert user into Supabase
  const { data, error } = await supabase.from('users').insert([{ username, email }]);

  if (error) return res.status(400).json({ message: error.message });

  res.status(200).json({ message: 'User created', user: data[0] });
});

// GET all users — added for integration tests
router.get('/', async (req, res) => {
  const { data, error } = await supabase.from('users').select('*');

  if (error) return res.status(400).json({ message: error.message });

  res.status(200).json(data);
});

// Signup with Supabase Auth
router.post('/signup', async (req, res) => {
  const { email, password } = req.body;

  const { data, error } = await supabase.auth.signUp({ email, password });

  if (error) return res.status(400).json({ error: error.message });
  res.status(201).json({ message: 'User created', user: data.user });
});

// Login with Supabase Auth
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) return res.status(400).json({ error: error.message });
  res.json({ message: 'Login successful', session: data.session });
});

// Get user info from Supabase Auth
router.get('/me', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) return res.status(401).json({ error: 'Missing token' });

  const { data: { user }, error } = await supabase.auth.getUser(token);

  if (error) return res.status(400).json({ error: error.message });
  res.json({ user });
});

module.exports = router;