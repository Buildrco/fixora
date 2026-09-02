import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView, ScrollView, View, Text, StyleSheet, Pressable } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { colors, radius } from "../../constants/theme";
import { IconButton } from "../../components/IconButton";

export default function RepairDevice() {
  const router = useRouter();
  const { issue, brand, model } = useLocalSearchParams<{ issue?: string; brand?: string; model?: string }>();
  const initialDevice = [brand, model].filter(value => value && value !== "Not specified").join(" ") || "iPhone 13 Pro";
  const devices = [initialDevice, "iPhone 14 Pro", "Galaxy S24"].filter((value, index, all) => all.indexOf(value) === index);
  const [selectedDevice, setSelectedDevice] = useState(0);
  return <SafeAreaView style={s.safe}><ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
    <View style={s.header}><IconButton name="chevron-back" onPress={() => router.back()} /><Text style={s.title}>Your device</Text><View style={s.spacer} /></View>
    <Text style={s.step}>3 OF 3</Text><Text style={s.heading}>Confirm your device</Text><Text style={s.sub}>Make sure we match your request with the right specialist.</Text>
    <View style={s.summary}><View style={s.summaryIcon}><Ionicons name="construct-outline" size={18} color={colors.blue} /></View><View style={s.summaryCopy}><Text style={s.summaryLabel}>REPAIR REQUEST</Text><Text style={s.summaryValue}>{String(issue || "General repair")}</Text></View></View>
    <Text style={s.section}>Choose a device</Text>
    {devices.map((name, index) => <Pressable key={name} onPress={() => setSelectedDevice(index)} style={[s.item, selectedDevice === index && s.selected]}><View style={s.deviceIcon}><Ionicons name="phone-portrait-outline" size={22} color={selectedDevice === index ? colors.blue : colors.ink} /></View><View style={s.copy}><Text style={s.name}>{name}</Text><Text style={s.meta}>{selectedDevice === index ? "Selected device" : "Tap to select"}</Text></View><View style={[s.radio, selectedDevice === index && s.radioActive]}>{selectedDevice === index && <View style={s.radioDot} />}</View></Pressable>)}
    <Pressable onPress={() => router.push("/repair/repairers" as any)} style={({ pressed }) => [s.cta, pressed && s.pressed]}><Text style={s.ctaText}>Find repairers</Text><Ionicons name="arrow-forward" size={18} color="#fff" /></Pressable>
  </ScrollView></SafeAreaView>;
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.card },
  content: { padding: 18, paddingBottom: 38 },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  title: { fontSize: 19, fontWeight: "800", color: colors.ink },
  spacer: { width: 42 },
  step: { fontSize: 11, color: colors.accent, fontWeight: "800", letterSpacing: 0.8, marginTop: 28 },
  heading: { fontSize: 28, fontWeight: "800", color: colors.ink, marginTop: 6 },
  sub: { fontSize: 14, color: colors.muted, lineHeight: 21, marginTop: 7 },
  summary: { marginTop: 20, padding: 12, borderRadius: 18, backgroundColor: colors.soft, flexDirection: "row", alignItems: "center", gap: 10 },
  summaryIcon: { width: 38, height: 38, borderRadius: 13, backgroundColor: colors.card, alignItems: "center", justifyContent: "center" },
  summaryCopy: { flex: 1 },
  summaryLabel: { fontSize: 9, color: colors.muted, fontWeight: "800", letterSpacing: 0.9 },
  summaryValue: { fontSize: 15, color: colors.ink, fontWeight: "800", marginTop: 3 },
  section: { fontSize: 15, fontWeight: "800", color: colors.ink, marginTop: 24, marginBottom: 11 },
  item: { padding: 13, borderWidth: 1, borderColor: colors.line, borderRadius: radius.md, flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 10 },
  selected: { borderColor: colors.blue, backgroundColor: "rgba(45,107,218,.08)" },
  deviceIcon: { width: 42, height: 42, borderRadius: 14, backgroundColor: colors.soft, alignItems: "center", justifyContent: "center" },
  copy: { flex: 1 },
  name: { fontSize: 14, fontWeight: "800", color: colors.ink },
  meta: { fontSize: 11, color: colors.muted, marginTop: 3 },
  radio: { width: 22, height: 22, borderRadius: 11, borderWidth: 1.5, borderColor: colors.line, alignItems: "center", justifyContent: "center" },
  radioActive: { borderColor: colors.blue },
  radioDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: colors.blue },
  cta: { height: 54, borderRadius: 18, backgroundColor: colors.ink, alignItems: "center", justifyContent: "center", flexDirection: "row", gap: 9, marginTop: 22 },
  ctaText: { color: "#fff", fontSize: 15, fontWeight: "800" },
  pressed: { opacity: 0.8 },
});
