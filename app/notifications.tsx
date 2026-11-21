import { Ionicons } from "@expo/vector-icons";
import { ActivityIndicator, SafeAreaView, ScrollView, Text, View, StyleSheet, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { colors, spacing, radius } from "../constants/theme";
import { IconButton } from "../components/IconButton";
import { useAuth } from "../data/AuthContext";
import { listMyNotifications, updateNotificationRead } from "../data/fixoraRepository";

export default function Notifications() {
  const router = useRouter();
  const { session } = useAuth();
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => {
    let mounted = true;
    if (!session) { setItems([]); setLoading(false); return; }
    setLoading(true);
    listMyNotifications().then(rows => { if (mounted) setItems(rows as any[]); })
      .catch(reason => { if (mounted) setError(reason instanceof Error ? reason.message : "Could not load notifications."); })
      .finally(() => { if (mounted) setLoading(false); });
    return () => { mounted = false; };
  }, [session?.user.id]);
  const markRead = async (item: any) => {
    if (item.is_read) return;
    try {
      const updated = await updateNotificationRead(item.id, true);
      setItems(current => current.map(row => row.id === item.id ? updated : row));
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Could not update notification.");
    }
  };
  const relativeTime = (date: string) => {
    const minutes = Math.max(0, Math.floor((Date.now() - new Date(date).getTime()) / 60000));
    return minutes < 60 ? `${minutes} min ago` : `${Math.floor(minutes / 60)} hr ago`;
  };
  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <IconButton name="chevron-back" onPress={() => router.back()} />
          <Text style={styles.title}>Notifications</Text>
          <View style={styles.spacer} />
        </View>
        {loading && <ActivityIndicator color={colors.blue} style={{ marginTop: 30 }} />}
        {!!error && <Text accessibilityRole="alert" style={styles.error}>{error}</Text>}
        {!loading && !session && <Pressable onPress={() => router.push("/sign-in" as never)} style={styles.empty}><Text style={styles.emptyTitle}>Sign in to view notifications</Text><Text style={styles.emptyCopy}>Your personal updates will appear here.</Text></Pressable>}
        {!loading && session && !items.length && !error && <View style={styles.empty}><Text style={styles.emptyTitle}>You’re all caught up</Text><Text style={styles.emptyCopy}>New updates will appear here.</Text></View>}
        {items.map(item => (
          <Pressable key={item.id} onPress={() => markRead(item)} style={({pressed}) => [styles.item, pressed && styles.pressed, !item.is_read && styles.unread]}>
            <View style={styles.icon}><Ionicons name={item.type?.toLowerCase().includes("repair") ? "construct-outline" : item.type?.toLowerCase().includes("message") ? "chatbubble-outline" : "notifications-outline"} size={20} color={colors.ink} /></View>
            <View style={styles.copy}>
              <Text style={styles.itemTitle}>{item.message || item.type}</Text>
              <Text style={styles.body}>{item.entity_type ? `${item.entity_type} update` : item.type}</Text>
              <Text style={styles.time}>{relativeTime(item.created_at)}</Text>
            </View>
          </Pressable>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  safe:{flex:1,backgroundColor:colors.card},
  content:{padding:18},
  header:{flexDirection:"row",alignItems:"center",justifyContent:"space-between",marginBottom:spacing.lg},
  title:{fontSize:20,fontWeight:"800",color:colors.ink},
  spacer:{width:42},
  item:{flexDirection:"row",alignItems:"center",paddingVertical:spacing.md,borderBottomWidth:1,borderBottomColor:colors.line},
  pressed:{opacity:.72},
  unread:{backgroundColor:"rgba(45,127,249,.05)"},
  empty:{alignItems:"center",marginTop:70,padding:20},
  emptyTitle:{fontSize:17,fontWeight:"800",color:colors.ink},
  emptyCopy:{fontSize:12,color:colors.muted,marginTop:6,textAlign:"center"},
  error:{fontSize:12,color:"#D74747",marginTop:18},
  icon:{width:44,height:44,borderRadius:radius.md,backgroundColor:colors.soft,alignItems:"center",justifyContent:"center",marginRight:12},
  copy:{flex:1},
  itemTitle:{fontSize:14,fontWeight:"800",color:colors.ink},
  body:{fontSize:12,color:colors.muted,marginTop:4},
  time:{fontSize:10,color:colors.muted,marginTop:5},
});
