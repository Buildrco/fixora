import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { ReactNode, useEffect, useRef } from "react";
import { Animated, ScrollView, StyleSheet, Text, View } from "react-native";
import { colors, radius } from "../constants/theme";
import { IconButton } from "./IconButton";

export function ProfileDetailShell({ title, eyebrow, subtitle, children }: { title: string; eyebrow: string; subtitle: string; children: ReactNode }) {
  const router = useRouter();
  const entrance = useRef(new Animated.Value(0)).current;
  useEffect(() => { Animated.timing(entrance, { toValue: 1, duration: 520, delay: 80, useNativeDriver: true }).start(); }, [entrance]);
  return <SafeAreaView style={styles.safe}><ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
    <View style={styles.header}><IconButton name="chevron-back" onPress={() => router.back()} /><Text style={styles.headerTitle}>{title}</Text><View style={styles.spacer} /></View>
    <Animated.View style={{ opacity: entrance, transform: [{ translateX: entrance.interpolate({ inputRange: [0, 1], outputRange: [34, 0] }) }] }}>
      <Text style={styles.eyebrow}>{eyebrow}</Text><Text style={styles.title}>{title}</Text><Text style={styles.subtitle}>{subtitle}</Text>
      <View style={styles.rule} />{children}
    </Animated.View>
  </ScrollView></SafeAreaView>;
}

export function DetailSection({ title, action, children }: { title: string; action?: string; children: ReactNode }) {
  return <View style={styles.section}><View style={styles.sectionHead}><Text style={styles.sectionTitle}>{title}</Text>{action && <Text style={styles.sectionAction}>{action}</Text>}</View>{children}</View>;
}

export function DetailEmpty({ emoji, title, copy }: { emoji: string; title: string; copy: string }) {
  return <View style={styles.empty}><Text style={styles.emptyEmoji}>{emoji}</Text><Text style={styles.emptyTitle}>{title}</Text><Text style={styles.emptyCopy}>{copy}</Text></View>;
}

export const detailStyles = styles;

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.card }, content: { padding: 18, paddingBottom: 44 }, header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" }, headerTitle: { fontSize: 19, fontWeight: "800", color: colors.ink }, spacer: { width: 42 }, eyebrow: { fontSize: 11, color: colors.accent, fontWeight: "800", letterSpacing: 0.9, marginTop: 29 }, title: { fontSize: 30, lineHeight: 35, color: colors.ink, fontWeight: "800", letterSpacing: -0.8, marginTop: 5 }, subtitle: { color: colors.muted, fontSize: 14, lineHeight: 21, marginTop: 7 }, rule: { height: 1, backgroundColor: colors.line, marginTop: 22 }, section: { marginTop: 23 }, sectionHead: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 11 }, sectionTitle: { color: colors.ink, fontSize: 15, fontWeight: "800" }, sectionAction: { color: colors.blue, fontSize: 12, fontWeight: "800" }, empty: { alignItems: "center", paddingTop: 38, paddingHorizontal: 24 }, emptyEmoji: { fontSize: 43 }, emptyTitle: { color: colors.ink, fontSize: 19, fontWeight: "800", marginTop: 13 }, emptyCopy: { color: colors.muted, fontSize: 13, lineHeight: 20, textAlign: "center", marginTop: 6 },
});
