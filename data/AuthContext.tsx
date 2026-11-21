import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { Session } from "@supabase/supabase-js";
import * as Linking from "expo-linking";
import { isSupabaseConfigured, requireSupabaseConfig, supabase } from "../supabase";
import { authMessage, isValidUsername, normalizeUsername } from "./authValidation";

export type SignUpInput = {
  fullName: string;
  lastName: string;
  username: string;
  email: string;
  location: string;
  password: string;
};

type AuthContextValue = {
  session: Session | null;
  loading: boolean;
  authLinkError: string;
  authLinkType: string;
  clearAuthLinkError: () => void;
  checkUsername: (username: string) => Promise<boolean>;
  signIn: (username: string, password: string) => Promise<void>;
  signUp: (input: SignUpInput) => Promise<{ needsEmailConfirmation: boolean }>;
  requestPasswordReset: (email: string) => Promise<void>;
  updatePassword: (password: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

function readLinkParams(url: string) {
  const beforeHash = url.split("#", 1)[0];
  const query = beforeHash.includes("?") ? beforeHash.slice(beforeHash.indexOf("?") + 1) : "";
  const fragment = url.includes("#") ? url.slice(url.indexOf("#") + 1) : "";
  const params: Record<string, string> = {};
  for (const entry of `${query}&${fragment}`.split("&")) {
    if (!entry) continue;
    const splitAt = entry.indexOf("=");
    const key = splitAt < 0 ? entry : entry.slice(0, splitAt);
    const value = splitAt < 0 ? "" : entry.slice(splitAt + 1);
    try {
      params[decodeURIComponent(key.replace(/\+/g, " "))] = decodeURIComponent(value.replace(/\+/g, " "));
    } catch {
      // Ignore malformed URL parameters; Supabase will reject an invalid token.
    }
  }
  return params;
}

function isOtpType(value: string): value is "signup" | "invite" | "magiclink" | "recovery" | "email_change" | "email" {
  return ["signup", "invite", "magiclink", "recovery", "email_change", "email"].includes(value);
}

async function functionErrorMessage(error: unknown) {
  const context = (error as { context?: Response } | null)?.context;
  if (context && typeof context.clone === "function") {
    try {
      const body = await context.clone().json();
      if (body?.code === "email_not_confirmed") {
        return "Confirm your email from the link we sent, then try again.";
      }
    } catch {
      // Use the safe generic message below when no structured response is available.
    }
  }
  return "Username or password is incorrect.";
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [authLinkError, setAuthLinkError] = useState("");
  const [authLinkType, setAuthLinkType] = useState("");

  useEffect(() => {
    let alive = true;
    let handlingLink = false;

    if (!isSupabaseConfigured) {
      setLoading(false);
      return;
    }

    const handleAuthLink = async (url: string) => {
      const params = readLinkParams(url);
      const type = params.type || "";
      if (params.error || params.error_description) {
        setAuthLinkError("That email link is invalid or expired. Request a new one and try again.");
        setLoading(false);
        return;
      }
      if (!params.code && !params.token_hash && !(params.access_token && params.refresh_token)) return;
      if (handlingLink) return;

      handlingLink = true;
      setLoading(true);
      setAuthLinkError("");
      try {
        let error: Error | null = null;
        if (params.code) {
          const result = await supabase.auth.exchangeCodeForSession(params.code);
          error = result.error;
        } else if (params.token_hash && isOtpType(type)) {
          const result = await supabase.auth.verifyOtp({
            token_hash: params.token_hash,
            type,
          });
          error = result.error;
        } else if (params.access_token && params.refresh_token) {
          const result = await supabase.auth.setSession({
            access_token: params.access_token,
            refresh_token: params.refresh_token,
          });
          error = result.error;
        }
        if (error) throw error;
        if (alive) setAuthLinkType(type || "signup");
      } catch {
        if (alive) setAuthLinkError("That email link is invalid or expired. Request a new one and try again.");
      } finally {
        handlingLink = false;
        if (alive) setLoading(false);
      }
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      if (!alive) return;
      setSession(nextSession);
      setLoading(false);
    });
    const linkSubscription = Linking.addEventListener("url", ({ url }) => {
      void handleAuthLink(url);
    });

    const initialize = async () => {
      try {
        const initialUrl = await Linking.getInitialURL();
        if (initialUrl) await handleAuthLink(initialUrl);
        const { data, error } = await supabase.auth.getSession();
        if (!alive) return;
        if (error) console.warn("Unable to restore Supabase session:", error.message);
        setSession(data.session);
      } catch (error) {
        if (alive) console.warn("Unable to restore Supabase session:", error);
      } finally {
        if (alive) setLoading(false);
      }
    };
    void initialize();

    return () => {
      alive = false;
      subscription.unsubscribe();
      linkSubscription.remove();
    };
  }, []);

  const value = useMemo<AuthContextValue>(() => ({
    session,
    loading,
    authLinkError,
    authLinkType,
    clearAuthLinkError() {
      setAuthLinkError("");
    },
    async checkUsername(username) {
      requireSupabaseConfig();
      const normalized = normalizeUsername(username);
      if (!isValidUsername(normalized)) throw new Error("Use 3–30 letters, numbers, dots, underscores, or hyphens.");
      const { data, error } = await supabase.functions.invoke("username-auth", {
        body: { action: "check-username", username: normalized },
      });
      if (error) throw new Error("Could not check username availability. Try again in a moment.");
      if (typeof data?.available !== "boolean") throw new Error("Could not check username availability. Try again in a moment.");
      return data.available;
    },
    async signIn(username, password) {
      requireSupabaseConfig();
      const normalized = normalizeUsername(username);
      if (!isValidUsername(normalized) || !password) throw new Error("Enter your username and password.");
      const { data, error } = await supabase.functions.invoke("username-auth", {
        body: { action: "sign-in", username: normalized, password },
      });
      if (error) throw new Error(await functionErrorMessage(error));
      if (!data?.access_token || !data?.refresh_token) throw new Error("Username or password is incorrect.");
      const { error: sessionError } = await supabase.auth.setSession({
        access_token: data.access_token,
        refresh_token: data.refresh_token,
      });
      if (sessionError) throw new Error("Sign-in could not be completed. Try again.");
    },
    async signUp(input) {
      requireSupabaseConfig();
      const username = normalizeUsername(input.username);
      if (!isValidUsername(username)) throw new Error("Use 3–30 letters, numbers, dots, underscores, or hyphens for your username.");
      const { data: usernameCheck, error: usernameCheckError } = await supabase.functions.invoke("username-auth", {
        body: { action: "check-username", username },
      });
      if (usernameCheckError || typeof usernameCheck?.available !== "boolean") {
        throw new Error("Could not check username availability. Try again in a moment.");
      }
      if (!usernameCheck.available) throw new Error("That username is already taken.");
      const { data, error } = await supabase.auth.signUp({
        email: input.email.trim().toLowerCase(),
        password: input.password,
        options: {
          emailRedirectTo: Linking.createURL("auth/callback"),
          data: {
            full_name: input.fullName.trim(),
            last_name: input.lastName.trim(),
            username,
            location: input.location.trim(),
          },
        },
      });
      if (error) throw new Error(authMessage(error, "We couldn't create your account. Check your details and try again."));
      return { needsEmailConfirmation: !data.session };
    },
    async requestPasswordReset(email) {
      requireSupabaseConfig();
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim().toLowerCase(), {
        redirectTo: Linking.createURL("reset-password"),
      });
      if (error) throw new Error("We couldn't send the reset email. Check the address and try again.");
    },
    async updatePassword(password) {
      requireSupabaseConfig();
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw new Error("We couldn't update your password. Request a new reset link and try again.");
    },
    async signOut() {
      requireSupabaseConfig();
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    },
  }), [session, loading, authLinkError, authLinkType]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) throw new Error("useAuth must be used inside AuthProvider.");
  return value;
}
