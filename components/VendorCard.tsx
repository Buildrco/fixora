import { Image, Pressable, Text, View, StyleSheet } from "react-native";
import { colors, radius, spacing } from "../constants/theme";

export function VendorCard({name, image, price, distance, rating}:{name:string;image:string;price:string;distance:string;rating:string}) {
 return <Pressable style={({pressed})=>[styles.card,pressed&&{transform:[{scale:.985}]}]}>
   <Image source={{uri:image}} style={styles.image}/>
   <View style={styles.body}>
    <View style={styles.titleRow}><Text style={styles.name}>{name}</Text><View style={styles.badge}><Text style={styles.badgeText}>✓</Text></View></View>
    <Text style={styles.meta}>★ {rating}  ·  {distance}</Text>
    <View style={styles.bottom}><Text style={styles.price}>{price}</Text><Text style={styles.from}>from</Text></View>
   </View>
 </Pressable>
}
const styles=StyleSheet.create({
 card:{width:230,backgroundColor:colors.card,borderRadius:radius.lg,overflow:"hidden",borderWidth:1,borderColor:colors.line,marginRight:14},
 image:{width:"100%",height:126},body:{padding:14},titleRow:{flexDirection:"row",alignItems:"center"},name:{fontSize:16,fontWeight:"700",color:colors.ink},badge:{marginLeft:6,width:17,height:17,borderRadius:9,backgroundColor:colors.blue,alignItems:"center",justifyContent:"center"},badgeText:{color:"#fff",fontSize:10,fontWeight:"800"},meta:{fontSize:12,color:colors.muted,marginTop:5},bottom:{flexDirection:"row",alignItems:"baseline",marginTop:12},price:{fontSize:17,fontWeight:"800",color:colors.ink},from:{fontSize:11,color:colors.muted,marginLeft:4}
});
