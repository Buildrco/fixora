import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView, View, Text, StyleSheet, Pressable } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { colors, radius } from "../../constants/theme";

export default function RepairConfirmation() {
  const router = useRouter();
  const { issue, repairer, device } = useLocalSearchParams<{ issue?: string; repairer?: string; device?: string }>();
  return <SafeAreaView style={styles.safe}><View style={styles.content}><View style={styles.icon}><Ionicons name="checkmark" size={38} color="#fff" /></View><Text style={styles.heading}>You’re connected</Text><Text style={styles.sub}>{String(repairer || "Your repairer")} has your request. You can continue the conversation once live messaging is connected.</Text><View style={styles.card}><Text style={styles.label}>Repairer</Text><Text style={styles.value}>{String(repairer || "Selected repairer")}</Text><Text style={styles.label}>Device</Text><Text style={styles.value}>{String(device || "Selected device")}</Text><Text style={styles.label}>Issue</Text><Text style={styles.value}>{String(issue || "Selected repair issue")}</Text><Text style={styles.label}>Status</Text><Text style={styles.value}>Request ready to send</Text></View><Pressable style={({ pressed }) => [styles.cta, pressed && styles.pressed]} onPress={() => router.replace("/")}><Text style={styles.ctaText}>Back to Fixora</Text></Pressable></View></SafeAreaView>;
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.card },
  content: { padding: 24, flex: 1, justifyContent: "center" },
  icon: { alignSelf: "center", width: 76, height: 76, borderRadius: radius.lg, backgroundColor: colors.blue, alignItems: "center", justifyContent: "center" },
  heading: { fontSize: 28, fontWeight: "800", color: colors.ink, textAlign: "center", marginTop: 20 },
  sub: { fontSize: 14, lineHeight: 21, color: colors.muted, textAlign: "center", marginTop: 8 },
  card: { marginTop: 24, borderRadius: radius.md, backgroundColor: colors.soft, padding: 17 },
  label: { fontSize: 11, color: colors.muted, marginTop: 8 },
  value: { fontSize: 14, fontWeight: "800", color: colors.ink, marginTop: 3 },
  cta: { height: 54, borderRadius: radius.md, backgroundColor: colors.ink, alignItems: "center", justifyContent: "center", marginTop: 22 },
  ctaText: { color: "#fff", fontWeight: "800", fontSize: 15 },
  pressed: { opacity: 0.8 },
});
