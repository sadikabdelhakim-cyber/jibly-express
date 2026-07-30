-- ============================================================
-- Jibly Express — Supabase Database Schema (CLEAN INSTALL)
-- Multi-Tenant Delivery Management Platform
-- ============================================================
-- ⚠️ هاد السكريبت كيحيّد الجداول القديمة ويعاود يخلقهم من الصفر
-- شغلو فـ SQL Editor ديال Supabase

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- حيّد الجداول القديمة (بالترتيب الصحيح للـ foreign keys)
-- ============================================================
DROP TABLE IF EXISTS activity_logs CASCADE;
DROP TABLE IF EXISTS customers CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS drivers CASCADE;
DROP TABLE IF EXISTS teams CASCADE;

-- ============================================================
-- 1. Teams Table (الفرق)
-- ============================================================
CREATE TABLE teams (
  id TEXT PRIMARY KEY DEFAULT ('team-' || uuid_generate_v4()::TEXT),
  name TEXT NOT NULL,
  brand_name TEXT,
  logo TEXT DEFAULT '🚚',
  city TEXT,
  phone TEXT,
  email TEXT,
  address TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'suspended')),
  admin_pin TEXT NOT NULL DEFAULT '0000',
  settings JSONB DEFAULT '{
    "dayDeliveryFee": 25,
    "nightDeliveryFee": 35,
    "nightStartHour": 20,
    "nightEndHour": 6
  }'::JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 2. Drivers Table (الليفرورات)
-- ============================================================
CREATE TABLE drivers (
  id TEXT PRIMARY KEY DEFAULT ('drv-' || uuid_generate_v4()::TEXT),
  team_id TEXT NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  phone TEXT,
  vehicle TEXT,
  vehicle_plate TEXT,
  national_id TEXT,
  status TEXT DEFAULT 'نشيط' CHECK (status IN ('نشيط', 'موقوف')),
  daily_capital_limit INTEGER DEFAULT 1000,
  avatar TEXT DEFAULT '🏍️',
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  notes TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 3. Orders Table (الطلبيات)
-- ============================================================
CREATE TABLE orders (
  id TEXT PRIMARY KEY,
  team_id TEXT NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  customer_name TEXT,
  customer_phone TEXT,
  address TEXT,
  item_list JSONB DEFAULT '[]'::JSONB,
  items TEXT,
  selling_price NUMERIC DEFAULT 0,
  estimated_capital NUMERIC DEFAULT 0,
  delivery_fee NUMERIC DEFAULT 0,
  status TEXT DEFAULT 'available' CHECK (status IN ('available', 'claimed', 'delivered', 'cancelled')),
  claimed_by JSONB,
  claimed_at TIMESTAMPTZ,
  delivered_at TIMESTAMPTZ,
  actual_capital NUMERIC,
  actual_delivery_fee NUMERIC,
  total_collected NUMERIC,
  driver_notes TEXT,
  payment_method TEXT DEFAULT 'cash',
  customer_rating INTEGER CHECK (customer_rating IS NULL OR (customer_rating BETWEEN 1 AND 5)),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 4. Customers Table (قاعدة بيانات الزبناء)
-- ============================================================
CREATE TABLE customers (
  id TEXT PRIMARY KEY DEFAULT ('cust-' || uuid_generate_v4()::TEXT),
  team_id TEXT REFERENCES teams(id) ON DELETE SET NULL,
  phone TEXT NOT NULL,
  name TEXT DEFAULT '',
  address TEXT DEFAULT '',
  order_count INTEGER DEFAULT 0,
  total_spent NUMERIC DEFAULT 0,
  average_rating NUMERIC,
  ratings JSONB DEFAULT '[]'::JSONB,
  last_order_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Unique: one customer per phone per team
CREATE UNIQUE INDEX idx_customers_phone_team 
  ON customers(phone, team_id);

-- ============================================================
-- 5. Activity Logs Table (سجل العمليات)
-- ============================================================
CREATE TABLE activity_logs (
  id SERIAL PRIMARY KEY,
  user_type TEXT CHECK (user_type IN ('super_admin', 'team_admin', 'driver')),
  user_id TEXT,
  team_id TEXT REFERENCES teams(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  details JSONB DEFAULT '{}'::JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 6. Indexes for Performance
-- ============================================================
CREATE INDEX idx_drivers_team_id ON drivers(team_id);
CREATE INDEX idx_orders_team_id ON orders(team_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX idx_orders_customer_phone ON orders(customer_phone);
CREATE INDEX idx_customers_team_id ON customers(team_id);
CREATE INDEX idx_customers_phone ON customers(phone);
CREATE INDEX idx_activity_logs_team_id ON activity_logs(team_id);
CREATE INDEX idx_activity_logs_created_at ON activity_logs(created_at DESC);

-- ============================================================
-- 7. Realtime Publication
-- ============================================================
-- حيت حيّدنا الجداول وعاود خلقناهم، غير نزيدوهم مباشرة
ALTER PUBLICATION supabase_realtime ADD TABLE orders;
ALTER PUBLICATION supabase_realtime ADD TABLE drivers;
ALTER PUBLICATION supabase_realtime ADD TABLE teams;
ALTER PUBLICATION supabase_realtime ADD TABLE customers;

-- ============================================================
-- 8. Row Level Security (RLS)
-- ============================================================
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE drivers ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;

-- Allow all operations for anon key (basic — tighten later)
CREATE POLICY "Allow all for anon" ON teams FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for anon" ON drivers FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for anon" ON orders FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for anon" ON customers FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for anon" ON activity_logs FOR ALL USING (true) WITH CHECK (true);
