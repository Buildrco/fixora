import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { ScrollView, Text, View, StyleSheet, Image, Pressable, TextInput } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { colors, radius } from "../../constants/theme";
import { IconButton } from "../../components/IconButton";

type Product = {
  name: string;
  price: string;
  image: string;
  seller: string;
  category: string;
  description: string;
  specs: Array<[string, string]>;
  currentBid: number;
};

const products: Record<string, Product> = {
  "iphone-15-pro": {
    name: "iPhone 15 Pro", price: "GH₵14,500", image: "https://images.unsplash.com/photo-1592286927505-2fd0b2b8b0a4?auto=format&fit=crop&w=900&q=85",
    seller: "K-Tech Mobile", category: "Mobile phones", currentBid: 13400,
    description: "A professionally verified iPhone 15 Pro in excellent condition. Tested, unlocked, and ready for a new owner.",
    specs: [["Condition", "Like new"], ["Storage", "256 GB"], ["Battery", "98%"], ["Warranty", "12 months"]],
  },
  "iphone-14": {
    name: "iPhone 14", price: "GH₵10,800", image: "https://images.unsplash.com/photo-1591337676887-a217a6970a8a?auto=format&fit=crop&w=900&q=85",
    seller: "Accra Device Hub", category: "Mobile phones", currentBid: 9800,
    description: "A clean, fully tested iPhone 14 with a bright display, strong battery health, and verified device history.",
    specs: [["Condition", "Excellent"], ["Storage", "128 GB"], ["Battery", "94%"], ["Warranty", "6 months"]],
  },
  "galaxy-s24": {
    name: "Galaxy S24", price: "GH₵11,800", image: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=900&q=85",
    seller: "K-Tech Mobile", category: "Mobile phones", currentBid: 10900,
    description: "A verified Galaxy S24 with a sharp camera, smooth display, and all-day battery for work and everyday life.",
    specs: [["Condition", "Excellent"], ["Storage", "256 GB"], ["Battery", "97%"], ["Warranty", "12 months"]],
  },
  "pixel-9-pro": {
    name: "Pixel 9 Pro", price: "GH₵9,900", image: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=900&q=85",
    seller: "Accra Device Hub", category: "Mobile phones", currentBid: 9000,
    description: "A lightly used Pixel 9 Pro with a clean camera system, vivid display, and verified seller warranty.",
    specs: [["Condition", "Like new"], ["Storage", "128 GB"], ["Battery", "96%"], ["Warranty", "6 months"]],
  },
  "iphone-16-pro": { name: "iPhone 16 Pro", price: "GH₵18,900", image: "https://images.unsplash.com/photo-1696446701796-da61225697cc?auto=format&fit=crop&w=900&q=85", seller: "K-Tech Mobile", category: "Mobile phones", currentBid: 17800, description: "A premium iPhone 16 Pro, fully tested and verified for a confident upgrade.", specs: [["Condition", "Like new"], ["Storage", "256 GB"], ["Battery", "99%"], ["Warranty", "12 months"]] },
  "galaxy-z-flip6": { name: "Galaxy Z Flip6", price: "GH₵15,700", image: "https://images.unsplash.com/photo-1610945264803-c22b62d2a7b3?auto=format&fit=crop&w=900&q=85", seller: "K-Tech Mobile", category: "Mobile phones", currentBid: 14900, description: "A compact foldable Galaxy with a bright display and verified device history.", specs: [["Condition", "Excellent"], ["Storage", "256 GB"], ["Battery", "96%"], ["Warranty", "12 months"]] },
  "pixel-8a": { name: "Pixel 8a", price: "GH₵7,400", image: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=900&q=85", seller: "Accra Device Hub", category: "Mobile phones", currentBid: 6900, description: "A clean Pixel 8a with a reliable camera and smooth everyday performance.", specs: [["Condition", "Excellent"], ["Storage", "128 GB"], ["Battery", "95%"], ["Warranty", "6 months"]] },
  "oneplus-12": { name: "OnePlus 12", price: "GH₵8,600", image: "https://images.unsplash.com/photo-1598965402089-897ce52e8355?auto=format&fit=crop&w=900&q=85", seller: "K-Tech Mobile", category: "Mobile phones", currentBid: 8100, description: "A fast OnePlus 12 with a vivid display and verified seller warranty.", specs: [["Condition", "Like new"], ["Storage", "256 GB"], ["Battery", "98%"], ["Warranty", "12 months"]] },
  "ipad-air": { name: "iPad Air", price: "GH₵11,200", image: "https://images.unsplash.com/photo-1561154464-82e9adf32764?auto=format&fit=crop&w=900&q=85", seller: "K-Tech Mobile", category: "Tablets", currentBid: 10400, description: "A lightweight iPad Air ready for study, creative work, and everyday use.", specs: [["Condition", "Excellent"], ["Storage", "256 GB"], ["Battery", "97%"], ["Warranty", "12 months"]] },
  "galaxy-tab-a9": { name: "Galaxy Tab A9", price: "GH₵5,600", image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=900&q=85", seller: "Accra Device Hub", category: "Tablets", currentBid: 5100, description: "A practical Galaxy tablet with a bright screen and dependable battery life.", specs: [["Condition", "Very good"], ["Storage", "128 GB"], ["Battery", "95%"], ["Warranty", "6 months"]] },
  "lenovo-tab-p12": { name: "Lenovo Tab P12", price: "GH₵6,900", image: "https://images.unsplash.com/photo-1585790050230-5dd28404ccb9?auto=format&fit=crop&w=900&q=85", seller: "K-Tech Mobile", category: "Tablets", currentBid: 6200, description: "A spacious Lenovo tablet for work, media, and family use.", specs: [["Condition", "Excellent"], ["Storage", "128 GB"], ["Battery", "96%"], ["Warranty", "6 months"]] },
  "macbook-air": { name: "MacBook Air", price: "GH₵21,800", image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=900&q=85", seller: "K-Tech Mobile", category: "Laptops & Computers", currentBid: 20500, description: "A thin, powerful MacBook Air with a clean display and verified condition.", specs: [["Condition", "Like new"], ["Storage", "512 GB"], ["Battery", "91%"], ["Warranty", "12 months"]] },
  "dell-xps-15": { name: "Dell XPS 15", price: "GH₵16,400", image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=900&q=85", seller: "Accra Device Hub", category: "Laptops & Computers", currentBid: 15400, description: "A capable Dell XPS 15 for productivity, design, and demanding everyday work.", specs: [["Condition", "Excellent"], ["Storage", "512 GB"], ["Battery", "89%"], ["Warranty", "6 months"]] },
  "asus-rog-zephyrus": { name: "ASUS ROG Zephyrus", price: "GH₵24,500", image: "https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?auto=format&fit=crop&w=900&q=85", seller: "K-Tech Mobile", category: "Laptops & Computers", currentBid: 23200, description: "A powerful gaming laptop with a sharp display and verified performance.", specs: [["Condition", "Like new"], ["Storage", "1 TB"], ["Battery", "93%"], ["Warranty", "12 months"]] },
  "oled-display": { name: "OLED Display", price: "GH₵890", image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=900&q=85", seller: "Fixora Parts", category: "Repair Parts", currentBid: 780, description: "A tested replacement OLED display for clean, reliable phone repairs.", specs: [["Condition", "New"], ["Compatibility", "Multiple models"], ["Warranty", "3 months"], ["Stock", "Ready"]] },
  "iphone-14-battery": { name: "iPhone 14 Battery", price: "GH₵360", image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=900&q=85", seller: "Fixora Parts", category: "Repair Parts", currentBid: 300, description: "A quality replacement battery prepared for professional iPhone 14 service.", specs: [["Condition", "New"], ["Compatibility", "iPhone 14"], ["Warranty", "3 months"], ["Stock", "Ready"]] },
  "iphone-15-logic-board": { name: "iPhone 15 Logic Board", price: "GH₵1,650", image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=900&q=85", seller: "Fixora Parts", category: "Repair Parts", currentBid: 1450, description: "A tested logic board component for experienced repair technicians.", specs: [["Condition", "Tested"], ["Compatibility", "iPhone 15"], ["Warranty", "3 months"], ["Stock", "Limited"]] },
  "precision-driver-set": { name: "Precision Driver Set", price: "GH₵260", image: "https://images.unsplash.com/photo-1530124566582-a618bc2615dc?auto=format&fit=crop&w=900&q=85", seller: "Fixora Tools", category: "Tools & Equipment", currentBid: 220, description: "A compact precision driver set for everyday device repair work.", specs: [["Condition", "New"], ["Pieces", "24"], ["Warranty", "6 months"], ["Stock", "Ready"]] },
  "hot-air-rework-station": { name: "Hot Air Rework Station", price: "GH₵2,400", image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=900&q=85", seller: "Fixora Tools", category: "Tools & Equipment", currentBid: 2200, description: "A reliable hot air station for board-level repairs and rework.", specs: [["Condition", "New"], ["Temperature", "480°C"], ["Warranty", "12 months"], ["Stock", "Ready"]] },
  "usb-c-tester": { name: "USB-C Tester", price: "GH₵420", image: "https://images.unsplash.com/photo-1530124566582-a618bc2615dc?auto=format&fit=crop&w=900&q=85", seller: "Fixora Tools", category: "Tools & Equipment", currentBid: 360, description: "A pocket tester for checking USB-C power, voltage, and charging faults.", specs: [["Condition", "New"], ["Display", "Digital"], ["Warranty", "6 months"], ["Stock", "Ready"]] },
  "smartwatch-series-9": { name: "Smartwatch Series 9", price: "GH₵2,100", image: "https://images.unsplash.com/photo-1544117519-31a4b719223d?auto=format&fit=crop&w=900&q=85", seller: "Accra Device Hub", category: "Gadgets & Accessories", currentBid: 1900, description: "A clean smartwatch for calls, health tracking, and everyday alerts.", specs: [["Condition", "Excellent"], ["Battery", "96%"], ["Warranty", "6 months"], ["Stock", "Ready"]] },
  "usb-c-fast-charger": { name: "USB-C Fast Charger", price: "GH₵240", image: "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=900&q=85", seller: "Fixora Gadgets", category: "Gadgets & Accessories", currentBid: 200, description: "A compact fast charger for modern phones, tablets, and accessories.", specs: [["Condition", "New"], ["Output", "30W"], ["Warranty", "6 months"], ["Stock", "Ready"]] },
  "magsafe-case": { name: "MagSafe Case", price: "GH₵280", image: "https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?auto=format&fit=crop&w=900&q=85", seller: "Fixora Gadgets", category: "Gadgets & Accessories", currentBid: 230, description: "A slim protective MagSafe case with a clean fit and strong magnetic hold.", specs: [["Condition", "New"], ["Compatibility", "iPhone"], ["Warranty", "3 months"], ["Stock", "Ready"]] },
};

export default function ProductDetails() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const product = products[String(id)] ?? products["iphone-15-pro"];
  const [reminded, setReminded] = useState(false);
  const [following, setFollowing] = useState(false);
  const [bid, setBid] = useState("");
  const [highestBid, setHighestBid] = useState(product.currentBid);
  const [bidMessage, setBidMessage] = useState("");

  const placeBid = () => {
    const amount = Number(bid.replace(/[^0-9]/g, ""));
    if (!amount || amount <= highestBid) {
      setBidMessage(`Enter more than GH₵${highestBid.toLocaleString()}`);
      return;
    }
    setHighestBid(amount);
    setBid("");
    setBidMessage("You are currently the highest bidder.");
  };

  return <SafeAreaView edges={["top", "bottom"]} style={styles.safe}>
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
      <View style={styles.imageWrap}>
        <Image source={{ uri: product.image }} style={styles.image} resizeMode="cover" />
        <View style={styles.imageHeader}><IconButton name="chevron-back" onPress={() => router.back()} /><Pressable testID="reminder-button" onPress={() => setReminded(value => !value)} style={[styles.iconButton, reminded && styles.iconButtonActive]}><Ionicons name={reminded ? "notifications" : "notifications-outline"} size={20} color={reminded ? "#fff" : colors.ink} /></Pressable></View>
        <View style={styles.imageDots}><View style={styles.imageDotActive} /><View style={styles.imageDot} /><View style={styles.imageDot} /></View>
      </View>
      <View style={styles.content}>
        <Text style={styles.category}>{product.category.toUpperCase()}</Text>
        <View style={styles.titleRow}><View style={styles.titleCopy}><Text style={styles.name}>{product.name}</Text><Text style={styles.price}>{product.price}</Text></View><Pressable style={styles.favorite}><Ionicons name="heart-outline" size={22} color={colors.ink} /></Pressable></View>
        <View style={styles.verified}><Ionicons name="checkmark-circle" size={16} color={colors.blue} /><Text style={styles.verifiedText}>Verified seller · Warranty available</Text></View>
        <View style={styles.sellerRow}><View style={styles.sellerAvatar}><Text style={styles.sellerInitial}>{product.seller.charAt(0)}</Text></View><View style={styles.sellerCopy}><Text style={styles.sellerLabel}>SELLER</Text><Text style={styles.sellerName}>{product.seller}</Text></View><Pressable onPress={() => setFollowing(value => !value)} style={[styles.followButton, following && styles.following]}><Text style={[styles.followText, following && styles.followingText]}>{following ? "Following" : "Follow"}</Text></Pressable></View>
        <Text style={styles.heading}>About this item</Text>
        <Text style={styles.body}>{product.description}</Text>
        <Text style={styles.heading}>Specifications</Text>
        <View style={styles.specGrid}>{product.specs.map(([label, value]) => <View key={label} style={styles.spec}><Text style={styles.specLabel}>{label}</Text><Text style={styles.specValue}>{value}</Text></View>)}</View>
        <View style={styles.bidCard}><View style={styles.bidHeader}><View><Text style={styles.bidKicker}>LIVE BIDDING</Text><Text style={styles.bidTitle}>Highest bid</Text></View><Ionicons name="trending-up" size={20} color="#fff" /></View><Text style={styles.bidValue}>GH₵{highestBid.toLocaleString()}</Text><Text style={styles.bidHint}>Highest bidder wins when the auction closes.</Text><View style={styles.bidInputRow}><TextInput value={bid} onChangeText={setBid} keyboardType="numeric" placeholder="Your bid amount" placeholderTextColor="rgba(255,255,255,.58)" style={styles.bidInput} /><Pressable testID="place-bid-button" onPress={placeBid} style={styles.bidButton}><Text style={styles.bidButtonText}>Place bid</Text></Pressable></View>{bidMessage ? <Text style={styles.bidMessage}>{bidMessage}</Text> : null}</View>
      </View>
    </ScrollView>
    <View style={styles.footer}><Pressable testID="buy-now-button" onPress={() => router.push("/cart" as never)} style={styles.buyButton}><Text style={styles.buyText}>Buy now</Text><Text style={styles.buyPrice}>{product.price}</Text></Pressable><Pressable testID="add-to-cart-button" onPress={() => router.push("/cart" as never)} style={styles.cartButton}><Ionicons name="bag-handle-outline" size={18} color="#fff" /><Text style={styles.cartText}>Add to cart</Text></Pressable></View>
  </SafeAreaView>;
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.card },
  scrollContent: { paddingTop: 10, paddingBottom: 22 },
  imageWrap: { height: 345, backgroundColor: colors.soft },
  image: { width: "100%", height: "100%" },
  imageHeader: { position: "absolute", top: 16, left: 16, right: 16, flexDirection: "row", justifyContent: "space-between" },
  iconButton: { width: 42, height: 42, borderRadius: 21, backgroundColor: "rgba(255,255,255,.92)", alignItems: "center", justifyContent: "center" },
  iconButtonActive: { backgroundColor: colors.blue },
  imageDots: { position: "absolute", bottom: 15, left: 0, right: 0, flexDirection: "row", justifyContent: "center", gap: 5 },
  imageDotActive: { width: 18, height: 5, borderRadius: 3, backgroundColor: colors.ink },
  imageDot: { width: 5, height: 5, borderRadius: 3, backgroundColor: "rgba(23,23,23,.25)" },
  content: { padding: 18, paddingTop: 22 },
  category: { fontSize: 10, fontWeight: "800", color: colors.muted, letterSpacing: 1.2 },
  titleRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginTop: 7 },
  titleCopy: { flex: 1 },
  name: { fontSize: 26, fontWeight: "800", color: colors.ink, letterSpacing: -0.7 },
  price: { fontSize: 19, fontWeight: "800", color: colors.ink, marginTop: 5 },
  favorite: { width: 42, height: 42, borderRadius: 21, backgroundColor: colors.soft, alignItems: "center", justifyContent: "center" },
  verified: { flexDirection: "row", alignItems: "center", gap: 6, marginTop: 10 },
  verifiedText: { fontSize: 12, color: colors.blue, fontWeight: "700" },
  sellerRow: { flexDirection: "row", alignItems: "center", marginTop: 22, paddingVertical: 13, borderTopWidth: 1, borderBottomWidth: 1, borderColor: colors.line },
  sellerAvatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.soft, alignItems: "center", justifyContent: "center" },
  sellerInitial: { fontSize: 16, fontWeight: "800", color: colors.blue },
  sellerCopy: { flex: 1, marginLeft: 10 },
  sellerLabel: { fontSize: 9, fontWeight: "800", color: colors.muted, letterSpacing: 1 },
  sellerName: { fontSize: 14, fontWeight: "800", color: colors.ink, marginTop: 3 },
  followButton: { borderWidth: 1, borderColor: colors.blue, borderRadius: 15, paddingHorizontal: 14, paddingVertical: 7 },
  following: { backgroundColor: colors.blue },
  followText: { color: colors.blue, fontSize: 11, fontWeight: "800" },
  followingText: { color: "#fff" },
  heading: { fontSize: 18, fontWeight: "800", color: colors.ink, marginTop: 24 },
  body: { fontSize: 14, lineHeight: 21, color: colors.muted, marginTop: 8 },
  specGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 11 },
  spec: { width: "48%", backgroundColor: colors.soft, borderRadius: 12, padding: 11 },
  specLabel: { color: colors.muted, fontSize: 11 },
  specValue: { color: colors.ink, fontSize: 13, fontWeight: "800", marginTop: 4 },
  bidCard: { marginTop: 24, padding: 16, borderRadius: radius.lg, backgroundColor: colors.blue },
  bidHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  bidKicker: { color: "rgba(255,255,255,.72)", fontSize: 9, fontWeight: "800", letterSpacing: 1.1 },
  bidTitle: { color: "#fff", fontSize: 16, fontWeight: "800", marginTop: 3 },
  bidValue: { color: "#fff", fontSize: 25, fontWeight: "800", marginTop: 15 },
  bidHint: { color: "rgba(255,255,255,.76)", fontSize: 11, marginTop: 3 },
  bidInputRow: { flexDirection: "row", gap: 8, marginTop: 14 },
  bidInput: { flex: 1, height: 42, borderRadius: 13, paddingHorizontal: 12, color: "#fff", backgroundColor: "rgba(255,255,255,.16)", fontSize: 13 },
  bidButton: { height: 42, borderRadius: 13, paddingHorizontal: 13, backgroundColor: "#fff", justifyContent: "center" },
  bidButtonText: { color: colors.blue, fontSize: 12, fontWeight: "800" },
  bidMessage: { color: "#fff", fontSize: 11, fontWeight: "700", marginTop: 9 },
  footer: { marginHorizontal: 18, marginBottom: 10, padding: 7, flexDirection: "row", gap: 8, alignItems: "center", backgroundColor: "#fff", borderRadius: 34, borderWidth: 1, borderColor: colors.line, shadowColor: "#000", shadowOpacity: 0.08, shadowRadius: 12, shadowOffset: { width: 0, height: 4 }, elevation: 4 },
  buyButton: { flex: 1, height: 54, borderRadius: 27, justifyContent: "center", paddingHorizontal: 14, backgroundColor: "#fff" },
  buyText: { color: colors.ink, fontSize: 12, fontWeight: "800" },
  buyPrice: { color: colors.muted, fontSize: 11, marginTop: 2 },
  cartButton: { flex: 1.1, height: 54, borderRadius: 27, backgroundColor: colors.blue, flexDirection: "row", gap: 8, alignItems: "center", justifyContent: "center" },
  cartText: { color: "#fff", fontSize: 14, fontWeight: "800" },
});