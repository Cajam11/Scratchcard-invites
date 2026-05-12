-- Supabase / Postgres initial migration for teachers
CREATE TABLE IF NOT EXISTS teachers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  secret_hash text NOT NULL,
  phrase_template text DEFAULT 'Východzí šablóna',
  phrase_sentence text DEFAULT '',
  hidden_word text DEFAULT '',
  phrase_words text[] DEFAULT ARRAY[]::text[],
  notice_html text DEFAULT '',
  event_date date,
  event_time time,
  location text,
  created_at timestamp with time zone DEFAULT now()
);

CREATE TABLE IF NOT EXISTS attempts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id uuid REFERENCES teachers(id) ON DELETE CASCADE,
  user_input text,
  ip inet,
  success boolean,
  created_at timestamp with time zone DEFAULT now()
);

CREATE TABLE IF NOT EXISTS admin_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  password_hash text NOT NULL,
  created_at timestamp with time zone DEFAULT now()
);
