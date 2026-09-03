import { useEffect, useMemo, useRef } from "react";
import { Animated, PanResponder, StyleSheet, View } from "react-native";

export function FlexibleSheet({ children, style, initialOffset = 120, collapsedOffset = 250 }: { children: React.ReactNode; style?: any; initialOffset?: number; collapsedOffset?: number }) {
  const translateY = useRef(new Animated.Value(initialOffset)).current;
  const position = useRef(initialOffset);
  const startPosition = useRef(initialOffset);
  useEffect(() => { Animated.timing(translateY, { toValue: initialOffset, duration: 520, useNativeDriver: true }).start(); }, [initialOffset, translateY]);
  const panResponder = useMemo(() => PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: (_, gesture) => Math.abs(gesture.dy) > 3,
    onPanResponderGrant: () => { startPosition.current = position.current; },
    onPanResponderMove: (_, gesture) => { const next = Math.max(0, Math.min(collapsedOffset, startPosition.current + gesture.dy)); position.current = next; translateY.setValue(next); },
    onPanResponderRelease: () => { const target = position.current < collapsedOffset / 2 ? 0 : collapsedOffset; position.current = target; Animated.timing(translateY, { toValue: target, duration: 430, useNativeDriver: true }).start(); },
  }), [collapsedOffset, translateY]);
  return <Animated.View style={[styles.sheet, style, { transform: [{ translateY }] }]}><View {...panResponder.panHandlers} style={styles.handleArea}><View style={styles.handle} /></View>{children}</Animated.View>;
}
const styles = StyleSheet.create({ sheet: { position: "absolute", left: 0, right: 0, bottom: 0, backgroundColor: "#fff", borderTopLeftRadius: 28, borderTopRightRadius: 28, paddingHorizontal: 20, paddingBottom: 22, shadowColor: "#000", shadowOpacity: .12, shadowRadius: 16, shadowOffset: { width: 0, height: -4 }, elevation: 10 }, handleArea: { height: 34, alignItems: "center", justifyContent: "center" }, handle: { width: 48, height: 5, borderRadius: 3, backgroundColor: "#D8DDE6" } });