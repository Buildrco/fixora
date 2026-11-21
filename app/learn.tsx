import { Ionicons } from "@expo/vector-icons";
import { ActivityIndicator, SafeAreaView, ScrollView, Text, View, StyleSheet, Image, Pressable } from "react-native";
import { useEffect, useState } from "react";
import { colors, radius } from "../constants/theme";
import { Chip } from "../components/Chip";
import { IconButton } from "../components/IconButton";
import { useRouter } from "expo-router";
import { listPublishedTutorials } from "../data/fixoraRepository";

type Tutorial = { id: string; slug: string; title: string; meta: string; price: string; image: string; category: string };

export default function Learn() {
  const router = useRouter();
  const [tutorials, setTutorials] = useState<Tutorial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => {
    let mounted = true;
    listPublishedTutorials().then(rows => {
      if (!mounted) return;
      setTutorials((rows as any[]).map(row => ({
        id: row.id, slug: row.slug || row.id, title: row.title,
        meta: [row.duration_minutes ? `${row.duration_minutes} min` : "", row.difficulty || ""].filter(Boolean).join(" · "),
        price: Number(row.price || 0) === 0 ? "Free" : `${row.currency || "GHS"} ${row.price}`,
        image: row.cover_url || "", category: row.category || "",
      })));
    }).catch(reason => { if (mounted) setError(reason instanceof Error ? reason.message : "Could not load tutorials."); })
      .finally(() => { if (mounted) setLoading(false); });
    return () => { mounted = false; };
  }, []);
  const openTutorial = (tutorial: Tutorial) => router.push((tutorial.price === "Free" ? "/tutorial/" + tutorial.slug : "/tutorial/access?id=" + tutorial.slug) as any);
  const featured = tutorials[0];
  return <SafeAreaView style={s.safe}><ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
    <View style={s.head}><Text style={s.title}>Learn</Text><IconButton name="bookmark-outline" /></View>
    <Text style={s.sub}>Learn from verified repairers.</Text>
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={s.chips}><Chip label="Featured" active /><Chip label="Beginner" /><Chip label="Board repair" /><Chip label="Software" /></ScrollView>
    {loading && <ActivityIndicator color={colors.blue} style={{ marginTop: 28 }} />}
    {!!error && <Text accessibilityRole="alert" style={s.error}>{error}</Text>}
    {!loading && !error && !tutorials.length && <View style={s.empty}><Ionicons name="school-outline" size={30} color={colors.blue} /><Text style={s.emptyTitle}>No published tutorials yet</Text><Text style={s.meta}>New lessons will appear here when they are published.</Text></View>}
    {!!featured && <Pressable style={s.feature} onPress={() => openTutorial(featured)}>{featured.image ? <Image source={{ uri: featured.image }} style={s.featureImg} /> : <View style={[s.featureImg, s.imagePlaceholder]} />}<View style={s.featureShade} /><View style={s.featureCopy}><View style={s.featureTag}><Ionicons name={featured.price === "Free" ? "play" : "lock-closed"} size={11} color="#fff" /><Text style={s.kicker}>{featured.price === "Free" ? "FEATURED LESSON" : "PREMIUM FEATURED"}</Text></View><Text style={s.featureTitle}>{featured.title}</Text><Text style={s.featureMeta}>{[featured.category, featured.meta].filter(Boolean).join(" · ")}</Text><View style={s.watch}><Ionicons name={featured.price === "Free" ? "play" : "lock-closed"} size={13} color="#fff" /><Text style={s.watchText}>{featured.price === "Free" ? "Start tutorial" : `Unlock tutorial · ${featured.price}`}</Text></View></View></Pressable>}
    <Text style={s.section}>Popular tutorials</Text>
    {tutorials.slice(1, 4).map(tutorial => <Pressable key={tutorial.id} onPress={() => openTutorial(tutorial)} style={({ pressed }) => [s.row, pressed && s.pressed]}>{tutorial.image ? <Image source={{ uri: tutorial.image }} style={s.thumb} /> : <View style={[s.thumb, s.imagePlaceholder]} />}<View style={s.rowCopy}><Text style={s.tName}>{tutorial.title}</Text><Text style={s.meta}>{tutorial.meta}</Text><Text style={s.price}>{tutorial.price}</Text></View><Ionicons name={tutorial.price === "Free" ? "play-circle-outline" : "lock-closed-outline"} size={18} color={colors.muted} /></Pressable>)}
    <Text style={s.section}>More tutorials</Text>
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.moreList}>{tutorials.slice(4).map(tutorial => <Pressable key={tutorial.id} onPress={() => openTutorial(tutorial)} style={({ pressed }) => [s.moreCard, pressed && s.pressed]}><View>{tutorial.image ? <Image source={{ uri: tutorial.image }} style={s.moreImage} /> : <View style={[s.moreImage, s.imagePlaceholder]} />}<View style={s.moreBadge}><Ionicons name={tutorial.price === "Free" ? "play" : "lock-closed"} size={10} color="#fff" /></View></View><Text style={s.moreTitle} numberOfLines={2}>{tutorial.title}</Text><Text style={s.moreMeta}>{tutorial.meta}</Text><Text style={s.morePrice}>{tutorial.price}</Text></Pressable>)}</ScrollView>
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
  empty: { alignItems: "center", paddingVertical: 40 },
  emptyTitle: { fontSize: 17, fontWeight: "800", color: colors.ink, marginTop: 10 },
  error: { color: "#D74747", fontSize: 12, marginTop: 18 },
  imagePlaceholder: { backgroundColor: colors.soft },
});
