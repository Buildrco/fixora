import { Ionicons } from "@expo/vector-icons";
import { ScrollView, Text, View, StyleSheet, Image, Pressable } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { colors, radius } from "../constants/theme";
import { Chip } from "../components/Chip";
import { IconButton } from "../components/IconButton";
import { useRouter } from "expo-router";

const products=[
["iPhone 15 Pro","GH₵14,500","https://images.unsplash.com/photo-1592286927505-2fd0b2b8b0a4?auto=format&fit=crop&w=700&q=85"],
["Galaxy S24","GH₵11,800","https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=700&q=85"],
["Pixel 9 Pro","GH₵9,900","https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=700&q=85"],
["iPhone 14","GH₵10,800","https://images.unsplash.com/photo-1591337676887-a217a6970a8a?auto=format&fit=crop&w=700&q=85"]
];
export default function Shop(){const router=useRouter();return <SafeAreaProvider><SafeAreaView edges={["top"]} style={s.safe}><ScrollView contentContainerStyle={s.content}><View style={s.head}><IconButton name="chevron-back" onPress={()=>router.back()}/><Text style={s.title}>Shop</Text><IconButton name="bag-handle-outline"/></View><View style={s.search}><Ionicons name="search-outline" size={19} color={colors.muted}/><Text style={s.searchText}>Search products</Text></View><ScrollView horizontal showsHorizontalScrollIndicator={false} style={{marginVertical:18}}><Chip label="All" active/><Chip label="Phones"/><Chip label="Accessories"/><Chip label="Parts"/></ScrollView><View style={s.grid}>{products.map(([name,price,img])=><Pressable key={name} style={s.product}><Image source={{uri:img}} style={s.image}/><Text style={s.name}>{name}</Text><Text style={s.price}>{price}</Text><Text style={s.seller}>✓ Verified seller</Text></Pressable>)}</View></ScrollView></SafeAreaView></SafeAreaProvider>}
const s=StyleSheet.create({safe:{flex:1,backgroundColor:"#fff"},content:{padding:18,paddingBottom:40},head:{flexDirection:"row",alignItems:"center",justifyContent:"space-between"},title:{fontSize:20,fontWeight:"800",color:colors.ink},search:{height:48,borderRadius:16,backgroundColor:colors.soft,flexDirection:"row",alignItems:"center",gap:9,paddingHorizontal:14},searchText:{color:colors.muted,fontSize:13},grid:{flexDirection:"row",flexWrap:"wrap",gap:14},product:{width:"47%",marginBottom:10},image:{width:"100%",height:170,borderRadius:radius.lg},name:{fontSize:14,fontWeight:"700",marginTop:9},price:{fontSize:14,fontWeight:"800",marginTop:3},seller:{fontSize:11,color:colors.green,marginTop:4,fontWeight:"600"}})
