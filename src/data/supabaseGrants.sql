-- ============================================================
-- Jibly Express — Grant Permissions للـ anon role
-- ============================================================
-- شغل هاد الـ SQL فـ SQL Editor ديال Supabase

-- Grant full permissions on all tables to anon role
GRANT ALL ON TABLE public.teams TO anon;
GRANT ALL ON TABLE public.drivers TO anon;
GRANT ALL ON TABLE public.orders TO anon;
GRANT ALL ON TABLE public.customers TO anon;
GRANT ALL ON TABLE public.activity_logs TO anon;

-- Grant also to authenticated role (for future auth)
GRANT ALL ON TABLE public.teams TO authenticated;
GRANT ALL ON TABLE public.drivers TO authenticated;
GRANT ALL ON TABLE public.orders TO authenticated;
GRANT ALL ON TABLE public.customers TO authenticated;
GRANT ALL ON TABLE public.activity_logs TO authenticated;

-- Grant sequence usage (for activity_logs SERIAL id)
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO anon;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO authenticated;
