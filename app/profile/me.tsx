import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { Animated, Image, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "../../constants/theme";
import { addProfilePost, getProfile, getProfilePosts, ProfilePost, subscribeProfile, subscribeProfilePosts } from "../../data/profileStore";

const avatar = "https://i.pravatar.cc/240?img=12";
const tabs = [
  { label: "Posts", icon: "list-outline" },
  { label: "Shop", icon: "storefront-outline" },
  { label: "Services", icon: "construct-outline" },
  { label: "Class", icon: "school-outline" },
] as const;
type Tab = typeof tabs[number]["label"];
const shop = [
  { title: "iPhone 15 Pro", price: "GH₵14,500", meta: "256GB · Like new", image: "https://images.unsplash.com/photo-1591337676887-a217a6970a8a?auto=format&fit=crop&w=700&q=85" },
  { title: "Galaxy S24", price: "GH₵11,800", meta: "256GB · Sealed", image: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=700&q=85" },
];
const services = [{ title: "Screen replacement", meta: "Same-day service", icon: "phone-portrait-outline" }, { title: "Board diagnostics", meta: "Microsoldering", icon: "hardware-chip-outline" }];
const classes = [{ title: "Read a charging fault", meta: "Beginner · 4 lessons", icon: "flash-outline" }, { title: "Your first board repair", meta: "Intermediate · 7 lessons", icon: "construct-outline" }];

export default function ProfileMe() {
  const router = useRouter();
  const intro = useRef(new Animated.Value(0)).current;
  const [tab, setTab] = useState<Tab>("Posts");
  const [profile, setProfile] = useState(getProfile());
  const [composing, setComposing] = useState(false);
  const [draft, setDraft] = useState("");
  const [posts, setPosts] = useState<ProfilePost[]>(getProfilePosts());

  useEffect(() => { Animated.spring(intro, { toValue: 1, damping: 17, stiffness: 105, mass: 0.8, useNativeDriver: true }).start(); }, [intro]);
  useEffect(() => subscribeProfile(() => setProfile({ ...getProfile() })), []);
  useEffect(() => subscribeProfilePosts(() => setPosts([...getProfilePosts()])), []);
  const publish = () => { if (!draft.trim()) return; addProfilePost(draft.trim()); setDraft(""); setComposing(false); };

  return <SafeAreaView style={s.safe} edges={["top"]}>
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.content}>
      <View style={s.header}>
        <Pressable onPress={() => router.back()} hitSlop={10}><Ionicons name="chevron-back" size={27} color={colors.ink} /></Pressable>
        <Text style={s.headerTitle}>Profile</Text>
        <View style={s.headerActions}><Pressable hitSlop={10}><Ionicons name="share-outline" size={22} color={colors.ink} /></Pressable><Pressable hitSlop={10}><Ionicons name="ellipsis-horizontal" size={22} color={colors.ink} /></Pressable></View>
      </View>
      <Animated.View style={{ opacity: intro, transform: [{ translateY: intro.interpolate({ inputRange: [0, 1], outputRange: [24, 0] }) }] }}>
        <View style={s.cover}><View style={s.coverOrb} /></View>
        <View style={s.identityBlock}>
          <View style={s.avatarWrap}><Image source={{ uri: avatar }} style={s.avatar} /><View style={s.avatarBadge}><Ionicons name="checkmark" size={12} color="#fff" /></View></View>
          <View style={s.nameRow}><Text style={s.name}>{profile.name}</Text><View style={s.verified}><Ionicons name="checkmark" size={12} color="#fff" /></View></View>
          <Text style={s.handle}>{profile.handle}</Text>
          <Text style={s.bio}>{profile.bio}</Text>
          <InfoRow icon="briefcase-outline" text={profile.company} />
          <View style={s.infoLine}><InfoRow icon="location-outline" text={profile.location} /><InfoRow icon="link-outline" text={profile.website} linked /></View>
          <InfoRow icon="calendar-outline" text={profile.dateOfBirth + "  ·  " + profile.joined} />
          <View style={s.following}><Text style={s.followNumber}>89</Text><Text style={s.followLabel}> Following</Text><Text style={s.followNumber}>  117</Text><Text style={s.followLabel}> Followers</Text></View>
          <View style={s.actions}><Pressable style={s.secondaryButton}><Text style={s.secondaryText}>Share</Text></Pressable><Pressable onPress={() => router.push("/profile/edit" as never)} style={s.secondaryButton}><Text style={s.secondaryText}>Edit profile</Text></Pressable></View>
        </View>
        <View style={s.tabBar}>{tabs.map(item => <ProfileTab key={item.label} item={item} active={tab === item.label} onPress={() => setTab(item.label)} />)}</View>
        {tab === "Posts" && <Posts posts={posts} profile={profile} composing={composing} draft={draft} setDraft={setDraft} onCompose={() => setComposing(true)} onCancel={() => { setComposing(false); setDraft(""); }} onPublish={publish} />}
        {tab === "Shop" && <ShopTab />}
        {tab === "Services" && <ListTab title="Services" copy="Book a trusted service from this profile." items={services} />}
        {tab === "Class" && <ListTab title="Class" copy="Short, practical lessons from this profile." items={classes} />}
      </Animated.View>
    </ScrollView>
  </SafeAreaView>;
}

function ProfileTab({ item, active, onPress }: { item: typeof tabs[number]; active: boolean; onPress: () => void }) { const progress = useRef(new Animated.Value(active ? 1 : 0)).current; useEffect(() => { Animated.timing(progress, { toValue: active ? 1 : 0, duration: 220, useNativeDriver: true }).start(); }, [active, progress]); return <Pressable onPress={onPress} style={[s.tab, active && s.tabActive, active && s.tabExpanded]}><Ionicons name={item.icon as keyof typeof Ionicons.glyphMap} size={17} color={active ? colors.ink : colors.muted} /><Animated.Text style={[s.tabText, { opacity: progress, transform: [{ translateX: progress.interpolate({ inputRange: [0, 1], outputRange: [-8, 0] }) }] }]}>{item.label}</Animated.Text></Pressable>; }
function InfoRow({ icon, text, linked }: { icon: keyof typeof Ionicons.glyphMap; text: string; linked?: boolean }) { return <View style={s.infoRow}><Ionicons name={icon} size={16} color={colors.muted} /><Text style={[s.infoText, linked && s.linkText]}>{text}</Text></View>; }
function Posts({ posts, profile, composing, draft, setDraft, onCompose, onCancel, onPublish }: { posts: ProfilePost[]; profile: ReturnType<typeof getProfile>; composing: boolean; draft: string; setDraft: (value: string) => void; onCompose: () => void; onCancel: () => void; onPublish: () => void }) { return <View style={s.section}><Pressable onPress={onCompose} style={s.compose}><Image source={{ uri: avatar }} style={s.composeAvatar} /><Text style={s.composeText}>Share something useful</Text><Ionicons name="add-circle-outline" size={23} color={colors.blue} /></Pressable>{composing && <View style={s.composer}><TextInput autoFocus value={draft} onChangeText={setDraft} multiline style={s.postInput} placeholder="Share a repair, product, or lesson..." placeholderTextColor={colors.muted} /><View style={s.editorActions}><Pressable onPress={onCancel}><Text style={s.cancel}>Cancel</Text></Pressable><Pressable onPress={onPublish} style={s.publish}><Text style={s.publishText}>Publish</Text></Pressable></View></View>}{posts.length === 0 && <View style={s.empty}><Ionicons name="images-outline" size={31} color={colors.blue} /><Text style={s.emptyTitle}>No posts yet</Text><Text style={s.emptyCopy}>Your repairs, products, and lessons will appear here.</Text></View>}{posts.map(post => <View key={post.id} style={s.post}><View style={s.postHead}><Image source={{ uri: avatar }} style={s.postAvatar} /><View style={{ flex: 1 }}><Text style={s.postName}>{post.name}</Text><Text style={s.postMeta}>{post.handle} · just now</Text></View><Ionicons name="ellipsis-horizontal" size={18} color={colors.muted} /></View><Text style={s.postText}>{post.text}</Text><View style={s.postActions}><Ionicons name="chatbubble-outline" size={18} color={colors.muted} /><Ionicons name="repeat-outline" size={20} color={colors.muted} /><Ionicons name="heart-outline" size={19} color={colors.muted} /><Ionicons name="share-outline" size={18} color={colors.muted} /></View></View>)}</View>; }
function ShopTab() { return <View style={s.section}><SectionHead title="Shop" copy="Products from this profile." /><View style={s.shopGrid}>{shop.map(item => <Pressable key={item.title} style={s.product}><Image source={{ uri: item.image }} style={s.productImage} /><Text style={s.productTitle}>{item.title}</Text><Text style={s.productMeta}>{item.meta}</Text><Text style={s.price}>{item.price}</Text></Pressable>)}</View></View>; }
function ListTab({ title, copy, items }: { title: string; copy: string; items: Array<{ title: string; meta: string; icon: keyof typeof Ionicons.glyphMap }> }) { return <View style={s.section}><SectionHead title={title} copy={copy} />{items.map(item => <Pressable key={item.title} style={s.listItem}><View style={s.listIcon}><Ionicons name={item.icon} size={21} color={colors.blue} /></View><View style={{ flex: 1 }}><Text style={s.productTitle}>{item.title}</Text><Text style={s.productMeta}>{item.meta}</Text></View><Ionicons name="chevron-forward" size={18} color={colors.muted} /></Pressable>)}</View>; }
function SectionHead({ title, copy }: { title: string; copy: string }) { return <View style={s.sectionHead}><View><Text style={s.sectionTitle}>{title}</Text><Text style={s.sectionCopy}>{copy}</Text></View><Ionicons name="add-circle-outline" size={23} color={colors.blue} /></View>; }

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.card }, content: { paddingBottom: 45 }, header: { height: 50, paddingHorizontal: 18, flexDirection: "row", alignItems: "center", justifyContent: "space-between", backgroundColor: colors.card }, headerTitle: { color: colors.ink, fontSize: 18, fontWeight: "800" }, headerActions: { flexDirection: "row", gap: 19 }, cover: { height: 106, backgroundColor: "#d4dce1", overflow: "hidden" }, coverOrb: { width: 210, height: 210, borderRadius: 105, backgroundColor: "rgba(255,255,255,.23)", position: "absolute", right: -45, top: -90 }, identityBlock: { paddingHorizontal: 17, paddingBottom: 17, backgroundColor: colors.card }, avatarWrap: { width: 82, height: 82, borderRadius: 41, padding: 4, backgroundColor: colors.card, position: "absolute", top: -41, left: 17 }, avatar: { width: "100%", height: "100%", borderRadius: 38 }, avatarBadge: { position: "absolute", right: -1, bottom: 3, width: 24, height: 24, borderRadius: 12, backgroundColor: colors.blue, alignItems: "center", justifyContent: "center", borderWidth: 2, borderColor: colors.card }, nameRow: { flexDirection: "row", alignItems: "center", gap: 5, marginTop: 47 }, name: { color: colors.ink, fontSize: 20, fontWeight: "800", letterSpacing: -0.4 }, verified: { width: 18, height: 18, borderRadius: 10, backgroundColor: colors.blue, alignItems: "center", justifyContent: "center" }, handle: { color: colors.muted, fontSize: 13, marginTop: 3 }, bio: { color: colors.ink, fontSize: 14, lineHeight: 20, marginTop: 16, maxWidth: 370 }, infoLine: { flexDirection: "row", flexWrap: "wrap", gap: 10, marginTop: 7 }, infoRow: { flexDirection: "row", alignItems: "center", gap: 4, marginTop: 7 }, infoText: { color: colors.muted, fontSize: 12 }, linkText: { color: "#2b9cca" }, following: { flexDirection: "row", alignItems: "baseline", marginTop: 15 }, followNumber: { color: colors.ink, fontSize: 14, fontWeight: "800" }, followLabel: { color: colors.muted, fontSize: 13 }, actions: { flexDirection: "row", gap: 9, marginTop: 13 }, secondaryButton: { flex: 1, height: 41, borderRadius: 24, borderWidth: 1, borderColor: "#cbd0d3", alignItems: "center", justifyContent: "center" }, secondaryText: { color: colors.ink, fontSize: 15, fontWeight: "800" }, tabBar: { height: 51, borderTopWidth: 1, borderBottomWidth: 1, borderColor: colors.line, flexDirection: "row", backgroundColor: colors.card }, tab: { flex: 1, alignItems: "center", justifyContent: "center", gap: 0, borderBottomWidth: 3, borderBottomColor: "transparent" }, tabActive: { borderBottomColor: colors.blue }, tabExpanded: { flexDirection: "row", gap: 5, paddingHorizontal: 7 }, tabText: { color: colors.muted, fontSize: 10, fontWeight: "700" }, tabTextActive: { color: colors.ink }, section: { paddingHorizontal: 17, marginTop: 10 }, compose: { minHeight: 50, paddingHorizontal: 11, backgroundColor: colors.soft, flexDirection: "row", alignItems: "center", gap: 9 }, composeAvatar: { width: 30, height: 30, borderRadius: 17 }, composeText: { flex: 1, color: colors.muted, fontSize: 12 }, composer: { padding: 12, borderBottomWidth: 1, borderColor: colors.line }, postInput: { minHeight: 74, color: colors.ink, fontSize: 14, textAlignVertical: "top" }, editorActions: { flexDirection: "row", justifyContent: "flex-end", alignItems: "center", gap: 15, marginTop: 10 }, cancel: { color: colors.muted, fontSize: 13, fontWeight: "700" }, publish: { paddingHorizontal: 15, paddingVertical: 9, backgroundColor: colors.ink, borderRadius: 17 }, publishText: { color: "#fff", fontSize: 12, fontWeight: "800" }, empty: { alignItems: "center", paddingVertical: 38, borderBottomWidth: 1, borderColor: colors.line }, emptyTitle: { color: colors.ink, fontSize: 17, fontWeight: "800", marginTop: 11 }, emptyCopy: { color: colors.muted, fontSize: 13, marginTop: 5, textAlign: "center" }, post: { paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: colors.line }, postHead: { flexDirection: "row", alignItems: "center", gap: 9 }, postAvatar: { width: 34, height: 34, borderRadius: 19 }, postName: { color: colors.ink, fontSize: 13, fontWeight: "800" }, postMeta: { color: colors.muted, fontSize: 11, marginTop: 3 }, postText: { color: colors.ink, fontSize: 14, lineHeight: 20, marginTop: 10 }, postActions: { flexDirection: "row", justifyContent: "space-between", marginTop: 14, paddingRight: 16 }, sectionHead: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }, sectionTitle: { color: colors.ink, fontSize: 17, fontWeight: "800" }, sectionCopy: { color: colors.muted, fontSize: 12, marginTop: 3 }, shopGrid: { flexDirection: "row", gap: 11 }, product: { flex: 1 }, productImage: { width: "100%", height: 134, borderRadius: 13 }, productTitle: { color: colors.ink, fontSize: 13, fontWeight: "800", marginTop: 8 }, productMeta: { color: colors.muted, fontSize: 11, marginTop: 4 }, price: { color: colors.blue, fontSize: 13, fontWeight: "800", marginTop: 6 }, listItem: { minHeight: 70, flexDirection: "row", alignItems: "center", gap: 11, borderBottomWidth: 1, borderColor: colors.line }, listIcon: { width: 41, height: 41, backgroundColor: "rgba(45,127,249,.1)", alignItems: "center", justifyContent: "center" },
});
