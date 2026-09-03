import { useCallback, useRef, useState } from "react";
import { Animated, Pressable, StyleSheet, Text, View } from "react-native";
import Svg, { Path } from "react-native-svg";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors } from "../constants/theme";

export type MainRoute = "home" | "repair" | "community" | "profile";
const routes: Array<{ key: MainRoute; label: string; path: string }> = [
  { key: "home", label: "Home", path: "/" },
  { key: "repair", label: "Repairs", path: "/repair" },
  { key: "community", label: "Feed", path: "/community" },
  { key: "profile", label: "Profile", path: "/profile" },
];
const iconPaths = [
  "M224,120v96a8,8,0,0,1-8,8H160a8,8,0,0,1-8-8V164a4,4,0,0,0-4-4H108a4,4,0,0,0-4,4v52a8,8,0,0,1-8,8H40a8,8,0,0,1-8-8V120a16,16,0,0,1,4.69-11.31l80-80a16,16,0,0,1,22.62,0l80,80A16,16,0,0,1,224,120Z",
  "M232,96a72,72,0,0,1-100.94,66L79,222.22c-.12.14-.26.29-.39.42a32,32,0,0,1-45.26-45.26c.14-.13.28-.27.43-.39L94,124.94a72.07,72.07,0,0,1,83.54-98.78,8,8,0,0,1,3.93,13.19L144,80l5.66,26.35L176,112l40.65-37.52a8,8,0,0,1,13.19,3.93A72.6,72.6,0,0,1,232,96Z",
  "M64.12,147.8a4,4,0,0,1-4,4.2H16a8,8,0,0,1-7.8-6.17,8.35,8.35,0,0,1,1.62-6.93A67.79,67.79,0,0,1,37,117.51a40,40,0,1,1,66.46-35.8,3.94,3.94,0,0,1-2.27,4.18A64.08,64.08,0,0,0,64,144C64,145.28,64,146.54,64.12,147.8Zm182-8.91A67.76,67.76,0,0,0,219,117.51a40,40,0,1,0-66.46-35.8,3.94,3.94,0,0,0,2.27,4.18A64.08,64.08,0,0,1,192,144c0,1.28,0,2.54-.12,3.8a4,4,0,0,0,4,4.2H240a8,8,0,0,0,7.8-6.17A8.33,8.33,0,0,0,246.17,138.89Zm-89,43.18a48,48,0,1,0-58.37,0A72.13,72.13,0,0,0,65.07,212,8,8,0,0,0,72,224H184a8,8,0,0,0,6.93-12A72.15,72.15,0,0,0,157.19,182.07Z",
  "M172,120a44,44,0,1,1-44-44A44.05,44.05,0,0,1,172,120Zm60,8A104,104,0,1,1,128,24,104.11,104.11,0,0,1,232,128Zm-16,0a88.09,88.09,0,0,0-91.47-87.93C77.43,41.89,39.87,81.12,40,128.25a87.65,87.65,0,0,0,22.24,58.16A79.71,79.71,0,0,1,84,165.1a4,4,0,0,1,4.83.32,59.83,59.83,0,0,0,78.28,0,4,4,0,0,1,4.83-.32,79.71,79.71,0,0,1,21.79,21.31A87.62,87.62,0,0,0,216,128Z"
] as const;

function NavigationIcon({ path, color }: { path: string; color: string }) {
  return <Svg width={24} height={24} viewBox="0 0 256 256"><Path d={path} fill={color} /></Svg>;
}

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
        const iconPath = iconPaths[index];
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
                <NavigationIcon path={iconPath} color="#000000" />
              </Animated.View>
              <Animated.View style={[StyleSheet.absoluteFillObject, styles.iconOverlay, { opacity: activeOpacity }]}>
                <NavigationIcon path={iconPath} color="#ffffff" />
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
