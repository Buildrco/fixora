import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView, ScrollView, Text, View, StyleSheet, Image, Pressable } from "react-native";
import { colors, radius } from "../constants/theme";
import { Chip } from "../components/Chip";
import { IconButton } from "../components/IconButton";
import { useRouter } from "expo-router";

type Tutorial = { id: string; title: string; meta: string; price: string; image: string };
const tutorials: Tutorial[] = [
  { id: "iphone-diagnosis", title: "How to diagnose an iPhone with no power", meta: "12 min · Intermediate", price: "GH₵25", image: "https://images.unsplash.com/photo-1581092919535-7146ff8fce9b?auto=format&fit=crop&w=1000&q=85" },
  { id: "charging-ic", title: "Charging IC diagnosis", meta: "18 min · Advanced", price: "GH₵35", image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1000&q=85" },
  { id: "screen-replacement", title: "Screen replacement basics", meta: "9 min · Beginner", price: "Free", image: "https://images.unsplash.com/photo-1603899122634-f086ca5f5ddd?auto=format&fit=crop&w=1000&q=85" },
  { id: "microsoldering-basics", title: "Microsoldering tools and setup", meta: "15 min · Beginner", price: "GH₵30", image: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&w=1000&q=85" },
  { id: "water-damage-recovery", title: "Water damage recovery", meta: "14 min · Intermediate", price: "GH₵28", image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1000&q=85" },
  { id: "software-faults", title: "Fixing common software faults", meta: "11 min · Beginner", price: "Free", image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1000&q=85" },
];

export default function Learn() {
  const router = useRouter();
  const openTutorial = (tutorial: Tutorial) => router.push((tutorial.price === "Free" ? "/tutorial/" + tutorial.id : "/tutorial/access?id=" + tutorial.id) as any);
  const featured = tutorials[0];
  return <SafeAreaView style={s.safe}><ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
    <View style={s.head}><Text style={s.title}>Learn</Text><IconButton name="bookmark-outline" /></View>
    <Text style={s.sub}>Learn from verified repairers.</Text>
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={s.chips}><Chip label="Featured" active /><Chip label="Beginner" /><Chip label="Board repair" /><Chip label="Software" /></ScrollView>
    <Pressable style={s.feature} onPress={() => openTutorial(featured)}><Image source={{ uri: featured.image }} style={s.featureImg} /><View style={s.featureShade} /><View style={s.featureCopy}><View style={s.featureTag}><Ionicons name="lock-closed" size={11} color="#fff" /><Text style={s.kicker}>PREMIUM FEATURED</Text></View><Text style={s.featureTitle}>{featured.title}</Text><Text style={s.featureMeta}>By Kwame Repairs ✓  ·  1.2K learners</Text><View style={s.watch}><Ionicons name="lock-closed" size={13} color="#fff" /><Text style={s.watchText}>Unlock tutorial · {featured.price}</Text></View></View></Pressable>
    <Text style={s.section}>Popular tutorials</Text>
    {tutorials.slice(1, 4).map(tutorial => <Pressable key={tutorial.id} onPress={() => openTutorial(tutorial)} style={({ pressed }) => [s.row, pressed && s.pressed]}><Image source={{ uri: tutorial.image }} style={s.thumb} /><View style={s.rowCopy}><Text style={s.tName}>{tutorial.title}</Text><Text style={s.meta}>{tutorial.meta}</Text><Text style={s.price}>{tutorial.price}</Text></View><Ionicons name={tutorial.price === "Free" ? "play-circle-outline" : "lock-closed-outline"} size={18} color={colors.muted} /></Pressable>)}
    <Text style={s.section}>More tutorials</Text>
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.moreList}>{tutorials.slice(4).map(tutorial => <Pressable key={tutorial.id} onPress={() => openTutorial(tutorial)} style={({ pressed }) => [s.moreCard, pressed && s.pressed]}><View><Image source={{ uri: tutorial.image }} style={s.moreImage} /><View style={s.moreBadge}><Ionicons name={tutorial.price === "Free" ? "play" : "lock-closed"} size={10} color="#fff" /></View></View><Text style={s.moreTitle} numberOfLines={2}>{tutorial.title}</Text><Text style={s.moreMeta}>{tutorial.meta}</Text><Text style={s.morePrice}>{tutorial.price}</Text></Pressable>)}</ScrollView>
  </ScrollView></SafeAreaView>;
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#fff" },
  content: { padding: 18, paddingTop: 28, paddingBottom: 40 },
  head: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  title: { fontSize: 26, fontWeight: "800", letterSpacing: -0.7 },
  sub: { fontSize: 14, color: colors.muted, marginTop: 5 },
  chips: { marginTop: 18 },
  feature: { height: 285, borderRadius: radius.xl, overflow: "hidden", marginTop: 20 },
  featureImg: { width: "100%", height: "100%" },
  featureShade: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0,0,0,.28)" },
  featureCopy: { position: "absolute", left: 18, right: 18, bottom: 18 },
  featureTag: { flexDirection: "row", alignItems: "center", gap: 6 },
  kicker: { fontSize: 10, color: "#fff", fontWeight: "800", letterSpacing: 1.2 },
  featureTitle: { fontSize: 24, lineHeight: 29, color: "#fff", fontWeight: "800", marginTop: 5 },
  featureMeta: { fontSize: 12, color: "rgba(255,255,255,.82)", marginTop: 6 },
  watch: { marginTop: 12, alignSelf: "flex-start", backgroundColor: colors.accent, borderRadius: 15, paddingHorizontal: 13, paddingVertical: 9, flexDirection: "row", gap: 6, alignItems: "center" },
  watchText: { color: "#fff", fontWeight: "800", fontSize: 12 },
  section: { fontSize: 20, fontWeight: "800", marginTop: 26, marginBottom: 12 },
  row: { flexDirection: "row", alignItems: "center", gap: 12, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: colors.line },
  rowCopy: { flex: 1 },
  thumb: { width: 104, height: 78, borderRadius: 14 },
  tName: { fontSize: 14, fontWeight: "750", lineHeight: 19, color: colors.ink },
  meta: { fontSize: 12, color: colors.muted, marginTop: 6 },
  price: { fontSize: 13, fontWeight: "800", color: colors.ink, marginTop: 6 },
  moreList: { gap: 12, paddingRight: 4 },
  moreCard: { width: 180, paddingBottom: 8 },
  moreImage: { width: 180, height: 118, borderRadius: 16 },
  moreBadge: { position: "absolute", right: 8, top: 8, width: 25, height: 25, borderRadius: 13, backgroundColor: "rgba(0,0,0,.72)", alignItems: "center", justifyContent: "center" },
  moreTitle: { fontSize: 14, fontWeight: "800", lineHeight: 18, marginTop: 8, color: colors.ink },
  moreMeta: { fontSize: 12, color: colors.muted, marginTop: 4 },
  morePrice: { fontSize: 13, fontWeight: "800", marginTop: 5, color: colors.ink },
  pressed: { opacity: 0.78 },
});
