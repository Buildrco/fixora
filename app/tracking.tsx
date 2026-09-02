import { useEffect, useMemo, useRef, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { Animated, Image, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { colors, radius } from "../constants/theme";
import { IconButton } from "../components/IconButton";

type DeliveryMode = "motorbike" | "car" | "pickup";

const modeDetails: Record<DeliveryMode, { label: string; icon: any; eta: string }> = {
  motorbike: { label: "Motorbike delivery", icon: "bicycle-outline", eta: "20–30 min" },
  car: { label: "Car delivery", icon: "car-sport-outline", eta: "30–45 min" },
  pickup: { label: "Seller pickup", icon: "storefront-outline", eta: "Ready today" },
};

const statusSteps = [
  { title: "Order confirmed", copy: "Your payment and order are secure.", icon: "checkmark-circle" },
  { title: "Being prepared", copy: "The seller is packing your item.", icon: "cube-outline" },
  { title: "On the way", copy: "Your rider is heading to you now.", icon: "navigate-outline" },
  { title: "Arriving next", copy: "We’ll notify you at the doorstep.", icon: "flag-outline" },
];

export default function Tracking() {
  const router = useRouter();
  const { name, price, image, mode, address } = useLocalSearchParams<{ name?: string; price?: string; image?: string; mode?: string; address?: string }>();
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [notice, setNotice] = useState("");
  const progress = useRef(new Animated.Value(0)).current;
  const cardEntrance = useRef(new Animated.Value(0)).current;
  const deliveryMode: DeliveryMode = mode === "car" || mode === "pickup" ? mode : "motorbike";
  const delivery = modeDetails[deliveryMode];
  const productName = String(name || "Fixora order");
  const productPrice = String(price || "GH₵0");
  const dropOff = String(address || "New Market, Central");
  const orderNumber = "#FX-204873";
  const mapLine = useMemo(() => deliveryMode === "pickup" ? "M 42 52 C 95 60, 130 110, 192 101" : "M 38 54 C 92 22, 104 128, 165 90 C 188 75, 217 104, 263 64", [deliveryMode]);

  useEffect(() => {
    Animated.parallel([
      Animated.spring(cardEntrance, { toValue: 1, tension: 48, friction: 9, useNativeDriver: true }),
      Animated.timing(progress, { toValue: 1, duration: 1200, useNativeDriver: false }),
    ]).start();
  }, [cardEntrance, progress]);

  const showNotice = (message: string) => {
    setNotice(message);
    setTimeout(() => setNotice(""), 2600);
  };

  return <SafeAreaView edges={["top", "bottom"]} style={styles.safe}>
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
      <View style={styles.header}><IconButton name="chevron-back" onPress={() => router.back()} /><View style={styles.headerCenter}><Text style={styles.headerKicker}>LIVE ORDER</Text><Text style={styles.title}>Track delivery</Text></View><Pressable onPress={() => showNotice("Tracking updates are on for this order.")} style={styles.bell}><Ionicons name="notifications-outline" size={19} color={colors.ink} /><View style={styles.bellDot} /></Pressable></View>

      <Animated.View style={{ opacity: cardEntrance, transform: [{ translateY: cardEntrance.interpolate({ inputRange: [0, 1], outputRange: [18, 0] }) }] }}>
        <View style={styles.statusHero}>
          <View style={styles.heroTop}><View style={styles.statusPill}><View style={styles.liveDot} /><Text style={styles.statusPillText}>{deliveryMode === "pickup" ? "READY TO COLLECT" : "ON THE WAY"}</Text></View><Text style={styles.orderNumber}>{orderNumber}</Text></View>
          <Text style={styles.heroTitle}>{deliveryMode === "pickup" ? "Your order is ready" : "Your order is moving"}</Text>
          <Text style={styles.heroCopy}>{deliveryMode === "pickup" ? "The seller has prepared your order for collection." : "Your rider has picked up the order and is heading your way."}</Text>
          <View style={styles.etaRow}><View><Text style={styles.etaLabel}>{deliveryMode === "pickup" ? "COLLECTION WINDOW" : "ESTIMATED ARRIVAL"}</Text><Text style={styles.etaValue}>{delivery.eta}</Text></View><View style={styles.heroRide}><Ionicons name={delivery.icon} size={21} color="#fff" /><Text style={styles.heroRideText}>{deliveryMode === "pickup" ? "Pickup" : "Fixora rider"}</Text></View></View>
          <View style={styles.progressTrack}><Animated.View style={[styles.progressFill, { width: progress.interpolate({ inputRange: [0, 1], outputRange: ["24%", "76%"] }) }]} /><View style={styles.progressCar}><Ionicons name={delivery.icon} size={14} color={colors.blue} /></View></View>
        </View>

        <View style={styles.routeCard}>
          <View style={styles.routeHeader}><View><Text style={styles.routeKicker}>DELIVERY ROUTE</Text><Text style={styles.routeTitle}>{deliveryMode === "pickup" ? "Collect from seller" : "Heading to your drop-off"}</Text></View><View style={styles.routeBadge}><Ionicons name="navigate" size={14} color={colors.blue} /></View></View>
          <View style={styles.map}><View style={styles.mapRoadOne} /><View style={styles.mapRoadTwo} /><View style={styles.mapRoadThree} /><View style={styles.mapLabelOne}><Text style={styles.mapLabelText}>CENTRAL</Text></View><View style={styles.mapLabelTwo}><Text style={styles.mapLabelText}>MARKET ROAD</Text></View><View style={styles.routeSvg}><View style={[styles.routeSegment, { transform: [{ rotate: "-20deg" }, { translateY: -17 }, { translateX: 26 }] }]} /><View style={[styles.routeSegment, { width: 78, transform: [{ rotate: "53deg" }, { translateY: 9 }, { translateX: 3 }] }]} /><View style={[styles.routeSegment, { width: 66, transform: [{ rotate: "-29deg" }, { translateY: 24 }, { translateX: 43 }] }]} /></View><View style={styles.mapPinStart}><Ionicons name={deliveryMode === "pickup" ? "storefront" : "cube"} size={13} color="#fff" /></View><View style={styles.mapPinEnd}><Ionicons name={deliveryMode === "pickup" ? "checkmark" : "location"} size={13} color="#fff" /></View><View style={styles.mapStartLabel}><Text style={styles.mapPointTitle}>{deliveryMode === "pickup" ? "Seller" : "K-Tech Mobile"}</Text><Text style={styles.mapPointCopy}>{deliveryMode === "pickup" ? "Ready for collection" : "Order packed"}</Text></View><View style={styles.mapEndLabel}><Text style={styles.mapPointTitle}>{deliveryMode === "pickup" ? "Done" : "You"}</Text><Text style={styles.mapPointCopy}>{dropOff}</Text></View></View>
          <View style={styles.routeFooter}><View style={styles.routePerson}><View style={styles.avatar}><Ionicons name={deliveryMode === "pickup" ? "storefront" : "person"} size={16} color={colors.blue} /></View><View><Text style={styles.personLabel}>{deliveryMode === "pickup" ? "PICKUP CONTACT" : "YOUR RIDER"}</Text><Text style={styles.personName}>{deliveryMode === "pickup" ? "K-Tech Mobile" : "Richard D. · Fixora"}</Text></View></View><View style={styles.actionRow}><Pressable testID="call-rider-button" onPress={() => showNotice(deliveryMode === "pickup" ? "Seller contact is ready." : "Calling your Fixora rider...")} style={styles.roundAction}><Ionicons name={deliveryMode === "pickup" ? "call-outline" : "call"} size={17} color={colors.ink} /></Pressable><Pressable testID="message-rider-button" onPress={() => showNotice("Message composer is ready for your rider.")} style={[styles.roundAction, styles.messageAction]}><Ionicons name="chatbubble-ellipses" size={16} color="#fff" /></Pressable></View></View>
        </View>

        <View style={styles.timelineHeader}><Text style={styles.sectionTitle}>Order updates</Text><Text style={styles.updated}>UPDATED JUST NOW</Text></View>
        <View style={styles.timeline}>{statusSteps.map((step, index) => {
          const complete = deliveryMode === "pickup" || index < 2;
          const active = deliveryMode !== "pickup" && index === 2;
          return <View key={step.title} style={styles.timelineItem}><View style={styles.timelineRail}><View style={[styles.timelineIcon, complete && styles.timelineIconComplete, active && styles.timelineIconActive]}><Ionicons name={complete ? "checkmark" : step.icon as any} size={15} color={complete || active ? "#fff" : colors.muted} /></View>{index < statusSteps.length - 1 ? <View style={[styles.timelineLine, (complete || active) && styles.timelineLineActive]} /> : null}</View><View style={styles.timelineCopy}><Text style={[styles.timelineTitle, (complete || active) && styles.timelineTitleActive]}>{step.title}</Text><Text style={styles.timelineSub}>{step.copy}</Text></View>{active ? <View style={styles.nowPill}><Text style={styles.nowText}>NOW</Text></View> : null}</View>;
        })}</View>

        <Pressable testID="order-details-toggle" onPress={() => setDetailsOpen(value => !value)} style={styles.detailsToggle}><View style={styles.detailsToggleLeft}><View style={styles.productThumb}><Image source={{ uri: String(image || "https://images.unsplash.com/photo-1591337676887-a217a6970a8a?auto=format&fit=crop&w=240&q=85") }} style={styles.productImage} /></View><View><Text style={styles.detailsKicker}>ORDER DETAILS</Text><Text style={styles.detailsName} numberOfLines={1}>{productName}</Text></View></View><Ionicons name={detailsOpen ? "chevron-up" : "chevron-down"} size={18} color={colors.ink} /></Pressable>
        {detailsOpen ? <View style={styles.detailsCard}><View style={styles.detailRow}><Text style={styles.detailKey}>Item total</Text><Text style={styles.detailValue}>{productPrice}</Text></View><View style={styles.detailRow}><Text style={styles.detailKey}>{delivery.label}</Text><Text style={styles.detailValue}>{deliveryMode === "pickup" ? "Free" : deliveryMode === "car" ? "GH₵55" : "GH₵35"}</Text></View><View style={styles.detailDivider} /><View style={styles.detailRow}><Text style={styles.detailTotalKey}>Paid total</Text><Text style={styles.detailTotalValue}>GH₵{((Number(productPrice.replace(/[^0-9]/g, "")) || 0) + (deliveryMode === "pickup" ? 0 : deliveryMode === "car" ? 55 : 35)).toLocaleString()}</Text></View></View> : null}

        <View style={styles.bottomActions}><Pressable onPress={() => showNotice("A shareable tracking link is ready.")} style={styles.shareButton}><Ionicons name="share-social-outline" size={17} color={colors.ink} /><Text style={styles.shareText}>Share tracking</Text></Pressable><Pressable onPress={() => router.push("/profile/help" as never)} style={styles.helpButton}><Ionicons name="help-circle-outline" size={17} color="#fff" /><Text style={styles.helpText}>Need help?</Text></Pressable></View>
      </Animated.View>
    </ScrollView>
    {notice ? <View style={styles.toast}><Ionicons name="checkmark-circle" size={17} color="#9FE5C5" /><Text style={styles.toastText}>{notice}</Text></View> : null}
  </SafeAreaView>;
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.card },
  scrollContent: { padding: 18, paddingBottom: 38 },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  headerCenter: { alignItems: "center" },
  headerKicker: { color: colors.muted, fontSize: 9, fontWeight: "800", letterSpacing: 1.2 },
  title: { color: colors.ink, fontSize: 19, fontWeight: "800", marginTop: 3 },
  bell: { width: 42, height: 42, borderRadius: 21, backgroundColor: colors.soft, alignItems: "center", justifyContent: "center", position: "relative" },
  bellDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.blue, position: "absolute", top: 10, right: 10 },
  statusHero: { marginTop: 20, padding: 19, minHeight: 214, borderRadius: radius.lg, backgroundColor: colors.ink, overflow: "hidden" },
  heroTop: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  statusPill: { paddingHorizontal: 9, height: 24, borderRadius: 12, backgroundColor: "rgba(45,127,249,.2)", flexDirection: "row", alignItems: "center", gap: 6 },
  liveDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: "#79B0FF" },
  statusPillText: { color: "#A9C9FF", fontSize: 9, fontWeight: "800", letterSpacing: .7 },
  orderNumber: { color: "#8E8E8E", fontSize: 10, fontWeight: "700" },
  heroTitle: { color: "#fff", fontSize: 25, fontWeight: "800", marginTop: 19, letterSpacing: -.5 },
  heroCopy: { color: "#BDBDBD", fontSize: 12, lineHeight: 18, marginTop: 5, maxWidth: 275 },
  etaRow: { flexDirection: "row", alignItems: "flex-end", justifyContent: "space-between", marginTop: 17 },
  etaLabel: { color: "#858585", fontSize: 9, fontWeight: "800", letterSpacing: 1 },
  etaValue: { color: "#fff", fontSize: 18, fontWeight: "800", marginTop: 4 },
  heroRide: { flexDirection: "row", alignItems: "center", gap: 7 },
  heroRideText: { color: "#D9D9D9", fontSize: 10, fontWeight: "700" },
  progressTrack: { height: 7, borderRadius: 4, backgroundColor: "#343434", marginTop: 17, position: "relative" },
  progressFill: { height: 7, borderRadius: 4, backgroundColor: colors.blue },
  progressCar: { position: "absolute", top: -5, width: 24, height: 24, borderRadius: 12, backgroundColor: "#fff", alignItems: "center", justifyContent: "center", marginLeft: -12, left: "76%" },
  routeCard: { marginTop: 14, borderRadius: radius.lg, backgroundColor: colors.soft, padding: 14 },
  routeHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  routeKicker: { color: colors.muted, fontSize: 9, fontWeight: "800", letterSpacing: 1.1 },
  routeTitle: { color: colors.ink, fontSize: 16, fontWeight: "800", marginTop: 4 },
  routeBadge: { width: 35, height: 35, borderRadius: 13, backgroundColor: "#DFEBFF", alignItems: "center", justifyContent: "center" },
  map: { height: 190, marginTop: 13, borderRadius: 18, backgroundColor: "#E7EAE9", overflow: "hidden", position: "relative" },
  mapRoadOne: { position: "absolute", width: 330, height: 17, backgroundColor: "#F7F8F6", top: 37, left: -30, transform: [{ rotate: "22deg" }] },
  mapRoadTwo: { position: "absolute", width: 300, height: 14, backgroundColor: "#F7F8F6", top: 110, left: -24, transform: [{ rotate: "-35deg" }] },
  mapRoadThree: { position: "absolute", width: 250, height: 12, backgroundColor: "#F7F8F6", top: 91, left: 76, transform: [{ rotate: "70deg" }] },
  mapLabelOne: { position: "absolute", top: 18, right: 22 },
  mapLabelTwo: { position: "absolute", bottom: 18, left: 20 },
  mapLabelText: { color: "#A5AAA7", fontSize: 8, fontWeight: "800", letterSpacing: 1 },
  routeSvg: { position: "absolute", left: 0, top: 0, right: 0, bottom: 0 },
  routeSegment: { position: "absolute", left: 36, top: 78, width: 82, height: 2, backgroundColor: colors.blue, borderRadius: 2, borderStyle: "dashed", borderWidth: 1, borderColor: colors.blue },
  mapPinStart: { position: "absolute", left: 27, top: 42, width: 28, height: 28, borderRadius: 14, backgroundColor: colors.ink, alignItems: "center", justifyContent: "center", borderWidth: 3, borderColor: "#fff" },
  mapPinEnd: { position: "absolute", right: 29, bottom: 35, width: 28, height: 28, borderRadius: 14, backgroundColor: colors.blue, alignItems: "center", justifyContent: "center", borderWidth: 3, borderColor: "#fff" },
  mapStartLabel: { position: "absolute", left: 62, top: 37, backgroundColor: "rgba(255,255,255,.86)", borderRadius: 8, paddingHorizontal: 7, paddingVertical: 5 },
  mapEndLabel: { position: "absolute", right: 62, bottom: 28, backgroundColor: "rgba(255,255,255,.9)", borderRadius: 8, paddingHorizontal: 7, paddingVertical: 5, maxWidth: 130 },
  mapPointTitle: { color: colors.ink, fontSize: 9, fontWeight: "800" },
  mapPointCopy: { color: colors.muted, fontSize: 8, marginTop: 2 },
  routeFooter: { marginTop: 13, paddingTop: 12, borderTopWidth: 1, borderTopColor: colors.line, flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  routePerson: { flexDirection: "row", alignItems: "center" },
  avatar: { width: 38, height: 38, borderRadius: 13, backgroundColor: "#DDEAFF", alignItems: "center", justifyContent: "center", marginRight: 9 },
  personLabel: { color: colors.muted, fontSize: 8, fontWeight: "800", letterSpacing: .8 },
  personName: { color: colors.ink, fontSize: 12, fontWeight: "800", marginTop: 3 },
  actionRow: { flexDirection: "row", gap: 7 },
  roundAction: { width: 37, height: 37, borderRadius: 19, backgroundColor: "#fff", alignItems: "center", justifyContent: "center" },
  messageAction: { backgroundColor: colors.blue },
  timelineHeader: { marginTop: 24, flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  sectionTitle: { color: colors.ink, fontSize: 16, fontWeight: "800" },
  updated: { color: colors.blue, fontSize: 9, fontWeight: "800", letterSpacing: .8 },
  timeline: { marginTop: 13, padding: 15, borderRadius: radius.md, borderWidth: 1, borderColor: colors.line },
  timelineItem: { minHeight: 58, flexDirection: "row" },
  timelineRail: { width: 29, alignItems: "center" },
  timelineIcon: { width: 25, height: 25, borderRadius: 13, backgroundColor: colors.soft, borderWidth: 1, borderColor: colors.line, alignItems: "center", justifyContent: "center" },
  timelineIconComplete: { backgroundColor: colors.blue, borderColor: colors.blue },
  timelineIconActive: { backgroundColor: colors.ink, borderColor: colors.ink },
  timelineLine: { flex: 1, width: 1, backgroundColor: colors.line },
  timelineLineActive: { backgroundColor: colors.blue },
  timelineCopy: { flex: 1, marginLeft: 10, paddingBottom: 12 },
  timelineTitle: { color: colors.muted, fontSize: 12, fontWeight: "700" },
  timelineTitleActive: { color: colors.ink, fontWeight: "800" },
  timelineSub: { color: colors.muted, fontSize: 10, marginTop: 4 },
  nowPill: { alignSelf: "flex-start", paddingHorizontal: 7, paddingVertical: 4, borderRadius: 8, backgroundColor: "#E5F1FF" },
  nowText: { color: colors.blue, fontSize: 8, fontWeight: "800" },
  detailsToggle: { marginTop: 14, minHeight: 67, padding: 10, borderRadius: 17, backgroundColor: colors.soft, flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  detailsToggleLeft: { flexDirection: "row", alignItems: "center", flex: 1 },
  productThumb: { width: 47, height: 47, borderRadius: 13, overflow: "hidden", backgroundColor: "#E7E7E2" },
  productImage: { width: "100%", height: "100%" },
  detailsKicker: { color: colors.muted, fontSize: 8, fontWeight: "800", letterSpacing: .9 },
  detailsName: { color: colors.ink, fontSize: 13, fontWeight: "800", marginTop: 4, maxWidth: 220 },
  detailsCard: { marginTop: 6, padding: 14, borderRadius: 15, backgroundColor: "#F8F8F6", borderWidth: 1, borderColor: colors.line },
  detailRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 5 },
  detailKey: { color: colors.muted, fontSize: 11 },
  detailValue: { color: colors.ink, fontSize: 11, fontWeight: "700" },
  detailDivider: { height: 1, backgroundColor: colors.line, marginVertical: 4 },
  detailTotalKey: { color: colors.ink, fontSize: 12, fontWeight: "800" },
  detailTotalValue: { color: colors.blue, fontSize: 14, fontWeight: "800" },
  bottomActions: { marginTop: 16, flexDirection: "row", gap: 9 },
  shareButton: { flex: 1, height: 52, borderRadius: 17, borderWidth: 1, borderColor: colors.line, flexDirection: "row", gap: 7, alignItems: "center", justifyContent: "center" },
  shareText: { color: colors.ink, fontSize: 12, fontWeight: "800" },
  helpButton: { flex: .85, height: 52, borderRadius: 17, backgroundColor: colors.blue, flexDirection: "row", gap: 7, alignItems: "center", justifyContent: "center" },
  helpText: { color: "#fff", fontSize: 12, fontWeight: "800" },
  toast: { position: "absolute", left: 18, right: 18, bottom: 22, minHeight: 48, paddingHorizontal: 14, borderRadius: 16, backgroundColor: colors.ink, flexDirection: "row", alignItems: "center", gap: 8, shadowColor: "#000", shadowOpacity: .18, shadowRadius: 12, shadowOffset: { width: 0, height: 5 }, elevation: 5 },
  toastText: { color: "#fff", fontSize: 11, fontWeight: "700", flex: 1 },
});