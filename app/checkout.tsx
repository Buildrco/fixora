import { useEffect, useMemo, useRef, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { Animated, Image, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { colors, radius } from "../constants/theme";
import { IconButton } from "../components/IconButton";

type DeliveryMode = "motorbike" | "car" | "pickup";
type PaymentMethod = "mobile-money" | "cash";

type ModeOption = {
  id: DeliveryMode;
  title: string;
  copy: string;
  eta: string;
  fee: number;
  icon: any;
  accent: string;
};

const modeOptions: ModeOption[] = [
  { id: "motorbike", title: "Motorbike", copy: "Best for small parcels", eta: "20–30 min", fee: 35, icon: "bicycle-outline", accent: "#2D7FF9" },
  { id: "car", title: "Car", copy: "Extra room for devices", eta: "30–45 min", fee: 55, icon: "car-sport-outline", accent: "#1E57C8" },
  { id: "pickup", title: "Pick up", copy: "Collect from the seller", eta: "Ready today", fee: 0, icon: "storefront-outline", accent: "#171717" },
];

export default function Checkout() {
  const router = useRouter();
  const { name, price, image } = useLocalSearchParams<{ name?: string; price?: string; image?: string }>();
  const [deliveryMode, setDeliveryMode] = useState<DeliveryMode>("motorbike");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("mobile-money");
  const [address, setAddress] = useState("New Market, Central");
  const [note, setNote] = useState("");
  const entrance = useRef(new Animated.Value(0)).current;
  const buttonPulse = useRef(new Animated.Value(1)).current;
  const productName = String(name || "Fixora order");
  const productPrice = String(price || "GH₵0");
  const unitPrice = Number(productPrice.replace(/[^0-9]/g, "")) || 0;
  const selectedMode = modeOptions.find(option => option.id === deliveryMode) || modeOptions[0];
  const total = unitPrice + selectedMode.fee;

  useEffect(() => {
    Animated.spring(entrance, { toValue: 1, tension: 48, friction: 9, useNativeDriver: true }).start();
    Animated.loop(Animated.sequence([
      Animated.timing(buttonPulse, { toValue: 0.97, duration: 1100, useNativeDriver: true }),
      Animated.timing(buttonPulse, { toValue: 1, duration: 1100, useNativeDriver: true }),
    ])).start();
  }, [buttonPulse, entrance]);

  const trackingPath = useMemo(() => {
    return "/tracking?name=" + encodeURIComponent(productName) + "&price=" + encodeURIComponent(productPrice) + "&image=" + encodeURIComponent(String(image || "")) + "&mode=" + deliveryMode + "&address=" + encodeURIComponent(address);
  }, [address, deliveryMode, image, productName, productPrice]);

  return <SafeAreaView edges={["top", "bottom"]} style={styles.safe}>
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
      <View style={styles.header}>
        <IconButton name="chevron-back" onPress={() => router.back()} />
        <View style={styles.headerTitle}><Text style={styles.headerKicker}>ORDER FLOW</Text><Text style={styles.title}>Delivery details</Text></View>
        <View style={styles.secure}><Ionicons name="shield-checkmark-outline" size={17} color={colors.blue} /></View>
      </View>

      <View style={styles.steps}>
        <View style={styles.stepDone}><Ionicons name="checkmark" size={12} color="#fff" /></View><View style={styles.stepLineActive} /><View style={styles.stepCurrent}><Text style={styles.stepCurrentText}>2</Text></View><View style={styles.stepLine} /><View style={styles.step}><Text style={styles.stepText}>3</Text></View>
        <View style={styles.stepLabels}><Text style={styles.stepLabelDone}>Basket</Text><Text style={styles.stepLabelCurrent}>Delivery</Text><Text style={styles.stepLabel}>Done</Text></View>
      </View>

      <Animated.View style={{ opacity: entrance, transform: [{ translateY: entrance.interpolate({ inputRange: [0, 1], outputRange: [22, 0] }) }] }}>
        <View style={styles.hero}>
          <View style={styles.heroOrb}><Ionicons name={selectedMode.icon} size={26} color="#fff" /></View>
          <View style={styles.heroCopy}><Text style={styles.heroKicker}>MAKE IT YOURS</Text><Text style={styles.heroTitle}>How should we get it to you?</Text><Text style={styles.heroSub}>Choose the ride that fits your order.</Text></View>
          <View style={styles.heroSpark}><Ionicons name="sparkles-outline" size={18} color="#A9C9FF" /></View>
        </View>

        <Text style={styles.sectionTitle}>Your order</Text>
        <View style={styles.orderCard}>
          <Image source={{ uri: String(image || "https://images.unsplash.com/photo-1591337676887-a217a6970a8a?auto=format&fit=crop&w=700&q=85") }} style={styles.orderImage} />
          <View style={styles.orderCopy}><Text style={styles.orderName} numberOfLines={2}>{productName}</Text><Text style={styles.orderSeller}>Verified seller · 1 item</Text><Text style={styles.orderPrice}>{productPrice}</Text></View>
          <View style={styles.quantity}><Text style={styles.quantityText}>×1</Text></View>
        </View>

        <Text style={styles.sectionTitle}>Choose delivery</Text>
        <View style={styles.modeList}>{modeOptions.map(option => {
          const selected = deliveryMode === option.id;
          return <Pressable key={option.id} testID={"delivery-" + option.id} onPress={() => setDeliveryMode(option.id)} style={[styles.modeCard, selected && styles.modeCardSelected]}>
            <View style={[styles.modeIcon, selected && { backgroundColor: option.accent }]}><Ionicons name={option.icon} size={21} color={selected ? "#fff" : colors.ink} /></View>
            <View style={styles.modeCopy}><Text style={styles.modeTitle}>{option.title}</Text><Text style={styles.modeSub}>{option.copy}</Text></View>
            <View style={styles.modeRight}><Text style={styles.modeEta}>{option.eta}</Text><Text style={styles.modeFee}>{option.fee ? "GH₵" + option.fee : "Free"}</Text></View>
            <View style={[styles.radio, selected && styles.radioSelected]}>{selected ? <View style={styles.radioDot} /> : null}</View>
          </Pressable>;
        })}</View>

        {deliveryMode !== "pickup" ? <>
          <View style={styles.sectionRow}><Text style={styles.sectionTitle}>Drop-off point</Text><Text style={styles.editLabel}>EDIT</Text></View>
          <View style={styles.addressCard}><View style={styles.addressIcon}><Ionicons name="location" size={17} color={colors.blue} /></View><View style={styles.addressCopy}><Text style={styles.addressLabel}>DELIVER TO</Text><TextInput value={address} onChangeText={setAddress} placeholder="Add a delivery address" placeholderTextColor={colors.muted} style={styles.addressInput} /></View><Ionicons name="chevron-forward" size={17} color={colors.muted} /></View>
          <View style={styles.noteRow}><Ionicons name="information-circle-outline" size={16} color={colors.muted} /><TextInput value={note} onChangeText={setNote} placeholder="Add a note for your rider (optional)" placeholderTextColor={colors.muted} style={styles.noteInput} /></View>
        </> : <View style={styles.pickupNotice}><View style={styles.pickupIcon}><Ionicons name="storefront-outline" size={19} color="#fff" /></View><View><Text style={styles.pickupTitle}>Ready for collection</Text><Text style={styles.pickupCopy}>We’ll notify you when the seller has packed it.</Text></View></View>}

        <Text style={styles.sectionTitle}>Payment method</Text>
        <View style={styles.paymentList}>
          <Pressable testID="mobile-money-payment" onPress={() => setPaymentMethod("mobile-money")} style={[styles.paymentCard, paymentMethod === "mobile-money" && styles.paymentSelected]}><View style={styles.paymentIcon}><Ionicons name="phone-portrait-outline" size={18} color={colors.blue} /></View><View style={styles.paymentCopy}><Text style={styles.paymentTitle}>Mobile Money</Text><Text style={styles.paymentSub}>MTN, Vodafone or AirtelTigo</Text></View><View style={[styles.radio, paymentMethod === "mobile-money" && styles.radioSelected]}>{paymentMethod === "mobile-money" ? <View style={styles.radioDot} /> : null}</View></Pressable>
          <Pressable testID="cash-payment" onPress={() => setPaymentMethod("cash")} style={[styles.paymentCard, paymentMethod === "cash" && styles.paymentSelected]}><View style={[styles.paymentIcon, styles.cashIcon]}><Ionicons name="cash-outline" size={18} color={colors.ink} /></View><View style={styles.paymentCopy}><Text style={styles.paymentTitle}>Pay on delivery</Text><Text style={styles.paymentSub}>Cash when your order arrives</Text></View><View style={[styles.radio, paymentMethod === "cash" && styles.radioSelected]}>{paymentMethod === "cash" ? <View style={styles.radioDot} /> : null}</View></Pressable>
        </View>

        <View style={styles.summary}><View><Text style={styles.summaryLabel}>ORDER TOTAL</Text><Text style={styles.summaryValue}>GH₵{total.toLocaleString()}</Text></View><View style={styles.summaryLines}><View style={styles.summaryLine}><Text style={styles.summaryKey}>Item</Text><Text style={styles.summaryText}>{productPrice}</Text></View><View style={styles.summaryLine}><Text style={styles.summaryKey}>{selectedMode.title}</Text><Text style={styles.summaryText}>{selectedMode.fee ? "GH₵" + selectedMode.fee : "Free"}</Text></View></View></View>

        <Animated.View style={{ transform: [{ scale: buttonPulse }] }}><Pressable testID="place-order-button" onPress={() => router.push(trackingPath as never)} style={({ pressed }) => [styles.cta, pressed && styles.pressed]}><View><Text style={styles.ctaTitle}>Place order</Text><Text style={styles.ctaSub}>{paymentMethod === "cash" ? "Pay when it arrives" : "Secure mobile money checkout"}</Text></View><View style={styles.ctaArrow}><Ionicons name="arrow-forward" size={19} color={colors.blue} /></View></Pressable></Animated.View>
        <View style={styles.trust}><Ionicons name="lock-closed-outline" size={13} color={colors.green} /><Text style={styles.trustText}>Your order details are protected</Text></View>
      </Animated.View>
    </ScrollView>
  </SafeAreaView>;
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.card },
  scrollContent: { padding: 18, paddingBottom: 36 },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  headerTitle: { alignItems: "center" },
  headerKicker: { color: colors.muted, fontSize: 9, fontWeight: "800", letterSpacing: 1.1 },
  title: { color: colors.ink, fontSize: 19, fontWeight: "800", marginTop: 3 },
  secure: { width: 42, height: 42, borderRadius: 21, backgroundColor: "#EEF4FF", alignItems: "center", justifyContent: "center" },
  steps: { height: 57, marginTop: 17, flexDirection: "row", alignItems: "flex-start", paddingHorizontal: 21, position: "relative" },
  stepDone: { width: 22, height: 22, borderRadius: 11, backgroundColor: colors.blue, alignItems: "center", justifyContent: "center" },
  stepCurrent: { width: 22, height: 22, borderRadius: 11, backgroundColor: colors.ink, alignItems: "center", justifyContent: "center" },
  step: { width: 22, height: 22, borderRadius: 11, backgroundColor: colors.soft, alignItems: "center", justifyContent: "center" },
  stepCurrentText: { color: "#fff", fontSize: 11, fontWeight: "800" },
  stepText: { color: colors.muted, fontSize: 11, fontWeight: "800" },
  stepLineActive: { flex: 1, height: 2, backgroundColor: colors.blue, marginTop: 10 },
  stepLine: { flex: 1, height: 2, backgroundColor: colors.line, marginTop: 10 },
  stepLabels: { position: "absolute", top: 29, left: 10, right: 10, flexDirection: "row", justifyContent: "space-between" },
  stepLabelDone: { color: colors.blue, fontSize: 10, fontWeight: "800" },
  stepLabelCurrent: { color: colors.ink, fontSize: 10, fontWeight: "800", marginLeft: 9 },
  stepLabel: { color: colors.muted, fontSize: 10, fontWeight: "700", marginRight: 7 },
  hero: { minHeight: 130, borderRadius: radius.lg, backgroundColor: colors.ink, padding: 18, flexDirection: "row", alignItems: "center", overflow: "hidden" },
  heroOrb: { width: 54, height: 54, borderRadius: 18, backgroundColor: colors.blue, alignItems: "center", justifyContent: "center", marginRight: 13 },
  heroCopy: { flex: 1 },
  heroKicker: { color: "#9EBFFF", fontSize: 9, fontWeight: "800", letterSpacing: 1.3 },
  heroTitle: { color: "#fff", fontSize: 20, fontWeight: "800", lineHeight: 24, marginTop: 5 },
  heroSub: { color: "#B9B9B9", fontSize: 12, marginTop: 4 },
  heroSpark: { position: "absolute", right: 16, top: 16 },
  sectionTitle: { color: colors.ink, fontSize: 16, fontWeight: "800", marginTop: 23, marginBottom: 10 },
  orderCard: { borderRadius: radius.md, backgroundColor: colors.soft, padding: 11, flexDirection: "row", alignItems: "center" },
  orderImage: { width: 66, height: 72, borderRadius: 13, backgroundColor: "#E5E5E0" },
  orderCopy: { flex: 1, marginLeft: 11 },
  orderName: { color: colors.ink, fontSize: 14, fontWeight: "800", lineHeight: 18 },
  orderSeller: { color: colors.muted, fontSize: 10, marginTop: 5 },
  orderPrice: { color: colors.ink, fontSize: 13, fontWeight: "800", marginTop: 6 },
  quantity: { alignSelf: "flex-start", paddingTop: 3 },
  quantityText: { color: colors.muted, fontSize: 12, fontWeight: "800" },
  modeList: { gap: 9 },
  modeCard: { minHeight: 75, borderRadius: 17, borderWidth: 1, borderColor: colors.line, padding: 10, flexDirection: "row", alignItems: "center" },
  modeCardSelected: { borderColor: colors.blue, backgroundColor: "#F4F8FF" },
  modeIcon: { width: 43, height: 43, borderRadius: 14, backgroundColor: colors.soft, alignItems: "center", justifyContent: "center" },
  modeCopy: { flex: 1, marginLeft: 11 },
  modeTitle: { color: colors.ink, fontSize: 13, fontWeight: "800" },
  modeSub: { color: colors.muted, fontSize: 10, marginTop: 4 },
  modeRight: { alignItems: "flex-end", marginRight: 10 },
  modeEta: { color: colors.blue, fontSize: 10, fontWeight: "800" },
  modeFee: { color: colors.ink, fontSize: 12, fontWeight: "800", marginTop: 5 },
  radio: { width: 19, height: 19, borderRadius: 10, borderWidth: 1.5, borderColor: "#CFCFCB", alignItems: "center", justifyContent: "center" },
  radioSelected: { borderColor: colors.blue },
  radioDot: { width: 9, height: 9, borderRadius: 5, backgroundColor: colors.blue },
  sectionRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 1 },
  sectionRowTitle: { color: colors.ink, fontSize: 16, fontWeight: "800" },
  editLabel: { color: colors.blue, fontSize: 10, fontWeight: "800", letterSpacing: 1 },
  addressCard: { minHeight: 70, padding: 11, borderRadius: 17, backgroundColor: "#F4F8FF", borderWidth: 1, borderColor: "#D8E6FF", flexDirection: "row", alignItems: "center" },
  addressIcon: { width: 38, height: 38, borderRadius: 13, backgroundColor: "#DDEAFF", alignItems: "center", justifyContent: "center" },
  addressCopy: { flex: 1, marginLeft: 10 },
  addressLabel: { color: colors.blue, fontSize: 9, fontWeight: "800", letterSpacing: 1 },
  addressInput: { color: colors.ink, fontSize: 13, fontWeight: "700", paddingVertical: 2, paddingHorizontal: 0 },
  noteRow: { minHeight: 43, borderBottomWidth: 1, borderBottomColor: colors.line, flexDirection: "row", alignItems: "center", gap: 7 },
  noteInput: { flex: 1, color: colors.ink, fontSize: 12, paddingVertical: 9 },
  pickupNotice: { padding: 13, borderRadius: 17, backgroundColor: "#F3F3F1", flexDirection: "row", alignItems: "center" },
  pickupIcon: { width: 39, height: 39, borderRadius: 13, backgroundColor: colors.ink, alignItems: "center", justifyContent: "center", marginRight: 10 },
  pickupTitle: { color: colors.ink, fontSize: 13, fontWeight: "800" },
  pickupCopy: { color: colors.muted, fontSize: 10, marginTop: 3 },
  paymentList: { gap: 9 },
  paymentCard: { minHeight: 64, padding: 10, borderRadius: 17, borderWidth: 1, borderColor: colors.line, flexDirection: "row", alignItems: "center" },
  paymentSelected: { borderColor: colors.blue, backgroundColor: "#F4F8FF" },
  paymentIcon: { width: 38, height: 38, borderRadius: 13, backgroundColor: "#E6F0FF", alignItems: "center", justifyContent: "center" },
  cashIcon: { backgroundColor: colors.soft },
  paymentCopy: { flex: 1, marginLeft: 10 },
  paymentTitle: { color: colors.ink, fontSize: 13, fontWeight: "800" },
  paymentSub: { color: colors.muted, fontSize: 10, marginTop: 3 },
  summary: { marginTop: 23, padding: 15, borderRadius: radius.md, backgroundColor: colors.soft, flexDirection: "row", justifyContent: "space-between" },
  summaryLabel: { color: colors.muted, fontSize: 9, fontWeight: "800", letterSpacing: 1.1 },
  summaryValue: { color: colors.ink, fontSize: 23, fontWeight: "800", marginTop: 4 },
  summaryLines: { minWidth: 112, gap: 5 },
  summaryLine: { flexDirection: "row", justifyContent: "space-between", gap: 16 },
  summaryKey: { color: colors.muted, fontSize: 10 },
  summaryText: { color: colors.ink, fontSize: 10, fontWeight: "800" },
  cta: { minHeight: 64, marginTop: 13, borderRadius: 21, paddingHorizontal: 18, backgroundColor: colors.blue, flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  ctaTitle: { color: "#fff", fontSize: 15, fontWeight: "800" },
  ctaSub: { color: "#DCE9FF", fontSize: 10, marginTop: 4 },
  ctaArrow: { width: 38, height: 38, borderRadius: 19, backgroundColor: "#fff", alignItems: "center", justifyContent: "center" },
  trust: { flexDirection: "row", gap: 5, alignItems: "center", justifyContent: "center", marginTop: 14 },
  trustText: { color: colors.muted, fontSize: 10 },
  pressed: { opacity: 0.82 },
});