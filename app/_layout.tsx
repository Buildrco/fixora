import { useEffect } from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { colors } from "../constants/theme";
import * as Updates from "expo-updates";
import { AuthProvider } from "../data/AuthContext";

export default function Layout(){
 useEffect(() => {
  if (__DEV__) return;
  Updates.checkForUpdateAsync()
   .then(async result => {
    if (result.isAvailable) {
     await Updates.fetchUpdateAsync();
     await Updates.reloadAsync();
    }
   })
   .catch(() => {});
 }, []);

 return <AuthProvider><>
  <StatusBar style="dark"/>
  <Stack screenOptions={{headerShown:false,contentStyle:{backgroundColor:colors.card},animation:"slide_from_right"}}/>
 </></AuthProvider>
}
