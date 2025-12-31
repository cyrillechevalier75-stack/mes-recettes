-- Drop the old table if it exists to ensure a clean start with correct column names
DROP TABLE IF EXISTS public.recipes;

-- Create the recipes table with columns matching the React code (camelCase)
CREATE TABLE public.recipes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    emoji TEXT,
    "baseServings" INT DEFAULT 4,
    ingredients JSONB DEFAULT '[]'::jsonb,
    steps JSONB DEFAULT '[]'::jsonb,
    color TEXT DEFAULT 'bg-orange-100',
    category TEXT,
    created_at BIGINT DEFAULT extract(epoch from now()) * 1000
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.recipes ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows public access
CREATE POLICY "Allow public access" ON public.recipes
    FOR ALL
    USING (true)
    WITH CHECK (true);
