import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { colors, radius } from "../../constants/theme";
import { IconButton } from "../../components/IconButton";

const brandsByCategory: Record<string, string[]> = { Phone: ["Apple", "Samsung", "Google", "Tecno", "Other"], Laptop: ["HP", "Lenovo", "Dell", "ASUS", "Other"], MacBook: ["Apple"], Tablet: ["Apple", "Samsung", "Other"] };
const issueChoices: Record<string, string[]> = {
  Battery: ["Drains quickly", "Won't charge", "Swollen battery", "Random shutdowns"],
  "Broken screen": ["Cracked glass", "Black display", "Touch not working", "Lines on screen"],
  "Charging port": ["Loose connection", "Not charging", "Only charges at an angle", "Port damaged"],
  Camera: ["Blurry photos", "Camera won't open", "Flash not working", "Cracked lens"],
  Speaker: ["No sound", "Low volume", "Distorted audio", "Microphone issue"],
  "Water damage": ["Phone got wet", "Liquid warning", "Won't turn on", "Corrosion"],
  Software: ["Boot loop", "Frozen screen", "Forgot passcode", "Apps crashing"],
  Motherboard: ["No power", "Short circuit", "Overheating", "Intermittent fault"],
};

export default function RepairOptions() {
  const router = useRouter();
  const { issue, brand: queryBrand, model: queryModel, category } = useLocalSearchParams<{ issue?: string; brand?: string; model?: string; category?: string }>();
  const issueName = String(issue || "General repair");
  const brandOptions = brandsByCategory[String(category || "Phone")] || brandsByCategory.Phone;
  const [brand, setBrand] = React.useState(String(queryBrand || "Apple"));
  const [selectedChoice, setSelectedChoice] = React.useState("");
  const [model, setModel] = React.useState(String(queryModel || ""));
  const [notes, setNotes] = React.useState("");
  const choices = issueChoices[issueName] || ["Needs diagnosis", "Not working", "Intermittent issue", "Physical damage"];
  return <SafeAreaView style={s.safe}><ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
    <View style={s.header}><IconButton name="chevron-back" onPress={() => router.back()} /><Text style={s.headerTitle}>Repair details</Text><View style={s.spacer} /></View>
    <Text style={s.step}>2 OF 3</Text><Text style={s.title}>Tell us about it</Text><Text style={s.subtitle}>A few details help us find the right repairer and give you a clearer estimate.</Text>
    <View style={s.issuePill}><View style={s.issueIcon}><Ionicons name="construct-outline" size={17} color={colors.blue} /></View><View style={s.issueCopy}><Text style={s.issueLabel}>SELECTED ISSUE</Text><Text style={s.issueName}>{issueName}</Text></View><Ionicons name="checkmark-circle" size={21} color={colors.blue} /></View>
    <Text style={s.section}>Phone brand</Text><View style={s.chips}>{brandOptions.map(item => <Pressable key={item} onPress={() => setBrand(item)} style={[s.chip, brand === item && s.chipActive]}><Text style={[s.chipText, brand === item && s.chipTextActive]}>{item}</Text></Pressable>)}</View>
    <Text style={s.section}>Model name</Text><TextInput value={model} onChangeText={setModel} placeholder="e.g. iPhone 14 Pro" placeholderTextColor={colors.muted} style={s.input} />
    <Text style={s.section}>What best describes the problem?</Text><View style={s.choiceGrid}>{choices.map(choice => <Pressable key={choice} onPress={() => setSelectedChoice(choice)} style={[s.choice, selectedChoice === choice && s.choiceActive]}><View style={[s.radio, selectedChoice === choice && s.radioActive]}>{selectedChoice === choice && <View style={s.radioDot} />}</View><Text style={[s.choiceText, selectedChoice === choice && s.choiceTextActive]}>{choice}</Text></Pressable>)}</View>
    <Text style={s.section}>Extra details <Text style={s.optional}>OPTIONAL</Text></Text><TextInput value={notes} onChangeText={setNotes} placeholder="Tell the repairer anything useful..." placeholderTextColor={colors.muted} style={[s.input, s.notes]} multiline textAlignVertical="top" />
    <Pressable onPress={() => router.push(("/repair/device?issue=" + encodeURIComponent(issueName) + "&category=" + encodeURIComponent(String(category || "Phone")) + "&brand=" + encodeURIComponent(brand) + "&model=" + encodeURIComponent(model || "Not specified")) as never)} style={({ pressed }) => [s.cta, pressed && s.pressed]}><Text style={s.ctaText}>Continue to device</Text><Ionicons name="arrow-forward" size={18} color="#fff" /></Pressable>
  </ScrollView></SafeAreaView>;
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.card },
  content: { padding: 18, paddingBottom: 38 },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  headerTitle: { fontSize: 19, fontWeight: "800", color: colors.ink },
  spacer: { width: 42 },
  step: { fontSize: 11, color: colors.accent, fontWeight: "800", letterSpacing: 0.8, marginTop: 28 },
  title: { fontSize: 29, lineHeight: 34, fontWeight: "800", color: colors.ink, letterSpacing: -0.8, marginTop: 6 },
  subtitle: { fontSize: 14, color: colors.muted, lineHeight: 21, marginTop: 7 },
  issuePill: { marginTop: 20, padding: 12, borderRadius: 18, backgroundColor: colors.soft, flexDirection: "row", alignItems: "center", gap: 10 },
  issueIcon: { width: 38, height: 38, borderRadius: 13, backgroundColor: colors.card, alignItems: "center", justifyContent: "center" },
  issueCopy: { flex: 1 },
  issueLabel: { fontSize: 9, color: colors.muted, fontWeight: "800", letterSpacing: 0.9 },
  issueName: { fontSize: 15, color: colors.ink, fontWeight: "800", marginTop: 3 },
  section: { fontSize: 15, color: colors.ink, fontWeight: "800", marginTop: 22, marginBottom: 10 },
  chips: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  chip: { paddingHorizontal: 15, paddingVertical: 10, borderRadius: 17, backgroundColor: colors.soft },
  chipActive: { backgroundColor: colors.blue },
  chipText: { fontSize: 12, color: colors.muted, fontWeight: "700" },
  chipTextActive: { color: "#fff" },
  input: { height: 50, borderRadius: 15, backgroundColor: colors.soft, paddingHorizontal: 14, color: colors.ink, fontSize: 13 },
  choiceGrid: { gap: 9 },
  choice: { minHeight: 48, borderRadius: 15, borderWidth: 1, borderColor: colors.line, paddingHorizontal: 13, flexDirection: "row", alignItems: "center", gap: 10 },
  choiceActive: { borderColor: colors.blue, backgroundColor: "rgba(45,107,218,.08)" },
  radio: { width: 19, height: 19, borderRadius: 10, borderWidth: 1.5, borderColor: colors.line, alignItems: "center", justifyContent: "center" },
  radioActive: { borderColor: colors.blue },
  radioDot: { width: 9, height: 9, borderRadius: 5, backgroundColor: colors.blue },
  choiceText: { fontSize: 13, color: colors.ink, fontWeight: "700" },
  choiceTextActive: { color: colors.blue },
  optional: { fontSize: 9, color: colors.muted, letterSpacing: 0.7 },
  notes: { height: 88, paddingTop: 13 },
  cta: { height: 54, borderRadius: 18, backgroundColor: colors.ink, alignItems: "center", justifyContent: "center", flexDirection: "row", gap: 9, marginTop: 24 },
  ctaText: { color: "#fff", fontSize: 15, fontWeight: "800" },
  pressed: { opacity: 0.8 },
});
