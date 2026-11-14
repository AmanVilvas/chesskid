ALTER TABLE users DROP CONSTRAINT IF EXISTS users_role_check;
ALTER TABLE users ADD CONSTRAINT users_role_check CHECK (role IN ('learner', 'admin', 'instructor'));

CREATE TABLE IF NOT EXISTS course_instructors (
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  assigned_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (course_id, user_id)
);

CREATE TABLE IF NOT EXISTS coupons (
  id UUID PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  discount_percent SMALLINT NOT NULL CHECK (discount_percent BETWEEN 1 AND 100),
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  starts_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  max_redemptions INTEGER CHECK (max_redemptions IS NULL OR max_redemptions > 0),
  redeemed_count INTEGER NOT NULL DEFAULT 0 CHECK (redeemed_count >= 0),
  active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE orders ADD COLUMN IF NOT EXISTS discount_minor INTEGER NOT NULL DEFAULT 0 CHECK (discount_minor >= 0);
ALTER TABLE orders ADD COLUMN IF NOT EXISTS coupon_id UUID REFERENCES coupons(id) ON DELETE SET NULL;
ALTER TABLE enrollments ADD COLUMN IF NOT EXISTS expires_at TIMESTAMPTZ;
CREATE INDEX IF NOT EXISTS enrollments_expiry_idx ON enrollments(expires_at);

CREATE TABLE IF NOT EXISTS course_subscription_plans (
  course_id UUID PRIMARY KEY REFERENCES courses(id) ON DELETE CASCADE,
  razorpay_plan_id TEXT NOT NULL UNIQUE,
  price_paise INTEGER NOT NULL CHECK (price_paise >= 100),
  period TEXT NOT NULL CHECK (period IN ('weekly', 'monthly', 'quarterly', 'yearly')),
  interval_count SMALLINT NOT NULL DEFAULT 1 CHECK (interval_count > 0),
  active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS course_subscriptions (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE RESTRICT,
  razorpay_subscription_id TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL CHECK (status IN ('created', 'authenticated', 'active', 'pending', 'halted', 'cancelled', 'completed')),
  current_end TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, course_id, razorpay_subscription_id)
);
CREATE INDEX IF NOT EXISTS course_subscriptions_user_course_idx ON course_subscriptions(user_id, course_id, status);
