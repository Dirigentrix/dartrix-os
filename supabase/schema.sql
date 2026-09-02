-- DARTRAINER OS - Supabase Schema v1.0 Trinity
-- Run in Supabase SQL Editor
create extension if not exists "uuid-ossp";
create table public.profiles (id uuid primary key references auth.users(id) on delete cascade, username text unique, trinity_score numeric default 0, ssf numeric default 0, avg numeric default 0, rank text default 'INITIATE', created_at timestamp with time zone default now());
create table public.throws (id uuid primary key default uuid_generate_v4(), user_id uuid references public.profiles(id) on delete cascade, score int not null, target int not null, is_double boolean default false, session_id uuid, created_at timestamp with time zone default now());
create table public.sessions (id uuid primary key default uuid_generate_v4(), user_id uuid references public.profiles(id) on delete cascade, type text not null, avg numeric, ssf numeric, trinity_score numeric, duration_sec int, created_at timestamp with time zone default now());
create table public.drills (id uuid primary key default uuid_generate_v4(), user_id uuid references public.profiles(id) on delete cascade, title text not null, payload jsonb not null, completed boolean default false, result jsonb, created_at timestamp with time zone default now());
alter table public.profiles enable row level security;
alter table public.throws enable row level security;
alter table public.sessions enable row level security;
alter table public.drills enable row level security;
create policy "Users can view own profile" on public.profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);
create policy "Users can manage own throws" on public.throws for all using (auth.uid() = user_id);
create policy "Users can manage own sessions" on public.sessions for all using (auth.uid() = user_id);
create policy "Users can manage own drills" on public.drills for all using (auth.uid() = user_id);
create index idx_throws_user on public.throws(user_id);
create index idx_sessions_user on public.sessions(user_id);
create index idx_drills_user on public.drills(user_id);
