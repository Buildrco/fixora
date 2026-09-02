import { useCallback, useEffect, useRef } from "react";
import { Animated, Pressable, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../constants/theme";

export type MainRoute = "home" | "repair" | "community" | "profile";

const routes: Array<{ key: MainRoute; label: string; icon: keyof typeof Ionicons.glyphMap; path: string }> = [
  { key: "home", label: "Home", icon: "home-outline", path: "/" },
  { key: "repair", label: "Repairs", icon: "construct-outline", path: "/repair" },
  { key: "community", label: "Community", icon: "people-outline", path: "/community" },
  { key: "profile", label: "Profile", icon: "person-outline", path: "/profile" },
];

export function useBottomNavVisibility() {
  const visibility = useRef(new Animated.Value(1)).current;
  const lastY = useRef(0);
  const hidden = useRef(false);

  const onScroll = useCallback((event: any) => {
    const nextY = Math.max(0, event.nativeEvent.contentOffset.y);
    const movingDown = nextY > lastY.current + 5;
    const movingUp = nextY < lastY.current - 5;
    lastY.current = nextY;

    if (movingDown && !hidden.current) {
      hidden.current = true;
      Animated.timing(visibility, { toValue: 0, duration: 220, useNativeDriver: true }).start();
    } else if (movingUp && hidden.current) {
      hidden.current = false;
      Animated.timing(visibility, { toValue: 1, duration: 240, useNativeDriver: true }).start();
    }
  }, [visibility]);

  return { visibility, onScroll };
}

export function BottomNav({ active, visibility }: { active: MainRoute; visibility: Animated.Value }) {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return <Animated.View style={[styles.shell, { paddingBottom: Math.max(insets.bottom, 10), opacity: visibility, transform: [{ translateY: visibility.interpolate({ inputRange: [0, 1], outputRange: [110, 0] }) }] }]}>
    <View style={styles.bar}>
      {routes.map(route => <View key={route.key}><NavItem route={route} active={active === route.key} onPress={() => router.replace(route.path as never)} /></View>)}
    </View>
  </Animated.View>;
}

function NavItem({ route, active, onPress }: { route: typeof routes[number]; active: boolean; onPress: () => void }) {
  const progress = useRef(new Animated.Value(active ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(progress, { toValue: active ? 1 : 0, duration: 230, useNativeDriver: false }).start();
  }, [active, progress]);

  return <Pressable testID={`nav-${route.key}`} onPress={onPress} style={styles.touch}>
    <Animated.View style={[styles.item, active && styles.itemActive, { width: progress.interpolate({ inputRange: [0, 1], outputRange: [42, 86] }) }]}>
      <Ionicons name={route.icon} size={20} color={active ? "#fff" : colors.ink} />
      <Animated.View style={{ opacity: progress, maxWidth: progress.interpolate({ inputRange: [0, 1], outputRange: [0, 58] }) }}>
        <Text numberOfLines={1} style={styles.label}>{route.label}</Text>
      </Animated.View>
    </Animated.View>
  </Pressable>;
}

const styles = StyleSheet.create({
  shell: { position: "absolute", left: 0, right: 0, bottom: 0, alignItems: "center", zIndex: 20 },
  bar: { minHeight: 62, width: "92%", paddingHorizontal: 8, borderRadius: 25, backgroundColor: colors.card, flexDirection: "row", alignItems: "center", justifyContent: "space-around", shadowColor: colors.ink, shadowOpacity: 0.12, shadowRadius: 18, shadowOffset: { width: 0, height: 5 }, elevation: 8 },
  touch: { minWidth: 48, minHeight: 52, alignItems: "center", justifyContent: "center" },
  item: { height: 40, borderRadius: 20, paddingHorizontal: 11, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 7 },
  itemActive: { backgroundColor: colors.blue },
  label: { color: "#fff", fontSize: 11, fontWeight: "800" },
});