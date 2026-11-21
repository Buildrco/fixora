import { useState } from "react";
import { ActivityIndicator, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { useRouter } from "expo-router";
import { colors, radius } from "../constants/theme";
import { useAuth } from "../data/AuthContext";

export default function ForgotPassword() {
  const router = useRouter();
  const { requestPasswordReset } = useAuth();
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  const submit = async () => {
    setError("");
    if (!email.trim() || !email.includes("@")) {
      setError("Enter the email address connected to your account.");
      return;
    }
    setBusy(true);
    try {
      await requestPasswordReset(email);
      setSent(true);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "We couldn't send the reset email. Try again.");
    } finally {
      setBusy(false);
    }
  };

  return <SafeAreaView style={s.safe}><ScrollView contentContainerStyle={s.content} keyboardShouldPersistTaps="handled">
    <Pressable onPress={() => router.back()} style={s.back}><Text style={s.backText}>‹  Back</Text></Pressable>
    <View style={s.form}>
      <Text style={s.eyebrow}>ACCOUNT RECOVERY</Text>
      <Text style={s.title}>Reset your password</Text>
      <Text style={s.subtitle}>Enter your email address and we’ll send a secure reset link.</Text>
      <Text style={s.label}>Email address</Text>
      <TextInput
        autoCapitalize="none"
        autoCorrect={false}
        autoComplete="email"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
        placeholder="you@example.com"
        placeholderTextColor={colors.muted}
        style={s.input}
      />
      {!!error && <Text accessibilityRole="alert" style={s.error}>{error}</Text>}
      {sent ? <Text accessibilityRole="alert" style={s.message}>If an account uses that email, a password reset link is on its way.</Text> : null}
      <Pressable disabled={busy} onPress={submit} style={[s.primary, busy && s.disabled]}>
        {busy ? <ActivityIndicator color="#fff" /> : <Text style={s.primaryText}>Send reset link</Text>}
      </Pressable>
      <Pressable onPress={() => router.replace("/sign-in" as never)} style={s.returnLink}>
        <Text style={s.returnText}>Back to username sign in</Text>
      </Pressable>
    </View>
  </ScrollView></SafeAreaView>;
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.card },
  content: { flexGrow: 1, padding: 24, justifyContent: "center" },
  back: { position: "absolute", top: 18, left: 22, padding: 8, zIndex: 1 },
  backText: { color: colors.blue, fontWeight: "700", fontSize: 15 },
  form: { width: "100%", maxWidth: 480, alignSelf: "center", paddingTop: 28 },
  eyebrow: { color: colors.blue, fontSize: 11, fontWeight: "800", letterSpacing: 1.5, marginBottom: 9 },
  title: { color: colors.ink, fontSize: 27, fontWeight: "800" },
  subtitle: { color: colors.muted, fontSize: 14, lineHeight: 21, marginTop: 8, marginBottom: 22 },
  label: { color: colors.ink, fontSize: 12, fontWeight: "800", marginBottom: 7 },
  input: { minHeight: 52, borderWidth: 1, borderColor: colors.line, borderRadius: radius.md, paddingHorizontal: 14, color: colors.ink },
  error: { color: "#D74747", fontSize: 13, marginTop: 12 },
  message: { color: colors.green, fontSize: 13, lineHeight: 19, marginTop: 14 },
  primary: { minHeight: 52, borderRadius: radius.md, backgroundColor: colors.blue, alignItems: "center", justifyContent: "center", marginTop: 18 },
  primaryText: { color: "#fff", fontSize: 15, fontWeight: "800" },
  returnLink: { alignSelf: "center", padding: 10, marginTop: 12 },
  returnText: { color: colors.blue, fontSize: 12, fontWeight: "700" },
  disabled: { opacity: 0.6 },
});
