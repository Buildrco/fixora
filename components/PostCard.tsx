import { Ionicons } from "@expo/vector-icons";
import { Image, Pressable, Text, View, StyleSheet } from "react-native";
import { colors, radius } from "../constants/theme";

export function PostCard({name,handle,text,image,likes="42",comments="13"}:{name:string;handle:string;text:string;image:string;likes?:string;comments?:string}) {
 return <View style={styles.card}>
   <View style={styles.head}><Image source={{uri:"https://i.pravatar.cc/100?img=12"}} style={styles.avatar}/><View style={{flex:1}}><View style={styles.nameRow}><Text style={styles.name}>{name}</Text><View style={styles.badge}><Text style={styles.badgeText}>✓</Text></View></View><Text style={styles.handle}>{handle} · 2h</Text></View><Ionicons name="ellipsis-horizontal" size={19} color={colors.muted}/></View>
   <Text style={styles.text}>{text}</Text>
   <Image source={{uri:image}} style={styles.postImage}/>
   <View style={styles.actions}>
     <Pressable style={styles.action}><Ionicons name="heart-outline" size={21} color={colors.muted}/><Text>{likes}</Text></Pressable>
     <Pressable style={styles.action}><Ionicons name="chatbubble-outline" size={20} color={colors.muted}/><Text>{comments}</Text></Pressable>
     <Pressable style={styles.action}><Ionicons name="repeat-outline" size={21} color={colors.muted}/><Text>8</Text></Pressable>
     <Pressable style={styles.action}><Ionicons name="share-outline" size={20} color={colors.muted}/></Pressable>
   </View>
 </View>
}
const styles=StyleSheet.create({
 card:{backgroundColor:"#fff",borderBottomWidth:1,borderBottomColor:colors.line,paddingVertical:18},head:{flexDirection:"row",alignItems:"center",gap:10},avatar:{width:40,height:40,borderRadius:20},nameRow:{flexDirection:"row",alignItems:"center"},name:{fontSize:15,fontWeight:"700",color:colors.ink},handle:{fontSize:12,color:colors.muted,marginTop:2},badge:{marginLeft:5,width:16,height:16,borderRadius:8,backgroundColor:colors.blue,alignItems:"center",justifyContent:"center"},badgeText:{color:"#fff",fontSize:9,fontWeight:"800"},text:{fontSize:15,lineHeight:22,color:colors.ink,marginTop:12,marginBottom:12},postImage:{width:"100%",height:215,borderRadius:radius.md},actions:{flexDirection:"row",justifyContent:"space-between",paddingTop:12},action:{flexDirection:"row",alignItems:"center",gap:6},actionText:{fontSize:12,color:colors.muted}
});