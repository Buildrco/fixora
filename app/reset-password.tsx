import { useEffect, useState } from "react";
import { ActivityIndicator, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { useRouter } from "expo-router";
import { colors, radius } from "../constants/theme";
import { useAuth } from "../data/AuthContext";

export default function ResetPassword() {
  const router = useRouter();
  const { session, loading, authLinkError, updatePassword } = useAuth();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [updated, setUpdated] = useState(false);

  useEffect(() => {
    if (authLinkError) setError(authLinkError);
  }, [authLinkError]);

  const submit = async () => {
    setError("");
    if (!session) {
      setError("Open the password reset link from your email first.");
      return;
    }
    if (password.length < 8) {
      setError("Choose a password with at least 8 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("The passwords do not match.");
      return;
    }
    setBusy(true);
    try {
      await updatePassword(password);
      setUpdated(true);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "We couldn't update your password. Request a new link and try again.");
    } finally {
      setBusy(false);
    }
  };

  return <SafeAreaView style={s.safe}><ScrollView contentContainerStyle={s.content} keyboardShouldPersistTaps="handled">
    <View style={s.form}>
      <Text style={s.eyebrow}>ACCOUNT RECOVERY</Text>
      <Text style={s.title}>Choose a new password</Text>
      <Text style={s.subtitle}>Use at least 8 characters for your new password.</Text>
      {loading ? <ActivityIndicator color={colors.blue} style={{ marginVertical: 20 }} /> : null}
      <Text style={s.label}>New password</Text>
      <TextInput secureTextEntry autoComplete="new-password" value={password} onChangeText={setPassword} placeholder="At least 8 characters" placeholderTextColor={colors.muted} style={s.input} />
      <Text style={s.label}>Confirm new password</Text>
      <TextInput secureTextEntry autoComplete="new-password" value={confirmPassword} onChangeText={setConfirmPassword} placeholder="Enter it again" placeholderTextColor={colors.muted} style={s.input} />
      {!!error && <Text accessibilityRole="alert" style={s.error}>{error}</Text>}
      {updated ? <Text accessibilityRole="alert" style={s.message}>Password updated. You can continue to Fixora.</Text> : null}
      <Pressable disabled={busy || loading} onPress={submit} style={[s.primary, (busy || loading) && s.disabled]}>
        {busy ? <ActivityIndicator color="#fff" /> : <Text style={s.primaryText}>Update password</Text>}
      </Pressable>
      {updated ? <Pressable onPress={() => router.replace("/" as never)} style={s.returnLink}><Text style={s.returnText}>Continue</Text></Pressable> : null}
    </View>
  </ScrollView></SafeAreaView>;
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.card },
  content: { flexGrow: 1, padding: 24, justifyContent: "center" },
  form: { width: "100%", maxWidth: 480, alignSelf: "center" },
  eyebrow: { color: colors.blue, fontSize: 11, fontWeight: "800", letterSpacing: 1.5, marginBottom: 9 },
  title: { color: colors.ink, fontSize: 27, fontWeight: "800" },
  subtitle: { color: colors.muted, fontSize: 14, lineHeight: 21, marginTop: 8, marginBottom: 22 },
  label: { color: colors.ink, fontSize: 12, fontWeight: "800", marginBottom: 7 },
  input: { minHeight: 52, borderWidth: 1, borderColor: colors.line, borderRadius: radius.md, paddingHorizontal: 14, marginBottom: 15, color: colors.ink },
  error: { color: "#D74747", fontSize: 13, lineHeight: 19 },
  message: { color: colors.green, fontSize: 13, lineHeight: 19, marginTop: 14 },
  primary: { minHeight: 52, borderRadius: radius.md, backgroundColor: colors.blue, alignItems: "center", justifyContent: "center", marginTop: 16 },
  primaryText: { color: "#fff", fontSize: 15, fontWeight: "800" },
  returnLink: { alignSelf: "center", padding: 10, marginTop: 12 },
  returnText: { color: colors.blue, fontSize: 12, fontWeight: "700" },
  disabled: { opacity: 0.6 },
});
