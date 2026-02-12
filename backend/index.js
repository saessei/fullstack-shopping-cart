require('dotenv').config();

const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');

const { supabase } = require('./supabaseClient');

const authRoutes = require('./routes/authRoutes');
const catalogRoutes = require('./routes/catalogRoutes');
const userRoutes = require('./routes/userRoutes');
const cartRoutes = require('./routes/cartRoutes');
const orderRoutes = require('./routes/orderRoutes');

const publicPath = path.join(__dirname, '..', 'frontend', 'public');
const port = process.env.PORT || 5000;

const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  bodyParser.json({
    limit: '10MB',
    type: 'application/json',
  }),
);
app.use(express.static(publicPath));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/catalog', catalogRoutes);
app.use('/api/user', userRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/order', orderRoutes);

app.get('/api/health', async (req, res) => {
  try {
    const { data, error } = await supabase.from('users').select('*').limit(1);
    if (error) throw error;
    res.status(200).json({ status: 'ok', data: data.length });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

app.listen(port, () => console.log(`SERVER NOW RUNNING ON PORT ${port}...`));
