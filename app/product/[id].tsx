import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView, ScrollView, Text, View, StyleSheet, Image, Pressable } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { colors, radius } from "../../constants/theme";
import { IconButton } from "../../components/IconButton";

const products:any={
 "iphone-15-pro":{name:"iPhone 15 Pro",price:"GH₵14,500",image:"https://images.unsplash.com/photo-1592286927505-2fd0b2b8b0a4?auto=format&fit=crop&w=900&q=85"},
 "galaxy-s24":{name:"Galaxy S24",price:"GH₵11,800",image:"https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=900&q=85"}
};
export default function ProductDetails(){const router=useRouter();const {id}=useLocalSearchParams();const p=products[id as string]||products["iphone-15-pro"];return <SafeAreaView style={styles.safe}><ScrollView>
<View style={styles.imageWrap}><Image source={{uri:p.image}} style={styles.image}/><View style={styles.back}><IconButton name="chevron-back" onPress={()=>router.back()}/></View></View>
<View style={styles.content}><Text style={styles.name}>{p.name}</Text><Text style={styles.price}>{p.price}</Text><Text style={styles.verified}>✓ Verified seller · Warranty available</Text><Text style={styles.heading}>About this phone</Text><Text style={styles.body}>Professionally listed device with verified seller information. Full specifications and seller details can be connected later.</Text><Pressable style={({pressed})=>[styles.cta,pressed&&styles.pressed]} onPress={()=>router.push("/cart" as any)}><Text style={styles.ctaText}>Add to bag</Text><Ionicons name="bag-handle-outline" size={18} color="#fff"/></Pressable></View>
</ScrollView></SafeAreaView>}
const styles=StyleSheet.create({safe:{flex:1,backgroundColor:colors.card},imageWrap:{height:390,backgroundColor:colors.soft},image:{width:"100%",height:"100%"},back:{position:"absolute",top:16,left:16},content:{padding:18},name:{fontSize:26,fontWeight:"800",color:colors.ink},price:{fontSize:20,fontWeight:"800",color:colors.ink,marginTop:6},verified:{fontSize:12,color:colors.green,fontWeight:"700",marginTop:9},heading:{fontSize:19,fontWeight:"800",color:colors.ink,marginTop:28},body:{fontSize:14,lineHeight:21,color:colors.muted,marginTop:8},cta:{height:54,borderRadius:radius.md,backgroundColor:colors.ink,flexDirection:"row",alignItems:"center",justifyContent:"center",gap:9,marginTop:25},pressed:{opacity:.78},ctaText:{color:"#fff",fontSize:15,fontWeight:"800"}});