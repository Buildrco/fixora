import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { ActivityIndicator, Animated, Image, Pressable, SafeAreaView, StyleSheet, Text, View } from "react-native";
import { colors, radius } from "../constants/theme";
import { IconButton } from "../components/IconButton";
import { listMyCart, removeCartItem, updateCartQuantity } from "../data/fixoraRepository";

type CartEntry = { id: string; quantity: number; product?: { name?: string; price?: number | string; currency?: string; image_url?: string; image?: string; image_urls?: string[]; stock_quantity?: number | null } | null };

export default function Cart() {
  const router = useRouter();
  const [cart, setCart] = useState<CartEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState("");
  const [error, setError] = useState("");
  const [refresh, setRefresh] = useState(0);
  const hasItem = cart.length > 0;
  const basketFloat = useRef(new Animated.Value(0)).current;
  const itemEntrance = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    let active = true;
    setLoading(true); setError("");
    listMyCart().then(rows => { if (active) setCart(rows as CartEntry[]); })
      .catch(reason => { if (active) setError(reason instanceof Error ? reason.message : "Could not load your basket."); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [refresh]);
  useEffect(() => { Animated.loop(Animated.sequence([Animated.timing(basketFloat, { toValue: -7, duration: 1450, useNativeDriver: true }), Animated.timing(basketFloat, { toValue: 0, duration: 1450, useNativeDriver: true })])).start(); if (hasItem) Animated.spring(itemEntrance, { toValue: 1, tension: 48, friction: 8, useNativeDriver: true }).start(); }, [basketFloat, hasItem, itemEntrance]);
  const total = cart.reduce((sum, item) => sum + Number(item.product?.price || 0) * item.quantity, 0);
  const changeQuantity = async (item: CartEntry, delta: number) => {
    setBusyId(item.id); setError("");
    try {
      const next = item.quantity + delta;
      if (delta > 0 && item.product?.stock_quantity != null && next > item.product.stock_quantity) {
        throw new Error("Requested quantity exceeds available stock.");
      }
      if (next < 1) await removeCartItem(item.id);
      else await updateCartQuantity(item.id, next);
      setRefresh(value => value + 1);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Could not update your basket.");
    } finally { setBusyId(""); }
  };
  const formatPrice = (price: number, currency = "GHS") => {
    try { return new Intl.NumberFormat("en-GH", { style: "currency", currency }).format(price); }
    catch { return `${currency} ${price.toLocaleString()}`; }
  };
  return <SafeAreaView style={s.safe}><View style={s.content}><View style={s.header}><IconButton name="chevron-back" onPress={() => router.back()} /><Text style={s.title}>Your basket</Text><View style={s.headerBag}><Ionicons name="bag-handle-outline" size={19} color={colors.ink} /></View></View>{error ? <Text style={s.errorText}>{error}</Text> : null}{loading ? <ActivityIndicator color={colors.blue} style={{ marginTop: 32 }} /> : hasItem ? <Animated.View style={{ opacity: itemEntrance, transform: [{ translateY: itemEntrance.interpolate({ inputRange: [0, 1], outputRange: [22, 0] }) }, { scale: itemEntrance.interpolate({ inputRange: [0, 1], outputRange: [0.96, 1] }) }] }}>{cart.map(item => { const product = item.product; const image = product?.image_url || product?.image || product?.image_urls?.[0]; return <View key={item.id} style={s.item}>{image ? <Image source={{ uri: image }} style={s.itemImage} /> : <View style={[s.itemImage, s.basketBack]}><Ionicons name="cube-outline" size={28} color={colors.blue} /></View>}<View style={s.itemCopy}><Text style={s.itemName}>{product?.name || "Unavailable product"}</Text><Text style={s.itemPrice}>{formatPrice(Number(product?.price || 0), product?.currency || "GHS")}</Text><Text style={s.itemMeta}>{product?.stock_quantity === 0 ? "Out of stock" : "Verified seller"}</Text><View style={s.quantity}><Pressable disabled={busyId === item.id} onPress={() => changeQuantity(item, -1)} style={s.quantityButton}><Ionicons name="remove" size={16} color={colors.ink} /></Pressable><Text style={s.quantityText}>{item.quantity}</Text><Pressable disabled={busyId === item.id} onPress={() => changeQuantity(item, 1)} style={s.quantityButton}><Ionicons name="add" size={16} color={colors.ink} /></Pressable></View></View><Pressable accessibilityLabel="Remove item" onPress={() => changeQuantity(item, -item.quantity)}><Ionicons name="trash-outline" size={18} color={colors.muted} /></Pressable></View>; })}<View style={s.summary}><View><Text style={s.summaryLabel}>SUBTOTAL</Text><Text style={s.summaryValue}>{formatPrice(total)}</Text></View><Text style={s.summaryHint}>Delivery calculated next</Text></View><Pressable disabled={Boolean(busyId)} onPress={() => router.push("/checkout" as never)} style={({ pressed }) => [s.cta, pressed && s.pressed]}><Text style={s.ctaText}>Choose pickup or delivery</Text><Ionicons name="arrow-forward" size={18} color="#fff" /></Pressable><Pressable onPress={() => router.push("/shop" as never)} style={s.keep}><Text style={s.keepText}>Continue shopping</Text></Pressable></Animated.View> : <View style={s.empty}><Animated.View style={{ transform: [{ translateY: basketFloat }] }}><View style={s.basketHalo}><View style={s.basketBack}><Ionicons name="bag-handle" size={52} color={colors.blue} /></View><View style={s.basketFront}><Ionicons name="bag-handle" size={44} color="#fff" /></View></View></Animated.View><Text style={s.heading}>Your basket is waiting</Text><Text style={s.body}>{error || "Add a phone, part, or tool and it will appear here ready for delivery or pickup."}</Text><Pressable style={s.emptyCta} onPress={() => router.push("/shop" as never)}><Text style={s.emptyCtaText}>Explore the shop</Text><Ionicons name="arrow-forward" size={17} color="#fff" /></Pressable></View>}</View></SafeAreaView>;
}

const s = StyleSheet.create({ safe: { flex: 1, backgroundColor: colors.card }, content: { padding: 18, flex: 1 }, header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" }, title: { fontSize: 20, fontWeight: "800", color: colors.ink }, headerBag: { width: 42, height: 42, borderRadius: 21, backgroundColor: colors.soft, alignItems: "center", justifyContent: "center" }, item: { marginTop: 14, padding: 11, borderWidth: 1, borderColor: colors.line, borderRadius: radius.lg, flexDirection: "row", gap: 12 }, itemImage: { width: 90, height: 112, borderRadius: 16, backgroundColor: colors.soft }, itemCopy: { flex: 1, paddingTop: 3 }, itemName: { color: colors.ink, fontSize: 14, lineHeight: 19, fontWeight: "800" }, itemPrice: { color: colors.ink, fontSize: 14, fontWeight: "800", marginTop: 7 }, itemMeta: { color: colors.green, fontSize: 10, lineHeight: 15, marginTop: 8 }, quantity: { flexDirection: "row", alignItems: "center", gap: 10, marginTop: 12 }, quantityButton: { width: 28, height: 28, borderRadius: 10, backgroundColor: colors.soft, alignItems: "center", justifyContent: "center" }, quantityText: { minWidth: 15, textAlign: "center", color: colors.ink, fontSize: 13, fontWeight: "800" }, summary: { marginTop: 18, paddingTop: 16, borderTopWidth: 1, borderTopColor: colors.line, flexDirection: "row", alignItems: "flex-end", justifyContent: "space-between" }, summaryLabel: { color: colors.muted, fontSize: 10, fontWeight: "800", letterSpacing: 1 }, summaryValue: { color: colors.ink, fontSize: 23, fontWeight: "800", marginTop: 4 }, summaryHint: { color: colors.muted, fontSize: 11, paddingBottom: 3 }, cta: { height: 54, borderRadius: 18, backgroundColor: colors.blue, flexDirection: "row", gap: 9, alignItems: "center", justifyContent: "center", marginTop: 23 }, ctaText: { color: "#fff", fontSize: 14, fontWeight: "800" }, keep: { alignItems: "center", marginTop: 15 }, keepText: { color: colors.muted, fontSize: 12, fontWeight: "700" }, empty: { alignItems: "center", paddingTop: 92, paddingHorizontal: 21 }, basketHalo: { width: 132, height: 132, borderRadius: 66, backgroundColor: "#EEF4FF", alignItems: "center", justifyContent: "center", position: "relative" }, basketBack: { width: 58, height: 58, borderRadius: 18, backgroundColor: "#BFD5FF", alignItems: "center", justifyContent: "center", transform: [{ rotate: "-7deg" }] }, basketFront: { width: 56, height: 56, borderRadius: 18, backgroundColor: colors.blue, alignItems: "center", justifyContent: "center", transform: [{ rotate: "7deg" }] }, heading: { fontSize: 22, fontWeight: "800", color: colors.ink, marginTop: 21 }, body: { fontSize: 13, lineHeight: 20, color: colors.muted, textAlign: "center", marginTop: 7 }, emptyCta: { height: 52, borderRadius: 17, backgroundColor: colors.ink, paddingHorizontal: 20, alignItems: "center", justifyContent: "center", flexDirection: "row", gap: 8, marginTop: 24 }, emptyCtaText: { color: "#fff", fontWeight: "800", fontSize: 13 }, pressed: { opacity: 0.8 }, errorText: { color: colors.accent, fontSize: 12, marginTop: 12, textAlign: "center" } });
