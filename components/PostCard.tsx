import { Ionicons } from "@expo/vector-icons";
import { Animated, Image, Pressable, Text, TextInput, View, StyleSheet, Modal, ScrollView, KeyboardAvoidingView, Platform, PanResponder } from "react-native";
import { useEffect, useRef, useState } from "react";
import { colors, radius } from "../constants/theme";

const bubbleLayout = [
  { left: 24, drift: -28, rise: 88, rotate: "-18deg" },
  { left: 52, drift: 18, rise: 104, rotate: "14deg" },
  { left: 82, drift: 34, rise: 76, rotate: "25deg" },
  { left: 12, drift: -12, rise: 116, rotate: "-30deg" },
  { left: 68, drift: -22, rise: 94, rotate: "-8deg" },
];

export function PostCard({ name, handle, text, image, likes = "42", comments = "13", delay = 0, initialComments = [] }: { name: string; handle: string; text: string; image: string; likes?: string; comments?: string; delay?: number; initialComments?: string[] }) {
  const [liked, setLiked] = useState(false);
  const [reposted, setReposted] = useState(false);
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [localComments, setLocalComments] = useState<string[]>(initialComments);
  const sheetDragY = useRef(new Animated.Value(0)).current;
  const commentScrollY = useRef(0);
  const sheetPan = useRef(PanResponder.create({ onMoveShouldSetPanResponderCapture: (_, gesture) => gesture.dy > 7 && Math.abs(gesture.dy) > Math.abs(gesture.dx) * 1.2 && commentScrollY.current <= 1, onPanResponderGrant: () => sheetDragY.setValue(0), onPanResponderMove: (_, gesture) => sheetDragY.setValue(Math.max(0, gesture.dy)), onPanResponderRelease: (_, gesture) => { if (gesture.dy > 115 || gesture.vy > 1.05) { Animated.timing(sheetDragY, { toValue: 650, duration: 170, useNativeDriver: true }).start(() => { setCommentsOpen(false); sheetDragY.setValue(0); }); } else { Animated.spring(sheetDragY, { toValue: 0, useNativeDriver: true, friction: 9, tension: 110 }).start(); } }, onPanResponderTerminate: () => Animated.spring(sheetDragY, { toValue: 0, useNativeDriver: true, friction: 9, tension: 110 }).start() })).current;
  useEffect(() => { if (commentsOpen) sheetDragY.setValue(0); }, [commentsOpen, sheetDragY]);
  const entry = useRef(new Animated.Value(0)).current;
  const likeScale = useRef(new Animated.Value(1)).current;
  const repostScale = useRef(new Animated.Value(1)).current;
  const commentScale = useRef(new Animated.Value(1)).current;
  const bubbleValues = useRef(bubbleLayout.map(() => new Animated.Value(0))).current;
  const commentCount = Number(comments) + Math.max(0, localComments.length - initialComments.length);

  const toggleLike = () => {
    const next = !liked;
    setLiked(next);
    if (!next) return;
    Animated.sequence([
      Animated.timing(likeScale, { toValue: 1.3, duration: 110, useNativeDriver: true }),
      Animated.spring(likeScale, { toValue: 1, friction: 4, tension: 150, useNativeDriver: true }),
    ]).start();
    bubbleValues.forEach((value, index) => {
      value.setValue(0);
      Animated.timing(value, { toValue: 1, duration: 860, delay: index * 65, useNativeDriver: true }).start();
    });
  };

  const toggleComments = () => {
    setCommentsOpen(value => !value);
    Animated.sequence([
      Animated.timing(commentScale, { toValue: 1.16, duration: 100, useNativeDriver: true }),
      Animated.spring(commentScale, { toValue: 1, friction: 5, tension: 140, useNativeDriver: true }),
    ]).start();
  };

  const toggleRepost = () => {
    setReposted(value => !value);
    Animated.sequence([
      Animated.timing(repostScale, { toValue: 1.22, duration: 120, useNativeDriver: true }),
      Animated.spring(repostScale, { toValue: 1, friction: 5, tension: 130, useNativeDriver: true }),
    ]).start();
  };

  useEffect(() => {
    Animated.timing(entry, { toValue: 1, duration: 540, delay, useNativeDriver: true }).start();
  }, [delay, entry]);

  const addComment = () => {
    const value = commentText.trim();
    if (!value) return;
    setLocalComments(current => [...current, value]);
    setCommentText("");
  };

  return <Animated.View style={[styles.card, { opacity: entry, transform: [{ translateY: entry.interpolate({ inputRange: [0, 1], outputRange: [18, 0] }) }] }]}>
    <View pointerEvents="none" style={styles.bubbles}>
      {bubbleValues.map((value, index) => {
        const bubble = bubbleLayout[index];
        return <Animated.Text key={index} style={[styles.bubble, { left: bubble.left, transform: [
          { translateX: value.interpolate({ inputRange: [0, 1], outputRange: [0, bubble.drift] }) },
          { translateY: value.interpolate({ inputRange: [0, 1], outputRange: [0, -bubble.rise] }) },
          { scale: value.interpolate({ inputRange: [0, 0.22, 1], outputRange: [0.25, 1.1, 0.72] }) },
          { rotate: bubble.rotate },
        ], opacity: value.interpolate({ inputRange: [0, 0.24, 0.76, 1], outputRange: [0, 1, 0.82, 0] }) }]}>♥</Animated.Text>;
      })}
    </View>
    <View style={styles.head}><Image source={{ uri: "https://i.pravatar.cc/100?img=12" }} style={styles.avatar} /><View style={{ flex: 1 }}><View style={styles.nameRow}><Text style={styles.name}>{name}</Text><View style={styles.badge}><Text style={styles.badgeText}>✓</Text></View></View><Text style={styles.handle}>{handle} · 2h</Text></View><Ionicons name="ellipsis-horizontal" size={19} color={colors.muted} /></View>
    <Text style={styles.text}>{text}</Text>
    <Image source={{ uri: image }} style={styles.postImage} />
    <View style={styles.actions}>
      <Pressable onPress={toggleLike} hitSlop={8} style={styles.action}><Animated.View style={{ transform: [{ scale: likeScale }] }}><Ionicons name={liked ? "heart" : "heart-outline"} size={21} color={liked ? colors.accent : colors.muted} /></Animated.View><Text style={liked ? styles.activeText : styles.count}>{Number(likes) + (liked ? 1 : 0)}</Text></Pressable>
      <Pressable onPress={toggleComments} hitSlop={8} accessibilityRole="button" accessibilityLabel={commentsOpen ? "Hide comments" : "View comments"} style={[styles.action, commentsOpen && styles.commentAction]}><Animated.View style={{ transform: [{ scale: commentScale }] }}><Ionicons name={commentsOpen ? "chatbubble" : "chatbubble-outline"} size={20} color={commentsOpen ? colors.blue : colors.muted} /></Animated.View><Text style={commentsOpen ? styles.commentText : styles.count}>{commentCount}</Text></Pressable>
      <Pressable onPress={toggleRepost} hitSlop={8} style={[styles.action, reposted && styles.repostAction]}><Animated.View style={{ transform: [{ scale: repostScale }] }}><Ionicons name="repeat-outline" size={21} color={reposted ? colors.green : colors.muted} /></Animated.View><Text style={reposted ? styles.repostText : styles.count}>{Number(8) + (reposted ? 1 : 0)}</Text></Pressable>
      <Pressable hitSlop={8} style={styles.action}><Ionicons name="share-outline" size={20} color={colors.muted} /></Pressable>
    </View>
    {!commentsOpen && <Pressable onPress={toggleComments} style={styles.viewComments}><Text style={styles.viewCommentsText}>{commentCount} comments · View</Text><Ionicons name="chevron-down" size={14} color={colors.muted} /></Pressable>}
    <Modal visible={commentsOpen} transparent animationType="slide" onRequestClose={() => setCommentsOpen(false)}>
      <View style={styles.modalRoot}>
        <Pressable style={StyleSheet.absoluteFillObject} onPress={() => setCommentsOpen(false)} />
        <KeyboardAvoidingView {...sheetPan.panHandlers} style={[styles.commentsSheet, { transform: [{ translateY: sheetDragY }] }]} behavior={Platform.OS === "ios" ? "padding" : undefined}>
          <View style={styles.sheetHandle} />
          <View style={styles.sheetHeader}><Text style={styles.sheetTitle}>Comments</Text><Pressable onPress={() => setCommentsOpen(false)} hitSlop={8}><Ionicons name="close" size={22} color={colors.ink} /></Pressable></View>
          <View style={styles.sortRow}><Text style={styles.sortText}>Most relevant</Text><Ionicons name="chevron-down" size={14} color={colors.muted} /></View>
          <ScrollView style={styles.commentList} contentContainerStyle={styles.commentListContent} keyboardShouldPersistTaps="handled" scrollEventThrottle={16} onScroll={event => { commentScrollY.current = event.nativeEvent.contentOffset.y; }}>
            {localComments.length ? localComments.map((comment, index) => <View key={index} style={styles.commentEntry}><View style={styles.commentAvatar}><Ionicons name="person" size={15} color={colors.muted} /></View><View style={{ flex: 1 }}><View style={styles.commentBubble}><Text style={styles.commentAuthor}>Community member</Text><Text style={styles.commentCopy}>{comment}</Text></View><Text style={styles.commentMeta}>1h · Like · Reply</Text></View></View>) : <Text style={styles.emptyComments}>Be the first to comment.</Text>}
          </ScrollView>
          <View style={styles.commentComposer}><View style={styles.commentCurrentAvatar}><Ionicons name="person" size={16} color={colors.muted} /></View><TextInput value={commentText} onChangeText={setCommentText} onSubmitEditing={addComment} returnKeyType="send" placeholder="Write a comment..." placeholderTextColor={colors.muted} style={styles.commentInput} /><Pressable onPress={addComment} hitSlop={8} accessibilityLabel="Post comment"><Ionicons name="send" size={20} color={commentText.trim() ? colors.blue : colors.line} /></Pressable></View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  </Animated.View>;
}

const styles = StyleSheet.create({
  card: { position: "relative", backgroundColor: "#fff", borderBottomWidth: 1, borderBottomColor: colors.line, paddingVertical: 18 },
  head: { flexDirection: "row", alignItems: "center", gap: 10 },
  avatar: { width: 40, height: 40, borderRadius: 20 },
  nameRow: { flexDirection: "row", alignItems: "center" },
  name: { fontSize: 15, fontWeight: "700", color: colors.ink },
  handle: { fontSize: 12, color: colors.muted, marginTop: 2 },
  badge: { marginLeft: 5, width: 16, height: 16, borderRadius: 8, backgroundColor: colors.blue, alignItems: "center", justifyContent: "center" },
  badgeText: { color: "#fff", fontSize: 9, fontWeight: "800" },
  text: { fontSize: 15, lineHeight: 22, color: colors.ink, marginTop: 12, marginBottom: 12 },
  postImage: { width: "100%", height: 215, borderRadius: radius.md },
  bubbles: { position: "absolute", left: 0, bottom: 36, width: 140, height: 130, zIndex: 2 },
  bubble: { position: "absolute", bottom: 0, color: colors.accent, fontSize: 18, fontWeight: "800" },
  actions: { flexDirection: "row", justifyContent: "space-between", paddingTop: 12 },
  action: { flexDirection: "row", alignItems: "center", gap: 6, paddingHorizontal: 8, paddingVertical: 5, borderRadius: 14 },
  count: { color: colors.muted, fontSize: 13 },
  commentAction: { backgroundColor: "#eef5ff" },
  commentText: { color: colors.blue, fontSize: 13, fontWeight: "700" },
  repostAction: { backgroundColor: "#eaf8f1" },
  activeText: { color: colors.accent, fontWeight: "700", fontSize: 13 },
  repostText: { color: colors.green, fontWeight: "700", fontSize: 13 },
  viewComments: { alignSelf: "flex-start", flexDirection: "row", alignItems: "center", gap: 4, marginTop: 4, paddingVertical: 5 },
  viewCommentsText: { color: colors.muted, fontSize: 12, fontWeight: "600" },
  modalRoot: { flex: 1, justifyContent: "flex-end", backgroundColor: "rgba(0,0,0,.48)" },
  commentsSheet: { height: "76%", maxHeight: "88%", backgroundColor: "#fff", borderTopLeftRadius: 22, borderTopRightRadius: 22, paddingHorizontal: 16, paddingTop: 9, paddingBottom: 18, overflow: "hidden" },
  sheetHandle: { alignSelf: "center", width: 38, height: 4, borderRadius: 2, backgroundColor: "#d0d2d6", marginBottom: 10 },
  sheetHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingBottom: 10, borderBottomWidth: 1, borderBottomColor: "#eceef1" },
  sheetTitle: { color: colors.ink, fontSize: 17, fontWeight: "800" },
  sortRow: { flexDirection: "row", alignItems: "center", gap: 4, paddingVertical: 10 },
  sortText: { color: colors.muted, fontSize: 12, fontWeight: "700" },
  commentList: { flex: 1, marginHorizontal: -16 },
  commentListContent: { paddingHorizontal: 16, paddingVertical: 12 },
  commentEntry: { flexDirection: "row", alignItems: "flex-start", gap: 9, marginBottom: 14 },
  commentAvatar: { width: 34, height: 34, borderRadius: 17, backgroundColor: colors.soft, alignItems: "center", justifyContent: "center" },
  commentBubble: { alignSelf: "flex-start", maxWidth: "100%", backgroundColor: "#f0f2f5", borderRadius: 18, paddingHorizontal: 12, paddingVertical: 8 },
  commentAuthor: { color: colors.ink, fontSize: 12, fontWeight: "800", marginBottom: 2 },
  commentCopy: { color: colors.ink, fontSize: 14, lineHeight: 19 },
  commentMeta: { color: colors.muted, fontSize: 11, marginTop: 4, marginLeft: 10 },
  emptyComments: { color: colors.muted, textAlign: "center", paddingTop: 30, fontSize: 14 },
  commentComposer: { flexDirection: "row", alignItems: "center", gap: 8, paddingTop: 10, borderTopWidth: 1, borderTopColor: "#eceef1" },
  commentCurrentAvatar: { width: 34, height: 34, borderRadius: 17, backgroundColor: colors.soft, alignItems: "center", justifyContent: "center" },
  commentInput: { flex: 1, height: 40, borderRadius: 20, backgroundColor: "#f0f2f5", paddingHorizontal: 14, color: colors.ink, fontSize: 13 },
});
