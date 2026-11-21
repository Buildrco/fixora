import { useEffect } from "react";
import { AppState } from "react-native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { colors } from "../constants/theme";
import * as Updates from "expo-updates";
import { AuthProvider } from "../data/AuthContext";

export default function Layout(){
 useEffect(() => {
  if (__DEV__ || !Updates.isEnabled) return;

  let isCheckingForUpdate = false;
  const checkForUpdate = async () => {
   if (isCheckingForUpdate) return;
   isCheckingForUpdate = true;

   try {
    const result = await Updates.checkForUpdateAsync();
    if (!result.isAvailable) return;

    const fetched = await Updates.fetchUpdateAsync();
    if (fetched.isNew) await Updates.reloadAsync();
   } catch (error) {
    console.warn("[Fixora] OTA update check failed", error);
   } finally {
    isCheckingForUpdate = false;
   }
  };

  void checkForUpdate();
  const subscription = AppState.addEventListener("change", state => {
   if (state === "active") void checkForUpdate();
  });

  return () => subscription.remove();
 }, []);

 return <AuthProvider><>
  <StatusBar style="dark"/>
  <Stack screenOptions={{headerShown:false,contentStyle:{backgroundColor:colors.card},animation:"slide_from_right"}}/>
 </></AuthProvider>
}
