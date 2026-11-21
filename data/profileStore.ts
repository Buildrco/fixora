import {
  createPost, getCurrentProfile, listMyPosts, saveProfile,
} from "./fixoraRepository";

export type ProfilePost = {
  id: string; name: string; handle: string; text: string; image: string;
};
export type ProfileData = {
  name: string; handle: string; bio: string; location: string; website: string;
  dateOfBirth: string; company: string; joined: string; avatarUrl: string;
};

let profile: ProfileData = {
  name: "", handle: "", bio: "", location: "", website: "",
  dateOfBirth: "", company: "", joined: "", avatarUrl: "",
};
let posts: ProfilePost[] = [];
const listeners = new Set<() => void>();

function notify() { listeners.forEach(listener => listener()); }
function fromRow(row: any): ProfileData {
  return {
    name: row?.full_name || "",
    handle: row?.username ? `@${row.username}` : "",
    bio: row?.bio || "",
    location: row?.location || "",
    website: row?.website || "",
    dateOfBirth: "",
    company: row?.company || "",
    joined: row?.created_at ? `Joined ${new Date(row.created_at).toLocaleDateString()}` : "",
    avatarUrl: row?.avatar_url || "",
  };
}

export function getProfile() { return profile; }
export function subscribeProfile(listener: () => void) {
  listeners.add(listener);
  return () => { listeners.delete(listener); };
}
export async function loadProfileFromSupabase() {
  const row = await getCurrentProfile();
  profile = fromRow(row);
  const rows = await listMyPosts() as any[];
  posts = rows.map(row => ({
    id: row.id, name: profile.name || "Fixora member",
    handle: profile.handle, text: row.body || "",
    image: row.media_urls?.[0] || profile.avatarUrl,
  }));
  notify();
  return profile;
}
export async function updateProfile(changes: Partial<ProfileData>) {
  const username = changes.handle?.replace(/^@/, "");
  const row = await saveProfile({
    ...(changes.name !== undefined ? { full_name: changes.name } : {}),
    ...(username !== undefined ? { username } : {}),
    ...(changes.bio !== undefined ? { bio: changes.bio } : {}),
    ...(changes.location !== undefined ? { location: changes.location } : {}),
    ...(changes.website !== undefined ? { website: changes.website } : {}),
    ...(changes.company !== undefined ? { company: changes.company } : {}),
    ...(changes.avatarUrl !== undefined ? { avatar_url: changes.avatarUrl } : {}),
  });
  profile = fromRow(row);
  notify();
  return profile;
}
export function getProfilePosts() { return posts; }
export function subscribeProfilePosts(listener: () => void) {
  listeners.add(listener);
  return () => { listeners.delete(listener); };
}
export async function addProfilePost(text: string) {
  const row = await createPost(text);
  const post: ProfilePost = {
    id: row.id, name: profile.name || "Fixora member",
    handle: profile.handle, text: row.body, image: row.media_urls?.[0] || profile.avatarUrl,
  };
  posts = [post, ...posts];
  notify();
  return post;
}
