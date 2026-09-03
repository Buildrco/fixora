export type ProfilePost = { id: string; name: string; handle: string; text: string; image: string };

const initialPosts: ProfilePost[] = [];
let posts = initialPosts;
const listeners = new Set<() => void>();

export function getProfilePosts() { return posts; }
export function subscribeProfilePosts(listener: () => void) { listeners.add(listener); return () => listeners.delete(listener); }
export function addProfilePost(text: string) {
  const post: ProfilePost = { id: String(Date.now()), name: "Your Name", handle: "@yourhandle", text, image: "https://i.pravatar.cc/800?img=12" };
  posts = [post, ...posts];
  listeners.forEach(listener => listener());
}
