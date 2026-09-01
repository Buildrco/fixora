import { Pressable, Text, StyleSheet } from "react-native";
import { colors } from "../constants/theme";

export function Chip({label, active=false, onPress}:{label:string;active?:boolean;onPress?:()=>void}) {
 return <Pressable onPress={onPress} style={[styles.chip, active && styles.active]}><Text style={[styles.text,active&&styles.activeText]}>{label}</Text></Pressable>
}
const styles=StyleSheet.create({
 chip:{paddingHorizontal:15,paddingVertical:10,borderRadius:18,backgroundColor:colors.soft,marginRight:8},
 active:{backgroundColor:colors.ink},text:{fontSize:13,fontWeight:"600",color:colors.muted},activeText:{color:"#fff"}
});
