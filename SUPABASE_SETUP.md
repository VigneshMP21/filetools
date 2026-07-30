# Supabase setup for PDF Tools

## 1. Environment variables
Create a `.env` file from `.env.example` and set:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

## 2. Storage bucket
Create a private bucket named `temporary-pdf-files`.

- Set bucket to private.
- Enable signed URLs for downloads.
- Use UUID-based folder names such as `temporary-files/{session-id}/input/`.

## 3. SQL for temporary jobs
```sql
create extension if not exists pgcrypto;

create table if not exists public.temporary_jobs (
  id uuid primary key default gen_random_uuid(),
  session_id text not null,
  tool_name text not null,
  status text not null,
  input_file_paths jsonb default '[]'::jsonb,
  output_file_path text,
  created_at timestamptz default now(),
  expires_at timestamptz default now() + interval '30 minutes'
);
```

## 4. Edge Function cleanup example
Create an Edge Function called `cleanup-expired-files` and use the following code:

```ts
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

Deno.serve(async (req) => {
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  );

  const { data, error } = await supabase.from('temporary_jobs').select('*').lt('expires_at', new Date().toISOString());
  if (error) {
    console.error(error);
    return new Response(JSON.stringify({ ok: false, error: 'cleanup_failed' }), { status: 500 });
  }

  for (const job of data ?? []) {
    await supabase.storage.from('temporary-pdf-files').remove(job.input_file_paths ?? []);
    if (job.output_file_path) {
      await supabase.storage.from('temporary-pdf-files').remove([job.output_file_path]);
    }
  }

  await supabase.from('temporary_jobs').delete().lt('expires_at', new Date().toISOString());

  return new Response(JSON.stringify({ ok: true }), { headers: { 'Content-Type': 'application/json' } });
});
```

## 5. Cleanup schedule
Run the cleanup job every 10–15 minutes in Supabase Cron or a scheduler.

## 6. Security notes
- Never expose the service-role key in frontend code.
- Use private storage buckets and signed URLs.
- Validate file types and sizes on both the client and server.
