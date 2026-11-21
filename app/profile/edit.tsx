import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Alert, Image, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";
import { colors } from "../../constants/theme";
import { getProfile, loadProfileFromSupabase, ProfileData, updateProfile } from "../../data/profileStore";
import { useAuth } from "../../data/AuthContext";
import { getPublicMediaUrl, uploadMediaFromUri } from "../../data/fixoraRepository";

export default function EditProfile() {
  const router = useRouter();
  const { session } = useAuth();
  const saved = getProfile();
  const [draft, setDraft] = useState<ProfileData>({ ...saved });
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const setField = (field: keyof ProfileData, value: string) => setDraft(current => ({ ...current, [field]: value }));
  useEffect(() => {
    if (!session) { setLoading(false); setError("Sign in to edit your profile."); return; }
    let mounted = true;
    loadProfileFromSupabase().then(profile => { if (mounted) setDraft({ ...profile }); })
      .catch(reason => { if (mounted) setError(reason instanceof Error ? reason.message : "Could not load profile."); })
      .finally(() => { if (mounted) setLoading(false); });
    return () => { mounted = false; };
  }, [session?.user.id]);
  const save = async () => {
    setSaving(true); setError("");
    try { await updateProfile(draft); router.back(); }
    catch (reason) { setError(reason instanceof Error ? reason.message : "Could not save profile."); }
    finally { setSaving(false); }
  };
  const chooseAvatar = async () => {
    if (!session) { router.push("/sign-in" as never); return; }
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ["images"], allowsEditing: true, aspect: [1, 1], quality: 0.85 });
    if (result.canceled || !result.assets[0]) return;
    const asset = result.assets[0];
    try {
      const ext = asset.mimeType?.split("/")[1] || "jpg";
      const uploaded = await uploadMediaFromUri("avatars", `profile-${Date.now()}.${ext}`, asset.uri, asset.mimeType || "image/jpeg");
      setField("avatarUrl", getPublicMediaUrl("avatars", uploaded.path));
    } catch (reason) {
      Alert.alert("Photo upload failed", reason instanceof Error ? reason.message : "Please try again.");
    }
  };

  return <SafeAreaView style={s.safe} edges={["top"]}>
    <KeyboardAvoidingView style={s.flex} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false} contentContainerStyle={s.content}>
        <View style={s.header}><Pressable onPress={() => router.back()} hitSlop={10}><Ionicons name="chevron-back" size={28} color={colors.ink} /></Pressable><Text style={s.title}>Edit profile</Text><Pressable onPress={save} disabled={saving} hitSlop={10}><Text style={s.save}>{saving ? "Saving…" : "Save"}</Text></Pressable></View>
        <View style={s.cover}><Pressable style={s.coverCamera} onPress={() => Alert.alert("Cover photo unavailable", "The profiles table has no cover-image column.")}><Ionicons name="camera-outline" size={30} color="#fff" /></Pressable></View>
        <View style={s.avatarWrap}><Pressable onPress={chooseAvatar} style={s.avatar}>{draft.avatarUrl ? <Image source={{ uri: draft.avatarUrl }} style={s.avatarImage} /> : <Ionicons name="person" size={35} color={colors.muted} />}</Pressable><Pressable style={s.avatarCamera} onPress={chooseAvatar}><Ionicons name="camera-outline" size={25} color="#fff" /></Pressable></View>
        {loading && <ActivityIndicator color={colors.blue} style={{ marginTop: 16 }} />}
        {!!error && <Text accessibilityRole="alert" style={s.error}>{error}</Text>}
        <View style={s.form}>
          <Field label="Name" value={draft.name} onChangeText={value => setField("name", value)} />
          <Field label="Bio" value={draft.bio} onChangeText={value => setField("bio", value)} multiline />
          <Field label="Location" value={draft.location} onChangeText={value => setField("location", value)} />
          <Field label="Website" value={draft.website} onChangeText={value => setField("website", value)} keyboardType="url" autoCapitalize="none" />
          <Field label="Date of birth" value={draft.dateOfBirth} onChangeText={() => {}} editable={false} />
          <View style={s.privacy}><Ionicons name="information-circle-outline" size={18} color={colors.muted} /><Text style={s.privacyText}>The existing profiles table does not store date of birth or cover photos.</Text></View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  </SafeAreaView>;
}

function Field({ label, value, onChangeText, multiline, keyboardType, autoCapitalize, editable = true }: { label: string; value: string; onChangeText: (value: string) => void; multiline?: boolean; keyboardType?: "default" | "url"; autoCapitalize?: "none" | "sentences"; editable?: boolean }) { return <View style={s.field}><Text style={s.label}>{label}</Text><TextInput value={value} onChangeText={onChangeText} editable={editable} multiline={multiline} keyboardType={keyboardType} autoCapitalize={autoCapitalize} textAlignVertical={multiline ? "top" : "center"} style={[s.input, multiline && s.bioInput]} /></View>; }

const s = StyleSheet.create({ safe: { flex: 1, backgroundColor: colors.card }, flex: { flex: 1 }, content: { paddingBottom: 40 }, header: { height: 66, paddingHorizontal: 21, flexDirection: "row", alignItems: "center", justifyContent: "space-between", backgroundColor: colors.card }, title: { color: colors.ink, fontSize: 20, fontWeight: "800" }, save: { color: colors.muted, fontSize: 17, fontWeight: "700" }, cover: { height: 156, backgroundColor: "#858b8f", alignItems: "center", justifyContent: "center" }, coverCamera: { width: 53, height: 53, alignItems: "center", justifyContent: "center" }, avatarWrap: { position: "absolute", top: 171, left: 21, width: 126, height: 126, borderRadius: 63, padding: 3, backgroundColor: colors.card }, avatar: { width: "100%", height: "100%", borderRadius: 60, alignItems: "center", justifyContent: "center", backgroundColor: colors.soft }, avatarImage: { width: "100%", height: "100%", borderRadius: 60 }, avatarCamera: { position: "absolute", left: 35, top: 35, width: 53, height: 53, borderRadius: 27, backgroundColor: "rgba(0,0,0,.44)", alignItems: "center", justifyContent: "center" }, form: { paddingHorizontal: 21, paddingTop: 86 }, field: { borderBottomWidth: 1, borderBottomColor: colors.line, paddingBottom: 3, marginBottom: 19 }, label: { color: colors.muted, fontSize: 17, marginBottom: 9 }, input: { minHeight: 36, padding: 0, color: colors.ink, fontSize: 21 }, bioInput: { minHeight: 92, lineHeight: 26, paddingTop: 3 }, privacy: { flexDirection: "row", alignItems: "flex-start", gap: 8, marginTop: -7 }, privacyText: { color: colors.muted, fontSize: 13, lineHeight: 19 }, error: { color: "#D74747", paddingHorizontal: 21, paddingTop: 12 } });
