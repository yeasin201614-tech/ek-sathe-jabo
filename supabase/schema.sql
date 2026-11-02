-- ===============================================================
-- EK SATHE JABO — BANGLADESH BUS TICKET BOOKING SAAS PLATFORM
-- COMPLETE SUPABASE POSTGRESQL SCHEMA WITH ROW LEVEL SECURITY (RLS)
-- ===============================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. User Profiles Table (Linked to Supabase Auth)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT,
  role TEXT NOT NULL DEFAULT 'passenger' CHECK (role IN ('passenger', 'operator', 'admin')),
  operator_id TEXT,
  photo_url TEXT,
  preferred_language TEXT DEFAULT 'en' CHECK (preferred_language IN ('en', 'bn')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Trigger to create public.profiles entry upon user sign-up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email, phone, role)
  VALUES (
    NEW.id,
    COALESPE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'phone', ''),
    'passenger' -- Strict security: always default to passenger
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 3. Bus Operators Table
CREATE TABLE IF NOT EXISTS public.operators (
  id TEXT PRIMARY KEY,
  operator_name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  logo_url TEXT,
  contact_phone TEXT NOT NULL,
  contact_email TEXT NOT NULL,
  address TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'pending')),
  rating NUMERIC(3, 1) DEFAULT 4.8,
  bus_categories TEXT[] DEFAULT '{}',
  popular_routes TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Bus Fleet Table
CREATE TABLE IF NOT EXISTS public.buses (
  id TEXT PRIMARY KEY,
  operator_id TEXT NOT NULL REFERENCES public.operators(id) ON DELETE CASCADE,
  bus_name TEXT NOT NULL,
  registration_number TEXT NOT NULL UNIQUE,
  bus_type TEXT NOT NULL CHECK (bus_type IN ('AC', 'Non-AC')),
  category TEXT NOT NULL CHECK (category IN ('Business Class', 'Sleeper Coach', 'Executive Chair', 'Economy Seater')),
  seat_layout TEXT NOT NULL DEFAULT '2x2' CHECK (seat_layout IN ('2x2', '2x1')),
  total_seats INT NOT NULL DEFAULT 36,
  amenities TEXT[] DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'maintenance')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Routes Table
CREATE TABLE IF NOT EXISTS public.routes (
  id TEXT PRIMARY KEY,
  origin TEXT NOT NULL,
  destination TEXT NOT NULL,
  distance_km INT NOT NULL,
  duration_minutes INT NOT NULL,
  duration_formatted TEXT NOT NULL,
  boarding_points TEXT[] NOT NULL DEFAULT '{}',
  dropping_points TEXT[] NOT NULL DEFAULT '{}',
  base_fare INT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive'))
);

-- 6. Scheduled Trips Table
CREATE TABLE IF NOT EXISTS public.trips (
  id TEXT PRIMARY KEY,
  bus_id TEXT NOT NULL REFERENCES public.buses(id) ON DELETE CASCADE,
  operator_id TEXT NOT NULL REFERENCES public.operators(id) ON DELETE CASCADE,
  operator_name TEXT NOT NULL,
  operator_logo TEXT,
  route_id TEXT NOT NULL REFERENCES public.routes(id) ON DELETE CASCADE,
  origin TEXT NOT NULL,
  destination TEXT NOT NULL,
  journey_date DATE NOT NULL,
  departure_time TEXT NOT NULL,
  arrival_time TEXT NOT NULL,
  duration_formatted TEXT NOT NULL,
  bus_name TEXT NOT NULL,
  bus_type TEXT NOT NULL,
  category TEXT NOT NULL,
  fare INT NOT NULL,
  seat_inventory JSONB NOT NULL DEFAULT '{}'::jsonb,
  available_seat_count INT NOT NULL,
  total_seats INT NOT NULL,
  amenities TEXT[] DEFAULT '{}',
  boarding_points TEXT[] DEFAULT '{}',
  dropping_points TEXT[] DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'running', 'completed', 'cancelled')),
  rating NUMERIC(3, 1) DEFAULT 4.8,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Seat Holds Table (Temporary 5-minute hold to prevent double-booking)
CREATE TABLE IF NOT EXISTS public.seat_holds (
  id TEXT PRIMARY KEY,
  trip_id TEXT NOT NULL REFERENCES public.trips(id) ON DELETE CASCADE,
  seat_numbers TEXT[] NOT NULL,
  user_id TEXT NOT NULL,
  user_session TEXT NOT NULL,
  expires_at BIGINT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'expired', 'converted', 'released'))
);

-- 8. Bookings Table
CREATE TABLE IF NOT EXISTS public.bookings (
  id TEXT PRIMARY KEY,
  booking_reference TEXT NOT NULL UNIQUE,
  user_id TEXT NOT NULL,
  trip_id TEXT NOT NULL REFERENCES public.trips(id) ON DELETE CASCADE,
  operator_id TEXT NOT NULL REFERENCES public.operators(id),
  operator_name TEXT NOT NULL,
  bus_name TEXT NOT NULL,
  bus_type TEXT NOT NULL,
  category TEXT NOT NULL,
  origin TEXT NOT NULL,
  destination TEXT NOT NULL,
  journey_date DATE NOT NULL,
  departure_time TEXT NOT NULL,
  arrival_time TEXT NOT NULL,
  boarding_point TEXT NOT NULL,
  dropping_point TEXT NOT NULL,
  passenger_details JSONB NOT NULL DEFAULT '[]'::jsonb,
  primary_contact JSONB NOT NULL,
  selected_seats TEXT[] NOT NULL,
  seat_count INT NOT NULL,
  subtotal INT NOT NULL,
  seat_charge INT NOT NULL DEFAULT 0,
  discount INT NOT NULL DEFAULT 0,
  coupon_code TEXT,
  total_amount INT NOT NULL,
  payment_status TEXT NOT NULL DEFAULT 'UNPAID' CHECK (payment_status IN ('UNPAID', 'VERIFIED', 'FAILED', 'REFUNDED')),
  booking_status TEXT NOT NULL DEFAULT 'PENDING' CHECK (booking_status IN ('CONFIRMED', 'CANCELLED', 'PENDING')),
  qr_code_token TEXT NOT NULL,
  payment_id TEXT,
  transaction_reference TEXT,
  payment_method TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. Payments Table
CREATE TABLE IF NOT EXISTS public.payments (
  id TEXT PRIMARY KEY,
  booking_id TEXT NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
  booking_reference TEXT NOT NULL,
  user_id TEXT NOT NULL,
  provider TEXT NOT NULL CHECK (provider IN ('bkash', 'nagad', 'rocket', 'card', 'demo')),
  amount INT NOT NULL,
  currency TEXT NOT NULL DEFAULT 'BDT',
  transaction_reference TEXT NOT NULL UNIQUE,
  account_number TEXT,
  payment_status TEXT NOT NULL DEFAULT 'VERIFIED' CHECK (payment_status IN ('VERIFIED', 'FAILED', 'PENDING', 'REFUNDED')),
  verified_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. Coupons Table
CREATE TABLE IF NOT EXISTS public.coupons (
  id TEXT PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  discount_type TEXT NOT NULL CHECK (discount_type IN ('percentage', 'fixed')),
  discount_value INT NOT NULL,
  minimum_purchase INT NOT NULL DEFAULT 0,
  maximum_discount INT,
  usage_limit INT DEFAULT 1000,
  used_count INT DEFAULT 0,
  expiry_date DATE NOT NULL,
  active BOOLEAN NOT NULL DEFAULT TRUE,
  description TEXT NOT NULL
);

-- 11. Customer Support Tickets Table
CREATE TABLE IF NOT EXISTS public.support_tickets (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  user_name TEXT NOT NULL,
  user_email TEXT NOT NULL,
  booking_reference TEXT,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'resolved')),
  admin_reply TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===============================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ===============================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.operators ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.buses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.routes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trips ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.seat_holds ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.support_tickets ENABLE ROW LEVEL SECURITY;

-- Helper to check if current user is admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Profiles: Users can read and update their own profile; admins read all
CREATE POLICY "Profiles are viewable by owner or admin"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id OR public.is_admin());

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id AND role = 'passenger');

-- Operators: Anyone can view active operators
CREATE POLICY "Public operators view"
  ON public.operators FOR SELECT
  USING (status = 'active' OR public.is_admin());

CREATE POLICY "Admin manage operators"
  ON public.operators FOR ALL
  USING (public.is_admin());

-- Buses & Routes: Public view; Admin write
CREATE POLICY "Public buses view"
  ON public.buses FOR SELECT
  USING (TRUE);

CREATE POLICY "Admin manage buses"
  ON public.buses FOR ALL
  USING (public.is_admin());

CREATE POLICY "Public routes view"
  ON public.routes FOR SELECT
  USING (status = 'active' OR public.is_admin());

CREATE POLICY "Admin manage routes"
  ON public.routes FOR ALL
  USING (public.is_admin());

-- Trips: Public view scheduled trips
CREATE POLICY "Public trips view"
  ON public.trips FOR SELECT
  USING (status = 'scheduled' OR public.is_admin());

CREATE POLICY "Admin manage trips"
  ON public.trips FOR ALL
  USING (public.is_admin());

-- Bookings: Passenger view own bookings; Operator view assigned bookings; Admin view all
CREATE POLICY "Passenger view own bookings"
  ON public.bookings FOR SELECT
  USING (
    user_id = auth.uid()::text 
    OR public.is_admin()
    OR EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() AND profiles.operator_id = bookings.operator_id
    )
  );

CREATE POLICY "Passenger create pending booking"
  ON public.bookings FOR INSERT
  WITH CHECK (payment_status = 'UNPAID' AND booking_status = 'PENDING');

-- Payments: Only viewable by owner or admin
CREATE POLICY "View own payments"
  ON public.payments FOR SELECT
  USING (user_id = auth.uid()::text OR public.is_admin());

-- Coupons: Public read active coupons
CREATE POLICY "Public view active coupons"
  ON public.coupons FOR SELECT
  USING (active = TRUE OR public.is_admin());

-- Support Tickets: User manage own tickets; Admin manage all
CREATE POLICY "User manage own tickets"
  ON public.support_tickets FOR ALL
  USING (user_id = auth.uid()::text OR public.is_admin());

-- ===============================================================
-- INITIAL BANGLADESH SEED DATA
-- ===============================================================

INSERT INTO public.operators (id, operator_name, slug, logo_url, contact_phone, contact_email, address, rating, bus_categories, popular_routes)
VALUES
('op-greenline', 'Green Line Paribahan', 'green-line', 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=120&auto=format&fit=crop&q=80', '+880 1711-547788', 'support@greenlinebd.com', '9/2 Outer Circular Road, Rajarbagh, Dhaka', 4.8, ARRAY['Double Decker', 'Scania Multi-Axle', 'Sleeper Coach'], ARRAY['Dhaka - Chattogram', 'Dhaka - Cox''s Bazar', 'Dhaka - Sylhet']),
('op-shohagh', 'Shohagh Paribahan', 'shohagh', 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=120&auto=format&fit=crop&q=80', '+880 1711-612433', 'care@shohagh.com', '63 DIT Road, Malibagh, Dhaka', 4.9, ARRAY['Scania Multi-Axle', 'Hyundai Universe Suite'], ARRAY['Dhaka - Chattogram', 'Dhaka - Cox''s Bazar', 'Dhaka - Khulna']),
('op-hanif', 'Hanif Enterprise', 'hanif', 'https://images.unsplash.com/photo-1596706918840-7cf1615f7958?w=120&auto=format&fit=crop&q=80', '+880 1713-049533', 'info@hanifenterprise.com', 'Panthapath, Green Road, Dhaka', 4.6, ARRAY['Volvo B11R AC', 'Hino 1J Non-AC'], ARRAY['Dhaka - Rajshahi', 'Dhaka - Rangpur', 'Dhaka - Chattogram']),
('op-shyamoli', 'Shyamoli Paribahan (NR)', 'shyamoli', 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=120&auto=format&fit=crop&q=80', '+880 1711-304746', 'contact@shyamolibd.com', 'Sayedabad Bus Terminal, Dhaka', 4.7, ARRAY['Volvo Multi-Axle', 'Hyundai AC'], ARRAY['Dhaka - Sylhet', 'Dhaka - Barishal', 'Dhaka - Rajshahi']),
('op-desh', 'Desh Travels', 'desh-travels', 'https://images.unsplash.com/photo-1494515843206-f3117d3f51b7?w=120&auto=format&fit=crop&q=80', '+880 1762-684400', 'support@deshtravelsbd.com', 'Gabtoli Interdistrict Bus Terminal, Dhaka', 4.7, ARRAY['Hyundai Universe Luxury Class'], ARRAY['Dhaka - Rajshahi', 'Dhaka - Rangpur', 'Dhaka - Kushtia']),
('op-saintmartin', 'Saintmartin Paribahan', 'saintmartin', 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=120&auto=format&fit=crop&q=80', '+880 1819-338877', 'booking@saintmartinparibahan.com', 'Fakirapool, Motijheel, Dhaka', 4.8, ARRAY['Scania Sleeper Coach', 'Mercedes-Benz AC'], ARRAY['Dhaka - Cox''s Bazar', 'Dhaka - Chattogram'])
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.coupons (id, code, discount_type, discount_value, minimum_purchase, maximum_discount, usage_limit, expiry_date, active, description)
VALUES
('c-first50', 'FIRST50', 'fixed', 50, 500, 50, 5000, '2027-12-31', TRUE, 'Flat ৳50 discount for first-time bookings'),
('c-save100', 'SAVE100', 'fixed', 100, 1000, 100, 3000, '2027-12-31', TRUE, 'Flat ৳100 off on ticket orders of ৳1,000 or more'),
('c-travel10', 'TRAVEL10', 'percentage', 10, 800, 250, 2000, '2027-12-31', TRUE, '10% instant discount up to ৳250')
ON CONFLICT (id) DO NOTHING;
