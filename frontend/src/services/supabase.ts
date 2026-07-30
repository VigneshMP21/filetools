export const supabaseConfig = {
  url: import.meta.env.VITE_SUPABASE_URL ?? 'https://example.supabase.co',
  anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY ?? 'demo-anon-key',
};

export function getSupabaseSetupNotes() {
  return {
    bucket: 'temporary-pdf-files',
    table: 'temporary_jobs',
    privacyMessage: 'Your files are temporarily stored only for processing and are automatically deleted shortly after completion.',
  };
}
