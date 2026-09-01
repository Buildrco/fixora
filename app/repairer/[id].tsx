import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView, ScrollView, Text, View, StyleSheet, Pressable } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { colors, radius } from "../../constants/theme";
import { IconButton } from "../../components/IconButton";

const repairers:any={
  "k-tech-repairs":{name:"K-Tech Repairs",rating:"4.9",distance:"2.1 km",price:"GH₵280",about:"Board-level repairs, screen replacements and diagnostics from a verified local repairer."},
  "ifix-lab":{name:"iFix Lab",rating:"4.8",distance:"3.4 km",price:"GH₵350",about:"Careful phone repairs with clear diagnosis updates and warranty-backed service."},
};

export default function RepairerDetails(){
  const router=useRouter();
  const {id}=useLocalSearchParams();
  const repairer=repairers[id as string]||repairers["k-tech-repairs"];
  return <SafeAreaView style={styles.safe}><ScrollView contentContainerStyle={styles.content}>
    <View style={styles.header}><IconButton name="chevron-back" onPress={()=>router.back()}/><Text style={styles.title}>Repairer</Text><View style={styles.spacer}/></View>
    <View style={styles.avatar}><Ionicons name="construct-outline" size={34} color={colors.ink}/></View>
    <Text style={styles.name}>{repairer.name}</Text><Text style={styles.meta}>★ {repairer.rating} · {repairer.distance} · Verified</Text>
    <View style={styles.card}><Text style={styles.label}>About this repairer</Text><Text style={styles.body}>{repairer.about}</Text><Text style={styles.label}>Estimated from</Text><Text style={styles.price}>{repairer.price}</Text></View>
    <Pressable style={styles.cta} onPress={()=>router.push("/repair/confirmation" as any)}><Text style={styles.ctaText}>Choose repairer</Text><Ionicons name="arrow-forward" size={18} color="#fff"/></Pressable>
  </ScrollView></SafeAreaView>
}

const styles=StyleSheet.create({safe:{flex:1,backgroundColor:colors.card},content:{padding:18},header:{flexDirection:"row",alignItems:"center",justifyContent:"space-between"},title:{fontSize:20,fontWeight:"800",color:colors.ink},spacer:{width:42},avatar:{alignSelf:"center",width:88,height:88,borderRadius:radius.lg,backgroundColor:colors.soft,alignItems:"center",justifyContent:"center",marginTop:38},name:{fontSize:25,fontWeight:"800",color:colors.ink,textAlign:"center",marginTop:18},meta:{fontSize:12,color:colors.muted,textAlign:"center",marginTop:6},card:{marginTop:28,borderRadius:radius.md,backgroundColor:colors.soft,padding:17},label:{fontSize:11,color:colors.muted,marginTop:8},body:{fontSize:14,lineHeight:21,color:colors.ink,marginTop:5},price:{fontSize:18,fontWeight:"800",color:colors.ink,marginTop:4},cta:{height:54,borderRadius:radius.md,backgroundColor:colors.ink,flexDirection:"row",alignItems:"center",justifyContent:"center",gap:9,marginTop:22},ctaText:{color:"#fff",fontWeight:"800",fontSize:15}});