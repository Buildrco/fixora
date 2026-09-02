import { useRef, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { Animated, ScrollView, Text, View, StyleSheet, Image, Pressable, useWindowDimensions } from "react-native";
import Svg, { Circle, ClipPath, Defs, G, Path } from "react-native-svg";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { colors, radius } from "../constants/theme";
import { IconButton } from "../components/IconButton";
import { useRouter } from "expo-router";

type Product = { name: string; price: string; image: string; brand: string };
type Brand = { label: string; mark: string; tone: string };
type Category = { id: string; title: string; kicker: string; copy: string; tone: string; brands: Brand[]; products: Product[] };

const categories: Category[] = [
  { id: "phones", title: "Mobile Phones", kicker: "FIND YOUR NEXT DEVICE", copy: "Quality phones from trusted sellers.", tone: "#244B98", brands: [{ label: "Apple", mark: "apple", tone: "#2D6BDA" }, { label: "Samsung", mark: "SAMSUNG", tone: "#174B9B" }, { label: "Google", mark: "G", tone: "#D5A32C" }, { label: "Other Brands", mark: "A", tone: "#2B9A71" }], products: [
    { name: "iPhone 15 Pro", price: "GH₵14,500", image: "https://images.unsplash.com/photo-1591337676887-a217a6970a8a?auto=format&fit=crop&w=700&q=88", brand: "Apple" },
    { name: "Galaxy S24", price: "GH₵11,800", image: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=700&q=88", brand: "Samsung" },
    { name: "Pixel 9 Pro", price: "GH₵9,900", image: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=700&q=88", brand: "Google" },
    { name: "iPhone 14", price: "GH₵10,800", image: "https://images.unsplash.com/photo-1591337676887-a217a6970a8a?auto=format&fit=crop&w=700&q=88", brand: "Apple" }
  ] },
  { id: "tablets", title: "Tablets", kicker: "WORK. CREATE. PLAY.", copy: "Big screens, easy to carry.", tone: "#D5A32C", brands: [{ label: "iPad", mark: "apple", tone: "#2D6BDA" }, { label: "Galaxy Tab", mark: "SAMSUNG", tone: "#174B9B" }, { label: "Android", mark: "A", tone: "#2B9A71" }], products: [
    { name: "iPad Pro", price: "GH₵16,500", image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=700&q=88", brand: "iPad" },
    { name: "Galaxy Tab S9", price: "GH₵12,400", image: "https://images.unsplash.com/photo-1561154464-82e9adf32764?auto=format&fit=crop&w=700&q=88", brand: "Galaxy Tab" },
    { name: "Android Tablet", price: "GH₵4,800", image: "https://images.unsplash.com/photo-1585790050230-5dd28404ccb9?auto=format&fit=crop&w=700&q=88", brand: "Android" }
  ] },
  { id: "computers", title: "Laptops & Computers", kicker: "POWER YOUR WORK", copy: "Ready for every big idea.", tone: "#315B58", brands: [{ label: "MacBook", mark: "apple", tone: "#2D6BDA" }, { label: "Windows", mark: "W", tone: "#2088D8" }, { label: "Gaming", mark: "G", tone: "#7B4CC5" }], products: [
    { name: "MacBook Pro", price: "GH₵28,500", image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=700&q=88", brand: "MacBook" },
    { name: "Windows Laptop", price: "GH₵12,800", image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=700&q=88", brand: "Windows" },
    { name: "Gaming Laptop", price: "GH₵19,900", image: "https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?auto=format&fit=crop&w=700&q=88", brand: "Gaming" }
  ] },
  { id: "parts", title: "Repair Parts", kicker: "BUILT FOR REPAIRERS", copy: "Quality parts for every fix.", tone: "#4A477F", brands: [{ label: "Displays", mark: "▣", tone: "#2D6BDA" }, { label: "Batteries", mark: "▰", tone: "#2B9A71" }, { label: "Boards", mark: "▦", tone: "#D5A32C" }], products: [
    { name: "Phone Displays", price: "GH₵650", image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=700&q=88", brand: "Displays" },
    { name: "Phone Batteries", price: "GH₵280", image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=700&q=88", brand: "Batteries" },
    { name: "Logic Boards", price: "GH₵1,200", image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=700&q=88", brand: "Boards" }
  ] },
  { id: "tools", title: "Tools & Equipment", kicker: "WORK WITH CONFIDENCE", copy: "The tools behind better repairs.", tone: "#B45639", brands: [{ label: "Screwdrivers", mark: "✣", tone: "#2D6BDA" }, { label: "Soldering", mark: "⌁", tone: "#B45639" }, { label: "Testing", mark: "＋", tone: "#2B9A71" }], products: [
    { name: "Repair Tool Kit", price: "GH₵480", image: "https://images.unsplash.com/photo-1530124566582-a618bc2615dc?auto=format&fit=crop&w=700&q=88", brand: "Screwdrivers" },
    { name: "Soldering Station", price: "GH₵1,850", image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=700&q=88", brand: "Soldering" },
    { name: "Digital Multimeter", price: "GH₵380", image: "https://images.unsplash.com/photo-1530124566582-a618bc2615dc?auto=format&fit=crop&w=700&q=88", brand: "Testing" }
  ] },
  { id: "accessories", title: "Accessories", kicker: "COMPLETE YOUR SETUP", copy: "Smart add-ons for every device.", tone: "#416A91", brands: [{ label: "Audio", mark: "♫", tone: "#2D6BDA" }, { label: "Chargers", mark: "ϟ", tone: "#D5A32C" }, { label: "Cases", mark: "▢", tone: "#4A477F" }], products: [
    { name: "Wireless Headphones", price: "GH₵950", image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=700&q=88", brand: "Audio" },
    { name: "Power Bank", price: "GH₵320", image: "https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?auto=format&fit=crop&w=700&q=88", brand: "Chargers" },
    { name: "Phone Cases", price: "GH₵180", image: "https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?auto=format&fit=crop&w=700&q=88", brand: "Cases" }
  ] }
];

const heroPath = "M28 0 C12 0 0 12 0 28 L0 174 C0 195 13 208 35 208 L101 208 C113 208 120 202 124 191 C129 177 140 168 155 168 L198 168 C213 168 224 177 229 191 C233 202 240 208 252 208 L365 208 C387 208 400 195 400 174 L400 28 C400 12 388 0 372 0 Z";
const heroAccent = "M0 187 C24 151 83 153 128 179 C158 196 184 199 216 184 C270 159 348 155 400 185 L400 220 L0 220 Z";
const filterPath = "M22 1 C10 1 1 10 1 22 C1 34 10 43 22 43 C31 43 37 38 42 32 C45 28 48 28 55 28 C58 28 59 31 61 34 C63 37 67 39 73 39 H124 C135 39 143 32 143 22 C143 12 135 5 124 5 H73 C67 5 63 7 61 10 C59 13 58 16 55 16 C48 16 45 16 42 12 C37 6 31 1 22 1 Z";

function HeroShape({ tone, id, width }: { tone: string; id: string; width: number }) {
  return <Svg width={width} height={220} viewBox="0 0 400 220" preserveAspectRatio="none" style={s.heroSvg}>
    <Defs><ClipPath id={id}><Path d={heroPath} /></ClipPath></Defs>
    <Path d={heroPath} fill={tone} />
    <G clipPath={"url(#" + id + ")"}>
      <Path d={heroAccent} fill="rgba(255,255,255,0.14)" />
    </G>
  </Svg>;
}

function BrandFilterShape({ brand, active }: { brand: Brand; active: boolean }) {
  return <View style={s.brandShape}>
    <Svg width={146} height={44} viewBox="0 0 146 44">
      <Path d={filterPath} fill={active ? "#EAF1FF" : "#fff"} stroke={active ? "#BFD1F8" : "#D8D8D8"} strokeWidth={1.2} />
      <Circle cx={22} cy={22} r={19.5} fill={brand.tone} />
    </Svg>
    <View style={s.brandMarkWrap}><BrandMark brand={brand} /></View>
    <View style={s.brandTextWrap}><Text style={[s.brandText, active && s.brandTextActive]}>{brand.label}</Text></View>
  </View>;
}

function BrandMark({ brand }: { brand: Brand }) {
  if (brand.mark === "apple") return <Ionicons name="logo-apple" size={22} color="#fff" />;
  if (brand.mark === "SAMSUNG") return <Text style={s.samsungMark}>SAMSUNG</Text>;
  return <Text style={s.brandMark}>{brand.mark}</Text>;
}

export default function Shop() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const [activeCategory, setActiveCategory] = useState(0);
  const [selectedBrand, setSelectedBrand] = useState("");
  const bannerScroll = useRef(new Animated.Value(0)).current;
  const brandScroll = useRef(new Animated.Value(0)).current;
  const category = categories[activeCategory];
  const bannerWidth = Math.max(width - 36, 280);
  const pageSize = bannerWidth + 12;
  const products = selectedBrand ? category.products.filter(product => product.brand === selectedBrand) : category.products;

  const onBannerEnd = (event: any) => {
    const next = Math.max(0, Math.min(categories.length - 1, Math.round(event.nativeEvent.contentOffset.x / pageSize)));
    setActiveCategory(next);
    setSelectedBrand("");
  };

  return <SafeAreaProvider><SafeAreaView edges={["top"]} style={s.safe}>
    <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
      <View style={s.head}><IconButton name="chevron-back" onPress={() => router.back()} /><Text style={s.title}>Shop</Text><IconButton name="bag-handle-outline" /></View>
      <View style={s.search}><Ionicons name="search-outline" size={19} color={colors.muted} /><Text style={s.searchText}>Search products</Text></View>

      <Animated.ScrollView horizontal decelerationRate="normal" snapToInterval={pageSize} showsHorizontalScrollIndicator={false} contentContainerStyle={s.bannerList} onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: bannerScroll } } }], { useNativeDriver: true })} scrollEventThrottle={16} onMomentumScrollEnd={onBannerEnd}>
        {categories.map((item, index) => {
          const range = [(index - 1) * pageSize, index * pageSize, (index + 1) * pageSize];
          const motion = { opacity: bannerScroll.interpolate({ inputRange: range, outputRange: [0.72, 1, 0.72], extrapolate: "clamp" }), transform: [{ translateY: bannerScroll.interpolate({ inputRange: range, outputRange: [8, 0, 8], extrapolate: "clamp" }) }, { scale: bannerScroll.interpolate({ inputRange: range, outputRange: [0.97, 1, 0.97], extrapolate: "clamp" }) }] };
          return <Animated.View key={item.id} style={[s.banner, { width: bannerWidth }, motion]}>
            <HeroShape tone={item.tone} id={"hero-" + item.id} width={bannerWidth} />
            <View style={s.bannerCopy}><Text style={s.bannerKicker}>{item.kicker}</Text><Text style={s.bannerTitle}>{item.title}</Text><Text style={s.bannerSubtitle}>{item.copy}</Text></View>
            <View style={s.bannerButtonWrap}><View style={s.bannerButton}><Text style={s.bannerButtonText}>Shop now</Text><Ionicons name="arrow-forward" size={16} color="#fff" /></View></View>
          </Animated.View>;
        })}
      </Animated.ScrollView>
      <View style={s.dots}>{categories.map((item, index) => <View key={item.id} style={[s.dot, index === activeCategory && s.dotActive]} />)}</View>

      <Animated.ScrollView key={category.id} horizontal decelerationRate="normal" showsHorizontalScrollIndicator={false} contentContainerStyle={s.brandList} onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: brandScroll } } }], { useNativeDriver: true })} scrollEventThrottle={16}>
        {category.brands.map((brand, index) => {
          const range = [(index - 1) * 140, index * 140, (index + 1) * 140];
          const motion = { opacity: brandScroll.interpolate({ inputRange: range, outputRange: [0.62, 1, 0.62], extrapolate: "clamp" }), transform: [{ translateY: brandScroll.interpolate({ inputRange: range, outputRange: [4, 0, 4], extrapolate: "clamp" }) }] };
          const active = selectedBrand === brand.label;
          return <Animated.View key={brand.label} style={[s.brandSlot, motion]}><Pressable onPress={() => setSelectedBrand(active ? "" : brand.label)} style={({ pressed }) => [s.brandCard, pressed && s.pressed]}>
            <BrandFilterShape brand={brand} active={active} />
          </Pressable></Animated.View>;
        })}
      </Animated.ScrollView>

      <View style={s.grid}>{products.map(product => <Pressable key={product.name} style={({ pressed }) => [s.product, pressed && s.pressedProduct]}>
        <Image source={{ uri: product.image }} style={s.image} resizeMode="cover" /><Text style={s.name}>{product.name}</Text><Text style={s.price}>{product.price}</Text><Text style={s.seller}>✓ Verified seller</Text>
      </Pressable>)}</View>
    </ScrollView>
  </SafeAreaView></SafeAreaProvider>;
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#fff" },
  content: { padding: 18, paddingBottom: 40 },
  head: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  title: { fontSize: 20, fontWeight: "800", color: colors.ink },
  search: { height: 48, borderRadius: 16, backgroundColor: colors.soft, flexDirection: "row", alignItems: "center", gap: 9, paddingHorizontal: 14, marginTop: 16 },
  searchText: { color: colors.muted, fontSize: 13 },
  bannerList: { gap: 12, paddingTop: 18 },
  banner: { height: 220, position: "relative", overflow: "visible" },
  heroSvg: { position: "absolute", left: 0, top: 0 },
  bannerCopy: { position: "absolute", left: 20, right: 20, bottom: 72, zIndex: 2 },
  bannerKicker: { color: "rgba(255,255,255,.78)", fontSize: 10, fontWeight: "800", letterSpacing: 1.1 },
  bannerTitle: { color: "#fff", fontSize: 24, fontWeight: "800", marginTop: 5, maxWidth: 190 },
  bannerSubtitle: { color: "rgba(255,255,255,.86)", fontSize: 13, marginTop: 3 },
  bannerButtonWrap: { position: "absolute", left: 20, bottom: 3, zIndex: 3 },
  bannerButton: { alignSelf: "flex-start", flexDirection: "row", alignItems: "center", gap: 7, backgroundColor: "rgba(0,0,0,.72)", borderRadius: 15, paddingHorizontal: 13, paddingVertical: 8 },
  bannerButtonText: { color: "#fff", fontSize: 12, fontWeight: "700" },
  dots: { flexDirection: "row", justifyContent: "center", alignItems: "center", gap: 5, height: 22 },
  dot: { width: 5, height: 5, borderRadius: 3, backgroundColor: colors.line },
  dotActive: { width: 17, backgroundColor: colors.ink },
  brandList: { paddingVertical: 10 },
  brandSlot: { width: 146, height: 44, marginRight: 10 },
  brandCard: { width: 146, height: 44 },
  brandShape: { width: 146, height: 44, position: "relative" },
  brandMarkWrap: { position: "absolute", left: 0, top: 0, width: 44, height: 44, alignItems: "center", justifyContent: "center" },
  brandTextWrap: { position: "absolute", left: 59, right: 5, top: 0, height: 44, alignItems: "center", justifyContent: "center" },
  brandMark: { color: "#fff", fontSize: 17, fontWeight: "800" },
  samsungMark: { color: "#fff", fontSize: 6, fontWeight: "900", letterSpacing: .2 },
  brandText: { fontSize: 13, fontWeight: "700", color: colors.ink },
  brandTextActive: { color: "#1C4EA8" },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: 14 },
  product: { width: "47%", marginBottom: 10 },
  pressedProduct: { opacity: .88, transform: [{ scale: .985 }] },
  image: { width: "100%", height: 170, borderRadius: radius.lg },
  name: { fontSize: 14, fontWeight: "700", marginTop: 9 },
  price: { fontSize: 14, fontWeight: "800", marginTop: 3 },
  seller: { fontSize: 11, color: colors.green, marginTop: 4, fontWeight: "600" },
  pressed: { opacity: .8 }
});
