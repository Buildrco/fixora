import { isSupabaseConfigured, requireSupabaseConfig, supabase } from "../supabase";

function fail<T>(error: { message: string } | null, data: T | null): T {
  if (error) throw new Error(error.message);
  if (data === null) throw new Error("Supabase returned no data.");
  return data;
}

async function currentUserId(): Promise<string> {
  requireSupabaseConfig();
  const { data, error } = await supabase.auth.getUser();
  if (error) throw error;
  if (!data.user) throw new Error("Sign in is required for this action.");
  return data.user.id;
}

export async function testSupabaseConnection() {
  requireSupabaseConfig();
  const { error } = await supabase.from("products").select("id").limit(1);
  if (error) throw error;
  return true;
}

// Public reads use only tables/view already present in the supplied schema.
export async function listProducts(category?: string) {
  requireSupabaseConfig();
  let query = supabase.from("products").select("*").eq("is_active", true).order("created_at", { ascending: false });
  if (category) query = query.eq("category", category);
  const { data, error } = await query;
  return fail(error, data);
}

export async function listPublishedTutorials() {
  requireSupabaseConfig();
  const { data, error } = await supabase.from("tutorials").select("*")
    .eq("is_published", true).order("created_at", { ascending: false });
  return fail(error, data);
}

export async function listCommunityFeed() {
  requireSupabaseConfig();
  const { data, error } = await supabase.from("posts_feed").select("*")
    .order("created_at", { ascending: false }).limit(50);
  return fail(error, data);
}

export async function getProfile(userId: string) {
  requireSupabaseConfig();
  const { data, error } = await supabase.from("profiles").select("*").eq("id", userId).maybeSingle();
  if (error) throw error;
  return data;
}

export async function saveProfile(input: {
  username?: string; full_name?: string; avatar_url?: string; bio?: string;
  location?: string; website?: string; company?: string;
}) {
  const id = await currentUserId();
  const { data, error } = await supabase.from("profiles").upsert({ id, ...input })
    .select().single();
  return fail(error, data);
}

export async function createPost(body: string, mediaUrls: string[] = []) {
  const author_id = await currentUserId();
  const { data, error } = await supabase.from("posts").insert({
    author_id, body: body.trim(), media_urls: mediaUrls,
  }).select().single();
  return fail(error, data);
}

export async function setPostLike(postId: string, liked: boolean) {
  const user_id = await currentUserId();
  if (liked) {
    const { error } = await supabase.from("post_likes").upsert({ post_id: postId, user_id });
    if (error) throw error;
  } else {
    const { error } = await supabase.from("post_likes").delete()
      .eq("post_id", postId).eq("user_id", user_id);
    if (error) throw error;
  }
}

export async function setPostRepost(postId: string, reposted: boolean) {
  const user_id = await currentUserId();
  if (reposted) {
    const { error } = await supabase.from("post_reposts").upsert({ post_id: postId, user_id });
    if (error) throw error;
  } else {
    const { error } = await supabase.from("post_reposts").delete()
      .eq("post_id", postId).eq("user_id", user_id);
    if (error) throw error;
  }
}

export async function addComment(postId: string, body: string, parentCommentId?: string) {
  const author_id = await currentUserId();
  const { data, error } = await supabase.from("comments").insert({
    post_id: postId, author_id, body: body.trim(), parent_comment_id: parentCommentId ?? null,
  }).select().single();
  return fail(error, data);
}

export async function toggleSavedPost(postId: string, saved: boolean) {
  const user_id = await currentUserId();
  if (saved) {
    const { error } = await supabase.from("saved_posts").upsert({ post_id: postId, user_id });
    if (error) throw error;
  } else {
    const { error } = await supabase.from("saved_posts").delete()
      .eq("post_id", postId).eq("user_id", user_id);
    if (error) throw error;
  }
}

export async function createRepairRequest(input: {
  repairer_id?: string | null; device_category: string; device_brand: string;
  device_model: string; issue: string; issue_details?: string; address?: string;
}) {
  const customer_id = await currentUserId();
  const { data, error } = await supabase.from("repair_requests").insert({
    customer_id, repairer_id: input.repairer_id ?? null, device_category: input.device_category,
    device_brand: input.device_brand, device_model: input.device_model, issue: input.issue,
    issue_details: input.issue_details ?? null, address: input.address ?? null,
  }).select().single();
  return fail(error, data);
}

export async function listMyRepairRequests() {
  const customer_id = await currentUserId();
  const { data, error } = await supabase.from("repair_requests").select("*")
    .eq("customer_id", customer_id).order("created_at", { ascending: false });
  return fail(error, data);
}

export async function listMyNotifications() {
  const recipient_id = await currentUserId();
  const { data, error } = await supabase.from("notifications").select("*")
    .eq("recipient_id", recipient_id).order("created_at", { ascending: false });
  return fail(error, data);
}

export async function updateNotificationRead(id: string, is_read: boolean) {
  const recipient_id = await currentUserId();
  const { data, error } = await supabase.from("notifications").update({ is_read })
    .eq("id", id).eq("recipient_id", recipient_id).select().single();
  return fail(error, data);
}

export async function saveUserSettings(input: {
  repair_updates?: boolean; community_notifications?: boolean;
  message_notifications?: boolean; nearby_recommendations?: boolean;
}) {
  const user_id = await currentUserId();
  const { data, error } = await supabase.from("user_settings")
    .upsert({ user_id, ...input, updated_at: new Date().toISOString() }).select().single();
  return fail(error, data);
}

export async function listMyOrders() {
  const customer_id = await currentUserId();
  const { data, error } = await supabase.from("orders").select("*, order_items(*)")
    .eq("customer_id", customer_id).order("created_at", { ascending: false });
  return fail(error, data);
}

export async function saveTutorialProgress(input: {
  tutorial_id: string; progress_percent: number; last_position_seconds: number; completed_at?: string | null;
}) {
  const user_id = await currentUserId();
  const { data, error } = await supabase.from("tutorial_progress").upsert({
    ...input, user_id, updated_at: new Date().toISOString(),
  }).select().single();
  return fail(error, data);
}

export async function submitVendorApplication(input: {
  business_name: string; application_type: "vendor" | "repairer";
  phone?: string; location?: string; description?: string;
}) {
  const user_id = await currentUserId();
  const { data, error } = await supabase.from("vendor_applications").insert({
    user_id, ...input,
  }).select().single();
  return fail(error, data);
}

export async function uploadMedia(
  bucket: "avatars" | "post-media" | "product-media" | "chat-media",
  path: string,
  file: Blob,
  contentType: string,
) {
  const userId = await currentUserId();
  requireSupabaseConfig();
  if (!path || path.startsWith("/") || path.split("/").includes("..")) {
    throw new Error("Storage path must be a relative path.");
  }
  const { data, error } = await supabase.storage.from(bucket).upload(`${userId}/${path}`, file, {
    contentType, upsert: false,
  });
  return fail(error, data);
}

export function supabaseConfigured() {
  return isSupabaseConfigured;
}
