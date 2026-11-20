/**
 * Fixora Supabase project configuration.
 * Keep the publishable key in Expo's public environment, never a service-role key.
 */
const projectUrl =
  process.env.EXPO_PUBLIC_SUPABASE_URL ??
  "https://epnlgpakpkydkcfhjohl.supabase.co";

const publishableKey =
  process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? "";

export const supabaseConfig = Object.freeze({
  url: projectUrl,
  publishableKey,
});

export const isSupabaseConfigured =
  Boolean(supabaseConfig.url) && Boolean(supabaseConfig.publishableKey);

export function requireSupabaseConfig() {
  if (!isSupabaseConfigured) {
    throw new Error(
      "Supabase is not configured. Set EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY in the Expo environment.",
    );
  }

  return supabaseConfig;
}
