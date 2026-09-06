import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Image, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "../../constants/theme";
import { getProfile, ProfileData, updateProfile } from "../../data/profileStore";

const avatar = "https://i.pravatar.cc/240?img=12";

export default function EditProfile() {
  const router = useRouter();
  const saved = getProfile();
  const [draft, setDraft] = useState<ProfileData>({ ...saved });
  const setField = (field: keyof ProfileData, value: string) => setDraft(current => ({ ...current, [field]: value }));
  const save = () => { updateProfile(draft); router.back(); };

  return <SafeAreaView style={s.safe} edges={["top"]}>
    <KeyboardAvoidingView style={s.flex} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false} contentContainerStyle={s.content}>
        <View style={s.header}><Pressable onPress={() => router.back()} hitSlop={10}><Ionicons name="chevron-back" size={28} color={colors.ink} /></Pressable><Text style={s.title}>Edit profile</Text><Pressable onPress={save} hitSlop={10}><Text style={s.save}>Save</Text></Pressable></View>
        <View style={s.cover}><Pressable style={s.coverCamera}><Ionicons name="camera-outline" size={30} color="#fff" /></Pressable></View>
        <View style={s.avatarWrap}><Image source={{ uri: avatar }} style={s.avatar} /><Pressable style={s.avatarCamera}><Ionicons name="camera-outline" size={25} color="#fff" /></Pressable></View>
        <View style={s.form}>
          <Field label="Name" value={draft.name} onChangeText={value => setField("name", value)} />
          <Field label="Bio" value={draft.bio} onChangeText={value => setField("bio", value)} multiline />
          <Field label="Location" value={draft.location} onChangeText={value => setField("location", value)} />
          <Field label="Website" value={draft.website} onChangeText={value => setField("website", value)} keyboardType="url" autoCapitalize="none" />
          <Field label="Date of birth" value={draft.dateOfBirth} onChangeText={value => setField("dateOfBirth", value)} />
          <View style={s.privacy}><Ionicons name="information-circle-outline" size={18} color={colors.muted} /><Text style={s.privacyText}>Month and day: You follow each other{ "\n" }Year: Only you</Text></View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  </SafeAreaView>;
}

function Field({ label, value, onChangeText, multiline, keyboardType, autoCapitalize }: { label: string; value: string; onChangeText: (value: string) => void; multiline?: boolean; keyboardType?: "default" | "url"; autoCapitalize?: "none" | "sentences" }) { return <View style={s.field}><Text style={s.label}>{label}</Text><TextInput value={value} onChangeText={onChangeText} multiline={multiline} keyboardType={keyboardType} autoCapitalize={autoCapitalize} textAlignVertical={multiline ? "top" : "center"} style={[s.input, multiline && s.bioInput]} /></View>; }

const s = StyleSheet.create({ safe: { flex: 1, backgroundColor: colors.card }, flex: { flex: 1 }, content: { paddingBottom: 40 }, header: { height: 66, paddingHorizontal: 21, flexDirection: "row", alignItems: "center", justifyContent: "space-between", backgroundColor: colors.card }, title: { color: colors.ink, fontSize: 20, fontWeight: "800" }, save: { color: colors.muted, fontSize: 17, fontWeight: "700" }, cover: { height: 156, backgroundColor: "#858b8f", alignItems: "center", justifyContent: "center" }, coverCamera: { width: 53, height: 53, alignItems: "center", justifyContent: "center" }, avatarWrap: { position: "absolute", top: 171, left: 21, width: 126, height: 126, borderRadius: 63, padding: 3, backgroundColor: colors.card }, avatar: { width: "100%", height: "100%", borderRadius: 60 }, avatarCamera: { position: "absolute", left: 35, top: 35, width: 53, height: 53, borderRadius: 27, backgroundColor: "rgba(0,0,0,.44)", alignItems: "center", justifyContent: "center" }, form: { paddingHorizontal: 21, paddingTop: 86 }, field: { borderBottomWidth: 1, borderBottomColor: colors.line, paddingBottom: 3, marginBottom: 19 }, label: { color: colors.muted, fontSize: 17, marginBottom: 9 }, input: { minHeight: 36, padding: 0, color: colors.ink, fontSize: 21 }, bioInput: { minHeight: 92, lineHeight: 26, paddingTop: 3 }, privacy: { flexDirection: "row", alignItems: "flex-start", gap: 8, marginTop: -7 }, privacyText: { color: colors.muted, fontSize: 16, lineHeight: 22 } });
