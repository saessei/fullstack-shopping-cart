const { supabase } = require('./supabaseClient');

// Middleware to check Supabase JWT from Authorization header
const checkToken = async (req, res, next) => {
  const header = req.headers['authorization'];

  if (!header) return res.sendStatus(403);

  const token = header.split(' ')[1]; // Bearer <token>
  if (!token) return res.sendStatus(403);

  try {
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) return res.sendStatus(403);

    req.user = user; // Attach Supabase user object to req
    next();
  } catch (err) {
    res.sendStatus(403);
  }
};

module.exports = { checkToken };
