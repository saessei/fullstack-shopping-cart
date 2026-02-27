-- Create carts table
create table if not exists carts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamp with time zone default now()
);

-- Each user can only have one active cart
create unique index if not exists carts_user_id_key
on carts(user_id);


-- Create cart_items table
create table if not exists cart_items (
  id uuid primary key default gen_random_uuid(),
  cart_id uuid not null references carts(id) on delete cascade,
  product_id uuid not null references products(id) on delete cascade,
  quantity integer not null check (quantity > 0),
  created_at timestamp with time zone default now(),
  unique(cart_id, product_id)
);