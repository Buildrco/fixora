import { Ionicons } from "@expo/vector-icons";
import { Animated, Image, Pressable, Text, View, StyleSheet } from "react-native";
import { useRef, useState } from "react";
import { colors, radius } from "../constants/theme";

export function PostCard({name,handle,text,image,likes="42",comments="13"}:{name:string;handle:string;text:string;image:string;likes?:string;comments?:string}) {
 const [liked, setLiked] = useState(false);
 const [reposted, setReposted] = useState(false);
 const likeScale = useRef(new Animated.Value(1)).current;
 const bubbleValues = useRef([0, 1, 2, 3].map(() => new Animated.Value(0))).current;
 const toggleLike = () => {
   const next = !liked;
   setLiked(next);
   if (!next) return;
   Animated.sequence([Animated.timing(likeScale, { toValue: 1.28, duration: 110, useNativeDriver: true }), Animated.spring(likeScale, { toValue: 1, friction: 4, tension: 150, useNativeDriver: true })]).start();
   bubbleValues.forEach((value, index) => { value.setValue(0); Animated.timing(value, { toValue: 1, duration: 760, delay: index * 55, useNativeDriver: true }).start(); });
 };
 return <View style={styles.card}>
   <View pointerEvents="none" style={styles.bubbles}>{bubbleValues.map((value, index) => <Animated.Text key={index} style={[styles.bubble, { left: 24 + index * 28, transform: [{ translateY: value.interpolate({ inputRange: [0, 1], outputRange: [0, -72 - index * 8] }) }, { scale: value.interpolate({ inputRange: [0, 0.25, 1], outputRange: [0.4, 1.05, 0.7] }) }], opacity: value.interpolate({ inputRange: [0, 0.35, 1], outputRange: [0, 1, 0] }) }]}>♥</Animated.Text>)}</View>
   <View style={styles.head}><Image source={{uri:"https://i.pravatar.cc/100?img=12"}} style={styles.avatar}/><View style={{flex:1}}><View style={styles.nameRow}><Text style={styles.name}>{name}</Text><View style={styles.badge}><Text style={styles.badgeText}>✓</Text></View></View><Text style={styles.handle}>{handle} · 2h</Text></View><Ionicons name="ellipsis-horizontal" size={19} color={colors.muted}/></View>
   <Text style={styles.text}>{text}</Text>
   <Image source={{uri:image}} style={styles.postImage}/>
   <View style={styles.actions}>
     <Pressable onPress={toggleLike} hitSlop={8} style={styles.action}><Animated.View style={{ transform: [{ scale: likeScale }] }}><Ionicons name={liked ? "heart" : "heart-outline"} size={21} color={liked ? colors.accent : colors.muted}/></Animated.View><Text style={liked && styles.activeText}>{Number(likes) + (liked ? 1 : 0)}</Text></Pressable>
     <Pressable style={styles.action}><Ionicons name="chatbubble-outline" size={20} color={colors.muted}/><Text>{comments}</Text></Pressable>
     <Pressable onPress={() => setReposted(value => !value)} hitSlop={8} style={styles.action}><Ionicons name="repeat-outline" size={21} color={reposted ? colors.green : colors.muted}/><Text style={reposted && styles.repostText}>{Number(8) + (reposted ? 1 : 0)}</Text></Pressable>
     <Pressable style={styles.action}><Ionicons name="share-outline" size={20} color={colors.muted}/></Pressable>
   </View>
 </View>
}
const styles=StyleSheet.create({
 card:{position:"relative",backgroundColor:"#fff",borderBottomWidth:1,borderBottomColor:colors.line,paddingVertical:18},head:{flexDirection:"row",alignItems:"center",gap:10},avatar:{width:40,height:40,borderRadius:20},nameRow:{flexDirection:"row",alignItems:"center"},name:{fontSize:15,fontWeight:"700",color:colors.ink},handle:{fontSize:12,color:colors.muted,marginTop:2},badge:{marginLeft:5,width:16,height:16,borderRadius:8,backgroundColor:colors.blue,alignItems:"center",justifyContent:"center"},badgeText:{color:"#fff",fontSize:9,fontWeight:"800"},text:{fontSize:15,lineHeight:22,color:colors.ink,marginTop:12,marginBottom:12},postImage:{width:"100%",height:215,borderRadius:radius.md},bubbles:{position:"absolute",left:0,bottom:36,width:150,height:110,zIndex:2},bubble:{position:"absolute",bottom:0,color:colors.accent,fontSize:17,fontWeight:"800"},actions:{flexDirection:"row",justifyContent:"space-between",paddingTop:12},action:{flexDirection:"row",alignItems:"center",gap:6},actionText:{fontSize:12,color:colors.muted},activeText:{color:colors.accent,fontWeight:"700"},repostText:{color:colors.green,fontWeight:"700"}
});