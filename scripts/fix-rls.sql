-- ═══════════════════════════════════════════════════════
-- Fix RLS — TB Calculator (analytics)
-- รันที่: Supabase Dashboard → SQL Editor → New Query → Run
--
-- จุดประสงค์: ป้องกัน anon key (ที่อยู่ใน analytics.js) ถูกใช้
--           ลบ/แก้ไขข้อมูล analytics ผ่าน REST API
-- ═══════════════════════════════════════════════════════

alter table public.visits       enable row level security;
alter table public.calculations enable row level security;
alter table public.fdc_reverse  enable row level security;
alter table public.events       enable row level security;

drop policy if exists "visits insert"        on public.visits;
drop policy if exists "visits select count"  on public.visits;
drop policy if exists "visits update self"   on public.visits;
drop policy if exists "calculations insert"  on public.calculations;
drop policy if exists "fdc_reverse insert"   on public.fdc_reverse;
drop policy if exists "events insert"        on public.events;

-- visits — INSERT (track new visit) + SELECT (สำหรับนับสถิติบนเว็บ) + UPDATE (บันทึก duration)
create policy "visits insert"
  on public.visits for insert to anon with check (true);

create policy "visits select count"
  on public.visits for select to anon using (true);

create policy "visits update self"
  on public.visits for update to anon using (true) with check (true);

-- calculations / fdc_reverse / events — INSERT only
create policy "calculations insert"
  on public.calculations for insert to anon with check (true);

create policy "fdc_reverse insert"
  on public.fdc_reverse for insert to anon with check (true);

create policy "events insert"
  on public.events for insert to anon with check (true);

-- หมายเหตุ: ถ้า Supabase Dashboard มี policy "allow all" หรือ APPLIED TO = public
-- ต้องลบทิ้งด้วยตัวเอง (Authentication → Policies → จุดสามจุด → Delete)
