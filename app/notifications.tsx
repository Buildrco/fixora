import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView, ScrollView, Text, View, StyleSheet, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { colors, spacing, radius } from "../../constants/theme";
import { IconButton } from "../../components/IconButton";

export default function Notifications() {
  const router = useRouter();
  const items = [
    ["construct-outline", "Repair request update", "Your repair request has an update.", "2 min ago"],
    ["bag-handle-outline", "Shop update", "A saved item is still available.", "1 hr ago"],
    ["people-outline", "Community", "There is a new activity in Community.", "3 hr ago"],
  ];
  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <IconButton name="chevron-back" onPress={() => router.back()} />
          <Text style={styles.title}>Notifications</Text>
          <View style={styles.spacer} />
        </View>
        {items.map(([icon, title, body, time]) => (
          <Pressable key={title} style={({pressed}) => [styles.item, pressed && styles.pressed]}>
            <View style={styles.icon}><Ionicons name={icon as any} size={20} color={colors.ink} /></View>
            <View style={styles.copy}>
              <Text style={styles.itemTitle}>{title}</Text>
              <Text style={styles.body}>{body}</Text>
              <Text style={styles.time}>{time}</Text>
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
  icon:{width:44,height:44,borderRadius:radius.md,backgroundColor:colors.soft,alignItems:"center",justifyContent:"center",marginRight:12},
  copy:{flex:1},
  itemTitle:{fontSize:14,fontWeight:"800",color:colors.ink},
  body:{fontSize:12,color:colors.muted,marginTop:4},
  time:{fontSize:10,color:colors.muted,marginTop:5},
});
