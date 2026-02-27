-- 1. Create the auth schema
CREATE SCHEMA IF NOT EXISTS auth;

-- 2. Create the mock users table
CREATE TABLE IF NOT EXISTS auth.users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text
);

-- 3. Create the products table
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  price integer NOT NULL,
  created_at timestamp with time zone DEFAULT now()
);