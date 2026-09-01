import { Ionicons } from "@expo/vector-icons";
import { ScrollView, Text, View, Image, Pressable, StyleSheet, SafeAreaView } from "react-native";
import { colors, radius, spacing } from "../constants/theme";
import { IconButton } from "../components/IconButton";
import { SectionTitle } from "../components/SectionTitle";
import { Chip } from "../components/Chip";
import { VendorCard } from "../components/VendorCard";
import { useRouter } from "expo-router";

const repairImg="https://images.unsplash.com/photo-1597423244037-9d8c2d0f4b3d?auto=format&fit=crop&w=900&q=85";
const shopImg="https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?auto=format&fit=crop&w=900&q=85";

export default function Home(){
 const router=useRouter();
 return <SafeAreaView style={styles.safe}><ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
  <View style={styles.top}><View><Text style={styles.eyebrow}>Good morning</Text><Text style={styles.greeting}>What do you need today?</Text></View><IconButton name="notifications-outline"/></View>
  <Pressable style={styles.search} onPress={()=>router.push("/shop")}><Ionicons name="search-outline" size={20} color={colors.muted}/><Text style={styles.searchText}>Search phones, repairs, tutorials...</Text></Pressable>
  <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{marginTop:18}}><Chip label="Shop" active/><Chip label="Repair"/><Chip label="Learn"/><Chip label="Community"/><Chip label="Services"/></ScrollView>
  <Pressable style={styles.hero} onPress={()=>router.push("/repair")}>
    <Image source={{uri:repairImg}} style={styles.heroImage}/>
    <View style={styles.overlay}/>
    <View style={styles.heroCopy}><Text style={styles.heroKicker}>REPAIR, WITHOUT THE RUNAROUND</Text><Text style={styles.heroTitle}>Find a trusted repairer near you.</Text><View style={styles.heroButton}><Text style={styles.heroButtonText}>Start a repair</Text><Ionicons name="arrow-forward" size={17} color="#fff"/></View></View>
  </Pressable>
  <SectionTitle title="Quick actions"/>
  <View style={styles.actionsGrid}>
   {[["phone-portrait-outline","Shop phones","/shop"],["construct-outline","Request repair","/repair"],["play-circle-outline","Learn repairs","/learn"],["people-outline","Join community","/community"]].map(([icon,label,path])=><Pressable key={label} onPress={()=>router.push(path as any)} style={({pressed})=>[styles.quick,pressed&&{transform:[{scale:.97}]}]}><View style={styles.quickIcon}><Ionicons name={icon as any} size={22} color={colors.ink}/></View><Text style={styles.quickText}>{label}</Text></Pressable>)}
  </View>
  <SectionTitle title="Repairers near you" action="See all"/>
  <ScrollView horizontal showsHorizontalScrollIndicator={false}>
    <VendorCard name="K-Tech Repairs" image={repairImg} price="GH₵280" distance="2.1 km" rating="4.9"/>
    <VendorCard name="iFix Lab" image={shopImg} price="GH₵350" distance="3.4 km" rating="4.8"/>
  </ScrollView>
  <SectionTitle title="Popular phones" action="Shop"/>
  <View style={styles.productRow}><Product image="https://images.unsplash.com/photo-1592286927505-2fd0b2b8b0a4?auto=format&fit=crop&w=700&q=85" name="iPhone 15 Pro" price="GH₵14,500"/><Product image="https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=700&q=85" name="Galaxy S24" price="GH₵11,800"/></View>
 </ScrollView></SafeAreaView>
}
function Product({image,name,price}:{image:string;name:string;price:string}){return <View style={styles.product}><Image source={{uri:image}} style={styles.productImage}/><Text style={styles.productName}>{name}</Text><Text style={styles.productPrice}>{price}</Text></View>}
const styles=StyleSheet.create({
 safe:{flex:1,backgroundColor:"#fff"},content:{paddingHorizontal:18,paddingBottom:40},top:{flexDirection:"row",justifyContent:"space-between",alignItems:"center",paddingTop:8},eyebrow:{fontSize:13,color:colors.muted},greeting:{fontSize:24,fontWeight:"800",letterSpacing:-.7,color:colors.ink,marginTop:3},search:{height:50,borderRadius:17,backgroundColor:colors.soft,flexDirection:"row",alignItems:"center",paddingHorizontal:15,gap:10,marginTop:18},searchText:{fontSize:13,color:colors.muted},hero:{height:250,borderRadius:radius.xl,overflow:"hidden",marginTop:20},heroImage:{width:"100%",height:"100%"},overlay:{...StyleSheet.absoluteFillObject,backgroundColor:"rgba(0,0,0,.35)"},heroCopy:{position:"absolute",left:20,right:20,bottom:20},heroKicker:{fontSize:10,fontWeight:"800",letterSpacing:1.2,color:"#fff",opacity:.85},heroTitle:{fontSize:27,lineHeight:31,fontWeight:"800",letterSpacing:-.8,color:"#fff",marginTop:7,maxWidth:300},heroButton:{alignSelf:"flex-start",marginTop:14,paddingHorizontal:15,paddingVertical:10,borderRadius:16,backgroundColor:colors.accent,flexDirection:"row",gap:8,alignItems:"center"},heroButtonText:{color:"#fff",fontSize:13,fontWeight:"700"},actionsGrid:{flexDirection:"row",flexWrap:"wrap",gap:10,marginBottom:26},quick:{width:"48%",minHeight:76,borderRadius:18,backgroundColor:colors.soft,padding:12,flexDirection:"row",alignItems:"center",gap:11},quickIcon:{width:40,height:40,borderRadius:14,backgroundColor:"#fff",alignItems:"center",justifyContent:"center"},quickText:{fontSize:13,fontWeight:"700",color:colors.ink,flex:1},productRow:{flexDirection:"row",gap:12},product:{flex:1},productImage:{height:145,width:"100%",borderRadius:radius.lg},productName:{fontSize:14,fontWeight:"700",marginTop:9,color:colors.ink},productPrice:{fontSize:13,color:colors.muted,marginTop:3}
});
