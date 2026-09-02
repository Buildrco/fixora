import { useCallback, useRef, useState } from "react";
import { Animated, Pressable, StyleSheet, Text, View } from "react-native";
import { FontAwesome6 } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors } from "../constants/theme";

export type MainRoute = "home" | "repair" | "community" | "profile";
const routes: Array<{ key: MainRoute; label: string; path: string }> = [
  { key: "home", label: "Home", path: "/" },
  { key: "repair", label: "Repairs", path: "/repair" },
  { key: "community", label: "Community", path: "/community" },
  { key: "profile", label: "Profile", path: "/profile" },
];
type IconName = keyof typeof FontAwesome6.glyphMap;
const iconStates: Array<{ inactive: IconName; active: IconName }> = [
  { inactive: "house", active: "house-chimney" },
  { inactive: "wrench", active: "screwdriver-wrench" },
  { inactive: "comments", active: "comment-dots" },
  { inactive: "user", active: "circle-user" },
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
      Animated.timing(visibility, { toValue: 0, duration: 520, useNativeDriver: true }).start();
    } else if (movingUp && hidden.current) {
      hidden.current = false;
      Animated.timing(visibility, { toValue: 1, duration: 560, useNativeDriver: true }).start();
    }
  }, [visibility]);
  return { visibility, onScroll };
}

type BottomNavProps = { active: MainRoute; visibility: Animated.Value; pageProgress?: Animated.Value; onSelect?: (index: number) => void; swipePanHandlers?: Record<string, any> };

export function BottomNav({ active, visibility, pageProgress, onSelect, swipePanHandlers }: BottomNavProps) {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const fallbackProgress = useRef(new Animated.Value(Math.max(0, routes.findIndex(route => route.key === active)))).current;
  const progress = pageProgress || fallbackProgress;
  const [barWidth, setBarWidth] = useState(0);
  const select = (index: number) => onSelect ? onSelect(index) : router.replace(routes[index].path as never);
  const highlightLeft = progress.interpolate({ inputRange: [0, 1, 2, 3], outputRange: [7, 7 + Math.max(0, barWidth - 14) / 4, 7 + Math.max(0, barWidth - 14) / 2, 7 + Math.max(0, barWidth - 14) * 3 / 4], extrapolate: "clamp" });
  const highlightWidth = progress.interpolate({ inputRange: [0, 0.5, 1, 1.5, 2, 2.5, 3], outputRange: [82, 94, 82, 94, 82, 94, 82], extrapolate: "clamp" });
  return <Animated.View style={[styles.shell, { paddingBottom: Math.max(insets.bottom, 14), opacity: visibility, transform: [{ translateY: visibility.interpolate({ inputRange: [0, 1], outputRange: [110, 0] }) }] }]}>
    <View style={styles.bar} onLayout={event => setBarWidth(event.nativeEvent.layout.width)} {...swipePanHandlers}>
      <Animated.View pointerEvents="none" style={[styles.highlight, { left: highlightLeft, width: highlightWidth }]} />
      {routes.map((route, index) => {
        const inactiveIcon = iconStates[index].inactive;
        const activeIcon = iconStates[index].active;
        const stateInput = [index - 1, index, index + 1];
        const inactiveOpacity = progress.interpolate({ inputRange: stateInput, outputRange: [1, 0, 1], extrapolate: "clamp" });
        const activeOpacity = progress.interpolate({ inputRange: stateInput, outputRange: [0, 1, 0], extrapolate: "clamp" });
        const labelOpacity = progress.interpolate({ inputRange: stateInput, outputRange: [0, 1, 0], extrapolate: "clamp" });
        const labelWidth = progress.interpolate({ inputRange: stateInput, outputRange: [0, 58, 0], extrapolate: "clamp" });
        const labelTranslateX = progress.interpolate({ inputRange: stateInput, outputRange: [-10, 0, -10], extrapolate: "clamp" });
        return <Pressable key={route.key} testID={"nav-" + route.key} onPress={() => select(index)} style={styles.touch}>
          <Animated.View style={[styles.item, { opacity: progress.interpolate({ inputRange: stateInput, outputRange: [0.48, 1, 0.48], extrapolate: "clamp" }) }]}>
            <View style={styles.iconSlot}>
              <Animated.View style={{ opacity: inactiveOpacity }}>
                <FontAwesome6 name={inactiveIcon} size={18} color={colors.ink} />
              </Animated.View>
              <Animated.View style={[StyleSheet.absoluteFillObject, styles.iconOverlay, { opacity: activeOpacity }]}>
                <FontAwesome6 name={activeIcon} size={18} color="#fff" />
              </Animated.View>
            </View>
            <Animated.View style={[styles.labelWindow, { opacity: labelOpacity, maxWidth: labelWidth, transform: [{ translateX: labelTranslateX }] }]}>
              <Text numberOfLines={1} style={styles.label}>{route.label}</Text>
            </Animated.View>
          </Animated.View>
        </Pressable>;
      })}
    </View>
  </Animated.View>;
}

const styles = StyleSheet.create({
  shell: { position: "absolute", left: 0, right: 0, bottom: 0, alignItems: "center", zIndex: 20 },
  bar: { minHeight: 60, width: "88%", paddingHorizontal: 7, borderRadius: 32, backgroundColor: colors.card, flexDirection: "row", alignItems: "center", justifyContent: "space-around" },
  highlight: { position: "absolute", top: 10, height: 40, borderRadius: 20, backgroundColor: colors.blue },
  touch: { flex: 1, minHeight: 52, alignItems: "center", justifyContent: "center", zIndex: 2 },
  item: { height: 40, width: "100%", paddingHorizontal: 2, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6 },
  iconSlot: { width: 24, height: 24, alignItems: "center", justifyContent: "center", position: "relative" },
  iconOverlay: { alignItems: "center", justifyContent: "center" },
  labelWindow: { overflow: "hidden" },
  label: { color: "#fff", fontSize: 11, fontWeight: "800" },
});
