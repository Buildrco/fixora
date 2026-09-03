import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { Animated, Image, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { colors, radius } from "../../constants/theme";
import { IconButton } from "../../components/IconButton";

const stages = [
  { title: "Creating your repair request", body: "Preparing your device details so the right specialist can respond." },
  { title: "Mapping repair routes", body: "We're checking which nearby repairers can reach you fastest." },
  { title: "Finding repairers nearby", body: "Scanning your area for available specialists who handle this repair." },
];

const repairers = [
  { name: "Christian Mensah", handle: "@christianfixes", rating: "4.9", reviews: "128", area: "Osu, Accra", distance: "1.8 km", price: "GH₵180–280", image: "https://i.pravatar.cc/160?img=11", country: "🇬🇭" },
  { name: "K-Tech Mobile", handle: "@ktechmobile", rating: "4.8", reviews: "96", area: "Adum, Kumasi", distance: "3.2 km", price: "GH₵220–350", image: "https://i.pravatar.cc/160?img=12", country: "🇬🇭" },
  { name: "Ama Owusu", handle: "@amaphoneclinic", rating: "4.9", reviews: "74", area: "Kaneshie, Accra", distance: "4.6 km", price: "GH₵160–260", image: "https://i.pravatar.cc/160?img=32", country: "🇬🇭" },
  { name: "Ifeanyi Repairs", handle: "@ifeanyirepairs", rating: "4.7", reviews: "61", area: "Ikeja, Lagos", distance: "Nearby online", price: "₦45,000–70,000", image: "https://i.pravatar.cc/160?img=14", country: "🇳🇬" },
  { name: "Diana Tech Care", handle: "@dianatechcare", rating: "4.8", reviews: "53", area: "Westlands, Nairobi", distance: "Available remotely", price: "KSh 3,500–6,000", image: "https://i.pravatar.cc/160?img=44", country: "🇰🇪" },
  { name: "Marcus Device Lab", handle: "@marcusdevicelab", rating: "4.9", reviews: "112", area: "Brooklyn, New York", distance: "Available remotely", price: "$65–110", image: "https://i.pravatar.cc/160?img=68", country: "🇺🇸" },
];

function MapCanvas({ searching }: { searching: boolean }) {
  const pulse = useRef(new Animated.Value(0)).current;
  const route = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const pulseAnimation = Animated.loop(Animated.sequence([
      Animated.timing(pulse, { toValue: 1, duration: 1500, useNativeDriver: true }),
      Animated.timing(pulse, { toValue: 0, duration: 0, useNativeDriver: true }),
    ]));
    const routeAnimation = Animated.loop(Animated.sequence([
      Animated.timing(route, { toValue: 1, duration: 1800, useNativeDriver: false }),
      Animated.timing(route, { toValue: 0, duration: 0, useNativeDriver: false }),
    ]));
    pulseAnimation.start();
    routeAnimation.start();
    return () => { pulseAnimation.stop(); routeAnimation.stop(); };
  }, [pulse, route]);
  return <View style={s.map}>
    <View style={s.mapBlocks}><View style={[s.block, s.blockOne]} /><View style={[s.block, s.blockTwo]} /><View style={[s.block, s.blockThree]} /><View style={[s.block, s.blockFour]} /><View style={[s.block, s.blockFive]} /><View style={[s.block, s.blockSix]} /></View>
    <View style={[s.road, s.roadOne]} /><View style={[s.road, s.roadTwo]} /><View style={[s.road, s.roadThree]} /><View style={[s.road, s.roadFour]} />
    <Text style={[s.mapLabel, { top: 82, left: 44 }]}>Osu</Text><Text style={[s.mapLabel, { top: 145, right: 42 }]}>Accra Central</Text><Text style={[s.mapLabel, { bottom: 92, left: 62 }]}>Kaneshie</Text>
    <Animated.View style={[s.searchRadius, { opacity: pulse.interpolate({ inputRange: [0, 1], outputRange: [0.35, 0] }), transform: [{ scale: pulse.interpolate({ inputRange: [0, 1], outputRange: [0.65, 1.8] }) }] }]} />
    <View style={s.userPin}><Ionicons name="location" size={25} color="#fff" /></View>
    {searching && <Animated.View style={[s.routeLine, { width: route.interpolate({ inputRange: [0, 1], outputRange: [38, 170] }), opacity: route.interpolate({ inputRange: [0, 0.7, 1], outputRange: [0.35, 1, 0.5] }) }]} />}
    {!searching && <><View style={[s.repairerPin, { top: 95, right: 58 }]}><Ionicons name="construct" size={15} color="#fff" /></View><View style={[s.repairerPin, { bottom: 118, left: 108 }]}><Ionicons name="construct" size={15} color="#fff" /></View></>}
    <View style={s.mapControls}><Pressable style={s.mapCircle}><Ionicons name="arrow-back" size={23} color={colors.ink} /></Pressable><Pressable style={s.mapCircle}><Ionicons name="navigate" size={21} color={colors.ink} /></Pressable></View>
  </View>;
}

function SafetyCard({ category }: { category: string }) {
  const isPhone = category !== "Laptop" && category !== "MacBook";
  return <View style={s.safety}><View style={s.safetyCopy}><Text style={s.safetyTitle}>Keep your repair protected</Text><Text style={s.safetyBody}>Connect through Fixora so your request and repair details stay in one place.</Text></View><Image source={{ uri: isPhone ? "https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=260&q=85" : "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=260&q=85" }} style={s.deviceImage} /></View>;
}

export default function MatchedRepairers() {
  const router = useRouter();
  const { issue, category, model } = useLocalSearchParams<{ issue?: string; category?: string; model?: string }>();
  const [stage, setStage] = useState(0);
  const issueName = String(issue || "device repair");
  const categoryName = String(category || "Phone");
  useEffect(() => {
    const timers = [setTimeout(() => setStage(1), 1500), setTimeout(() => setStage(2), 3100), setTimeout(() => setStage(3), 4700)];
    return () => timers.forEach(clearTimeout);
  }, []);
  const searching = stage < 3;
  return <SafeAreaView style={s.safe}><ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
    <View style={s.topBar}><IconButton name="chevron-back" onPress={() => router.back()} /><View style={s.location}><Ionicons name="location" size={16} color={colors.blue} /><Text style={s.locationText}>Using your current area</Text></View><View style={s.spacer} /></View>
    <MapCanvas searching={searching} />
    <SafetyCard category={categoryName} />
    {searching ? <View style={s.searchSheet}><View style={s.searchHeading}><View><Text style={s.searchTitle}>{stages[stage].title}</Text><Text style={s.searchBody}>{stages[stage].body}</Text></View><Text style={s.timer}>0:{String(7 + stage * 5).padStart(2, "0")}</Text></View><View style={s.progressTrack}><View style={[s.progressFill, { width: stage === 0 ? "23%" : stage === 1 ? "58%" : "88%" }]} /></View><View style={s.steps}><View style={[s.stepDot, s.stepActive]}><Ionicons name="document-text" size={13} color="#fff" /></View><View style={[s.stepLine, stage >= 1 && s.stepLineActive]} /><View style={[s.stepDot, stage >= 1 && s.stepActive]}><Ionicons name="map" size={13} color={stage >= 1 ? "#fff" : colors.muted} /></View><View style={[s.stepLine, stage >= 2 && s.stepLineActive]} /><View style={[s.stepDot, stage >= 2 && s.stepActive]}><Ionicons name="people" size={13} color={stage >= 2 ? "#fff" : colors.muted} /></View></View><View style={s.tip}><Ionicons name="radio-outline" size={18} color={colors.blue} /><Text style={s.tipText}>{stage === 0 ? "Building a clear request for nearby repairers" : stage === 1 ? "Scanning the map to find available repairers" : "Comparing distance, ratings, and estimated prices"}</Text></View><View style={s.utilityRow}><Pressable style={s.utility}><View style={s.utilityIcon}><Ionicons name="pencil" size={20} color={colors.ink} /></View><Text style={s.utilityText}>Edit details</Text></Pressable><Pressable style={s.utility}><View style={s.utilityIcon}><Ionicons name="share-social" size={20} color={colors.ink} /></View><Text style={s.utilityText}>Share request</Text></Pressable></View></View> : <View style={s.resultsSheet}><Text style={s.resultsTitle}>Repairers near you</Text><Text style={s.resultsSub}>{issueName} · {categoryName}{model ? " · " + String(model) : ""}</Text><View style={s.filterRow}><View style={s.filterPill}><Ionicons name="navigate-outline" size={15} color={colors.blue} /><Text style={s.filterText}>Closest first</Text></View><Text style={s.found}>{repairers.length} available</Text></View>{repairers.map(item => <Pressable key={item.name} onPress={() => router.push({ pathname: "/repair/confirmation", params: { issue: issueName, repairer: item.name, device: String(model || categoryName) } } as never)} style={({ pressed }) => [s.repairerCard, pressed && s.pressed]}><Image source={{ uri: item.image }} style={s.profileImage} /><View style={s.repairerCopy}><View style={s.repairerNameRow}><Text style={s.repairerName} numberOfLines={1}>{item.name}</Text><Text style={s.country}>{item.country}</Text></View><Text style={s.handle}>{item.handle}</Text><View style={s.metaRow}><Text style={s.rating}>★ {item.rating}</Text><Text style={s.reviews}>({item.reviews})</Text><Text style={s.dot}>·</Text><Text style={s.area}>{item.area}</Text></View><View style={s.bottomRow}><Text style={s.distance}>{item.distance}</Text><Text style={s.price}>{item.price}</Text></View></View><View style={s.connect}><Ionicons name="arrow-up-right" size={17} color="#fff" /><Text style={s.connectText}>Connect</Text></View></Pressable>)}</View>}
  </ScrollView></SafeAreaView>;
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.card },
  content: { paddingBottom: 28 },
  topBar: { height: 54, paddingHorizontal: 18, flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  location: { flexDirection: "row", alignItems: "center", gap: 5 },
  locationText: { color: colors.ink, fontSize: 13, fontWeight: "700" },
  spacer: { width: 42 },
  map: { height: 350, marginHorizontal: 10, borderRadius: 24, overflow: "hidden", backgroundColor: "#e8efe8", position: "relative" },
  mapBlocks: { ...StyleSheet.absoluteFillObject },
  block: { position: "absolute", borderWidth: 1, borderColor: "#d8e2d8", backgroundColor: "#f4f5ef" },
  blockOne: { top: 18, left: 16, width: 100, height: 70, transform: [{ rotate: "-8deg" }] }, blockTwo: { top: 32, right: 18, width: 130, height: 70, transform: [{ rotate: "6deg" }] }, blockThree: { top: 142, left: 28, width: 125, height: 82, transform: [{ rotate: "7deg" }] }, blockFour: { top: 124, right: 24, width: 108, height: 98, transform: [{ rotate: "-12deg" }] }, blockFive: { bottom: 34, left: 12, width: 145, height: 76, transform: [{ rotate: "-5deg" }] }, blockSix: { bottom: 18, right: 10, width: 150, height: 82, transform: [{ rotate: "8deg" }] },
  road: { position: "absolute", backgroundColor: "#fff", borderWidth: 2, borderColor: "#d4ddd4" }, roadOne: { width: 520, height: 12, top: 112, left: -60, transform: [{ rotate: "-13deg" }] }, roadTwo: { width: 470, height: 10, top: 240, left: -40, transform: [{ rotate: "17deg" }] }, roadThree: { width: 10, height: 420, top: -36, left: 194, transform: [{ rotate: "12deg" }] }, roadFour: { width: 8, height: 390, top: -10, left: 90, transform: [{ rotate: "-28deg" }] },
  mapLabel: { position: "absolute", color: "#8a948d", fontSize: 11, fontWeight: "700" }, searchRadius: { position: "absolute", width: 120, height: 120, borderRadius: 60, borderWidth: 1.5, borderColor: colors.blue, left: "50%", top: "42%", marginLeft: -60, marginTop: -60 }, userPin: { position: "absolute", left: "50%", top: "42%", marginLeft: -24, marginTop: -24, width: 48, height: 48, borderRadius: 17, backgroundColor: colors.blue, borderWidth: 4, borderColor: "#fff", alignItems: "center", justifyContent: "center", shadowColor: colors.blue, shadowOpacity: 0.28, shadowRadius: 12, elevation: 4 }, repairerPin: { position: "absolute", width: 32, height: 32, borderRadius: 12, backgroundColor: colors.green, borderWidth: 3, borderColor: "#fff", alignItems: "center", justifyContent: "center" }, routeLine: { position: "absolute", left: "50%", top: "42%", height: 4, marginTop: -2, backgroundColor: colors.blue, borderRadius: 2, transform: [{ rotate: "-20deg" }] },
  mapControls: { position: "absolute", left: 12, right: 12, bottom: 15, flexDirection: "row", justifyContent: "space-between" }, mapCircle: { width: 53, height: 53, borderRadius: 27, backgroundColor: "rgba(255,255,255,.96)", alignItems: "center", justifyContent: "center", shadowColor: "#000", shadowOpacity: 0.09, shadowRadius: 8, elevation: 2 },
  safety: { marginHorizontal: 10, marginTop: -62, minHeight: 92, borderRadius: 22, backgroundColor: "#fff", flexDirection: "row", alignItems: "center", paddingLeft: 19, paddingRight: 9, shadowColor: "#000", shadowOpacity: 0.1, shadowRadius: 12, elevation: 4, zIndex: 2 }, safetyCopy: { flex: 1 }, safetyTitle: { color: colors.ink, fontSize: 16, lineHeight: 19, fontWeight: "800" }, safetyBody: { color: colors.muted, fontSize: 11, lineHeight: 15, marginTop: 4 }, deviceImage: { width: 78, height: 78, borderRadius: 16, marginLeft: 8 },
  searchSheet: { marginTop: 12, padding: 20, borderTopLeftRadius: 28, borderTopRightRadius: 28, backgroundColor: "#fff", minHeight: 290 }, searchHeading: { flexDirection: "row", justifyContent: "space-between", gap: 12 }, searchTitle: { color: colors.ink, fontSize: 22, fontWeight: "800" }, searchBody: { color: colors.muted, fontSize: 13, lineHeight: 18, marginTop: 3, maxWidth: 285 }, timer: { color: colors.ink, fontSize: 16, fontWeight: "800" }, progressTrack: { height: 5, marginTop: 18, borderRadius: 3, backgroundColor: "#edf0f2", overflow: "hidden" }, progressFill: { height: "100%", borderRadius: 3, backgroundColor: colors.blue }, steps: { flexDirection: "row", alignItems: "center", marginTop: 18, paddingHorizontal: 22 }, stepDot: { width: 30, height: 30, borderRadius: 15, backgroundColor: "#edf0f2", alignItems: "center", justifyContent: "center" }, stepActive: { backgroundColor: colors.blue }, stepLine: { flex: 1, height: 3, backgroundColor: "#edf0f2" }, stepLineActive: { backgroundColor: colors.blue }, tip: { marginTop: 20, minHeight: 52, borderRadius: 15, backgroundColor: "#f3f7ff", flexDirection: "row", alignItems: "center", paddingHorizontal: 14, gap: 10 }, tipText: { flex: 1, color: colors.ink, fontSize: 13, lineHeight: 18 }, utilityRow: { flexDirection: "row", justifyContent: "center", gap: 34, marginTop: 20 }, utility: { alignItems: "center", width: 88 }, utilityIcon: { width: 50, height: 50, borderRadius: 25, backgroundColor: colors.soft, alignItems: "center", justifyContent: "center" }, utilityText: { color: colors.muted, fontSize: 12, textAlign: "center", marginTop: 6 },
  resultsSheet: { marginTop: 12, paddingHorizontal: 18, paddingTop: 17 }, resultsTitle: { color: colors.ink, fontSize: 24, fontWeight: "800" }, resultsSub: { color: colors.muted, fontSize: 13, marginTop: 4 }, filterRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 18, marginBottom: 11 }, filterPill: { flexDirection: "row", alignItems: "center", gap: 6, backgroundColor: "#eef5ff", paddingHorizontal: 12, paddingVertical: 8, borderRadius: 15 }, filterText: { color: colors.blue, fontSize: 12, fontWeight: "700" }, found: { color: colors.muted, fontSize: 12 }, repairerCard: { borderWidth: 1, borderColor: colors.line, borderRadius: 20, padding: 12, marginBottom: 11, flexDirection: "row", alignItems: "center", gap: 11, backgroundColor: "#fff" }, profileImage: { width: 62, height: 62, borderRadius: 31 }, repairerCopy: { flex: 1, minWidth: 0 }, repairerNameRow: { flexDirection: "row", alignItems: "center", gap: 5 }, repairerName: { flexShrink: 1, color: colors.ink, fontSize: 14, fontWeight: "800" }, country: { fontSize: 14 }, handle: { color: colors.muted, fontSize: 11, marginTop: 2 }, metaRow: { flexDirection: "row", alignItems: "center", gap: 5, marginTop: 7 }, rating: { color: "#cc8a00", fontSize: 12, fontWeight: "800" }, reviews: { color: colors.muted, fontSize: 11 }, dot: { color: colors.line }, area: { flexShrink: 1, color: colors.muted, fontSize: 11 }, bottomRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 7 }, distance: { color: colors.muted, fontSize: 11 }, price: { color: colors.ink, fontSize: 12, fontWeight: "800" }, connect: { backgroundColor: colors.blue, borderRadius: 14, paddingHorizontal: 10, paddingVertical: 9, alignItems: "center", gap: 3 }, connectText: { color: "#fff", fontSize: 10, fontWeight: "800" }, pressed: { opacity: 0.78, transform: [{ scale: 0.985 }] },
});
