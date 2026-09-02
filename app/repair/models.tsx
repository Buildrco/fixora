import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Pressable, ScrollView, StyleSheet, Text, View, Image } from "react-native";
import { colors, radius } from "../../constants/theme";
import { IconButton } from "../../components/IconButton";

const brandsByCategory: Record<string, string[]> = {
  Phone: ["Apple", "Samsung", "Google", "Tecno", "Other"],
  Laptop: ["HP", "Lenovo", "Dell", "ASUS", "Other"],
  MacBook: ["Apple"],
  Tablet: ["Apple", "Samsung", "Other"],
};

const seriesByKey: Record<string, { name: string; detail: string; image: string }[]> = {
  "Phone-Apple": [
    { name: "iPhone 15 series", detail: "15 · 15 Plus · 15 Pro · 15 Pro Max", image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=700&q=85" },
    { name: "iPhone 14 series", detail: "14 · 14 Plus · 14 Pro · 14 Pro Max", image: "https://images.unsplash.com/photo-1663499482523-1c0c1dec3b7b?auto=format&fit=crop&w=700&q=85" },
    { name: "iPhone 13 series", detail: "13 · 13 mini · 13 Pro · 13 Pro Max", image: "https://images.unsplash.com/photo-1632661674596-df8be070a5c5?auto=format&fit=crop&w=700&q=85" },
    { name: "iPhone 7 / 7 Plus", detail: "7 · 7 Plus", image: "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?auto=format&fit=crop&w=700&q=85" },
  ],
  "Phone-Samsung": [
    { name: "Galaxy S24 series", detail: "S24 · S24+ · S24 Ultra", image: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=700&q=85" },
    { name: "Galaxy S23 series", detail: "S23 · S23+ · S23 Ultra", image: "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?auto=format&fit=crop&w=700&q=85" },
    { name: "Galaxy A series", detail: "A14 · A24 · A34 · A54", image: "https://images.unsplash.com/photo-1565849904461-04a58ad377e0?auto=format&fit=crop&w=700&q=85" },
  ],
  "Phone-Google": [
    { name: "Pixel 8 series", detail: "Pixel 8 · 8 Pro", image: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=700&q=85" },
    { name: "Pixel 7 series", detail: "Pixel 7 · 7 Pro · 7a", image: "https://images.unsplash.com/photo-1598327105854-c8674faddf2c?auto=format&fit=crop&w=700&q=85" },
  ],
  "Phone-Tecno": [
    { name: "Camon series", detail: "Camon 20 · Camon 30", image: "https://images.unsplash.com/photo-1598965402089-897ce52e8355?auto=format&fit=crop&w=700&q=85" },
    { name: "Spark series", detail: "Spark 10 · Spark 20", image: "https://images.unsplash.com/photo-1580910051074-3eb694886505?auto=format&fit=crop&w=700&q=85" },
  ],
  "Phone-Other": [{ name: "Other phone", detail: "Tell us the exact model next", image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=700&q=85" }],
  "Laptop-HP": [{ name: "HP Pavilion series", detail: "Pavilion · Envy · EliteBook", image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=700&q=85" }, { name: "HP ProBook series", detail: "ProBook · ZBook", image: "https://images.unsplash.com/photo-1484788984921-03950022c9ef?auto=format&fit=crop&w=700&q=85" }],
  "Laptop-Lenovo": [{ name: "ThinkPad series", detail: "ThinkPad · Yoga", image: "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?auto=format&fit=crop&w=700&q=85" }, { name: "IdeaPad series", detail: "IdeaPad 3 · 5 · Slim", image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=700&q=85" }],
  "Laptop-Dell": [{ name: "Inspiron series", detail: "Inspiron · Vostro", image: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&w=700&q=85" }, { name: "XPS series", detail: "XPS 13 · XPS 15", image: "https://images.unsplash.com/photo-1593642532400-2682810df593?auto=format&fit=crop&w=700&q=85" }],
  "Laptop-ASUS": [{ name: "VivoBook series", detail: "VivoBook · ZenBook", image: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=700&q=85" }, { name: "ROG series", detail: "ROG Strix · Zephyrus", image: "https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?auto=format&fit=crop&w=700&q=85" }],
  "Laptop-Other": [{ name: "Other laptop", detail: "Tell us the exact model next", image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=700&q=85" }],
  "MacBook-Apple": [{ name: "MacBook Air", detail: "M1 · M2 · M3 · M4", image: "https://images.unsplash.com/photo-1517336714739-489689fd1ca8?auto=format&fit=crop&w=700&q=85" }, { name: "MacBook Pro", detail: "13-inch · 14-inch · 16-inch", image: "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?auto=format&fit=crop&w=700&q=85" }],
  "Tablet-Apple": [{ name: "iPad series", detail: "iPad · Air · mini · Pro", image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=700&q=85" }],
  "Tablet-Samsung": [{ name: "Galaxy Tab series", detail: "Tab S · Tab A", image: "https://images.unsplash.com/photo-1561154464-82e9adf32764?auto=format&fit=crop&w=700&q=85" }],
  "Tablet-Other": [{ name: "Other tablet", detail: "Tell us the exact model next", image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=700&q=85" }],
};

export default function RepairModels() {
  const router = useRouter();
  const { category = "Phone", issue = "General repair" } = useLocalSearchParams<{ category?: string; issue?: string }>();
  const categoryName = String(category);
  const brands = brandsByCategory[categoryName] || brandsByCategory.Phone;
  const [brand, setBrand] = React.useState(brands[0]);
  const [selected, setSelected] = React.useState("");
  const series = seriesByKey[categoryName + "-" + brand] || seriesByKey["Phone-Other"];
  return <SafeAreaView style={s.safe}><ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
    <View style={s.header}><IconButton name="chevron-back" onPress={() => router.back()} /><Text style={s.headerTitle}>Pick a model</Text><View style={s.spacer} /></View>
    <Text style={s.step}>DEVICE 2 OF 2</Text><Text style={s.title}>Which {categoryName.toLowerCase()} is it?</Text><Text style={s.subtitle}>We group similar models together so your repairer has the right parts ready.</Text>
    <Text style={s.section}>Choose a brand</Text><ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.brandRow}>{brands.map(item => <Pressable key={item} onPress={() => { setBrand(item); setSelected(""); }} style={[s.brand, brand === item && s.brandActive]}><Text style={[s.brandText, brand === item && s.brandTextActive]}>{item}</Text></Pressable>)}</ScrollView>
    <Text style={s.section}>Choose a model series</Text><View style={s.seriesList}>{series.map(item => <Pressable key={item.name} onPress={() => setSelected(item.name)} style={[s.series, selected === item.name && s.seriesActive]}><Image source={{ uri: item.image }} style={s.seriesImage} /><View style={s.seriesCopy}><Text style={s.seriesTitle}>{item.name}</Text><Text style={s.seriesDetail}>{item.detail}</Text></View><View style={[s.radio, selected === item.name && s.radioActive]}>{selected === item.name && <View style={s.radioDot} />}</View></Pressable>)}</View>
    <Pressable disabled={!selected} onPress={() => router.push(("/repair/options?issue=" + encodeURIComponent(String(issue)) + "&category=" + encodeURIComponent(categoryName) + "&brand=" + encodeURIComponent(brand) + "&model=" + encodeURIComponent(selected)) as never)} style={({ pressed }) => [s.cta, !selected && s.ctaDisabled, pressed && s.pressed]}><Text style={s.ctaText}>Continue to repair details</Text><Ionicons name="arrow-forward" size={18} color="#fff" /></Pressable>
  </ScrollView></SafeAreaView>;
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.card }, content: { padding: 18, paddingBottom: 42 }, header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" }, headerTitle: { fontSize: 19, fontWeight: "800", color: colors.ink }, spacer: { width: 42 }, step: { fontSize: 11, color: colors.accent, fontWeight: "800", letterSpacing: 0.8, marginTop: 28 }, title: { fontSize: 29, lineHeight: 34, fontWeight: "800", color: colors.ink, letterSpacing: -0.8, marginTop: 6 }, subtitle: { fontSize: 14, color: colors.muted, lineHeight: 21, marginTop: 7 }, section: { fontSize: 15, fontWeight: "800", color: colors.ink, marginTop: 23, marginBottom: 10 }, brandRow: { gap: 8, paddingBottom: 1 }, brand: { paddingHorizontal: 15, paddingVertical: 10, borderRadius: 17, backgroundColor: colors.soft }, brandActive: { backgroundColor: colors.blue }, brandText: { fontSize: 12, color: colors.muted, fontWeight: "700" }, brandTextActive: { color: "#fff" }, seriesList: { gap: 10 }, series: { minHeight: 86, padding: 10, borderWidth: 1, borderColor: colors.line, borderRadius: radius.lg, flexDirection: "row", alignItems: "center", gap: 11 }, seriesActive: { borderColor: colors.blue, backgroundColor: "rgba(45,127,249,.07)" }, seriesImage: { width: 66, height: 66, borderRadius: 15, backgroundColor: colors.soft }, seriesCopy: { flex: 1 }, seriesTitle: { fontSize: 14, fontWeight: "800", color: colors.ink }, seriesDetail: { fontSize: 11, color: colors.muted, lineHeight: 16, marginTop: 4 }, radio: { width: 21, height: 21, borderRadius: 11, borderWidth: 1.5, borderColor: colors.line, alignItems: "center", justifyContent: "center" }, radioActive: { borderColor: colors.blue }, radioDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: colors.blue }, cta: { height: 54, borderRadius: 18, backgroundColor: colors.ink, alignItems: "center", justifyContent: "center", flexDirection: "row", gap: 9, marginTop: 24 }, ctaDisabled: { opacity: 0.35 }, ctaText: { color: "#fff", fontSize: 15, fontWeight: "800" }, pressed: { opacity: 0.8 },
});
