import { Text, View, StyleSheet } from "react-native";
import { colors, spacing } from "../constants/theme";

export function SectionTitle({title, action}: {title:string; action?:string}) {
 return <View style={styles.row}><Text style={styles.title}>{title}</Text>{action ? <Text style={styles.action}>{action}</Text>:null}</View>
}
const styles=StyleSheet.create({
 row:{flexDirection:"row",alignItems:"center",justifyContent:"space-between",marginBottom:spacing.md},
 title:{fontSize:20,fontWeight:"700",letterSpacing:-.4,color:colors.ink},
 action:{fontSize:14,fontWeight:"600",color:colors.accent}
});
