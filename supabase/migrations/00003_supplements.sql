-- Supplements list + daily taken-checkbox logs

CREATE TABLE supplements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  dose text,
  time_of_day text NOT NULL DEFAULT 'morning',
  with_food boolean NOT NULL DEFAULT false,
  tip text,
  created_at timestamp with time zone DEFAULT now()
);

ALTER TABLE supplements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own supplements"
  ON supplements FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own supplements"
  ON supplements FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own supplements"
  ON supplements FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own supplements"
  ON supplements FOR DELETE USING (auth.uid() = user_id);

CREATE TABLE supplement_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  supplement_id uuid REFERENCES supplements(id) ON DELETE CASCADE NOT NULL,
  date date NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  UNIQUE (supplement_id, date)
);

ALTER TABLE supplement_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own supplement logs"
  ON supplement_logs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own supplement logs"
  ON supplement_logs FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own supplement logs"
  ON supplement_logs FOR DELETE USING (auth.uid() = user_id);
