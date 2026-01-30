# Database Schema for Supabase

This document describes the database schema for the Iterate SRS application when using Supabase as the backend.

## Overview

The database consists of three main tables:
1. `decks` - Collections of flashcards
2. `cards` - Individual flashcards with FSRS scheduling data
3. `review_logs` - History of review sessions

## SQL Migrations

### Initial Schema

Run this SQL in your Supabase SQL Editor to create the database schema:

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Decks table
CREATE TABLE decks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  created TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  modified TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Cards table
CREATE TABLE cards (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  deck_id UUID REFERENCES decks(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Card content
  front TEXT NOT NULL,
  back TEXT NOT NULL,
  
  -- Metadata
  created TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  modified TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  -- FSRS scheduling data
  due TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  stability REAL NOT NULL DEFAULT 1.0,
  difficulty REAL NOT NULL DEFAULT 5.0,
  elapsed_days INTEGER NOT NULL DEFAULT 0,
  scheduled_days INTEGER NOT NULL DEFAULT 0,
  reps INTEGER NOT NULL DEFAULT 0,
  lapses INTEGER NOT NULL DEFAULT 0,
  state SMALLINT NOT NULL DEFAULT 0, -- 0: New, 1: Learning, 2: Review, 3: Relearning
  last_review TIMESTAMPTZ
);

-- Review logs table
CREATE TABLE review_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  card_id UUID REFERENCES cards(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Review data
  rating SMALLINT NOT NULL, -- 1: Again, 2: Hard, 3: Good, 4: Easy
  state SMALLINT NOT NULL,
  due TIMESTAMPTZ NOT NULL,
  stability REAL NOT NULL,
  difficulty REAL NOT NULL,
  elapsed_days INTEGER NOT NULL,
  scheduled_days INTEGER NOT NULL,
  review TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_cards_deck_id ON cards(deck_id);
CREATE INDEX idx_cards_user_id ON cards(user_id);
CREATE INDEX idx_cards_due ON cards(due);
CREATE INDEX idx_cards_state ON cards(state);
CREATE INDEX idx_decks_user_id ON decks(user_id);
CREATE INDEX idx_review_logs_card_id ON review_logs(card_id);
CREATE INDEX idx_review_logs_user_id ON review_logs(user_id);
CREATE INDEX idx_review_logs_review ON review_logs(review);

-- Updated at trigger function
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.modified = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to tables
CREATE TRIGGER update_decks_modified
  BEFORE UPDATE ON decks
  FOR EACH ROW
  EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER update_cards_modified
  BEFORE UPDATE ON cards
  FOR EACH ROW
  EXECUTE FUNCTION update_modified_column();
```

### Row Level Security (RLS)

Enable RLS to ensure users can only access their own data:

```sql
-- Enable RLS
ALTER TABLE decks ENABLE ROW LEVEL SECURITY;
ALTER TABLE cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE review_logs ENABLE ROW LEVEL SECURITY;

-- Decks policies
CREATE POLICY "Users can view their own decks"
  ON decks FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own decks"
  ON decks FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own decks"
  ON decks FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own decks"
  ON decks FOR DELETE
  USING (auth.uid() = user_id);

-- Cards policies
CREATE POLICY "Users can view their own cards"
  ON cards FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own cards"
  ON cards FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own cards"
  ON cards FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own cards"
  ON cards FOR DELETE
  USING (auth.uid() = user_id);

-- Review logs policies
CREATE POLICY "Users can view their own review logs"
  ON review_logs FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own review logs"
  ON review_logs FOR INSERT
  WITH CHECK (auth.uid() = user_id);
```

### Useful Views

Create views for common queries:

```sql
-- View: Cards due today
CREATE VIEW cards_due_today AS
SELECT 
  c.*,
  d.name AS deck_name
FROM cards c
JOIN decks d ON c.deck_id = d.id
WHERE c.due <= NOW()
ORDER BY c.due ASC;

-- View: Deck statistics
CREATE VIEW deck_stats AS
SELECT 
  d.id AS deck_id,
  d.name AS deck_name,
  d.user_id,
  COUNT(c.id) AS total_cards,
  COUNT(CASE WHEN c.due <= NOW() THEN 1 END) AS due_cards,
  COUNT(CASE WHEN c.state = 0 THEN 1 END) AS new_cards,
  COUNT(CASE WHEN c.state = 1 THEN 1 END) AS learning_cards,
  COUNT(CASE WHEN c.state = 2 THEN 1 END) AS review_cards,
  COUNT(CASE WHEN c.state = 3 THEN 1 END) AS relearning_cards
FROM decks d
LEFT JOIN cards c ON c.deck_id = d.id
GROUP BY d.id, d.name, d.user_id;

-- View: Daily review stats
CREATE VIEW daily_review_stats AS
SELECT 
  user_id,
  DATE(review) AS review_date,
  COUNT(*) AS total_reviews,
  AVG(rating) AS avg_rating,
  COUNT(CASE WHEN rating >= 3 THEN 1 END)::FLOAT / COUNT(*) AS retention_rate
FROM review_logs
GROUP BY user_id, DATE(review)
ORDER BY review_date DESC;
```

### Functions for Common Operations

```sql
-- Function: Get cards due for a specific deck
CREATE OR REPLACE FUNCTION get_due_cards(
  p_deck_id UUID,
  p_user_id UUID
)
RETURNS TABLE (
  id UUID,
  deck_id UUID,
  front TEXT,
  back TEXT,
  due TIMESTAMPTZ,
  state SMALLINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    c.id,
    c.deck_id,
    c.front,
    c.back,
    c.due,
    c.state
  FROM cards c
  WHERE c.deck_id = p_deck_id
    AND c.user_id = p_user_id
    AND c.due <= NOW()
  ORDER BY c.due ASC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function: Get deck statistics
CREATE OR REPLACE FUNCTION get_deck_statistics(
  p_deck_id UUID,
  p_user_id UUID
)
RETURNS JSON AS $$
DECLARE
  result JSON;
BEGIN
  SELECT json_build_object(
    'total_cards', COUNT(*),
    'due_cards', COUNT(CASE WHEN due <= NOW() THEN 1 END),
    'new_cards', COUNT(CASE WHEN state = 0 THEN 1 END),
    'learning_cards', COUNT(CASE WHEN state = 1 THEN 1 END),
    'review_cards', COUNT(CASE WHEN state = 2 THEN 1 END),
    'relearning_cards', COUNT(CASE WHEN state = 3 THEN 1 END)
  ) INTO result
  FROM cards
  WHERE deck_id = p_deck_id
    AND user_id = p_user_id;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

## TypeScript Types

The TypeScript types should match the database schema:

```typescript
// Database row types (snake_case)
export interface DeckRow {
  id: string
  user_id: string
  name: string
  description: string | null
  created: string
  modified: string
}

export interface CardRow {
  id: string
  deck_id: string
  user_id: string
  front: string
  back: string
  created: string
  modified: string
  due: string
  stability: number
  difficulty: number
  elapsed_days: number
  scheduled_days: number
  reps: number
  lapses: number
  state: number
  last_review: string | null
}

export interface ReviewLogRow {
  id: string
  card_id: string
  user_id: string
  rating: number
  state: number
  due: string
  stability: number
  difficulty: number
  elapsed_days: number
  scheduled_days: number
  review: string
}
```

## Migration Steps

### 1. Setup Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Wait for database provisioning

### 2. Run SQL Migrations

1. Go to SQL Editor in Supabase Dashboard
2. Copy and paste the SQL from above
3. Run each section sequentially

### 3. Configure Environment Variables

```bash
# .env.local
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 4. Test Connection

```typescript
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// Test query
const { data, error } = await supabase
  .from('decks')
  .select('*')
  .limit(1)

console.log(data, error)
```

## Sample Data

To add sample data for testing:

```sql
-- Insert sample deck (replace USER_ID with actual auth.users id)
INSERT INTO decks (id, user_id, name, description)
VALUES (
  '11111111-1111-1111-1111-111111111111',
  'USER_ID',
  'English Vocabulary',
  'Common English words and phrases'
);

-- Insert sample cards
INSERT INTO cards (deck_id, user_id, front, back, state)
VALUES
  (
    '11111111-1111-1111-1111-111111111111',
    'USER_ID',
    'What is FSRS?',
    'Free Spaced Repetition Scheduler - An algorithm for optimizing learning',
    0
  ),
  (
    '11111111-1111-1111-1111-111111111111',
    'USER_ID',
    'What does iterate mean?',
    'To repeat a process, especially to evolve through repetition',
    0
  );
```

## Backup and Restore

### Backup

```bash
# Using Supabase CLI
supabase db dump -f backup.sql

# Using pg_dump
pg_dump -h db.your-project.supabase.co -U postgres -d postgres > backup.sql
```

### Restore

```bash
# Using Supabase CLI
supabase db push backup.sql

# Using psql
psql -h db.your-project.supabase.co -U postgres -d postgres < backup.sql
```

## Performance Optimization

### 1. Add Composite Indexes

```sql
-- For querying due cards by user
CREATE INDEX idx_cards_user_due ON cards(user_id, due);

-- For querying cards by deck and state
CREATE INDEX idx_cards_deck_state ON cards(deck_id, state);
```

### 2. Analyze Query Performance

```sql
-- Explain query plan
EXPLAIN ANALYZE
SELECT * FROM cards
WHERE user_id = 'some-uuid'
  AND due <= NOW()
ORDER BY due ASC
LIMIT 20;
```

### 3. Vacuum Tables Regularly

Supabase does this automatically, but you can manually trigger:

```sql
VACUUM ANALYZE cards;
VACUUM ANALYZE decks;
VACUUM ANALYZE review_logs;
```

## Troubleshooting

### Connection Issues

- Check if IP is allowed in Supabase dashboard
- Verify environment variables are correct
- Ensure RLS policies are properly set

### Slow Queries

- Check if indexes exist
- Analyze query plans with EXPLAIN
- Consider pagination for large result sets

### RLS Issues

- Verify user is authenticated
- Check policy conditions
- Test with `auth.uid()` function

## Next Steps

1. Implement `SupabaseCardRepository`
2. Add authentication with Supabase Auth
3. Create real-time subscriptions for sync
4. Add data validation with Supabase Edge Functions

## Resources

- [Supabase Documentation](https://supabase.com/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)
