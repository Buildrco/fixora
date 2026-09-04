import { useCallback, useEffect, useRef, useState } from "react";
import { Animated, Easing, Image, PanResponder, Pressable, ScrollView, StyleSheet, Text, TextInput, View, useWindowDimensions } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { colors, radius } from "../constants/theme";
import { IconButton } from "./IconButton";
import { SectionTitle } from "./SectionTitle";
import { Chip } from "./Chip";
import { VendorCard } from "./VendorCard";
import { PostCard } from "./PostCard";
import { getProfilePosts, subscribeProfilePosts } from "../data/profileStore";
import { BottomNav, MainRoute, useBottomNavVisibility } from "./BottomNav";

const repairImg = "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?auto=format&fit=crop&w=900&q=85";
const shopImg = "https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?auto=format&fit=crop&w=900&q=85";
const menuRoutes: MainRoute[] = ["home", "repair", "community", "profile"];

const repairSlides = [
  { title: "Cracked screen?", copy: "Get a careful screen replacement from a verified repairer.", image: "https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?auto=format&fit=crop&w=1000&q=85" },
  { title: "Battery draining fast?", copy: "Find the right battery check before you replace anything.", image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1000&q=85" },
  { title: "Charging problems?", copy: "Diagnose the port, cable, or board with the right specialist.", image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1000&q=85" },
];

export function MainPager({ initial }: { initial: MainRoute }) {
  const { visibility, onScroll } = useBottomNavVisibility();
  const [communityOverlayOpen, setCommunityOverlayOpen] = useState(false);
  const initialIndex = menuRoutes.indexOf(initial);
  const [pageWidth, setPageWidth] = useState(0);
  const pageProgress = useRef(new Animated.Value(initialIndex)).current;
  const pageIndex = useRef(initialIndex);
  const trackPosition = useRef(new Animated.Value(0)).current;
  const dragX = useRef(new Animated.Value(0)).current;
  const trackBaseX = useRef(0);

  const settleTo = useCallback((target: number) => {
    pageIndex.current = target;
    const targetX = -target * pageWidth;
    const dragTarget = targetX - trackBaseX.current;
    Animated.parallel([
      Animated.timing(pageProgress, {
        toValue: target,
        duration: 640,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: false,
      }),
      Animated.timing(dragX, {
        toValue: dragTarget,
        duration: 640,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start(({ finished }) => {
      if (finished) {
        trackBaseX.current = targetX;
        trackPosition.setValue(targetX);
        dragX.setValue(0);
      }
    });
  }, [dragX, pageProgress, pageWidth, trackPosition]);

  const gestureStart = useRef(initialIndex);
  const onSwipeMove = useCallback((gesture: { dx: number }) => {
    if (!pageWidth) return;
    const max = menuRoutes.length - 1;
    const raw = gestureStart.current - gesture.dx / pageWidth;
    const bounded = raw < 0 ? raw * 0.2 : raw > max ? max + (raw - max) * 0.2 : raw;
    pageProgress.setValue(bounded);
  }, [pageProgress, pageWidth]);

  const onSwipeEnd = useCallback((gesture: { dx: number; vx: number }) => {
    if (!pageWidth) return;
    const current = gestureStart.current;
    const distance = Math.abs(gesture.dx);
    const shouldAdvance = distance > pageWidth * 0.22 || Math.abs(gesture.vx) > 0.45;
    let target = current;
    if (shouldAdvance) target = current + (gesture.dx < 0 ? 1 : -1);
    target = Math.max(0, Math.min(menuRoutes.length - 1, target));
    settleTo(target);
  }, [pageWidth, settleTo]);

  const onSwipeMoveRef = useRef(onSwipeMove);
  const onSwipeEndRef = useRef(onSwipeEnd);
  onSwipeMoveRef.current = onSwipeMove;
  onSwipeEndRef.current = onSwipeEnd;
  const gestureSettled = useRef(false);
  const swipeResponder = useRef(PanResponder.create({
    onPanResponderGrant: () => {
      gestureSettled.current = false;
      gestureStart.current = pageIndex.current;
      pageProgress.stopAnimation();
      dragX.stopAnimation();
      dragX.setValue(0);
    },
    onMoveShouldSetPanResponderCapture: (_, gesture) => Math.abs(gesture.dx) > Math.abs(gesture.dy) + 14 && Math.abs(gesture.dx) > 12,
    onPanResponderMove: (_, gesture) => {
      dragX.setValue(gesture.dx);
      onSwipeMoveRef.current(gesture);
    },
    onPanResponderRelease: (_, gesture) => {
      if (gestureSettled.current) return;
      gestureSettled.current = true;
      onSwipeEndRef.current(gesture);
    },
    onPanResponderTerminate: () => {
      if (gestureSettled.current) return;
      gestureSettled.current = true;
      settleTo(pageIndex.current);
    },
    onPanResponderTerminationRequest: () => false,
  })).current;

  return <SafeAreaProvider><SafeAreaView edges={["top"]} style={styles.safe}>
    <View style={styles.root}>
      <View style={styles.viewport} onLayout={event => { const width = event.nativeEvent.layout.width; setPageWidth(width); const baseX = -pageIndex.current * width; trackBaseX.current = baseX; trackPosition.setValue(baseX); }}>
        <Animated.View style={[styles.track, { width: pageWidth ? pageWidth * menuRoutes.length : "400%", transform: [{ translateX: Animated.add(trackPosition, dragX) }] }]}>
          <View style={[styles.page, { width: pageWidth || 1 }]}><HomePage onScroll={onScroll} /></View>
          <View style={[styles.page, { width: pageWidth || 1 }]}><RepairPage onScroll={onScroll} /></View>
          <View style={[styles.page, { width: pageWidth || 1 }]}><CommunityPage onScroll={onScroll} onOverlayChange={setCommunityOverlayOpen} /></View>
          <View style={[styles.page, { width: pageWidth || 1 }]}><ProfilePage onScroll={onScroll} /></View>
        </Animated.View>
      </View>
      {!communityOverlayOpen && <BottomNav active={initial} visibility={visibility} pageProgress={pageProgress} onSelect={index => settleTo(index)} swipePanHandlers={swipeResponder.panHandlers} />}
    </View>
  </SafeAreaView></SafeAreaProvider>;
}

type PageProps = { onScroll: (event: any) => void; onOverlayChange?: (open: boolean) => void };

function HomePage({ onScroll }: PageProps) {
  const router = useRouter();
  return <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={homeStyles.content} onScroll={onScroll} scrollEventThrottle={16}>
    <View style={homeStyles.top}><View><Text style={homeStyles.eyebrow}>Good morning</Text><Text style={homeStyles.greeting}>What do you need today?</Text></View><IconButton name="notifications-outline" /></View>
    <Pressable style={homeStyles.search} onPress={() => router.push("/shop")}><Ionicons name="search-outline" size={20} color={colors.muted} /><Text style={homeStyles.searchText}>Search phones, repairs, tutorials...</Text></Pressable>
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={homeStyles.chips}><Chip label="Shop" active /><Chip label="Repair" /><Chip label="Learn" /><Chip label="Community" /><Chip label="Services" /></ScrollView>
    <Pressable style={homeStyles.hero} onPress={() => router.push("/repair")}><Image source={{ uri: repairImg }} style={homeStyles.heroImage} /><View style={homeStyles.overlay} /><View style={homeStyles.heroCopy}><Text style={homeStyles.heroKicker}>REPAIR, WITHOUT THE RUNAROUND</Text><Text style={homeStyles.heroTitle}>Find a trusted repairer near you.</Text><View style={homeStyles.heroButton}><Text style={homeStyles.heroButtonText}>Start a repair</Text><Ionicons name="arrow-forward" size={17} color="#fff" /></View></View></Pressable>
    <SectionTitle title="Quick actions" />
    <View style={homeStyles.actionsGrid}>{[["phone-portrait-outline", "Shop phones", "/shop"], ["construct-outline", "Request repair", "/repair"], ["play-circle-outline", "Learn repairs", "/learn"], ["people-outline", "Join community", "/community"]].map(([icon, label, path]) => <Pressable key={label} onPress={() => router.push(path as never)} style={({ pressed }) => [homeStyles.quick, pressed && homeStyles.pressed]}><View style={homeStyles.quickIcon}><Ionicons name={icon as keyof typeof Ionicons.glyphMap} size={22} color={colors.ink} /></View><Text style={homeStyles.quickText}>{label}</Text></Pressable>)}</View>
    <SectionTitle title="Repairers near you" action="See all" />
    <ScrollView horizontal showsHorizontalScrollIndicator={false}><VendorCard name="K-Tech Repairs" image={repairImg} price="GH₵280" distance="2.1 km" rating="4.9" /><VendorCard name="iFix Lab" image={shopImg} price="GH₵350" distance="3.4 km" rating="4.8" /></ScrollView>
    <View style={homeStyles.popularSection}><SectionTitle title="Popular phones" action="Shop" /><View style={homeStyles.productRow}><Product image="https://images.unsplash.com/photo-1591337676887-a217a6970a8a?auto=format&fit=crop&w=700&q=85" name="iPhone 15 Pro" price="GH₵14,500" onPress={() => router.push("/product/iphone-15-pro" as never)} /><Product image="https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=700&q=85" name="Galaxy S24" price="GH₵11,800" onPress={() => router.push("/product/galaxy-s24" as never)} /></View></View>
  </ScrollView>;
}

function RepairPage({ onScroll }: PageProps) {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const [repairSlide, setRepairSlide] = useState(0);
  const slideWidth = Math.max(width - 36, 280);
  const issues = ["Broken screen", "Battery", "Charging port", "Camera", "Speaker", "Water damage", "Software", "Motherboard"];
  const icons = ["phone-portrait-outline", "battery-half-outline", "flash-outline", "camera-outline", "volume-medium-outline", "water-outline", "code-slash-outline", "hardware-chip-outline"];
  const issueImages = ["https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?auto=format&fit=crop&w=700&q=85", "https://images.unsplash.com/photo-1609592424773-4a4e5f4d31f1?auto=format&fit=crop&w=700&q=85", "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=700&q=85", "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=700&q=85", "https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=700&q=85", "https://images.unsplash.com/photo-1559825481-12a05cc00344?auto=format&fit=crop&w=700&q=85", "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=700&q=85", "https://images.unsplash.com/photo-1518779578993-ec3579fee39f?auto=format&fit=crop&w=700&q=85"];
  const issueEmojis = ["📱", "🔋", "⚡", "📸", "🔊", "💧", "🧩", "🛠️"];
  return <ScrollView contentContainerStyle={repairStyles.content} onScroll={onScroll} scrollEventThrottle={16}><View style={repairStyles.head}><IconButton name="chevron-back" onPress={() => router.back()} /><Text style={repairStyles.title}>Request a repair</Text><View style={{ width: 42 }} /></View><Text style={repairStyles.step}>1 of 3</Text><Text style={repairStyles.h1}>What needs fixing?</Text><Text style={repairStyles.sub}>Choose the issue and we’ll match you with verified repairers.</Text><ScrollView horizontal pagingEnabled showsHorizontalScrollIndicator={false} style={repairStyles.carousel} onMomentumScrollEnd={event => setRepairSlide(Math.round(event.nativeEvent.contentOffset.x / slideWidth))}>{repairSlides.map(slide => <View key={slide.title} style={[repairStyles.slide, { width: slideWidth }]}><Image source={{ uri: slide.image }} style={repairStyles.slideImage} resizeMode="cover" /><View style={repairStyles.slideShade} /><View style={repairStyles.slideCopy}><Text style={repairStyles.slideTitle}>{slide.title}</Text><Text style={repairStyles.slideText}>{slide.copy}</Text></View></View>)}</ScrollView><View style={repairStyles.slideDots}>{repairSlides.map((slide, index) => <View key={slide.title} style={[repairStyles.slideDot, index === repairSlide && repairStyles.slideDotActive]} />)}</View><Pressable onPress={() => router.push("/repair/select-device" as never)} style={({ pressed }) => [repairStyles.device, pressed && { opacity: 0.78 }]}><Ionicons name="phone-portrait-outline" size={25} color={colors.ink} /><View style={{ flex: 1 }}><Text style={repairStyles.deviceTitle}>iPhone 13 Pro</Text><Text style={repairStyles.deviceSub}>Tap to change device</Text></View><Ionicons name="chevron-forward" size={19} color={colors.muted} /></Pressable><View style={repairStyles.grid}>{issues.map((item, index) => <Pressable key={item} onPress={() => router.push(("/repair/options?issue=" + encodeURIComponent(item)) as never)} style={({ pressed }) => [repairStyles.issue, pressed && { transform: [{ scale: 0.97 }] }]}><Image source={{ uri: issueImages[index] }} style={repairStyles.issueImage} resizeMode="cover" /><Text style={repairStyles.issueEmoji}>{issueEmojis[index]}</Text><View style={repairStyles.issueBody}><View style={repairStyles.issueIcon}><Ionicons name={icons[index] as keyof typeof Ionicons.glyphMap} size={20} /></View><Text style={repairStyles.issueText}>{item}</Text></View></Pressable>)}</View><Pressable style={repairStyles.cta}><Text style={repairStyles.ctaText}>Continue</Text><Ionicons name="arrow-forward" size={18} color="#fff" /></Pressable></ScrollView>;
}

const storyItems = [
  { name: "Lilian Ama", image: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=500&q=85", caption: "New week, fresh repairs ✨" },
  { name: "Abraham K.", image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=500&q=85", caption: "Behind the bench today" },
  { name: "Diana Addo", image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=500&q=85", caption: "Learning never stops" },
  { name: "Kofi Mensah", image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=500&q=85", caption: "A clean board is a happy board" },
];

function StoryTile({ story, onPress }: { story: typeof storyItems[number]; onPress: () => void }) {
  return <Pressable onPress={onPress} style={({ pressed }) => [feedStyles.storyTile, pressed && feedStyles.pressed]}>
    <Image source={{ uri: story.image }} style={feedStyles.storyImage} />
    <View style={feedStyles.storyShade} />
    <View style={feedStyles.storyRing}><Image source={{ uri: story.image }} style={feedStyles.storyAvatar} /></View>
    <Text style={feedStyles.storyName} numberOfLines={2}>{story.name}</Text>
  </Pressable>;
}

function MessagesPage({ onClose }: { onClose: () => void }) {
  const slide = useRef(new Animated.Value(1)).current;
  const [selected, setSelected] = useState<string | null>(null);
  const [draft, setDraft] = useState("");
  const [sent, setSent] = useState<string[]>([]);
  const conversations = [
    { name: "K-Tech Mobile", preview: "The replacement screen is ready.", time: "9m", image: "https://i.pravatar.cc/100?img=12", unread: 2 },
    { name: "Ama’s Phone Clinic", preview: "Thanks for the repair notes!", time: "1h", image: "https://i.pravatar.cc/100?img=32", unread: 0 },
    { name: "Fixora Learn", preview: "New tutorial drops tomorrow.", time: "3h", image: "https://i.pravatar.cc/100?img=47", unread: 1 },
  ];
  const active = conversations.find(item => item.name === selected);
  useEffect(() => { Animated.timing(slide, { toValue: 0, duration: 520, easing: Easing.out(Easing.cubic), useNativeDriver: true }).start(); }, [slide]);
  const sendMessage = () => { if (!draft.trim()) return; setSent(current => [...current, draft.trim()]); setDraft(""); };
  return <Animated.View style={[feedStyles.messageOverlay, { opacity: slide.interpolate({ inputRange: [0, 1], outputRange: [1, 0] }), transform: [{ translateX: slide.interpolate({ inputRange: [0, 1], outputRange: [0, 420] }) }, { scale: slide.interpolate({ inputRange: [0, 1], outputRange: [1, 0.98] }) }] }]}>
    <View style={feedStyles.messageHeader}><Pressable onPress={selected ? () => setSelected(null) : onClose} hitSlop={10}><Ionicons name="arrow-back" size={23} color={colors.ink} /></Pressable><View style={feedStyles.messageTitleWrap}><Text style={feedStyles.messageTitle}>{selected || "Messages"}</Text>{selected && <Text style={feedStyles.messageSubtitle}>Active now</Text>}</View>{!selected && <Pressable style={feedStyles.newMessageButton} hitSlop={8}><Ionicons name="create-outline" size={21} color={colors.ink} /></Pressable>}</View>
    {!selected ? <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={feedStyles.messageList}>{conversations.map(item => <Pressable key={item.name} onPress={() => setSelected(item.name)} style={({ pressed }) => [feedStyles.messageRow, pressed && feedStyles.pressed]}><Image source={{ uri: item.image }} style={feedStyles.messageAvatar} /><View style={feedStyles.messageCopy}><Text style={feedStyles.messageName}>{item.name}</Text><Text style={feedStyles.messagePreview} numberOfLines={1}>{item.preview}</Text></View><View style={feedStyles.messageMeta}><Text style={feedStyles.messageTime}>{item.time}</Text>{item.unread > 0 && <View style={feedStyles.unread}><Text style={feedStyles.unreadText}>{item.unread}</Text></View>}</View></Pressable>)}</ScrollView> : <View style={feedStyles.chatBody}><View style={feedStyles.chatIntro}><Image source={{ uri: active?.image }} style={feedStyles.chatAvatar} /><Text style={feedStyles.chatName}>{active?.name}</Text><Text style={feedStyles.chatIntroText}>This is the beginning of your conversation.</Text></View><View style={feedStyles.sentMessages}>{sent.map((message, index) => <View key={index} style={feedStyles.sentBubble}><Text style={feedStyles.sentText}>{message}</Text></View>)}</View><View style={feedStyles.chatComposer}><TextInput value={draft} onChangeText={setDraft} onSubmitEditing={sendMessage} returnKeyType="send" placeholder="Message..." placeholderTextColor={colors.muted} style={feedStyles.messageInput} /><Pressable onPress={sendMessage} hitSlop={8}><Ionicons name="arrow-up-circle" size={30} color={draft.trim() ? colors.blue : colors.line} /></Pressable></View></View>}
  </Animated.View>;
}

function CommunityPage({ onScroll, onOverlayChange }: PageProps) {
  const [story, setStory] = useState<typeof storyItems[number] | null>(null);
  const [profilePosts, setProfilePosts] = useState(getProfilePosts());
  const [messagesOpen, setMessagesOpen] = useState(false);
  useEffect(() => subscribeProfilePosts(() => setProfilePosts(getProfilePosts())), []);
  useEffect(() => { onOverlayChange?.(Boolean(story || messagesOpen)); }, [story, messagesOpen, onOverlayChange]);
  const storyMotion = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    if (story) {
      storyMotion.setValue(0);
      Animated.timing(storyMotion, { toValue: 1, duration: 460, easing: Easing.out(Easing.cubic), useNativeDriver: true }).start();
    }
  }, [story, storyMotion]);
  return <View style={feedStyles.root}>
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={feedStyles.content} onScroll={onScroll} scrollEventThrottle={16}>
      <View style={feedStyles.head}><Text style={feedStyles.title}>Feed</Text><View style={feedStyles.icons}><IconButton name="search-outline" /><Pressable onPress={() => setMessagesOpen(true)} style={feedStyles.messageButton}><Ionicons name="chatbubble-ellipses-outline" size={22} color={colors.ink} /><View style={feedStyles.messageDot}><Text style={feedStyles.messageDotText}>3</Text></View></Pressable></View></View>
      <View style={feedStyles.tabs}><Text style={[feedStyles.tab, feedStyles.active]}>For You</Text><Text style={feedStyles.tab}>Following</Text></View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={feedStyles.stories}>
        <Pressable onPress={() => setStory({ name: "Your story", image: "https://i.pravatar.cc/100?img=12", caption: "Share something with the community" })} style={({ pressed }) => [feedStyles.storyTile, feedStyles.createStory, pressed && feedStyles.pressed]}><View style={feedStyles.createStoryTop}><View style={feedStyles.createAvatar}><Ionicons name="person" size={30} color={colors.muted} /></View><View style={feedStyles.plus}><Ionicons name="add" size={21} color="#fff" /></View></View><Text style={feedStyles.createText}>Create story</Text></Pressable>
        {storyItems.map(item => <StoryTile key={item.name} story={item} onPress={() => setStory(item)} />)}
      </ScrollView>
      <Pressable style={feedStyles.compose}><View style={feedStyles.avatar}><Ionicons name="person" size={17} color={colors.muted} /></View><Text style={feedStyles.placeholder}>What's happening in tech?</Text><Ionicons name="image-outline" size={20} color={colors.muted} /></Pressable>
      <PostCard delay={80} name="Kwame Repairs" handle="@kwamerepairs" text="Board repair today. Found a short on the power rail — sharing the diagnosis process for anyone learning microsoldering." image="https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&w=1000&q=85" />
      <PostCard delay={180} name="K-Tech Mobile" handle="@ktechmobile" text="Three clean iPhone 15 Pro units just arrived. Verified stock, 12-month warranty." image="https://images.unsplash.com/photo-1592286927505-2fd0b2b8b0a4?auto=format&fit=crop&w=1000&q=85" />
      <PostCard delay={280} name="Ama’s Phone Clinic" handle="@amasphoneclinic" text="Before and after: a careful screen replacement on an iPhone 13. Small details make a repair feel brand new." image="https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?auto=format&fit=crop&w=1000&q=85" />
      <PostCard delay={380} name="Fixora Learn" handle="@fixoralearn" text="Tutorial: three safe checks to try when your phone won’t charge. Save this one before you visit a repairer." image="https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1000&q=85" />
      <PostCard delay={480} name="Circuit Corner" handle="@circuitcorner" text="A little patience, the right tools, and a clean workspace make difficult repairs feel possible." image="https://images.unsplash.com/photo-1517430816045-df4b7de11d1d?auto=format&fit=crop&w=1000&q=85" />
    </ScrollView>
    {story && <Animated.View style={[feedStyles.storyViewer, { opacity: storyMotion, transform: [{ scale: storyMotion.interpolate({ inputRange: [0, 1], outputRange: [1.04, 1] }) }] }]}><Image source={{ uri: story.image }} style={feedStyles.storyViewerImage} /><View style={feedStyles.storyViewerShade} /><Pressable onPress={() => setStory(null)} style={feedStyles.storyClose} hitSlop={8}><Ionicons name="close" size={25} color="#fff" /></Pressable><View style={feedStyles.storyViewerCopy}><Text style={feedStyles.storyViewerName}>{story.name}</Text><Text style={feedStyles.storyViewerCaption}>{story.caption}</Text></View></Animated.View>}
    {messagesOpen && <MessagesPage onClose={() => setMessagesOpen(false)} />}
  </View>;
}

function ProfilePage({ onScroll }: PageProps) {
  const router = useRouter();
  const profileRoutes = ["/profile/orders", "/profile/learning", "/profile/saved", "/profile/payments", "/profile/help"];
  const items = ["Orders", "My learning", "Saved posts", "Payment methods", "Help & support"];
  const icons = ["bag-outline", "play-circle-outline", "bookmark-outline", "card-outline", "help-circle-outline"];
  return <ScrollView contentContainerStyle={profileStyles.content} onScroll={onScroll} scrollEventThrottle={16}><View style={profileStyles.head}><Text style={profileStyles.title}>Profile</Text><IconButton name="settings-outline" onPress={() => router.push("/profile/settings" as never)} /></View><View style={profileStyles.profile}><Pressable onPress={() => router.push("/profile/me" as never)} style={{ position: "relative" }}><Image source={{ uri: "https://i.pravatar.cc/160?img=12" }} style={profileStyles.avatar} /><View style={{ position: "absolute", right: 0, bottom: 2, width: 25, height: 25, borderRadius: 13, backgroundColor: colors.blue, alignItems: "center", justifyContent: "center", borderWidth: 2, borderColor: colors.card }}><Ionicons name="arrow-up-right" size={13} color="#fff" /></View></Pressable><View style={profileStyles.nameRow}><Text style={profileStyles.name}>Your Name</Text><View style={profileStyles.badge}><Text style={profileStyles.badgeText}>✓</Text></View></View><Text style={profileStyles.handle}>@yourhandle</Text><Text style={profileStyles.bio}>Phone enthusiast · Customer · Future repairer</Text><Pressable onPress={() => router.push("/profile/me" as never)} style={{ marginTop: 14, minHeight: 48, borderRadius: 16, backgroundColor: "rgba(45,127,249,.09)", borderWidth: 1, borderColor: "rgba(45,127,249,.25)", flexDirection: "row", alignItems: "center", paddingHorizontal: 13, gap: 10 }}><View style={{ width: 28, height: 28, borderRadius: 10, backgroundColor: colors.blue, alignItems: "center", justifyContent: "center" }}><Ionicons name="person-outline" size={15} color="#fff" /></View><View style={{ flex: 1 }}><Text style={{ color: colors.ink, fontSize: 12, fontWeight: "800" }}>View your profile</Text><Text style={{ color: colors.muted, fontSize: 10, marginTop: 2 }}>See your posts, shop, services and class</Text></View><Ionicons name="chevron-forward" size={16} color={colors.blue} /></Pressable><View style={profileStyles.stats}><Stat n="12" l="Posts" /><Stat n="48" l="Saved" /><Stat n="6" l="Orders" /></View></View><Pressable onPress={() => router.push("/profile/join" as never)} style={profileStyles.join}><View style={profileStyles.joinIcon}><Ionicons name="construct-outline" size={21} /></View><View style={{ flex: 1 }}><Text style={profileStyles.joinTitle}>Join as a repairer or vendor</Text><Text style={profileStyles.joinSub}>Get jobs, sell products and publish tutorials.</Text></View><Ionicons name="chevron-forward" size={19} color={colors.muted} /></Pressable>{items.map((item, index) => <Pressable key={item} onPress={() => router.push(profileRoutes[index] as never)} style={({ pressed }) => [profileStyles.item, pressed && { opacity: 0.76 }]}><View style={profileStyles.itemIcon}><Ionicons name={icons[index] as keyof typeof Ionicons.glyphMap} size={19} /></View><Text style={profileStyles.itemText}>{item}</Text><Ionicons name="chevron-forward" size={17} color={colors.muted} /></Pressable>)}</ScrollView>;
}

function Product({ image, name, price, onPress }: { image: string; name: string; price: string; onPress: () => void }) { return <Pressable onPress={onPress} style={({ pressed }) => [homeStyles.product, pressed && homeStyles.pressed]}><Image source={{ uri: image }} style={homeStyles.productImage} resizeMode="cover" /><Text style={homeStyles.productName}>{name}</Text><Text style={homeStyles.productPrice}>{price}</Text></Pressable>; }
function Stat({ n, l }: { n: string; l: string }) { return <View style={{ alignItems: "center" }}><Text style={profileStyles.statN}>{n}</Text><Text style={profileStyles.statL}>{l}</Text></View>; }

const styles = StyleSheet.create({ safe: { flex: 1, backgroundColor: colors.card }, root: { flex: 1 }, viewport: { flex: 1, overflow: "hidden" }, track: { flexDirection: "row", height: "100%" }, page: { flexShrink: 0, height: "100%" } });
const homeStyles = StyleSheet.create({ content: { paddingHorizontal: 18, paddingTop: 8, paddingBottom: 118 }, top: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" }, eyebrow: { fontSize: 13, color: colors.muted }, greeting: { fontSize: 24, fontWeight: "800", letterSpacing: -0.7, color: colors.ink, marginTop: 3 }, search: { height: 50, borderRadius: 17, backgroundColor: colors.soft, flexDirection: "row", alignItems: "center", paddingHorizontal: 15, gap: 10, marginTop: 18 }, searchText: { fontSize: 13, color: colors.muted }, chips: { marginTop: 18 }, hero: { height: 250, borderRadius: radius.xl, overflow: "hidden", marginTop: 20 }, heroImage: { width: "100%", height: "100%" }, overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0,0,0,.35)" }, heroCopy: { position: "absolute", left: 20, right: 20, bottom: 20 }, heroKicker: { fontSize: 10, fontWeight: "800", letterSpacing: 1.2, color: "#fff", opacity: 0.85 }, heroTitle: { fontSize: 27, lineHeight: 31, fontWeight: "800", letterSpacing: -0.8, color: "#fff", marginTop: 7, maxWidth: 300 }, heroButton: { alignSelf: "flex-start", marginTop: 14, paddingHorizontal: 15, paddingVertical: 10, borderRadius: 16, backgroundColor: colors.blue, flexDirection: "row", gap: 8, alignItems: "center" }, heroButtonText: { color: "#fff", fontSize: 13, fontWeight: "700" }, actionsGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10, marginBottom: 26 }, quick: { width: "48%", minHeight: 76, borderRadius: 18, backgroundColor: colors.soft, padding: 12, flexDirection: "row", alignItems: "center", gap: 11 }, quickIcon: { width: 40, height: 40, borderRadius: 14, backgroundColor: colors.card, alignItems: "center", justifyContent: "center" }, quickText: { fontSize: 13, fontWeight: "700", color: colors.ink, flex: 1 }, popularSection: { marginTop: 24 }, productRow: { flexDirection: "row", gap: 12 }, product: { flex: 1 }, productImage: { height: 145, width: "100%", borderRadius: radius.lg }, productName: { fontSize: 14, fontWeight: "700", marginTop: 9, color: colors.ink }, productPrice: { fontSize: 13, color: colors.muted, marginTop: 3 }, pressed: { opacity: 0.82, transform: [{ scale: 0.985 }] } });
const repairStyles = StyleSheet.create({ content: { padding: 18, paddingBottom: 118 }, carousel: { marginTop: 20 }, slide: { height: 178, borderRadius: 22, overflow: "hidden", marginRight: 12 }, slideImage: { width: "100%", height: "100%" }, slideShade: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0,0,0,.34)" }, slideCopy: { position: "absolute", left: 16, right: 16, bottom: 15 }, slideTitle: { color: "#fff", fontSize: 19, fontWeight: "800" }, slideText: { color: "rgba(255,255,255,.86)", fontSize: 12, lineHeight: 17, marginTop: 4 }, slideDots: { flexDirection: "row", justifyContent: "center", gap: 5, marginTop: 10 }, slideDot: { width: 5, height: 5, borderRadius: 3, backgroundColor: colors.line }, slideDotActive: { width: 17, backgroundColor: colors.ink }, head: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" }, title: { fontSize: 18, fontWeight: "800" }, step: { fontSize: 12, color: colors.accent, fontWeight: "800", marginTop: 28 }, h1: { fontSize: 29, fontWeight: "800", letterSpacing: -0.8, marginTop: 6 }, sub: { fontSize: 14, lineHeight: 21, color: colors.muted, marginTop: 7 }, device: { marginTop: 22, padding: 16, borderRadius: 18, backgroundColor: colors.soft, flexDirection: "row", alignItems: "center", gap: 12 }, deviceTitle: { fontWeight: "800", fontSize: 15 }, deviceSub: { fontSize: 12, color: colors.muted, marginTop: 3 }, grid: { flexDirection: "row", flexWrap: "wrap", gap: 10, marginTop: 18 }, issue: { width: "48%", minHeight: 151, borderWidth: 1, borderColor: colors.line, borderRadius: 18, overflow: "hidden", backgroundColor: colors.card }, issueImage: { width: "100%", height: 82 }, issueEmoji: { position: "absolute", top: 56, right: 10, fontSize: 23 }, issueBody: { padding: 10, flex: 1, justifyContent: "space-between" }, issueIcon: { width: 34, height: 34, borderRadius: 12, backgroundColor: colors.soft, alignItems: "center", justifyContent: "center" }, issueText: { fontSize: 13, fontWeight: "700" }, cta: { height: 54, borderRadius: 18, backgroundColor: colors.ink, alignItems: "center", justifyContent: "center", flexDirection: "row", gap: 9, marginTop: 22 }, ctaText: { color: "#fff", fontSize: 15, fontWeight: "800" } });
const communityStyles = StyleSheet.create({ content: { paddingHorizontal: 18, paddingBottom: 118 }, head: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingTop: 8 }, title: { fontSize: 25, fontWeight: "800", letterSpacing: -0.6 }, icons: { flexDirection: "row", gap: 8 }, tabs: { flexDirection: "row", gap: 28, borderBottomWidth: 1, borderBottomColor: colors.line, marginTop: 18 }, tab: { paddingBottom: 12, fontSize: 14, fontWeight: "700", color: colors.muted }, active: { color: colors.ink, borderBottomWidth: 2, borderBottomColor: colors.ink }, compose: { height: 64, flexDirection: "row", alignItems: "center", gap: 10, borderBottomWidth: 1, borderBottomColor: colors.line }, avatar: { width: 38, height: 38, borderRadius: 19, backgroundColor: colors.soft, alignItems: "center", justifyContent: "center" }, placeholder: { flex: 1, color: colors.muted, fontSize: 14 } });
const profileStyles = StyleSheet.create({ content: { padding: 18, paddingBottom: 118 }, head: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" }, title: { fontSize: 26, fontWeight: "800" }, profile: { alignItems: "center", paddingVertical: 20 }, avatar: { width: 88, height: 88, borderRadius: 44 }, nameRow: { flexDirection: "row", alignItems: "center", marginTop: 12 }, name: { fontSize: 21, fontWeight: "800" }, badge: { width: 18, height: 18, borderRadius: 9, backgroundColor: colors.blue, alignItems: "center", justifyContent: "center", marginLeft: 5 }, badgeText: { color: "#fff", fontSize: 10, fontWeight: "800" }, handle: { fontSize: 13, color: colors.muted, marginTop: 3 }, bio: { fontSize: 13, color: colors.muted, marginTop: 9 }, stats: { flexDirection: "row", gap: 45, marginTop: 17 }, statN: { fontSize: 16, fontWeight: "800" }, statL: { fontSize: 11, color: colors.muted, marginTop: 2 }, join: { padding: 15, borderRadius: 18, backgroundColor: colors.accentSoft, flexDirection: "row", alignItems: "center", gap: 11, marginBottom: 15 }, joinIcon: { width: 40, height: 40, borderRadius: 14, backgroundColor: "#fff", alignItems: "center", justifyContent: "center" }, joinTitle: { fontSize: 14, fontWeight: "800" }, joinSub: { fontSize: 12, color: colors.muted, marginTop: 3 }, item: { height: 62, flexDirection: "row", alignItems: "center", gap: 12, borderBottomWidth: 1, borderBottomColor: colors.line }, itemIcon: { width: 38, height: 38, borderRadius: 13, backgroundColor: colors.soft, alignItems: "center", justifyContent: "center" }, itemText: { flex: 1, fontSize: 14, fontWeight: "700" } });


const feedStyles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.card },
  content: { paddingHorizontal: 18, paddingTop: 8, paddingBottom: 118 },
  head: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  title: { fontSize: 25, fontWeight: "800", letterSpacing: -0.6, color: colors.ink },
  icons: { flexDirection: "row", alignItems: "center", gap: 12 },
  messageButton: { width: 48, height: 48, borderRadius: 24, backgroundColor: colors.soft, alignItems: "center", justifyContent: "center", position: "relative" },
  messageDot: { position: "absolute", top: -2, right: -1, width: 18, height: 18, borderRadius: 9, backgroundColor: colors.accent, alignItems: "center", justifyContent: "center", borderWidth: 2, borderColor: colors.card },
  messageDotText: { color: "#fff", fontSize: 10, fontWeight: "800" },
  tabs: { flexDirection: "row", gap: 36, borderBottomWidth: 1, borderBottomColor: colors.line, marginTop: 15 },
  tab: { paddingBottom: 12, fontSize: 14, fontWeight: "700", color: colors.muted },
  active: { color: colors.ink, borderBottomWidth: 2, borderBottomColor: colors.ink },
  stories: { gap: 8, paddingVertical: 16 },
  storyTile: { width: 92, height: 136, borderRadius: 16, overflow: "hidden", position: "relative", backgroundColor: colors.soft },
  storyImage: { width: "100%", height: "100%" },
  storyShade: { position: "absolute", left: 0, right: 0, top: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.2)" },
  storyRing: { position: "absolute", top: 9, left: 9, width: 36, height: 36, borderRadius: 18, borderWidth: 2, borderColor: colors.blue, padding: 2, backgroundColor: "#fff" },
  storyAvatar: { width: "100%", height: "100%", borderRadius: 15 },
  storyName: { position: "absolute", left: 9, right: 7, bottom: 9, color: "#fff", fontSize: 12, fontWeight: "700" },
  createStory: { backgroundColor: "#f1f2f4", borderWidth: 1, borderColor: colors.line },
  createStoryTop: { height: 91, alignItems: "center", justifyContent: "center" },
  createAvatar: { width: 55, height: 55, borderRadius: 28, backgroundColor: "#d7d9dc", alignItems: "center", justifyContent: "center" },
  plus: { position: "absolute", bottom: 8, width: 30, height: 30, borderRadius: 15, backgroundColor: colors.blue, alignItems: "center", justifyContent: "center", borderWidth: 3, borderColor: "#fff" },
  createText: { textAlign: "center", color: colors.ink, fontSize: 12, fontWeight: "700" },
  compose: { height: 62, flexDirection: "row", alignItems: "center", gap: 10, borderBottomWidth: 1, borderTopWidth: 1, borderColor: colors.line },
  avatar: { width: 38, height: 38, borderRadius: 19, backgroundColor: colors.soft, alignItems: "center", justifyContent: "center" },
  placeholder: { flex: 1, color: colors.muted, fontSize: 14 },
  storyViewer: { position: "absolute", left: 0, right: 0, top: 0, bottom: 0, backgroundColor: "#101114", zIndex: 5 },
  storyViewerImage: { width: "100%", height: "100%" },
  storyViewerShade: { position: "absolute", left: 0, right: 0, top: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.28)" },
  storyClose: { position: "absolute", top: 20, right: 18, width: 42, height: 42, borderRadius: 21, backgroundColor: "rgba(0,0,0,0.35)", alignItems: "center", justifyContent: "center" },
  storyViewerCopy: { position: "absolute", left: 22, right: 22, bottom: 50 },
  storyViewerName: { color: "#fff", fontSize: 24, fontWeight: "800" },
  storyViewerCaption: { color: "rgba(255,255,255,0.88)", fontSize: 15, marginTop: 6 },
  pressed: { opacity: 0.82 },
  messageOverlay: { position: "absolute", left: 0, right: 0, top: 0, bottom: 0, backgroundColor: colors.card, zIndex: 8, paddingHorizontal: 18, paddingTop: 8 },
  messageHeader: { height: 60, flexDirection: "row", alignItems: "center", gap: 16, borderBottomWidth: 1, borderBottomColor: colors.line },
  messageTitleWrap: { flex: 1 },
  messageTitle: { color: colors.ink, fontSize: 22, fontWeight: "800" },
  messageSubtitle: { color: colors.green, fontSize: 11, marginTop: 2 },
  newMessageButton: { width: 42, height: 42, borderRadius: 21, backgroundColor: colors.soft, alignItems: "center", justifyContent: "center" },
  messageList: { paddingTop: 7, paddingBottom: 24 },
  messageRow: { flexDirection: "row", alignItems: "center", gap: 12, paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: colors.line },
  messageAvatar: { width: 50, height: 50, borderRadius: 25 },
  messageCopy: { flex: 1 },
  messageName: { color: colors.ink, fontSize: 15, fontWeight: "700" },
  messagePreview: { color: colors.muted, fontSize: 13, marginTop: 5 },
  messageMeta: { alignItems: "flex-end", gap: 6 },
  messageTime: { color: colors.muted, fontSize: 11 },
  unread: { minWidth: 20, height: 20, paddingHorizontal: 5, borderRadius: 10, backgroundColor: colors.blue, alignItems: "center", justifyContent: "center" },
  unreadText: { color: "#fff", fontSize: 10, fontWeight: "800" },
  chatBody: { flex: 1 },
  chatIntro: { alignItems: "center", paddingTop: 35, paddingBottom: 20 },
  chatAvatar: { width: 66, height: 66, borderRadius: 33 },
  chatName: { color: colors.ink, fontSize: 17, fontWeight: "800", marginTop: 10 },
  chatIntroText: { color: colors.muted, fontSize: 12, marginTop: 5 },
  sentMessages: { flex: 1, justifyContent: "flex-end", gap: 8, paddingBottom: 12 },
  sentBubble: { alignSelf: "flex-end", maxWidth: "82%", backgroundColor: colors.blue, borderRadius: 18, borderBottomRightRadius: 5, paddingHorizontal: 14, paddingVertical: 10 },
  sentText: { color: "#fff", fontSize: 14 },
  chatComposer: { flexDirection: "row", alignItems: "center", gap: 8, paddingVertical: 10, borderTopWidth: 1, borderTopColor: colors.line },
  messageInput: { flex: 1, height: 42, borderRadius: 21, backgroundColor: colors.soft, paddingHorizontal: 15, color: colors.ink, fontSize: 14 },
});
