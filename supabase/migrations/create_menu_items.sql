create table menu_items (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  description text not null,
  price decimal(10,2) not null,
  image text not null,
  is_veg boolean not null default false,
  is_non_veg boolean not null default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Insert sample data
insert into menu_items (title, description, price, image, is_veg, is_non_veg) values
(
  'Classic Margherita Pizza',
  'Traditional Italian pizza with fresh basil and mozzarella',
  5.99,
  '/menu/margherita.jpg',
  true,
  false
),
(
  'Salmon Bowl',
  'Traditional Italian pizza with fresh basil and mozzarella',
  5.99,
  '/menu/salmon.jpg',
  true,
  false
),
(
  'Pasta Pizza',
  'Traditional Italian pizza with fresh basil and mozzarella',
  5.99,
  '/menu/pasta.jpg',
  true,
  true
);

-- Enable RLS
alter table menu_items enable row level security;

-- Create policy to allow public read access
create policy "Allow public read access"
  on menu_items
  for select
  to anon
  using (true);

