import { useEffect, useRef, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { Animated, Image, Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { colors, radius } from "../constants/theme";
import { IconButton } from "../components/IconButton";

const parcelImage = "https://images.unsplash.com/photo-1586528116493-da8b6f7a54c7?auto=format&fit=crop&w=900&q=88";

export default function BoxScan() {
  const router = useRouter();
  const [scanned, setScanned] = useState(false);
  const scanLine = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.loop(Animated.sequence([
      Animated.timing(scanLine, { toValue: 1, duration: 1700, useNativeDriver: true }),
      Animated.timing(scanLine, { toValue: 0, duration: 1700, useNativeDriver: true }),
    ])).start();
  }, [scanLine]);
  const startScan = () => {
    setScanned(true);
    setTimeout(() => router.push("/tracking?name=iPhone%2015%20Pro&price=GH%C2%A514%2C500&mode=motorbike&address=New%20Market%2C%20Central" as never), 650);
  };
  return <SafeAreaView edges={["top", "bottom"]} style={styles.safe}>
    <View style={styles.content}>
      <View style={styles.header}><IconButton name="chevron-back" onPress={() => router.back()} /><View style={styles.headerTitle}><Text style={styles.kicker}>FIXORA DELIVERY</Text><Text style={styles.title}>Box scan</Text></View><View style={styles.more}><Ionicons name="ellipsis-horizontal" size={18} color={colors.ink} /></View></View>
      <View style={styles.scanArea}><View style={styles.scanFrame}><Image source={{ uri: parcelImage }} style={styles.parcelImage} /><View style={styles.overlay} /><View style={[styles.corner, styles.cornerTopLeft]} /><View style={[styles.corner, styles.cornerTopRight]} /><View style={[styles.corner, styles.cornerBottomLeft]} /><View style={[styles.corner, styles.cornerBottomRight]} /><Animated.View style={[styles.scanLine, { transform: [{ translateY: scanLine.interpolate({ inputRange: [0, 1], outputRange: [4, 300] }) }] }]} /></View></View>
      <View style={styles.copy}><Text style={styles.heading}>{scanned ? "Code found" : "Scan the package code"}</Text><Text style={styles.body}>{scanned ? "Opening the live delivery details..." : "Place the QR code inside the frame to scan automatically."}</Text></View>
      <View style={styles.tips}><View style={styles.tip}><View style={styles.tipIcon}><Ionicons name="sunny-outline" size={17} color={colors.blue} /></View><Text style={styles.tipText}>Use good lighting</Text></View><View style={styles.tip}><View style={styles.tipIcon}><Ionicons name="scan-outline" size={17} color={colors.blue} /></View><Text style={styles.tipText}>Keep it steady</Text></View></View>
      <View style={styles.footer}><Pressable testID="scan-button" onPress={startScan} style={[styles.scanButton, scanned && styles.scanButtonDone]}><Ionicons name={scanned ? "checkmark" : "scan-outline"} size={22} color="#fff" /><Text style={styles.scanButtonText}>{scanned ? "Code scanned" : "Scan box"}</Text></Pressable><Text style={styles.footerHint}>Your camera stays on this screen</Text></View>
    </View>
  </SafeAreaView>;
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.card }, content: { flex: 1, padding: 18 }, header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" }, headerTitle: { alignItems: "center" }, kicker: { color: colors.muted, fontSize: 9, fontWeight: "800", letterSpacing: 1.1 }, title: { color: colors.ink, fontSize: 19, fontWeight: "800", marginTop: 3 }, more: { width: 42, height: 42, borderRadius: 21, backgroundColor: colors.soft, alignItems: "center", justifyContent: "center" }, scanArea: { marginTop: 22, alignItems: "center" }, scanFrame: { width: "100%", height: 350, borderRadius: 27, backgroundColor: "#E9E9E6", overflow: "hidden", position: "relative", borderWidth: 1, borderColor: colors.ink }, parcelImage: { width: "100%", height: "100%", resizeMode: "cover" }, overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(23,23,23,.16)" }, corner: { position: "absolute", width: 48, height: 48, borderColor: "#fff" }, cornerTopLeft: { top: 18, left: 18, borderTopWidth: 4, borderLeftWidth: 4, borderTopLeftRadius: 12 }, cornerTopRight: { top: 18, right: 18, borderTopWidth: 4, borderRightWidth: 4, borderTopRightRadius: 12 }, cornerBottomLeft: { bottom: 18, left: 18, borderBottomWidth: 4, borderLeftWidth: 4, borderBottomLeftRadius: 12 }, cornerBottomRight: { bottom: 18, right: 18, borderBottomWidth: 4, borderRightWidth: 4, borderBottomRightRadius: 12 }, scanLine: { position: "absolute", left: 18, right: 18, top: 22, height: 2, backgroundColor: colors.blue, shadowColor: colors.blue, shadowOpacity: .9, shadowRadius: 8 }, copy: { alignItems: "center", marginTop: 22 }, heading: { color: colors.ink, fontSize: 21, fontWeight: "900" }, body: { color: colors.muted, fontSize: 12, lineHeight: 19, textAlign: "center", marginTop: 7, maxWidth: 270 }, tips: { marginTop: 22, flexDirection: "row", justifyContent: "center", gap: 25 }, tip: { flexDirection: "row", alignItems: "center", gap: 7 }, tipIcon: { width: 32, height: 32, borderRadius: 11, backgroundColor: "#E8F1FF", alignItems: "center", justifyContent: "center" }, tipText: { color: colors.muted, fontSize: 10, fontWeight: "700" }, footer: { marginTop: "auto", alignItems: "center" }, scanButton: { width: "100%", height: 57, borderRadius: 20, backgroundColor: colors.ink, flexDirection: "row", gap: 9, alignItems: "center", justifyContent: "center" }, scanButtonDone: { backgroundColor: colors.blue }, scanButtonText: { color: "#fff", fontSize: 14, fontWeight: "800" }, footerHint: { color: colors.muted, fontSize: 10, marginTop: 10 }
});