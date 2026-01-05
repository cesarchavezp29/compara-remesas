-- ComparaRemesas Database Schema
-- Run this in Supabase SQL Editor

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ============================================
-- PROFILES TABLE (extends auth.users)
-- ============================================
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text unique,
  name text,
  avatar_url text,
  preferred_language text default 'es' check (preferred_language in ('es', 'en')),
  preferred_theme text default 'dark' check (preferred_theme in ('dark', 'light', 'midnight', 'nature')),
  origin_country text default 'US',
  preferred_payment text default 'bank',
  total_sent decimal default 0,
  total_saved decimal default 0,
  cashback_balance decimal default 0,
  user_level text default 'bronze' check (user_level in ('bronze', 'silver', 'gold', 'platinum')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Enable RLS
alter table public.profiles enable row level security;

-- Policies
create policy "Users can view own profile" on public.profiles
  for select using (auth.uid() = id);

create policy "Users can update own profile" on public.profiles
  for update using (auth.uid() = id);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email);
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ============================================
-- TRANSACTIONS TABLE
-- ============================================
create table if not exists public.transactions (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles on delete cascade not null,
  amount decimal not null,
  destination_country text not null,
  destination_currency text not null,
  service_used text not null,
  fee decimal not null,
  exchange_rate decimal not null,
  amount_received decimal not null,
  cashback_earned decimal default 0,
  status text default 'completed' check (status in ('pending', 'completed', 'failed')),
  created_at timestamptz default now()
);

-- Enable RLS
alter table public.transactions enable row level security;

-- Policies
create policy "Users can view own transactions" on public.transactions
  for select using (auth.uid() = user_id);

create policy "Users can insert own transactions" on public.transactions
  for insert with check (auth.uid() = user_id);

-- Index for faster queries
create index idx_transactions_user_id on public.transactions(user_id);
create index idx_transactions_created_at on public.transactions(created_at desc);

-- ============================================
-- ALERTS TABLE
-- ============================================
create table if not exists public.alerts (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles on delete cascade not null,
  type text not null check (type in ('rate', 'reminder', 'promo')),
  currency text,
  target_rate decimal,
  reminder_date timestamptz,
  message text,
  active boolean default true,
  triggered_at timestamptz,
  created_at timestamptz default now()
);

-- Enable RLS
alter table public.alerts enable row level security;

-- Policies
create policy "Users can view own alerts" on public.alerts
  for select using (auth.uid() = user_id);

create policy "Users can insert own alerts" on public.alerts
  for insert with check (auth.uid() = user_id);

create policy "Users can update own alerts" on public.alerts
  for update using (auth.uid() = user_id);

create policy "Users can delete own alerts" on public.alerts
  for delete using (auth.uid() = user_id);

-- Index
create index idx_alerts_user_id on public.alerts(user_id);

-- ============================================
-- FAMILY GROUPS TABLE
-- ============================================
create table if not exists public.family_groups (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  destination_country text not null,
  monthly_goal decimal default 0,
  created_by uuid references public.profiles on delete set null,
  invite_code text unique default substr(md5(random()::text), 1, 8),
  created_at timestamptz default now()
);

-- Enable RLS
alter table public.family_groups enable row level security;

-- ============================================
-- FAMILY MEMBERS TABLE
-- ============================================
create table if not exists public.family_members (
  id uuid default uuid_generate_v4() primary key,
  group_id uuid references public.family_groups on delete cascade not null,
  user_id uuid references public.profiles on delete cascade not null,
  role text default 'member' check (role in ('admin', 'member')),
  joined_at timestamptz default now(),
  unique(group_id, user_id)
);

-- Enable RLS
alter table public.family_members enable row level security;

-- Policies for family
create policy "Members can view their groups" on public.family_groups
  for select using (
    id in (select group_id from public.family_members where user_id = auth.uid())
  );

create policy "Members can view group members" on public.family_members
  for select using (
    group_id in (select group_id from public.family_members where user_id = auth.uid())
  );

-- ============================================
-- FEEDBACK TABLE
-- ============================================
create table if not exists public.feedback (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles on delete set null,
  category text not null check (category in ('bug', 'feature', 'general')),
  rating int not null check (rating >= 1 and rating <= 5),
  message text,
  status text default 'new' check (status in ('new', 'reviewed', 'resolved')),
  created_at timestamptz default now()
);

-- Enable RLS
alter table public.feedback enable row level security;

-- Policy - anyone can insert feedback
create policy "Anyone can submit feedback" on public.feedback
  for insert with check (true);

create policy "Users can view own feedback" on public.feedback
  for select using (auth.uid() = user_id);

-- ============================================
-- EXCHANGE RATES CACHE TABLE
-- ============================================
create table if not exists public.exchange_rates (
  id uuid default uuid_generate_v4() primary key,
  base_currency text default 'USD',
  target_currency text not null,
  rate decimal not null,
  source text default 'api',
  updated_at timestamptz default now(),
  unique(base_currency, target_currency)
);

-- No RLS needed - public read access
alter table public.exchange_rates enable row level security;

create policy "Anyone can read exchange rates" on public.exchange_rates
  for select using (true);

-- ============================================
-- REFERRALS TABLE
-- ============================================
create table if not exists public.referrals (
  id uuid default uuid_generate_v4() primary key,
  referrer_id uuid references public.profiles on delete cascade not null,
  referred_id uuid references public.profiles on delete cascade not null,
  reward_amount decimal default 5.00,
  status text default 'pending' check (status in ('pending', 'completed', 'paid')),
  created_at timestamptz default now(),
  completed_at timestamptz
);

-- Enable RLS
alter table public.referrals enable row level security;

create policy "Users can view own referrals" on public.referrals
  for select using (auth.uid() = referrer_id or auth.uid() = referred_id);

-- ============================================
-- FUNCTIONS
-- ============================================

-- Function to update user stats after transaction
create or replace function public.update_user_stats()
returns trigger as $$
begin
  update public.profiles
  set 
    total_sent = total_sent + new.amount,
    total_saved = total_saved + new.cashback_earned,
    cashback_balance = cashback_balance + new.cashback_earned,
    updated_at = now()
  where id = new.user_id;
  
  -- Update user level based on total sent
  update public.profiles
  set user_level = case
    when total_sent >= 10000 then 'platinum'
    when total_sent >= 5000 then 'gold'
    when total_sent >= 1000 then 'silver'
    else 'bronze'
  end
  where id = new.user_id;
  
  return new;
end;
$$ language plpgsql security definer;

create trigger on_transaction_created
  after insert on public.transactions
  for each row execute procedure public.update_user_stats();

-- ============================================
-- INITIAL DATA
-- ============================================

-- Insert initial exchange rates
insert into public.exchange_rates (target_currency, rate) values
  ('MXN', 17.15),
  ('GTQ', 7.78),
  ('COP', 4150),
  ('DOP', 58.50),
  ('PEN', 3.72),
  ('HNL', 24.85),
  ('BRL', 5.05),
  ('ARS', 875.00)
on conflict (base_currency, target_currency) do update set
  rate = excluded.rate,
  updated_at = now();
