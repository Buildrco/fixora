export type ProfilePost = { id: string; name: string; handle: string; text: string; image: string };
export type ProfileData = { name: string; handle: string; bio: string; location: string; website: string; dateOfBirth: string; company: string; joined: string };

let profile: ProfileData = {
  name: "Your Name",
  handle: "@yourhandle",
  bio: "Phone enthusiast · Customer · Future repairer",
  location: "Accra, Ghana",
  website: "fixora.app",
  dateOfBirth: "January 1, 2000",
  company: "Fixora community",
  joined: "Joined September 2026",
};

const initialPosts: ProfilePost[] = [];
let posts = initialPosts;
const listeners = new Set<() => void>();

export function getProfile() { return profile; }
export function subscribeProfile(listener: () => void) { listeners.add(listener); return () => { listeners.delete(listener); }; }
export function updateProfile(changes: Partial<ProfileData>) {
  profile = { ...profile, ...changes };
  listeners.forEach(listener => listener());
}
export function getProfilePosts() { return posts; }
export function subscribeProfilePosts(listener: () => void) { listeners.add(listener); return () => { listeners.delete(listener); }; }
export function addProfilePost(text: string) {
  const post: ProfilePost = { id: String(Date.now()), name: profile.name, handle: profile.handle, text, image: "https://i.pravatar.cc/800?img=12" };
  posts = [post, ...posts];
  listeners.forEach(listener => listener());
}
