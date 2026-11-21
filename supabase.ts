/**
 * Fixora Supabase project configuration.
 * This is the shared client for the existing Supabase project. Never use a
 * service-role key in the mobile app; all requests remain subject to RLS.
 */
import "react-native-url-polyfill/auto";
import { createClient } from "@supabase/supabase-js";
import AsyncStorage from "@react-native-async-storage/async-storage";

const projectUrl = process.env.EXPO_PUBLIC_SUPABASE_URL ??
  "https://epnlgpakpkydkcfhjohl.supabase.co";

const publishableKey =
  process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? "missing-publishable-key";

export const supabaseConfig = Object.freeze({
  url: projectUrl,
  publishableKey,
});

export const isSupabaseConfigured =
  Boolean(process.env.EXPO_PUBLIC_SUPABASE_URL) &&
  Boolean(process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY);

/**
 * A single initialized Supabase client. In local builds without Expo vars it
 * is inert: data functions call requireSupabaseConfig() before any request.
 */
export const supabase = createClient(
  supabaseConfig.url,
  supabaseConfig.publishableKey,
  {
    auth: {
      storage: AsyncStorage,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  },
);

export function requireSupabaseConfig() {
  if (!isSupabaseConfigured) {
    throw new Error(
      "Supabase is not configured. Set EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY in the Expo environment.",
    );
  }

  return supabaseConfig;
}
