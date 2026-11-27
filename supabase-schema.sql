-- Run this in your Supabase SQL Editor (https://supabase.com/dashboard)

-- 1. Founder Profiles
create table if not exists profiles (
  id uuid references auth.users on delete cascade primary key,
  email text,
  brand_name text,
  category_id text default 'beauty_skincare',
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- 2. Persistent Chat History
create table if not exists chat_history (
  id bigint generated always as identity primary key,
  user_id uuid references auth.users on delete cascade,
  role text check (role in ('user', 'mentor')),
  message text not null,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- 3. Self-Improving Knowledge Brain (New Web-Searched Q&As)
create table if not exists learned_brain (
  id bigint generated always as identity primary key,
  question text not null,
  answer text not null,
  category_id text,
  created_at timestamp with time zone default timezone('utc'::text, now())
);
