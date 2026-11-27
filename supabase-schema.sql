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

-- 4. Vector Knowledge Base (pgvector RAG for 1,000+ Articles & Podcasts)
create extension if not exists vector;

create table if not exists knowledge_chunks (
  id bigint generated always as identity primary key,
  source_title text,
  source_url text,
  content text not null,
  embedding vector(768)
);

-- Full-text search function (replaces pgvector, works without embeddings)
create or replace function match_knowledge (
  search_query text,
  match_count int default 4
)
returns table (
  id bigint,
  source_title text,
  source_url text,
  content text,
  rank real
)
language sql stable
as $$
  select
    id,
    source_title,
    source_url,
    content,
    ts_rank(to_tsvector('english', content), plainto_tsquery('english', search_query)) as rank
  from knowledge_chunks
  where to_tsvector('english', content) @@ plainto_tsquery('english', search_query)
  order by rank desc
  limit match_count;
$$;

-- Index for fast full-text search
create index if not exists knowledge_chunks_fts
  on knowledge_chunks using gin(to_tsvector('english', content));
