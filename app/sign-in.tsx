import { useEffect, useState } from "react";
import { ActivityIndicator, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { useRouter } from "expo-router";
import { colors, radius } from "../constants/theme";
import { useAuth } from "../data/AuthContext";

export default function SignIn() {
  const router = useRouter();
  const { session, loading: authLoading, signIn } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!authLoading && session) router.replace("/");
  }, [authLoading, session, router]);

  const submit = async () => {
    setMessage("");
    if (username.trim().length < 3 || !password) {
      setMessage("Enter your username and password.");
      return;
    }
    setBusy(true);
    try {
      await signIn(username, password);
      router.replace("/");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Username or password is incorrect.");
    } finally {
      setBusy(false);
    }
  };

  return <SafeAreaView style={s.safe}><ScrollView contentContainerStyle={s.content} keyboardShouldPersistTaps="handled">
    <Pressable onPress={() => router.back()} style={s.back}><Text style={s.backText}>‹  Back</Text></Pressable>
    <View style={s.form}>
      <Text style={s.eyebrow}>WELCOME BACK</Text>
      <Text style={s.title}>Sign in to Fixora</Text>
      <Text style={s.subtitle}>Use your username and password to continue.</Text>
      <Text style={s.label}>Username</Text>
      <TextInput
        autoCapitalize="none"
        autoCorrect={false}
        autoComplete="username"
        value={username}
        onChangeText={setUsername}
        onSubmitEditing={() => undefined}
        placeholder="Your username"
        placeholderTextColor={colors.muted}
        style={s.input}
        returnKeyType="next"
      />
      <Text style={s.label}>Password</Text>
      <TextInput
        secureTextEntry
        autoComplete="password"
        value={password}
        onChangeText={setPassword}
        onSubmitEditing={submit}
        placeholder="Your password"
        placeholderTextColor={colors.muted}
        style={s.input}
        returnKeyType="go"
      />
      <Pressable onPress={() => router.push("/forgot-password" as never)} style={s.forgot}>
        <Text style={s.forgotText}>Forgot password?</Text>
      </Pressable>
      {!!message && <Text accessibilityRole="alert" style={s.message}>{message}</Text>}
      <Pressable disabled={busy || authLoading} onPress={submit} style={[s.primary, (busy || authLoading) && s.disabled]}>
        {busy ? <ActivityIndicator color="#fff" /> : <Text style={s.primaryText}>Sign in</Text>}
      </Pressable>
      <View style={s.signupRow}>
        <Text style={s.signupPrompt}>New to Fixora?</Text>
        <Pressable onPress={() => router.push("/sign-up" as never)}><Text style={s.signupLink}> Create an account</Text></Pressable>
      </View>
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
  title: { color: colors.ink, fontSize: 28, fontWeight: "800", letterSpacing: -0.5 },
  subtitle: { color: colors.muted, fontSize: 14, lineHeight: 21, marginTop: 8, marginBottom: 24 },
  label: { color: colors.ink, fontSize: 12, fontWeight: "800", marginBottom: 7 },
  input: { minHeight: 52, borderWidth: 1, borderColor: colors.line, borderRadius: radius.md, paddingHorizontal: 14, marginBottom: 16, color: colors.ink, backgroundColor: colors.card },
  forgot: { alignSelf: "flex-end", paddingVertical: 4, marginTop: -9, marginBottom: 13 },
  forgotText: { color: colors.blue, fontSize: 12, fontWeight: "700" },
  message: { color: "#D74747", fontSize: 13, lineHeight: 19, marginBottom: 12 },
  primary: { minHeight: 52, borderRadius: radius.md, backgroundColor: colors.blue, alignItems: "center", justifyContent: "center", marginTop: 3 },
  primaryText: { color: "#fff", fontSize: 15, fontWeight: "800" },
  signupRow: { flexDirection: "row", justifyContent: "center", marginTop: 21 },
  signupPrompt: { color: colors.muted, fontSize: 13 },
  signupLink: { color: colors.blue, fontSize: 13, fontWeight: "800" },
  disabled: { opacity: 0.6 },
});
