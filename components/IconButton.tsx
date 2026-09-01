import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet } from "react-native";
import { colors } from "../constants/theme";

export function IconButton({name, onPress, filled=false}: {name: keyof typeof Ionicons.glyphMap; onPress?:()=>void; filled?:boolean}) {
  return (
    <Pressable onPress={onPress} style={({pressed}) => [styles.button, pressed && styles.pressed]}>
      <Ionicons name={name} size={20} color={colors.ink} />
    </Pressable>
  );
}
const styles = StyleSheet.create({
  button:{width:42,height:42,borderRadius:21,backgroundColor:colors.soft,alignItems:"center",justifyContent:"center"},
  pressed:{transform:[{scale:.94}],opacity:.75}
});
