import { useEffect, useState } from "react";
import { ActivityIndicator, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { useRouter } from "expo-router";
import { colors, radius } from "../constants/theme";
import { useAuth } from "../data/AuthContext";
import { isValidUsername, normalizeUsername } from "../data/authValidation";

export default function SignUp() {
  const router = useRouter();
  const { session, loading: authLoading, signUp } = useAuth();
  const [fullName, setFullName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [location, setLocation] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!authLoading && session) router.replace("/");
  }, [authLoading, session, router]);

  const submit = async () => {
    setError("");
    setMessage("");
    if (!fullName.trim() || !lastName.trim() || !email.trim()) {
      setError("Enter your full name, last name, and email address.");
      return;
    }
    if (!isValidUsername(username)) {
      setError("Use 3–30 letters, numbers, dots, underscores, or hyphens for your username.");
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
      const result = await signUp({
        fullName,
        lastName,
        username: normalizeUsername(username),
        email,
        location,
        password,
      });
      if (result.needsEmailConfirmation) {
        setMessage("Check your inbox for the Fixora confirmation link. Once you confirm, come back and sign in with your username.");
      } else {
        router.replace("/");
      }
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "We couldn't create your account. Check your details and try again.");
    } finally {
      setBusy(false);
    }
  };

  const field = (label: string, value: string, setter: (next: string) => void, placeholder: string, options: { email?: boolean; secure?: boolean; username?: boolean } = {}) => (
    <View style={s.field} key={label}>
      <Text style={s.label}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={setter}
        autoCapitalize={options.email || options.username ? "none" : "words"}
        autoCorrect={false}
        autoComplete={options.email ? "email" : options.username ? "username-new" : options.secure ? "new-password" : "off"}
        keyboardType={options.email ? "email-address" : "default"}
        secureTextEntry={options.secure}
        placeholder={placeholder}
        placeholderTextColor={colors.muted}
        style={s.input}
      />
    </View>
  );

  return <SafeAreaView style={s.safe}><ScrollView contentContainerStyle={s.content} keyboardShouldPersistTaps="handled">
    <Pressable onPress={() => router.back()} style={s.back}><Text style={s.backText}>‹  Back</Text></Pressable>
    <View style={s.form}>
      <Text style={s.eyebrow}>JOIN THE COMMUNITY</Text>
      <Text style={s.title}>Create your account</Text>
      <Text style={s.subtitle}>Set up your Fixora profile to connect with the community.</Text>
      {field("Full name", fullName, setFullName, "Your first and middle names")}
      {field("Last name", lastName, setLastName, "Your last name")}
      {field("Username", username, setUsername, "Choose a username", { username: true })}
      <Text style={s.hint}>3–30 characters: letters, numbers, dots, underscores, or hyphens.</Text>
      {field("Email address", email, setEmail, "you@example.com", { email: true })}
      {field("Location (optional)", location, setLocation, "City or area")}
      {field("Password", password, setPassword, "At least 8 characters", { secure: true })}
      {field("Confirm password", confirmPassword, setConfirmPassword, "Enter your password again", { secure: true })}
      {!!error && <Text accessibilityRole="alert" style={s.error}>{error}</Text>}
      {!!message && <Text accessibilityRole="alert" style={s.message}>{message}</Text>}
      <Pressable disabled={busy || authLoading} onPress={submit} style={[s.primary, (busy || authLoading) && s.disabled]}>
        {busy ? <ActivityIndicator color="#fff" /> : <Text style={s.primaryText}>Create account</Text>}
      </Pressable>
      <View style={s.signinRow}>
        <Text style={s.signinPrompt}>Already have an account?</Text>
        <Pressable onPress={() => router.replace("/sign-in" as never)}><Text style={s.signinLink}> Sign in</Text></Pressable>
      </View>
    </View>
  </ScrollView></SafeAreaView>;
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.card },
  content: { flexGrow: 1, padding: 24 },
  back: { padding: 8, alignSelf: "flex-start", marginLeft: -8, marginTop: 4 },
  backText: { color: colors.blue, fontWeight: "700", fontSize: 15 },
  form: { width: "100%", maxWidth: 480, alignSelf: "center", paddingBottom: 36 },
  eyebrow: { color: colors.blue, fontSize: 11, fontWeight: "800", letterSpacing: 1.5, marginTop: 13, marginBottom: 9 },
  title: { color: colors.ink, fontSize: 27, fontWeight: "800", letterSpacing: -0.5 },
  subtitle: { color: colors.muted, fontSize: 14, lineHeight: 21, marginTop: 8, marginBottom: 12 },
  field: { marginTop: 12 },
  label: { color: colors.ink, fontSize: 12, fontWeight: "800", marginBottom: 7 },
  input: { minHeight: 50, borderWidth: 1, borderColor: colors.line, borderRadius: radius.md, paddingHorizontal: 14, color: colors.ink, backgroundColor: colors.card },
  hint: { color: colors.muted, fontSize: 11, lineHeight: 16, marginTop: 6 },
  error: { color: "#D74747", fontSize: 13, lineHeight: 19, marginTop: 14 },
  message: { color: colors.green, fontSize: 13, lineHeight: 19, marginTop: 14 },
  primary: { minHeight: 52, borderRadius: radius.md, backgroundColor: colors.blue, alignItems: "center", justifyContent: "center", marginTop: 19 },
  primaryText: { color: "#fff", fontSize: 15, fontWeight: "800" },
  signinRow: { flexDirection: "row", justifyContent: "center", marginTop: 20 },
  signinPrompt: { color: colors.muted, fontSize: 13 },
  signinLink: { color: colors.blue, fontSize: 13, fontWeight: "800" },
  disabled: { opacity: 0.6 },
});
