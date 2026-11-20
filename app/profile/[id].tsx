import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { Image, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";
import { colors, radius } from "../../constants/theme";

type PublicProfile = { name: string; handle: string; role: string; area: string; bio: string; image: string; rating?: string; price?: string };

const profiles: Record<string, PublicProfile> = {
  "k-tech-repairs": { name: "K-Tech Repairs", handle: "@ktechrepairs", role: "Verified repairer", area: "Osu, Accra", bio: "Board-level repairs, screen replacements and diagnostics from a verified local repairer.", image: "https://i.pravatar.cc/240?img=12", rating: "4.9", price: "Repairs from GH₵280" },
  "ifix-lab": { name: "iFix Lab", handle: "@ifixlab", role: "Verified repairer", area: "Accra", bio: "Careful phone repairs with clear diagnosis updates and warranty-backed service.", image: "https://i.pravatar.cc/240?img=32", rating: "4.8", price: "Repairs from GH₵350" },
  "christian-mensah": { name: "Christian Mensah", handle: "@christianfixes", role: "Verified repairer", area: "Osu, Accra", bio: "Phone diagnostics, board repair and careful screen replacement.", image: "https://i.pravatar.cc/240?img=11", rating: "4.9", price: "GH₵180–280" },
  christianfixes: { name: "Christian Mensah", handle: "@christianfixes", role: "Verified repairer", area: "Osu, Accra", bio: "Phone diagnostics, board repair and careful screen replacement.", image: "https://i.pravatar.cc/240?img=11", rating: "4.9", price: "GH₵180–280" },
  ktechmobile: { name: "K-Tech Mobile", handle: "@ktechmobile", role: "Repairer & verified seller", area: "Adum, Kumasi", bio: "Phone repairs, diagnostics and verified devices with warranty options.", image: "https://i.pravatar.cc/240?img=12", rating: "4.8", price: "Repairs from GH₵220" },
  "k-tech-mobile": { name: "K-Tech Mobile", handle: "@ktechmobile", role: "Repairer & verified seller", area: "Adum, Kumasi", bio: "Phone repairs, diagnostics and verified devices with warranty options.", image: "https://i.pravatar.cc/240?img=12", rating: "4.8", price: "Repairs from GH₵220" },
  amaphoneclinic: { name: "Ama’s Phone Clinic", handle: "@amaphoneclinic", role: "Verified repairer", area: "Kaneshie, Accra", bio: "Screen replacement and phone repair service with clear updates.", image: "https://i.pravatar.cc/240?img=32", rating: "4.9", price: "GH₵160–260" },
  "ama-s-phone-clinic": { name: "Ama’s Phone Clinic", handle: "@amaphoneclinic", role: "Verified repairer", area: "Kaneshie, Accra", bio: "Screen replacement and phone repair service with clear updates.", image: "https://i.pravatar.cc/240?img=32", rating: "4.9", price: "GH₵160–260" },
  ifeanyirepairs: { name: "Ifeanyi Repairs", handle: "@ifeanyirepairs", role: "Repairer", area: "Ikeja, Lagos", bio: "Remote and in-person mobile device diagnostics and repairs.", image: "https://i.pravatar.cc/240?img=14", rating: "4.7", price: "₦45,000–70,000" },
  dianatechcare: { name: "Diana Tech Care", handle: "@dianatechcare", role: "Repairer", area: "Westlands, Nairobi", bio: "Friendly device diagnostics, repair guidance and support.", image: "https://i.pravatar.cc/240?img=44", rating: "4.8", price: "KSh 3,500–6,000" },
  "diana-addo": { name: "Diana Addo", handle: "@dianatechcare", role: "Community member", area: "Accra, Ghana", bio: "Learning and sharing practical repair tips with the Fixora community.", image: "https://i.pravatar.cc/240?img=44" },
  marcusdevicelab: { name: "Marcus Device Lab", handle: "@marcusdevicelab", role: "Repairer", area: "Brooklyn, New York", bio: "Device repair and diagnostics, available remotely.", image: "https://i.pravatar.cc/240?img=68", rating: "4.9", price: "$65–110" },
  fixoralearn: { name: "Fixora Learn", handle: "@fixoralearn", role: "Learning community", area: "Fixora", bio: "Practical tutorials and repair lessons for curious people at every skill level.", image: "https://i.pravatar.cc/240?img=47" },
  circuitcorner: { name: "Circuit Corner", handle: "@circuitcorner", role: "Community member", area: "Fixora", bio: "Sharing careful board work, tools and repair techniques.", image: "https://i.pravatar.cc/240?img=68" },
  kwamerepairs: { name: "Kwame Repairs", handle: "@kwamerepairs", role: "Repairer", area: "Accra, Ghana", bio: "Board repair and hands-on diagnosis, with a focus on sharing what works.", image: "https://i.pravatar.cc/240?img=11" },
};

function titleFromId(id: string) {
  return id.split("-").filter(Boolean).map(part => part.charAt(0).toUpperCase() + part.slice(1)).join(" ") || "Community member";
}

export default function PublicProfilePage() {
  const router = useRouter();
  const params = useLocalSearchParams<{ id?: string | string[] }>();
  const id = (Array.isArray(params.id) ? params.id[0] : params.id || "").toLowerCase();
  const profile = profiles[id] || { name: titleFromId(id), handle: "@" + id.replace(/-/g, ""), role: "Fixora community member", area: "Fixora community", bio: "A member of the Fixora community.", image: "https://i.pravatar.cc/240?img=12" };
  const [following, setFollowing] = useState(false);
  const isRepairer = Boolean(profile.rating);

  return <SafeAreaView style={styles.safe}><ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
    <View style={styles.header}><Pressable onPress={() => router.back()} hitSlop={10} accessibilityLabel="Go back"><Ionicons name="chevron-back" size={26} color={colors.ink} /></Pressable><Text style={styles.headerTitle}>Profile</Text><View style={styles.headerSpacer} /></View>
    <View style={styles.cover}><View style={styles.coverOrb} /></View>
    <View style={styles.identity}>
      <Image source={{ uri: profile.image }} style={styles.avatar} />
      <Text style={styles.name}>{profile.name}</Text>
      <Text style={styles.handle}>{profile.handle}</Text>
      <View style={styles.role}><Ionicons name={isRepairer ? "construct-outline" : "people-outline"} size={14} color={colors.blue} /><Text style={styles.roleText}>{profile.role}</Text></View>
      <Text style={styles.bio}>{profile.bio}</Text>
      <View style={styles.location}><Ionicons name="location-outline" size={15} color={colors.muted} /><Text style={styles.locationText}>{profile.area}</Text></View>
      {isRepairer && <View style={styles.rating}><Ionicons name="star" size={15} color="#d28b00" /><Text style={styles.ratingText}>{profile.rating} rating</Text><Text style={styles.price}>{profile.price}</Text></View>}
      <View style={styles.stats}><View style={styles.stat}><Text style={styles.statNumber}>12</Text><Text style={styles.statLabel}>Posts</Text></View><View style={styles.stat}><Text style={styles.statNumber}>248</Text><Text style={styles.statLabel}>Followers</Text></View><View style={styles.stat}><Text style={styles.statNumber}>86</Text><Text style={styles.statLabel}>Following</Text></View></View>
      <View style={styles.actions}><Pressable onPress={() => setFollowing(value => !value)} style={[styles.followButton, following && styles.followingButton]} accessibilityRole="button"><Text style={[styles.followText, following && styles.followingText]}>{following ? "Following" : "Follow"}</Text></Pressable>{isRepairer && <Pressable onPress={() => router.push({ pathname: "/repair/confirmation", params: { repairer: profile.name } } as never)} style={styles.repairButton}><Ionicons name="arrow-forward" size={16} color="#fff" /><Text style={styles.repairText}>Request repair</Text></Pressable>}</View>
    </View>
    <View style={styles.postsHead}><Text style={styles.postsTitle}>Recent posts</Text><Ionicons name="grid-outline" size={18} color={colors.muted} /></View>
    <View style={styles.postCard}><Text style={styles.postCopy}>{profile.bio}</Text><Text style={styles.postMeta}>From {profile.name} · Fixora</Text></View>
  </ScrollView></SafeAreaView>;
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.card },
  content: { padding: 18, paddingBottom: 36 },
  header: { height: 42, flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  headerTitle: { color: colors.ink, fontSize: 18, fontWeight: "800" },
  headerSpacer: { width: 28 },
  cover: { height: 128, marginTop: 12, borderRadius: 23, overflow: "hidden", backgroundColor: "#e8effa", justifyContent: "center", alignItems: "flex-end", paddingRight: 30 },
  coverOrb: { width: 150, height: 150, borderRadius: 75, backgroundColor: "rgba(45,127,249,.17)", marginRight: -6 },
  identity: { alignItems: "center", marginTop: -42 },
  avatar: { width: 86, height: 86, borderRadius: 43, borderWidth: 4, borderColor: colors.card, backgroundColor: colors.soft },
  name: { color: colors.ink, fontSize: 23, fontWeight: "800", marginTop: 10 },
  handle: { color: colors.muted, fontSize: 13, marginTop: 2 },
  role: { flexDirection: "row", alignItems: "center", gap: 5, marginTop: 12, paddingHorizontal: 11, paddingVertical: 7, borderRadius: 14, backgroundColor: "#eef5ff" },
  roleText: { color: colors.blue, fontSize: 12, fontWeight: "700" },
  bio: { color: colors.ink, textAlign: "center", fontSize: 14, lineHeight: 21, marginTop: 12, maxWidth: 320 },
  location: { flexDirection: "row", alignItems: "center", gap: 4, marginTop: 8 },
  locationText: { color: colors.muted, fontSize: 12 },
  rating: { flexDirection: "row", alignItems: "center", gap: 5, marginTop: 9 },
  ratingText: { color: colors.ink, fontWeight: "700", fontSize: 12 },
  price: { color: colors.muted, fontSize: 12, marginLeft: 5 },
  stats: { flexDirection: "row", justifyContent: "center", gap: 40, marginTop: 18 },
  stat: { alignItems: "center" },
  statNumber: { color: colors.ink, fontSize: 16, fontWeight: "800" },
  statLabel: { color: colors.muted, fontSize: 11, marginTop: 2 },
  actions: { flexDirection: "row", alignSelf: "stretch", gap: 10, marginTop: 18 },
  followButton: { flex: 1, height: 46, borderRadius: 15, borderWidth: 1, borderColor: colors.line, alignItems: "center", justifyContent: "center" },
  followingButton: { backgroundColor: colors.soft },
  followText: { color: colors.ink, fontSize: 14, fontWeight: "800" },
  followingText: { color: colors.muted },
  repairButton: { flex: 1, height: 46, borderRadius: 15, backgroundColor: colors.blue, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 7 },
  repairText: { color: "#fff", fontSize: 13, fontWeight: "800" },
  postsHead: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", borderTopWidth: 1, borderTopColor: colors.line, paddingTop: 17, marginTop: 24 },
  postsTitle: { color: colors.ink, fontSize: 16, fontWeight: "800" },
  postCard: { backgroundColor: colors.soft, borderRadius: radius.md, padding: 15, marginTop: 12 },
  postCopy: { color: colors.ink, fontSize: 14, lineHeight: 20 },
  postMeta: { color: colors.muted, fontSize: 11, marginTop: 10 },
});
