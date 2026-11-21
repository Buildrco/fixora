export function normalizeUsername(value: string) {
  return value.trim().toLowerCase();
}

export function isValidUsername(value: string) {
  return /^[a-z0-9._-]{3,30}$/.test(normalizeUsername(value));
}

export function authMessage(error: unknown, fallback: string) {
  const candidate = error as { code?: string; message?: string; status?: number } | null;
  const code = String(candidate?.code || "").toLowerCase();
  const message = String(candidate?.message || "").toLowerCase();

  if (code === "user_already_exists" || message.includes("already registered") || message.includes("already exists")) {
    return "That email is already registered. Sign in or reset your password.";
  }
  if (code === "email_not_confirmed" || message.includes("email not confirmed")) {
    return "Confirm your email from the link we sent, then try again.";
  }
  if (candidate?.status === 429) {
    return "Too many attempts. Wait a moment and try again.";
  }
  if (message.includes("username") && (message.includes("duplicate") || message.includes("already"))) {
    return "That username is already taken.";
  }
  return fallback;
}
