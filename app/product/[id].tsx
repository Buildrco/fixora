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
  scrollContent: { paddingBottom: 22 },
  imageWrap: { height: 345, backgroundColor: colors.soft },
  image: { width: "100%", height: "100%" },
  imageHeader: { position: "absolute", top: 16, left: 16, right: 16, flexDirection: "row", justifyContent: "space-between" },
  iconButton: { width: 42, height: 42, borderRadius: 21, backgroundColor: "rgba(255,255,255,.92)", alignItems: "center", justifyContent: "center" },
  iconButtonActive: { backgroundColor: colors.blue },
  imageDots: { position: "absolute", bottom: 15, left: 0, right: 0, flexDirection: "row", justifyContent: "center", gap: 5 },
  imageDotActive: { width: 18, height: 5, borderRadius: 3, backgroundColor: colors.ink },
  imageDot: { width: 5, height: 5, borderRadius: 3, backgroundColor: "rgba(23,23,23,.25)" },
  content: { padding: 18 },
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
  footer: { paddingHorizontal: 18, paddingTop: 10, flexDirection: "row", gap: 9, backgroundColor: colors.card, borderTopWidth: 1, borderTopColor: colors.line },
  buyButton: { flex: 1, height: 54, borderRadius: radius.md, borderWidth: 1, borderColor: colors.line, justifyContent: "center", paddingHorizontal: 14 },
  buyText: { color: colors.ink, fontSize: 12, fontWeight: "800" },
  buyPrice: { color: colors.muted, fontSize: 11, marginTop: 2 },
  cartButton: { flex: 1.1, height: 54, borderRadius: radius.md, backgroundColor: colors.blue, flexDirection: "row", gap: 8, alignItems: "center", justifyContent: "center" },
  cartText: { color: "#fff", fontSize: 14, fontWeight: "800" },
});