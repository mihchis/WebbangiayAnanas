-- Database Initialization Script for WebbangiayAnanas

-- Create Enum Types
CREATE TYPE user_role_enum AS ENUM ('user', 'staff', 'admin');
CREATE TYPE product_style_enum AS ENUM ('high-top', 'low-top', 'slip-on');
CREATE TYPE product_gender_enum AS ENUM ('men', 'women', 'unisex');
CREATE TYPE order_status_enum AS ENUM ('pending', 'paid', 'shipped', 'delivered', 'cancelled');

-- 1. Users Table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    "passwordHash" VARCHAR(255) NOT NULL,
    "firstName" VARCHAR(255),
    "lastName" VARCHAR(255),
    role user_role_enum DEFAULT 'user',
    "isEmailVerified" BOOLEAN DEFAULT FALSE,
    "emailVerificationToken" VARCHAR(255),
    "passwordResetToken" VARCHAR(255),
    "twoFactorSecret" VARCHAR(255),
    "isTwoFactorEnabled" BOOLEAN DEFAULT FALSE,
    "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
    "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW()
);

-- 2. Products Table
CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    sku VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    price DECIMAL(12, 2) NOT NULL,
    "originalPrice" DECIMAL(12, 2),
    style product_style_enum NOT NULL,
    gender product_gender_enum DEFAULT 'unisex',
    "isSale" BOOLEAN DEFAULT FALSE,
    "discountPercent" INTEGER DEFAULT 0,
    "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
    "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW()
);

-- 3. Colors Table
CREATE TABLE IF NOT EXISTS colors (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL,
    "hexCode" VARCHAR(255) UNIQUE NOT NULL
);

-- 4. Sizes Table
CREATE TABLE IF NOT EXISTS sizes (
    id SERIAL PRIMARY KEY,
    value VARCHAR(50) UNIQUE NOT NULL
);

-- 5. Product Variants (Color + Size combo with stock)
CREATE TABLE IF NOT EXISTS product_variants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    color_id INTEGER REFERENCES colors(id) ON DELETE RESTRICT,
    size_id INTEGER REFERENCES sizes(id) ON DELETE RESTRICT,
    stock INTEGER DEFAULT 0,
    UNIQUE(product_id, color_id, size_id)
);

-- 6. Product Images (Mapped by product and optionally by color)
CREATE TABLE IF NOT EXISTS product_images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    color_id INTEGER REFERENCES colors(id) ON DELETE SET NULL,
    url VARCHAR(500) NOT NULL,
    "isPrimary" BOOLEAN DEFAULT FALSE
);

-- 7. Orders Table
CREATE TABLE IF NOT EXISTS orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    status order_status_enum DEFAULT 'pending',
    "totalAmount" DECIMAL(12, 2) NOT NULL,
    "fullName" VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    address TEXT NOT NULL,
    note TEXT,
    "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
    "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW()
);

-- 8. Order Items Table
CREATE TABLE IF NOT EXISTS order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    product_variant_id UUID REFERENCES product_variants(id) ON DELETE RESTRICT,
    price DECIMAL(12, 2) NOT NULL,
    quantity INTEGER DEFAULT 1
);

-- ==========================================
-- PostgreSQL FULL-TEXT SEARCH GIN INDEX SETUP
-- ==========================================

-- Add the generated tsvector column for automatic search updates
-- We use 'simple' dictionary which preserves brand names (Vintas, Ananas) and Vietnamese diacritics
ALTER TABLE products DROP COLUMN IF EXISTS search_vector;
ALTER TABLE products ADD COLUMN search_vector tsvector GENERATED ALWAYS AS (
    to_tsvector('simple', coalesce(name, '') || ' ' || coalesce(description, '') || ' ' || coalesce(sku, ''))
) STORED;

-- Create GIN index for high-speed full-text queries
CREATE INDEX IF NOT EXISTS idx_products_search_vector ON products USING gin(search_vector);
