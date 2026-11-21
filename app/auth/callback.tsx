import { useEffect } from "react";
import { ActivityIndicator, Pressable, SafeAreaView, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { colors, radius } from "../../constants/theme";
import { useAuth } from "../../data/AuthContext";

export default function AuthCallback() {
  const router = useRouter();
  const { session, loading, authLinkError, authLinkType } = useAuth();

  useEffect(() => {
    if (authLinkType === "recovery") router.replace("/reset-password" as never);
  }, [authLinkType, router]);

  return <SafeAreaView style={s.safe}><View style={s.content}>
    {loading ? <ActivityIndicator color={colors.blue} size="large" /> : null}
    {!loading && session && !authLinkError ? <>
      <View style={s.check}><Text style={s.checkmark}>✓</Text></View>
      <Text style={s.title}>Email confirmed</Text>
      <Text style={s.copy}>Your Fixora account is ready. Continue to the community.</Text>
      <Pressable onPress={() => router.replace("/" as never)} style={s.primary}><Text style={s.primaryText}>Continue</Text></Pressable>
    </> : null}
    {!loading && (!session || authLinkError) ? <>
      <Text style={s.title}>Confirmation link unavailable</Text>
      <Text style={s.copy}>{authLinkError || "This link may have expired. Sign in if you already confirmed your email, or create a new account."}</Text>
      <Pressable onPress={() => router.replace("/sign-in" as never)} style={s.primary}><Text style={s.primaryText}>Go to sign in</Text></Pressable>
    </> : null}
  </View></SafeAreaView>;
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.card },
  content: { flex: 1, justifyContent: "center", alignItems: "center", padding: 28 },
  check: { width: 64, height: 64, borderRadius: 24, backgroundColor: colors.blue, alignItems: "center", justifyContent: "center", marginBottom: 18 },
  checkmark: { color: "#fff", fontSize: 34, fontWeight: "800" },
  title: { color: colors.ink, fontSize: 24, fontWeight: "800", textAlign: "center" },
  copy: { color: colors.muted, fontSize: 14, lineHeight: 21, textAlign: "center", marginTop: 8, maxWidth: 360 },
  primary: { minHeight: 50, minWidth: 190, borderRadius: radius.md, backgroundColor: colors.blue, alignItems: "center", justifyContent: "center", marginTop: 23, paddingHorizontal: 18 },
  primaryText: { color: "#fff", fontSize: 14, fontWeight: "800" },
});
