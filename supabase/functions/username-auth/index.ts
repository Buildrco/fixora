import { withSupabase } from "npm:@supabase/server@1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Cache-Control": "no-store",
};

function json(body: Record<string, unknown>, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

function normalizedUsername(value: unknown) {
  if (typeof value !== "string") return "";
  const username = value.trim().toLowerCase();
  return /^[a-z0-9._-]{3,30}$/.test(username) ? username : "";
}

const authenticatedHandler = withSupabase({ auth: "publishable" }, async (request, ctx) => {
  if (request.method !== "POST") return json({ code: "method_not_allowed" }, 405);

  let body: { action?: string; username?: string; password?: string };
  try {
    body = await request.json();
  } catch {
    return json({ code: "invalid_request" }, 400);
  }

  const username = normalizedUsername(body.username);
  if (!username) return json({ code: "invalid_username" }, 400);

  if (body.action === "check-username") {
    const { data, error } = await ctx.supabaseAdmin
      .from("profiles")
      .select("id")
      .eq("username", username)
      .limit(1);
    if (error) return json({ code: "username_check_unavailable" }, 503);
    return json({ available: !data?.length });
  }

  if (body.action !== "sign-in" || typeof body.password !== "string" || !body.password) {
    return json({ code: "invalid_request" }, 400);
  }

  const { data: profiles, error: profileError } = await ctx.supabaseAdmin
    .from("profiles")
    .select("id")
    .eq("username", username)
    .limit(1);
  if (profileError) return json({ code: "sign_in_unavailable" }, 503);
  const profile = profiles?.[0];
  if (!profile) return json({ code: "invalid_credentials" }, 401);

  const { data: userResult, error: userError } = await ctx.supabaseAdmin.auth.admin.getUserById(profile.id);
  const email = userResult.user?.email;
  if (userError || !email) return json({ code: "invalid_credentials" }, 401);

  const { data: authResult, error: authError } = await ctx.supabase.auth.signInWithPassword({
    email,
    password: body.password,
  });
  if (authError) {
    if (authError.code === "email_not_confirmed") {
      return json({ code: "email_not_confirmed" }, 403);
    }
    // Keep missing usernames and incorrect passwords indistinguishable.
    return json({ code: "invalid_credentials" }, 401);
  }

  const session = authResult.session;
  if (!session?.access_token || !session.refresh_token) {
    return json({ code: "invalid_credentials" }, 401);
  }

  // Return only the tokens needed to establish the client session. Never return the resolved email or user record.
  return json({
    access_token: session.access_token,
    refresh_token: session.refresh_token,
    expires_in: session.expires_in,
    expires_at: session.expires_at,
    token_type: session.token_type,
  });
});

Deno.serve((request) => {
  if (request.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  return authenticatedHandler(request);
});
