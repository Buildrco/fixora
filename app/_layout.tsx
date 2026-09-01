import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { colors } from "../constants/theme";

export default function Layout(){
 return <>
  <StatusBar style="dark"/>
  <Stack screenOptions={{headerShown:false,contentStyle:{backgroundColor:colors.card},animation:"slide_from_right"}}/>
 </>
}
