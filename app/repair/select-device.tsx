import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { colors, radius } from "../../constants/theme";
import { IconButton } from "../../components/IconButton";

const categories = [
  { key: "Phone", label: "Phones", emoji: "📱", icon: "phone-portrait-outline" as const, copy: "iPhone, Samsung, Pixel and more" },
  { key: "Laptop", label: "Laptops", emoji: "💻", icon: "laptop-outline" as const, copy: "Windows laptops and notebooks" },
  { key: "MacBook", label: "MacBooks", emoji: "🍎", icon: "laptop-outline" as const, copy: "MacBook Air and MacBook Pro" },
  { key: "Tablet", label: "Tablets", emoji: "▣", icon: "tablet-portrait-outline" as const, copy: "iPad and Android tablets" },
];

export default function SelectDevice() {
  const router = useRouter();
  return <SafeAreaView style={s.safe}><ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
    <View style={s.header}><IconButton name="chevron-back" onPress={() => router.back()} /><Text style={s.headerTitle}>Choose your device</Text><View style={s.spacer} /></View>
    <Text style={s.step}>DEVICE 1 OF 2</Text><Text style={s.title}>What are we fixing?</Text><Text style={s.subtitle}>Start with a category. We’ll show the right brands and models next.</Text>
    <View style={s.hero}><Text style={s.heroEmoji}>🛠️</Text><View style={{ flex: 1 }}><Text style={s.heroTitle}>The right specialist starts here</Text><Text style={s.heroCopy}>Tell us what you’re bringing in and we’ll keep the repair details focused.</Text></View></View>
    <Text style={s.section}>Select a category</Text>
    <View style={s.grid}>{categories.map(category => <Pressable key={category.key} onPress={() => router.push(("/repair/models?category=" + encodeURIComponent(category.key)) as never)} style={({ pressed }) => [s.card, pressed && s.pressed]}><View style={s.cardTop}><View style={s.icon}><Text style={s.emoji}>{category.emoji}</Text></View><Ionicons name="arrow-up-right" size={18} color={colors.muted} /></View><Text style={s.cardTitle}>{category.label}</Text><Text style={s.cardCopy}>{category.copy}</Text></Pressable>)}</View>
    <Text style={s.note}>You can change this before matching with a repairer.</Text>
  </ScrollView></SafeAreaView>;
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.card },
  content: { padding: 18, paddingBottom: 42 },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  headerTitle: { fontSize: 19, fontWeight: "800", color: colors.ink },
  spacer: { width: 42 },
  step: { fontSize: 11, color: colors.accent, fontWeight: "800", letterSpacing: 0.8, marginTop: 28 },
  title: { fontSize: 30, lineHeight: 35, fontWeight: "800", color: colors.ink, letterSpacing: -0.8, marginTop: 6 },
  subtitle: { fontSize: 14, color: colors.muted, lineHeight: 21, marginTop: 7 },
  hero: { marginTop: 20, padding: 15, borderRadius: 20, backgroundColor: colors.accentSoft, flexDirection: "row", alignItems: "center", gap: 12 },
  heroEmoji: { fontSize: 31 },
  heroTitle: { fontSize: 14, fontWeight: "800", color: colors.ink },
  heroCopy: { fontSize: 12, color: colors.muted, lineHeight: 17, marginTop: 3 },
  section: { fontSize: 15, fontWeight: "800", color: colors.ink, marginTop: 25, marginBottom: 11 },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  card: { width: "48%", minHeight: 143, borderWidth: 1, borderColor: colors.line, borderRadius: radius.lg, padding: 14, justifyContent: "space-between" },
  cardTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" },
  icon: { width: 47, height: 47, borderRadius: 16, backgroundColor: colors.soft, alignItems: "center", justifyContent: "center" },
  emoji: { fontSize: 25 },
  cardTitle: { fontSize: 16, fontWeight: "800", color: colors.ink, marginTop: 15 },
  cardCopy: { fontSize: 11, lineHeight: 16, color: colors.muted, marginTop: 3 },
  note: { textAlign: "center", fontSize: 12, color: colors.muted, marginTop: 23 },
  pressed: { opacity: 0.78, transform: [{ scale: 0.98 }] },
});
