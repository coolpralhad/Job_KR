-- ============================================================
-- JOB-KR Supabase Schema
-- Run this in the Supabase SQL Editor (Project Settings > SQL Editor)
-- ============================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ─── PROFILES ────────────────────────────────────────────────────────────────

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role text not null check (role in ('candidate', 'employer', 'admin')),
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Users can read own profile" on public.profiles
  for select using (auth.uid() = id);

create policy "Users can update own profile" on public.profiles
  for update using (auth.uid() = id);

create policy "Admins can read all profiles" on public.profiles
  for select using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

-- ─── CANDIDATE PROFILES ──────────────────────────────────────────────────────

create table if not exists public.candidate_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  career_goals text[],
  location text,
  work_status text,
  visa_type text,
  topik_level text,
  available_from date,
  skills text[],
  experience_years integer,
  current_title text,
  industry text,
  languages jsonb,
  onboarding_step integer not null default 0
);

alter table public.candidate_profiles enable row level security;

create policy "Candidates can read/write own profile" on public.candidate_profiles
  for all using (auth.uid() = id);

create policy "Employers can view candidate profiles" on public.candidate_profiles
  for select using (
    exists (select 1 from public.profiles where id = auth.uid() and role in ('employer', 'admin'))
  );

-- ─── COMPANIES ───────────────────────────────────────────────────────────────

create table if not exists public.companies (
  id uuid primary key default uuid_generate_v4(),
  legal_name text not null,
  display_name text,
  industry text,
  size text,
  city text,
  website text,
  description text,
  business_reg_number text unique,
  verification_status text not null default 'pending' check (verification_status in ('pending', 'approved', 'rejected', 'info_requested')),
  verification_doc_path text,
  verified_at timestamptz,
  logo_url text,
  created_at timestamptz not null default now()
);

alter table public.companies enable row level security;

create policy "Employers can view all companies" on public.companies
  for select using (true);

create policy "Employer can update own company" on public.companies
  for update using (
    exists (select 1 from public.employer_profiles where company_id = companies.id and id = auth.uid())
  );

create policy "Admins can manage companies" on public.companies
  for all using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

-- ─── EMPLOYER PROFILES ───────────────────────────────────────────────────────

create table if not exists public.employer_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  company_id uuid references public.companies(id),
  job_title text
);

alter table public.employer_profiles enable row level security;

create policy "Employers can read/write own profile" on public.employer_profiles
  for all using (auth.uid() = id);

create policy "Admins can read all employer profiles" on public.employer_profiles
  for select using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

-- ─── JOBS ────────────────────────────────────────────────────────────────────

create table if not exists public.jobs (
  id uuid primary key default uuid_generate_v4(),
  company_id uuid not null references public.companies(id) on delete cascade,
  title text not null,
  city text,
  industry text,
  job_type text,
  workplace_type text,
  salary_min integer,
  salary_max integer,
  description text,
  requirements jsonb,
  benefits text[],
  visa_types text[],
  korean_level text,
  english_required text,
  international_applicants text,
  sponsorship text,
  relocation text,
  overseas_applicants text,
  deadline date,
  questions jsonb,
  topik_level text,
  experience_years text,
  status text not null default 'draft' check (status in ('draft', 'pending_payment', 'under_review', 'active', 'paused', 'closed')),
  payment_status text not null default 'unpaid' check (payment_status in ('unpaid', 'pending_confirmation', 'paid')),
  posted_at timestamptz,
  created_at timestamptz not null default now()
);

alter table public.jobs enable row level security;

create policy "Anyone can view active jobs" on public.jobs
  for select using (status = 'active' or auth.uid() is not null);

create policy "Employers can manage own jobs" on public.jobs
  for all using (
    exists (
      select 1 from public.employer_profiles ep
      where ep.id = auth.uid() and ep.company_id = jobs.company_id
    )
  );

create policy "Admins can manage all jobs" on public.jobs
  for all using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

-- ─── APPLICATIONS ────────────────────────────────────────────────────────────

create table if not exists public.applications (
  id uuid primary key default uuid_generate_v4(),
  job_id uuid not null references public.jobs(id) on delete cascade,
  candidate_id uuid not null references auth.users(id) on delete cascade,
  status text not null default 'applied' check (status in ('applied', 'viewed', 'shortlisted', 'interview', 'offer', 'hired', 'rejected')),
  cover_message text,
  applied_at timestamptz not null default now(),
  notes text,
  answers jsonb,
  unique(job_id, candidate_id)
);

alter table public.applications enable row level security;

create policy "Candidates can view own applications" on public.applications
  for select using (auth.uid() = candidate_id);

create policy "Candidates can insert applications" on public.applications
  for insert with check (auth.uid() = candidate_id);

create policy "Employers can view/update applications for their jobs" on public.applications
  for all using (
    exists (
      select 1 from public.jobs j
      join public.employer_profiles ep on ep.company_id = j.company_id
      where j.id = applications.job_id and ep.id = auth.uid()
    )
  );

create policy "Admins can view all applications" on public.applications
  for select using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

-- ─── DOCUMENTS ───────────────────────────────────────────────────────────────

create table if not exists public.documents (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  type text not null,
  storage_path text not null,
  uploaded_at timestamptz not null default now(),
  application_id uuid references public.applications(id) on delete set null
);

alter table public.documents enable row level security;

create policy "Users can manage own documents" on public.documents
  for all using (auth.uid() = user_id);

create policy "Employers can view documents for their applicants" on public.documents
  for select using (
    exists (
      select 1 from public.applications a
      join public.jobs j on j.id = a.job_id
      join public.employer_profiles ep on ep.company_id = j.company_id
      where a.id = documents.application_id and ep.id = auth.uid()
    )
  );

-- ─── SAVED JOBS ──────────────────────────────────────────────────────────────

create table if not exists public.saved_jobs (
  candidate_id uuid not null references auth.users(id) on delete cascade,
  job_id uuid not null references public.jobs(id) on delete cascade,
  saved_at timestamptz not null default now(),
  primary key (candidate_id, job_id)
);

alter table public.saved_jobs enable row level security;

create policy "Candidates can manage own saved jobs" on public.saved_jobs
  for all using (auth.uid() = candidate_id);

-- ─── JOB ALERTS ──────────────────────────────────────────────────────────────

create table if not exists public.job_alerts (
  id uuid primary key default uuid_generate_v4(),
  candidate_id uuid not null references auth.users(id) on delete cascade,
  criteria jsonb not null default '{}',
  frequency text not null default 'daily' check (frequency in ('immediately', 'daily', 'weekly')),
  active boolean not null default true,
  created_at timestamptz not null default now(),
  last_sent_at timestamptz
);

alter table public.job_alerts enable row level security;

create policy "Candidates can manage own alerts" on public.job_alerts
  for all using (auth.uid() = candidate_id);

-- ─── PAYMENT RECORDS ─────────────────────────────────────────────────────────

create table if not exists public.payment_records (
  id uuid primary key default uuid_generate_v4(),
  job_id uuid not null references public.jobs(id) on delete cascade,
  amount integer,
  proof_path text,
  reference_code text not null,
  status text not null default 'pending_confirmation' check (status in ('pending_confirmation', 'confirmed', 'rejected')),
  submitted_at timestamptz not null default now(),
  confirmed_at timestamptz,
  confirmed_by uuid references auth.users(id),
  created_at timestamptz not null default now()
);

alter table public.payment_records enable row level security;

create policy "Employers can view own payment records" on public.payment_records
  for select using (
    exists (
      select 1 from public.jobs j
      join public.employer_profiles ep on ep.company_id = j.company_id
      where j.id = payment_records.job_id and ep.id = auth.uid()
    )
  );

create policy "Employers can insert payment records" on public.payment_records
  for insert with check (
    exists (
      select 1 from public.jobs j
      join public.employer_profiles ep on ep.company_id = j.company_id
      where j.id = payment_records.job_id and ep.id = auth.uid()
    )
  );

create policy "Admins can manage all payment records" on public.payment_records
  for all using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

-- ─── ADMIN LOGS ──────────────────────────────────────────────────────────────

create table if not exists public.admin_logs (
  id uuid primary key default uuid_generate_v4(),
  admin_id uuid not null references auth.users(id),
  action text not null,
  target_type text,
  target_id uuid,
  notes text,
  created_at timestamptz not null default now()
);

alter table public.admin_logs enable row level security;

create policy "Admins can manage admin logs" on public.admin_logs
  for all using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

-- ─── EMAIL LOGS ──────────────────────────────────────────────────────────────

create table if not exists public.email_logs (
  id uuid primary key default uuid_generate_v4(),
  sent_by uuid references auth.users(id),
  recipient_email text not null,
  subject text,
  sent_at timestamptz not null default now()
);

alter table public.email_logs enable row level security;

create policy "Admins can read email logs" on public.email_logs
  for select using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

create policy "Authenticated users can insert email logs" on public.email_logs
  for insert with check (auth.uid() is not null);

-- ─── STORAGE BUCKETS ─────────────────────────────────────────────────────────

-- Run these via Supabase Dashboard > Storage, or via the API:
-- 1. Create a bucket named "documents" with public: false
-- 2. Create RLS policies for the bucket allowing:
--    - INSERT for authenticated users (path must start with their user ID)
--    - SELECT for authenticated users (for their own files or employer access)
--    - Service role (admin) full access

-- ─── INITIAL ADMIN USER ──────────────────────────────────────────────────────

-- After creating your admin account via the app, run:
-- UPDATE public.profiles SET role = 'admin' WHERE id = '<your-user-id>';

-- ─── FUNCTIONS ───────────────────────────────────────────────────────────────

-- Automatically create a profile row when a new user signs up
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  -- Profile is created by the app callback, not auto-trigger
  -- This is intentional to support role selection at registration
  return new;
end;
$$;
