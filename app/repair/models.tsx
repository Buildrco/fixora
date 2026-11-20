import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Image, Linking, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { colors, radius } from "../../constants/theme";
import { IconButton } from "../../components/IconButton";

type ModelOption = { name: string; detail: string; image?: string; sourceUrl?: string; sourceLabel?: string };
type PhoneGroup = { family: string; models: string[]; image?: string; sourceUrl?: string; sourceLabel?: string };

const brandsByCategory: Record<string, string[]> = {
  Phone: ["Apple", "Samsung", "Google", "Tecno", "Other"],
  Laptop: ["HP", "Lenovo", "Dell", "ASUS", "Other"],
  MacBook: ["Apple"],
  Tablet: ["Apple", "Samsung", "Other"],
};

const commonsSource = (file: string) => "https://commons.wikimedia.org/wiki/File:" + encodeURIComponent(file).replace(/%20/g, "_");
const commonsCredit = "Wikimedia Commons · CC BY-SA";
const appleSource = "https://www.apple.com/iphone-18-pro/";
const samsungSource = "https://www.samsung.com/us/smartphones/galaxy-s24-ultra/";

const appleGroups: PhoneGroup[] = [
  { family: "iPhone 18", models: ["18", "18 Pro", "18 Pro Max", "18 Pro Max (US)"], image: "https://www.apple.com/v/iphone-18-pro/e/images/site/localnav/iphone_18_pro__ezuydx8yjcia_large.png", sourceUrl: appleSource, sourceLabel: "Apple" },
  { family: "iPhone 18", models: ["18 Duo"], image: "https://www.apple.com/v/iphone-18-pro/e/images/site/localnav/iphone_duo__es1je56gg18i_large.png", sourceUrl: appleSource, sourceLabel: "Apple" },
  { family: "iPhone 17", models: ["17e", "17", "Air", "17 Pro", "17 Pro Max"], image: "https://thumb.wikimedia.org/wikipedia/commons/thumb/e/e6/IPhone_17_Vector.svg/500px-IPhone_17_Vector.svg.png", sourceUrl: commonsSource("IPhone 17 Vector.svg"), sourceLabel: commonsCredit },
  { family: "iPhone 16", models: ["16e", "16", "16 Plus", "16 Pro", "16 Pro Max"], image: "https://thumb.wikimedia.org/wikipedia/commons/thumb/7/7c/IPhone_16_Vector.svg/500px-IPhone_16_Vector.svg.png", sourceUrl: commonsSource("IPhone 16 Vector.svg"), sourceLabel: commonsCredit },
  { family: "iPhone 15", models: ["15", "15 Plus", "15 Pro", "15 Pro Max"], image: "https://thumb.wikimedia.org/wikipedia/commons/thumb/e/ee/IPhone_15_Vector.svg/500px-IPhone_15_Vector.svg.png", sourceUrl: commonsSource("IPhone 15 Vector.svg"), sourceLabel: commonsCredit },
  { family: "iPhone 14", models: ["14", "14 Plus", "14 Pro", "14 Pro Max"], image: "https://thumb.wikimedia.org/wikipedia/commons/thumb/6/61/IPhone_14_vector.svg/500px-IPhone_14_vector.svg.png", sourceUrl: commonsSource("IPhone 14 vector.svg"), sourceLabel: commonsCredit },
  { family: "iPhone 13", models: ["13", "13 mini", "13 Pro", "13 Pro Max"], image: "https://thumb.wikimedia.org/wikipedia/commons/thumb/0/0c/IPhone_13_vector.svg/500px-IPhone_13_vector.svg.png", sourceUrl: commonsSource("IPhone 13 vector.svg"), sourceLabel: commonsCredit },
  { family: "iPhone 12", models: ["12", "12 mini", "12 Pro", "12 Pro Max"], image: "https://thumb.wikimedia.org/wikipedia/commons/thumb/3/34/IPhone_12_Blue.svg/500px-IPhone_12_Blue.svg.png", sourceUrl: commonsSource("IPhone 12 Blue.svg"), sourceLabel: commonsCredit },
  { family: "iPhone 11", models: ["11", "11 Pro", "11 Pro Max"], image: "https://thumb.wikimedia.org/wikipedia/commons/thumb/5/54/IPhone_11_White.svg/500px-IPhone_11_White.svg.png", sourceUrl: commonsSource("IPhone 11 White.svg"), sourceLabel: commonsCredit },
  { family: "iPhone X", models: ["X", "XR", "XS", "XS Max"], image: "https://thumb.wikimedia.org/wikipedia/commons/thumb/3/32/IPhone_X_vector.svg/500px-IPhone_X_vector.svg.png", sourceUrl: commonsSource("IPhone X vector.svg"), sourceLabel: commonsCredit },
  { family: "iPhone 8", models: ["8", "8 Plus", "SE (2nd generation)", "SE (3rd generation)"], image: "https://thumb.wikimedia.org/wikipedia/commons/thumb/5/5d/IPhone_8_vector.svg/500px-IPhone_8_vector.svg.png", sourceUrl: commonsSource("IPhone 8 vector.svg"), sourceLabel: commonsCredit },
  { family: "iPhone 7", models: ["7", "7 Plus"], image: "https://thumb.wikimedia.org/wikipedia/commons/thumb/6/6c/IPhone_7_mockup_template_PSD.jpg/500px-IPhone_7_mockup_template_PSD.jpg", sourceUrl: commonsSource("IPhone 7 mockup template PSD.jpg"), sourceLabel: commonsCredit },
  { family: "iPhone 6", models: ["6", "6 Plus", "6s", "6s Plus", "SE (1st generation)"], image: "https://thumb.wikimedia.org/wikipedia/commons/thumb/0/0f/IPhone_6_Space_Gray.svg/500px-IPhone_6_Space_Gray.svg.png", sourceUrl: commonsSource("IPhone 6 Space Gray.svg"), sourceLabel: commonsCredit },
  { family: "iPhone 5", models: ["5", "5c", "5s"], image: "https://thumb.wikimedia.org/wikipedia/commons/thumb/f/fa/IPhone_5.png/500px-IPhone_5.png", sourceUrl: commonsSource("IPhone 5.png"), sourceLabel: commonsCredit },
  { family: "iPhone 4", models: ["4", "4s"], image: "https://thumb.wikimedia.org/wikipedia/commons/thumb/a/ad/IPhone_1st_Gen.svg/500px-IPhone_1st_Gen.svg.png", sourceUrl: commonsSource("IPhone 1st Gen.svg"), sourceLabel: commonsCredit },
  { family: "iPhone 3", models: ["3G", "3GS"], image: "https://thumb.wikimedia.org/wikipedia/commons/thumb/a/ad/IPhone_1st_Gen.svg/500px-IPhone_1st_Gen.svg.png", sourceUrl: commonsSource("IPhone 1st Gen.svg"), sourceLabel: commonsCredit },
  { family: "iPhone 2G", models: ["2G"], image: "https://thumb.wikimedia.org/wikipedia/commons/thumb/a/ad/IPhone_1st_Gen.svg/500px-IPhone_1st_Gen.svg.png", sourceUrl: commonsSource("IPhone 1st Gen.svg"), sourceLabel: commonsCredit },
];

const expandGroups = (prefix: string, groups: PhoneGroup[]): ModelOption[] => groups.flatMap(group => group.models.map(model => ({ name: prefix + model, detail: group.family + " family", image: group.image, sourceUrl: group.sourceUrl, sourceLabel: group.sourceLabel })));
const applePhones = expandGroups("iPhone ", appleGroups);
const samsungRows: ModelOption[] = [
  { name: "Galaxy S26 Ultra", detail: "Galaxy S26 family" }, { name: "Galaxy S26+", detail: "Galaxy S26 family" }, { name: "Galaxy S26", detail: "Galaxy S26 family" },
  { name: "Galaxy S25 Ultra", detail: "Galaxy S25 family" }, { name: "Galaxy S25+", detail: "Galaxy S25 family" }, { name: "Galaxy S25", detail: "Galaxy S25 family" },
  { name: "Galaxy S24 Ultra", detail: "Galaxy S24 family", image: "https://thumb.wikimedia.org/wikipedia/commons/thumb/e/ed/Samsung_S24_Ultra_Phone.png/500px-Samsung_S24_Ultra_Phone.png", sourceUrl: commonsSource("Samsung S24 Ultra Phone.png"), sourceLabel: commonsCredit },
  { name: "Galaxy S24+", detail: "Galaxy S24 family", image: "https://thumb.wikimedia.org/wikipedia/commons/thumb/e/ed/Samsung_S24_Ultra_Phone.png/500px-Samsung_S24_Ultra_Phone.png", sourceUrl: commonsSource("Samsung S24 Ultra Phone.png"), sourceLabel: commonsCredit },
  { name: "Galaxy S24", detail: "Galaxy S24 family", image: "https://thumb.wikimedia.org/wikipedia/commons/thumb/e/ed/Samsung_S24_Ultra_Phone.png/500px-Samsung_S24_Ultra_Phone.png", sourceUrl: commonsSource("Samsung S24 Ultra Phone.png"), sourceLabel: commonsCredit },
  { name: "Galaxy S23 Ultra", detail: "Galaxy S23 family" }, { name: "Galaxy S23+", detail: "Galaxy S23 family" }, { name: "Galaxy S23", detail: "Galaxy S23 family" },
  { name: "Galaxy S22 Ultra", detail: "Galaxy S22 family" }, { name: "Galaxy S22+", detail: "Galaxy S22 family" }, { name: "Galaxy S22", detail: "Galaxy S22 family" },
  { name: "Galaxy S21 series", detail: "S21 · S21+ · S21 Ultra · S21 FE" }, { name: "Galaxy S20 series", detail: "S20 · S20+ · S20 Ultra · S20 FE" },
  { name: "Galaxy Z Fold7", detail: "Galaxy Z Fold family" }, { name: "Galaxy Z Fold6", detail: "Galaxy Z Fold family" }, { name: "Galaxy Z Fold5", detail: "Galaxy Z Fold family" }, { name: "Galaxy Z Fold4", detail: "Galaxy Z Fold family" },
  { name: "Galaxy Z Flip7", detail: "Galaxy Z Flip family" }, { name: "Galaxy Z Flip6", detail: "Galaxy Z Flip family" }, { name: "Galaxy Z Flip5", detail: "Galaxy Z Flip family" }, { name: "Galaxy Z Flip4", detail: "Galaxy Z Flip family" },
  { name: "Galaxy A56", detail: "Galaxy A family" }, { name: "Galaxy A55", detail: "Galaxy A family" }, { name: "Galaxy A54", detail: "Galaxy A family" }, { name: "Galaxy A35", detail: "Galaxy A family" }, { name: "Galaxy A34", detail: "Galaxy A family" }, { name: "Galaxy A25", detail: "Galaxy A family" }, { name: "Galaxy A15", detail: "Galaxy A family" }, { name: "Galaxy A14", detail: "Galaxy A family" },
  { name: "Galaxy Note20 Ultra", detail: "Galaxy Note20 family" }, { name: "Galaxy Note20", detail: "Galaxy Note20 family" }, { name: "Galaxy Note10", detail: "Galaxy Note family" }, { name: "Galaxy Note9", detail: "Galaxy Note family" }, { name: "Galaxy Note8", detail: "Galaxy Note family" },
  { name: "Galaxy M55", detail: "Galaxy M family" }, { name: "Galaxy M35", detail: "Galaxy M family" }, { name: "Galaxy M15", detail: "Galaxy M family" },
];
const googleRows: ModelOption[] = [
  { name: "Pixel 10 Pro XL", detail: "Pixel 10 family" }, { name: "Pixel 10 Pro", detail: "Pixel 10 family" }, { name: "Pixel 10", detail: "Pixel 10 family" },
  { name: "Pixel 9 Pro XL", detail: "Pixel 9 family" }, { name: "Pixel 9 Pro", detail: "Pixel 9 family" }, { name: "Pixel 9", detail: "Pixel 9 family" },
  { name: "Pixel 8 Pro", detail: "Pixel 8 family", image: "https://thumb.wikimedia.org/wikipedia/commons/thumb/5/57/Google_Pixel_8_Pro_front.svg/500px-Google_Pixel_8_Pro_front.svg.png", sourceUrl: commonsSource("Google Pixel 8 Pro front.svg"), sourceLabel: commonsCredit },
  { name: "Pixel 8", detail: "Pixel 8 family", image: "https://thumb.wikimedia.org/wikipedia/commons/thumb/9/93/Google_Pixel_8_front.svg/500px-Google_Pixel_8_front.svg.png", sourceUrl: commonsSource("Google Pixel 8 front.svg"), sourceLabel: commonsCredit },
  { name: "Pixel 7 series", detail: "Pixel 7 · 7 Pro · 7a" }, { name: "Pixel 6 series", detail: "Pixel 6 · 6 Pro · 6a" }, { name: "Pixel 5", detail: "Pixel 5 family" }, { name: "Pixel 4 series", detail: "Pixel 4 · 4 XL · 4a" }, { name: "Pixel 3 series", detail: "Pixel 3 · 3 XL · 3a" },
];
const tecnoRows: ModelOption[] = [
  { name: "Camon 40 Premier", detail: "Tecno Camon family" }, { name: "Camon 40", detail: "Tecno Camon family" }, { name: "Camon 30 Premier", detail: "Tecno Camon family" }, { name: "Camon 30", detail: "Tecno Camon family" }, { name: "Camon 20", detail: "Tecno Camon family" },
  { name: "Spark 40", detail: "Tecno Spark family" }, { name: "Spark 30", detail: "Tecno Spark family" }, { name: "Spark 20", detail: "Tecno Spark family" }, { name: "Spark 10", detail: "Tecno Spark family" }, { name: "Phantom V Fold2", detail: "Tecno Phantom family" }, { name: "Phantom V Flip2", detail: "Tecno Phantom family" },
];
const phoneModelsByBrand: Record<string, ModelOption[]> = {
  Apple: applePhones,
  Samsung: samsungRows,
  Google: googleRows,
  Tecno: tecnoRows,
  Other: [{ name: "Other phone", detail: "Tell us the exact model next" }],
};

const otherSeriesByKey: Record<string, ModelOption[]> = {
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

function DeviceImage({ item, category }: { item: ModelOption; category: string }) {
  const [failed, setFailed] = React.useState(false);
  if (!item.image || failed) {
    const icon = category === "Laptop" || category === "MacBook" ? "laptop-outline" : category === "Tablet" ? "tablet-portrait-outline" : "phone-portrait-outline";
    return <View style={s.seriesImageFallback}><Ionicons name={icon as keyof typeof Ionicons.glyphMap} size={27} color={colors.muted} /></View>;
  }
  return <Image source={{ uri: item.image }} style={s.seriesImage} resizeMode="contain" accessibilityLabel={item.name + " product image"} onError={() => setFailed(true)} />;
}

export default function RepairModels() {
  const router = useRouter();
  const { category = "Phone", issue = "General repair", search: initialSearch = "" } = useLocalSearchParams<{ category?: string; issue?: string; search?: string }>();
  const categoryName = String(category);
  const brands = brandsByCategory[categoryName] || brandsByCategory.Phone;
  const initialSearchText = String(initialSearch);
  const normalizedInitialSearch = initialSearchText.toLowerCase();
  const suggestedBrand = normalizedInitialSearch.includes("samsung") || normalizedInitialSearch.includes("galaxy") ? "Samsung" : normalizedInitialSearch.includes("pixel") || normalizedInitialSearch.includes("google") ? "Google" : normalizedInitialSearch.includes("tecno") || normalizedInitialSearch.includes("camon") || normalizedInitialSearch.includes("spark") ? "Tecno" : brands[0];
  const [brand, setBrand] = React.useState(brands.includes(suggestedBrand) ? suggestedBrand : brands[0]);
  const [selected, setSelected] = React.useState("");
  const [searchText, setSearchText] = React.useState(initialSearchText);
  const availableModels = categoryName === "Phone" ? (phoneModelsByBrand[brand] || phoneModelsByBrand.Apple) : (otherSeriesByKey[categoryName + "-" + brand] || []);
  const query = searchText.trim().toLowerCase();
  const series = availableModels.filter(item => !query || (item.name + " " + item.detail + " " + brand).toLowerCase().includes(query));

  return <SafeAreaView style={s.safe}><ScrollView contentContainerStyle={s.content} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
    <View style={s.header}><IconButton name="chevron-back" onPress={() => router.back()} /><Text style={s.headerTitle}>Pick a model</Text><View style={s.spacer} /></View>
    <Text style={s.step}>DEVICE 2 OF 2</Text><Text style={s.title}>Which {categoryName.toLowerCase()} is it?</Text><Text style={s.subtitle}>Choose the exact model so your repairer has the right parts ready.</Text>
    <Text style={s.section}>Choose a brand</Text><ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.brandRow}>{brands.map(item => <Pressable key={item} onPress={() => { setBrand(item); setSelected(""); }} style={[s.brand, brand === item && s.brandActive]}><Text style={[s.brandText, brand === item && s.brandTextActive]}>{item}</Text></Pressable>)}</ScrollView>
    <View style={s.searchBox}><Ionicons name="search-outline" size={19} color={colors.muted} /><TextInput value={searchText} onChangeText={setSearchText} placeholder={categoryName === "Phone" ? "Search iPhone, Galaxy, Pixel…" : "Search model"} placeholderTextColor={colors.muted} style={s.searchInput} returnKeyType="search" autoCapitalize="none" accessibilityLabel="Search device models" />{searchText.length > 0 && <Pressable onPress={() => setSearchText("")} accessibilityLabel="Clear model search"><Ionicons name="close-circle" size={19} color={colors.muted} /></Pressable>}</View>
    <Text style={s.section}>Choose a model</Text>
    {series.length ? <View style={s.seriesList}>{series.map(item => <View key={item.name} style={s.seriesWrap}><Pressable onPress={() => setSelected(item.name)} style={[s.series, selected === item.name && s.seriesActive]}><DeviceImage item={item} category={categoryName} /><View style={s.seriesCopy}><Text style={s.seriesTitle}>{item.name}</Text><Text style={s.seriesDetail}>{item.detail}</Text></View><View style={[s.radio, selected === item.name && s.radioActive]}>{selected === item.name && <View style={s.radioDot} />}</View></Pressable>{item.sourceUrl && <Pressable onPress={() => Linking.openURL(item.sourceUrl!)} style={s.sourceLink}><Text style={s.sourceText}>Image: {item.sourceLabel}</Text></Pressable>}</View>)}</View> : <View style={s.empty}><Ionicons name="search-outline" size={24} color={colors.muted} /><Text style={s.emptyText}>No models match “{searchText}”. Try a shorter search.</Text></View>}
    <Pressable disabled={!selected} onPress={() => router.push(("/repair/options?issue=" + encodeURIComponent(String(issue)) + "&category=" + encodeURIComponent(categoryName) + "&brand=" + encodeURIComponent(brand) + "&model=" + encodeURIComponent(selected)) as never)} style={({ pressed }) => [s.cta, !selected && s.ctaDisabled, pressed && s.pressed]}><Text style={s.ctaText}>Continue to repair details</Text><Ionicons name="arrow-forward" size={18} color="#fff" /></Pressable>
  </ScrollView></SafeAreaView>;
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.card }, content: { padding: 18, paddingBottom: 42 }, header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" }, headerTitle: { fontSize: 19, fontWeight: "800", color: colors.ink }, spacer: { width: 42 }, step: { fontSize: 11, color: colors.accent, fontWeight: "800", letterSpacing: 0.8, marginTop: 28 }, title: { fontSize: 29, lineHeight: 34, fontWeight: "800", color: colors.ink, letterSpacing: -0.8, marginTop: 6 }, subtitle: { fontSize: 14, color: colors.muted, lineHeight: 21, marginTop: 7 }, section: { fontSize: 15, fontWeight: "800", color: colors.ink, marginTop: 20, marginBottom: 10 }, brandRow: { gap: 8, paddingBottom: 1 }, brand: { paddingHorizontal: 15, paddingVertical: 10, borderRadius: 17, backgroundColor: colors.soft }, brandActive: { backgroundColor: colors.blue }, brandText: { fontSize: 12, color: colors.muted, fontWeight: "700" }, brandTextActive: { color: "#fff" }, searchBox: { minHeight: 48, marginTop: 18, paddingHorizontal: 13, borderRadius: 15, backgroundColor: colors.soft, flexDirection: "row", alignItems: "center", gap: 9 }, searchInput: { flex: 1, color: colors.ink, fontSize: 13, paddingVertical: 10 }, seriesList: { gap: 9 }, seriesWrap: { gap: 3 }, series: { minHeight: 82, padding: 8, borderWidth: 1, borderColor: colors.line, borderRadius: radius.lg, flexDirection: "row", alignItems: "center", gap: 11, backgroundColor: "#fff" }, seriesActive: { borderColor: colors.blue, backgroundColor: "rgba(45,127,249,.06)" }, seriesImage: { width: 58, height: 68, borderRadius: 10, backgroundColor: "#fff" }, seriesImageFallback: { width: 58, height: 68, borderRadius: 10, backgroundColor: "#fff", alignItems: "center", justifyContent: "center" }, seriesCopy: { flex: 1 }, seriesTitle: { fontSize: 14, fontWeight: "800", color: colors.ink }, seriesDetail: { fontSize: 11, color: colors.muted, lineHeight: 16, marginTop: 4 }, sourceLink: { alignSelf: "flex-start", marginLeft: 79, paddingVertical: 2 }, sourceText: { fontSize: 9, color: colors.muted, textDecorationLine: "underline" }, empty: { minHeight: 110, alignItems: "center", justifyContent: "center", gap: 8 }, emptyText: { maxWidth: 260, color: colors.muted, textAlign: "center", fontSize: 12 }, radio: { width: 21, height: 21, borderRadius: 11, borderWidth: 1.5, borderColor: colors.line, alignItems: "center", justifyContent: "center" }, radioActive: { borderColor: colors.blue }, radioDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: colors.blue }, cta: { height: 54, borderRadius: 18, backgroundColor: colors.ink, alignItems: "center", justifyContent: "center", flexDirection: "row", gap: 9, marginTop: 24 }, ctaDisabled: { opacity: 0.35 }, ctaText: { color: "#fff", fontSize: 15, fontWeight: "800" }, pressed: { opacity: 0.8 },
});
