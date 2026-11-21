import { useEffect, useState } from "react";
import { ActivityIndicator, Alert, Pressable, SafeAreaView, StyleSheet, Text, TextInput, View } from "react-native";
import { useRouter } from "expo-router";
import { colors, radius } from "../constants/theme";
import { useAuth } from "../data/AuthContext";

export default function SignIn() {
  const router = useRouter();
  const { session, loading: authLoading, signIn, signUp } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (session) router.replace("/");
  }, [session, router]);

  const submit = async (mode: "sign-in" | "sign-up") => {
    setMessage("");
    if (!email.trim() || password.length < 8) {
      Alert.alert("Check your details", "Enter an email and a password with at least 8 characters.");
      return;
    }
    setBusy(true);
    try {
      if (mode === "sign-in") await signIn(email, password);
      else {
        const result = await signUp(email, password);
        if (result.needsEmailConfirmation) {
          setMessage("Check your email to confirm the account, then sign in.");
        }
      }
    } catch (error) {
      Alert.alert("Authentication failed", error instanceof Error ? error.message : "Please try again.");
    } finally {
      setBusy(false);
    }
  };

  return <SafeAreaView style={s.safe}><View style={s.content}>
    <Pressable onPress={() => router.back()} style={s.back}><Text style={s.backText}>‹  Back</Text></Pressable>
    <Text style={s.title}>Welcome to Fixora</Text>
    <Text style={s.subtitle}>Sign in to save your profile, repairs, orders, and messages.</Text>
    <TextInput autoCapitalize="none" autoComplete="email" keyboardType="email-address" value={email} onChangeText={setEmail} placeholder="Email address" style={s.input} />
    <TextInput secureTextEntry autoComplete="password" value={password} onChangeText={setPassword} placeholder="Password" style={s.input} />
    {!!message && <Text accessibilityRole="alert" style={s.message}>{message}</Text>}
    <Pressable disabled={busy || authLoading} onPress={() => submit("sign-in")} style={[s.primary, (busy || authLoading) && s.disabled]}>
      {busy ? <ActivityIndicator color="#fff" /> : <Text style={s.primaryText}>Sign in</Text>}
    </Pressable>
    <Pressable disabled={busy || authLoading} onPress={() => submit("sign-up")} style={s.secondary}>
      <Text style={s.secondaryText}>Create account</Text>
    </Pressable>
  </View></SafeAreaView>;
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.card },
  content: { flex: 1, justifyContent: "center", padding: 24 },
  back: { position: "absolute", top: 18, left: 22, padding: 8 },
  backText: { color: colors.blue, fontWeight: "700", fontSize: 15 },
  title: { color: colors.ink, fontSize: 28, fontWeight: "800" },
  subtitle: { color: colors.muted, fontSize: 14, lineHeight: 21, marginTop: 8, marginBottom: 24 },
  input: { minHeight: 52, borderWidth: 1, borderColor: colors.line, borderRadius: radius.md, paddingHorizontal: 14, marginBottom: 12, color: colors.ink },
  message: { color: colors.green, fontSize: 13, marginBottom: 12 },
  primary: { minHeight: 52, borderRadius: radius.md, backgroundColor: colors.blue, alignItems: "center", justifyContent: "center", marginTop: 6 },
  primaryText: { color: "#fff", fontSize: 15, fontWeight: "800" },
  secondary: { minHeight: 50, borderRadius: radius.md, borderWidth: 1, borderColor: colors.line, alignItems: "center", justifyContent: "center", marginTop: 12 },
  secondaryText: { color: colors.ink, fontSize: 14, fontWeight: "700" },
  disabled: { opacity: 0.6 },
});
