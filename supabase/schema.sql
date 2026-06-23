create type public.portal_role as enum ('Admin', 'Teacher', 'Accounts', 'Parent');
create type public.request_status as enum ('Pending', 'Approved', 'Rejected');
create type public.fee_status as enum ('Paid', 'Pending', 'Overdue');

create table public.staff_profiles (
  id uuid primary key default gen_random_uuid(),
  role public.portal_role not null check (role in ('Teacher', 'Accounts', 'Admin')),
  name text not null,
  employee_id text not null unique,
  email text not null unique,
  password_hash text,
  standards text[] default '{}',
  divisions text[] default '{}',
  status public.request_status not null default 'Pending',
  approved_by uuid references public.staff_profiles(id),
  approved_at timestamptz,
  created_at timestamptz not null default now()
);

create table public.parent_profiles (
  id uuid primary key default gen_random_uuid(),
  auth_user_id uuid unique,
  name text not null,
  email text not null unique,
  created_at timestamptz not null default now()
);

create table public.students (
  id uuid primary key default gen_random_uuid(),
  student_code text unique,
  name text not null,
  standard text not null,
  division text not null,
  garden_number text not null,
  parent_id uuid references public.parent_profiles(id),
  guardian_name text not null,
  guardian_contact text not null,
  guardian_email text,
  fee_status public.fee_status not null default 'Pending',
  outstanding_balance numeric not null default 0,
  total_annual_fee numeric not null default 0,
  access_status public.request_status not null default 'Pending',
  approved_by uuid references public.staff_profiles(id),
  approved_at timestamptz,
  created_at timestamptz not null default now()
);

create table public.access_requests (
  id uuid primary key default gen_random_uuid(),
  role public.portal_role not null,
  status public.request_status not null default 'Pending',
  name text not null,
  email text not null,
  employee_id text,
  requested_password_hash text,
  standards text[] default '{}',
  divisions text[] default '{}',
  student_name text,
  standard text,
  division text,
  garden_number text,
  student_id uuid references public.students(id),
  rejection_category text,
  rejection_reason text,
  approved_by uuid references public.staff_profiles(id),
  approved_at timestamptz,
  created_at timestamptz not null default now()
);

create table public.student_marks (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.students(id) on delete cascade,
  subject text not null,
  marks_secured numeric not null default 0,
  max_marks numeric not null default 100,
  grade text not null default '',
  updated_by uuid references public.staff_profiles(id),
  updated_at timestamptz not null default now()
);

create table public.fee_items (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.students(id) on delete cascade,
  name text not null,
  amount numeric not null,
  due_date date,
  status public.fee_status not null default 'Pending',
  category text,
  updated_by uuid references public.staff_profiles(id),
  updated_at timestamptz not null default now()
);

create table public.fee_transactions (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.students(id) on delete cascade,
  amount numeric not null,
  method text not null default 'Cash',
  notes text,
  receipt_sent boolean not null default false,
  status text not null default 'Recorded',
  void_reason text,
  recorded_by uuid references public.staff_profiles(id),
  recorded_at timestamptz not null default now()
);

create table public.activity_logs (
  id uuid primary key default gen_random_uuid(),
  actor_name text not null,
  actor_role public.portal_role not null,
  action text not null,
  target text not null,
  created_at timestamptz not null default now()
);

create table public.login_events (
  id uuid primary key default gen_random_uuid(),
  role public.portal_role not null,
  email text not null,
  provider text not null default 'password',
  created_at timestamptz not null default now()
);

alter table public.staff_profiles enable row level security;
alter table public.parent_profiles enable row level security;
alter table public.students enable row level security;
alter table public.access_requests enable row level security;
alter table public.student_marks enable row level security;
alter table public.fee_items enable row level security;
alter table public.fee_transactions enable row level security;
alter table public.activity_logs enable row level security;
alter table public.login_events enable row level security;

create policy "development read staff profiles" on public.staff_profiles for select using (true);
create policy "development write staff profiles" on public.staff_profiles for all using (true) with check (true);
create policy "development read parent profiles" on public.parent_profiles for select using (true);
create policy "development write parent profiles" on public.parent_profiles for all using (true) with check (true);
create policy "development read students" on public.students for select using (true);
create policy "development write students" on public.students for all using (true) with check (true);
create policy "development read access requests" on public.access_requests for select using (true);
create policy "development write access requests" on public.access_requests for all using (true) with check (true);
create policy "development read student marks" on public.student_marks for select using (true);
create policy "development write student marks" on public.student_marks for all using (true) with check (true);
create policy "development read fee items" on public.fee_items for select using (true);
create policy "development write fee items" on public.fee_items for all using (true) with check (true);
create policy "development read fee transactions" on public.fee_transactions for select using (true);
create policy "development write fee transactions" on public.fee_transactions for all using (true) with check (true);
create policy "development read activity logs" on public.activity_logs for select using (true);
create policy "development write activity logs" on public.activity_logs for all using (true) with check (true);
create policy "development read login events" on public.login_events for select using (true);
create policy "development write login events" on public.login_events for all using (true) with check (true);
