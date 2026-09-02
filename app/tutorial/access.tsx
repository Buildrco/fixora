import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView, ScrollView, Text, View, StyleSheet, Image, Pressable } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { colors, radius } from "../../constants/theme";
import { IconButton } from "../../components/IconButton";

const paidTutorials: Record<string, { title: string; meta: string; price: string; image: string }> = {
  "iphone-diagnosis": { title: "How to diagnose an iPhone with no power", meta: "12 min · Intermediate", price: "GH₵25", image: "https://images.unsplash.com/photo-1597423244037-9d8c2d0f4b3d?auto=format&fit=crop&w=1000&q=85" },
  "charging-ic": { title: "Charging IC diagnosis", meta: "18 min · Advanced", price: "GH₵35", image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1000&q=85" },
  "microsoldering-basics": { title: "Microsoldering tools and setup", meta: "15 min · Beginner", price: "GH₵30", image: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&w=1000&q=85" },
  "water-damage-recovery": { title: "Water damage recovery", meta: "14 min · Intermediate", price: "GH₵28", image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1000&q=85" },
};

export default function TutorialAccess() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const tutorial = paidTutorials[String(id)] || paidTutorials["iphone-diagnosis"];
  return <SafeAreaView style={s.safe}><ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
    <View style={s.head}><IconButton name="chevron-back" onPress={() => router.back()} /><View style={s.secure}><Ionicons name="lock-closed" size={13} color={colors.green} /><Text style={s.secureText}>SECURE ACCESS</Text></View><View style={s.headSpacer} /></View>
    <View style={s.hero}><Image source={{ uri: tutorial.image }} style={s.heroImage} /><View style={s.heroShade} /><View style={s.lock}><Ionicons name="lock-closed" size={23} color="#fff" /></View></View>
    <View style={s.card}><View style={s.kickerRow}><Ionicons name="star" size={13} color={colors.accent} /><Text style={s.kicker}>PREMIUM TUTORIAL</Text></View><Text style={s.title}>{tutorial.title}</Text><Text style={s.meta}>{tutorial.meta} · Verified repairer</Text><View style={s.divider} /><View style={s.priceRow}><View><Text style={s.priceLabel}>One-time access</Text><Text style={s.priceSub}>Watch whenever you’re ready</Text></View><Text style={s.price}>{tutorial.price}</Text></View><Pressable style={({ pressed }) => [s.cta, pressed && s.pressed]}><Text style={s.ctaText}>Pay to unlock video</Text><Ionicons name="arrow-forward" size={17} color="#fff" /></Pressable><Text style={s.note}><Ionicons name="shield-checkmark-outline" size={14} color={colors.green} /> Secure checkout · Full tutorial access</Text></View>
  </ScrollView></SafeAreaView>;
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#fff" },
  content: { padding: 18, paddingBottom: 40 },
  head: { height: 48, flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  headSpacer: { width: 42 },
  secure: { flexDirection: "row", alignItems: "center", gap: 5 },
  secureText: { fontSize: 9, fontWeight: "800", letterSpacing: 0.8, color: colors.green },
  hero: { height: 270, borderRadius: radius.xl, overflow: "hidden", marginTop: 18 },
  heroImage: { width: "100%", height: "100%" },
  heroShade: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0,0,0,.34)" },
  lock: { position: "absolute", alignSelf: "center", top: 106, width: 58, height: 58, borderRadius: 29, backgroundColor: colors.blue, alignItems: "center", justifyContent: "center" },
  card: { padding: 18, marginTop: 16, borderRadius: radius.lg, backgroundColor: colors.soft },
  kickerRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  kicker: { fontSize: 10, fontWeight: "800", letterSpacing: 1, color: colors.accent },
  title: { fontSize: 24, lineHeight: 29, fontWeight: "800", color: colors.ink, marginTop: 8 },
  meta: { fontSize: 12, color: colors.muted, marginTop: 7 },
  divider: { height: 1, backgroundColor: colors.line, marginVertical: 18 },
  priceRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  priceLabel: { fontSize: 14, fontWeight: "800", color: colors.ink },
  priceSub: { fontSize: 12, color: colors.muted, marginTop: 4 },
  price: { fontSize: 20, fontWeight: "800", color: colors.ink },
  cta: { height: 54, borderRadius: radius.md, backgroundColor: colors.ink, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 9, marginTop: 20 },
  ctaText: { color: "#fff", fontSize: 15, fontWeight: "800" },
  note: { textAlign: "center", color: colors.muted, fontSize: 11, marginTop: 13 },
  pressed: { opacity: 0.78 },
});
