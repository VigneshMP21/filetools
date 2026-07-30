export function getCleanupSql() {
  return `
CREATE TABLE IF NOT EXISTS temporary_jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id text NOT NULL,
  tool_name text NOT NULL,
  status text NOT NULL,
  input_file_paths jsonb DEFAULT '[]'::jsonb,
  output_file_path text,
  created_at timestamptz DEFAULT now(),
  expires_at timestamptz DEFAULT now() + interval '30 minutes'
);

CREATE OR REPLACE FUNCTION cleanup_expired_jobs()
RETURNS void AS $$
BEGIN
  DELETE FROM temporary_jobs WHERE expires_at < now();
END;
$$ LANGUAGE plpgsql;
`;
}

export function getCleanupNotes() {
  return [
    'Run the cleanup job every 10-15 minutes.',
    'Delete files older than 30 minutes from the temporary-pdf-files bucket.',
    'Remove expired job records and log failures.',
  ];
}
