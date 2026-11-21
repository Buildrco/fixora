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

export async function getProduct(productId: string) {
  requireSupabaseConfig();
  const { data, error } = await supabase.from("products").select("*")
    .eq("id", productId).eq("is_active", true).maybeSingle();
  if (error) throw error;
  return data;
}

export async function listPublishedTutorials() {
  requireSupabaseConfig();
  const { data, error } = await supabase.from("tutorials").select("*")
    .eq("is_published", true).order("created_at", { ascending: false });
  return fail(error, data);
}

export async function getTutorial(slugOrId: string) {
  requireSupabaseConfig();
  const { data, error } = await supabase.from("tutorials").select("*")
    .eq("is_published", true).or(`slug.eq.${slugOrId},id.eq.${slugOrId}`).maybeSingle();
  if (error) throw error;
  return data;
}

export async function listCommunityFeed() {
  requireSupabaseConfig();
  const { data, error } = await supabase.from("posts_feed").select("*")
    .order("created_at", { ascending: false }).limit(50);
  return fail(error, data);
}

export async function listComments(postId: string) {
  requireSupabaseConfig();
  const { data, error } = await supabase.from("comments").select("*")
    .eq("post_id", postId).order("created_at", { ascending: true });
  return fail(error, data);
}

export async function getProfile(userId: string) {
  requireSupabaseConfig();
  const { data, error } = await supabase.from("profiles").select("*").eq("id", userId).maybeSingle();
  if (error) throw error;
  return data;
}

export async function getCurrentProfile() {
  const userId = await currentUserId();
  return getProfile(userId);
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

export async function getRepairRequest(id: string) {
  const customer_id = await currentUserId();
  const { data, error } = await supabase.from("repair_requests").select("*")
    .eq("id", id).eq("customer_id", customer_id).maybeSingle();
  if (error) throw error;
  return data;
}

export async function listRepairers() {
  requireSupabaseConfig();
  const { data, error } = await supabase.from("repairer_profiles").select("*")
    .order("average_rating", { ascending: false });
  const repairers = fail(error, data) as any[];
  if (!repairers.length) return [];
  const ids = repairers.map(row => row.user_id);
  const { data: profiles, error: profileError } = await supabase.from("profiles")
    .select("id,username,full_name,avatar_url,location,is_verified")
    .in("id", ids);
  if (profileError) throw profileError;
  const byId = new Map((profiles || []).map(profile => [profile.id, profile]));
  return repairers.map(row => ({ ...row, profile: byId.get(row.user_id) ?? null }));
}

export async function listMyPosts() {
  const author_id = await currentUserId();
  const { data, error } = await supabase.from("posts").select("*")
    .eq("author_id", author_id).order("created_at", { ascending: false });
  return fail(error, data);
}

export async function listMyProducts() {
  const seller_id = await currentUserId();
  const { data, error } = await supabase.from("products").select("*")
    .eq("seller_id", seller_id).order("created_at", { ascending: false });
  return fail(error, data);
}

export async function getMyRepairerProfile() {
  const user_id = await currentUserId();
  const { data, error } = await supabase.from("repairer_profiles").select("*")
    .eq("user_id", user_id).maybeSingle();
  if (error) throw error;
  return data;
}

export async function listMyTutorials() {
  const author_id = await currentUserId();
  const { data, error } = await supabase.from("tutorials").select("*")
    .eq("author_id", author_id).order("created_at", { ascending: false });
  return fail(error, data);
}

export async function getMyProfileStats() {
  const user_id = await currentUserId();
  const [posts, saved, orders] = await Promise.all([
    supabase.from("posts").select("id", { count: "exact", head: true }).eq("author_id", user_id),
    supabase.from("saved_posts").select("post_id", { count: "exact", head: true }).eq("user_id", user_id),
    supabase.from("orders").select("id", { count: "exact", head: true }).eq("customer_id", user_id),
  ]);
  const error = posts.error || saved.error || orders.error;
  if (error) throw error;
  return { posts: posts.count || 0, saved: saved.count || 0, orders: orders.count || 0 };
}

export async function listSavedPosts() {
  const user_id = await currentUserId();
  const { data, error } = await supabase.from("saved_posts").select("post_id,created_at")
    .eq("user_id", user_id).order("created_at", { ascending: false });
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

export async function getMySettings() {
  const user_id = await currentUserId();
  const { data, error } = await supabase.from("user_settings").select("*")
    .eq("user_id", user_id).maybeSingle();
  if (error) throw error;
  return data;
}

export async function listMyOrders() {
  const customer_id = await currentUserId();
  const { data, error } = await supabase.from("orders").select("*, order_items(*)")
    .eq("customer_id", customer_id).order("created_at", { ascending: false });
  return fail(error, data);
}

export async function listMyCart() {
  const user_id = await currentUserId();
  const { data: cart, error } = await supabase.from("cart_items").select("*")
    .eq("user_id", user_id).order("created_at", { ascending: true });
  if (error) throw error;
  if (!cart?.length) return [];
  const productIds = [...new Set(cart.map(item => item.product_id))];
  const { data: products, error: productError } = await supabase.from("products")
    .select("*").in("id", productIds);
  if (productError) throw productError;
  const byId = new Map((products || []).map(product => [product.id, product]));
  return cart.map(item => ({ ...item, product: byId.get(item.product_id) ?? null }));
}

export async function addCartItem(productId: string, quantity = 1) {
  const user_id = await currentUserId();
  if (!Number.isInteger(quantity) || quantity < 1) throw new Error("Quantity must be a positive whole number.");
  const product = await getProduct(productId);
  if (!product) throw new Error("This product is unavailable.");
  if (product.stock_quantity != null && quantity > product.stock_quantity) {
    throw new Error("Requested quantity exceeds available stock.");
  }
  const { data: existing, error: lookupError } = await supabase.from("cart_items")
    .select("id,quantity").eq("user_id", user_id).eq("product_id", productId).maybeSingle();
  if (lookupError) throw lookupError;
  if (existing) {
    const nextQuantity = existing.quantity + quantity;
    if (product.stock_quantity != null && nextQuantity > product.stock_quantity) {
      throw new Error("Requested quantity exceeds available stock.");
    }
    const { data, error } = await supabase.from("cart_items").update({
      quantity: nextQuantity, updated_at: new Date().toISOString(),
    }).eq("id", existing.id).select().single();
    return fail(error, data);
  }
  const { data, error } = await supabase.from("cart_items")
    .insert({ user_id, product_id: productId, quantity }).select().single();
  return fail(error, data);
}

export async function updateCartQuantity(cartItemId: string, quantity: number) {
  const user_id = await currentUserId();
  if (!Number.isInteger(quantity) || quantity < 1) throw new Error("Quantity must be a positive whole number.");
  const { data, error } = await supabase.from("cart_items").update({
    quantity, updated_at: new Date().toISOString(),
  }).eq("id", cartItemId).eq("user_id", user_id).select().single();
  return fail(error, data);
}

export async function removeCartItem(cartItemId: string) {
  const user_id = await currentUserId();
  const { error } = await supabase.from("cart_items").delete()
    .eq("id", cartItemId).eq("user_id", user_id);
  if (error) throw error;
}

export async function checkoutCart(deliveryAddress: string, deliveryFee = 0) {
  const customer_id = await currentUserId();
  const cart = await listMyCart();
  if (!cart.length) throw new Error("Your cart is empty.");
  const unavailable = cart.find(item => !item.product?.is_active ||
    (item.product.stock_quantity != null && item.quantity > item.product.stock_quantity));
  if (unavailable) throw new Error(`${unavailable.product?.name ?? "An item"} is unavailable or out of stock.`);
  const currency = cart[0].product.currency || "GHS";
  if (cart.some(item => (item.product.currency || "GHS") !== currency)) {
    throw new Error("Cart items must use the same currency.");
  }
  const subtotal = cart.reduce((total, item) => total + Number(item.product.price) * item.quantity, 0);
  const order_number = `FX-${Date.now().toString(36).toUpperCase()}`;
  const { data: order, error: orderError } = await supabase.from("orders").insert({
    customer_id, order_number, status: "pending", subtotal, delivery_fee: deliveryFee,
    total: subtotal + deliveryFee, currency, delivery_address: deliveryAddress,
  }).select().single();
  if (orderError) throw orderError;
  const items = cart.map(item => ({
    order_id: order.id, product_id: item.product_id, product_name: item.product.name,
    unit_price: item.product.price, quantity: item.quantity,
  }));
  const { error: itemError } = await supabase.from("order_items").insert(items);
  if (itemError) {
    // Best-effort compensation for the two-table write; RLS still applies.
    await supabase.from("orders").delete().eq("id", order.id).eq("customer_id", customer_id);
    throw itemError;
  }
  const { error: cartError } = await supabase.from("cart_items").delete().eq("user_id", customer_id);
  if (cartError) throw cartError;
  return order;
}

export async function listMyConversations() {
  const user_id = await currentUserId();
  const { data: memberships, error } = await supabase.from("conversation_members")
    .select("conversation_id,last_read_at").eq("user_id", user_id);
  if (error) throw error;
  if (!memberships?.length) return [];
  const ids = memberships.map(item => item.conversation_id);
  const { data: conversations, error: conversationError } = await supabase.from("conversations")
    .select("*").in("id", ids).order("last_message_at", { ascending: false });
  if (conversationError) throw conversationError;
  return conversations || [];
}

export async function listConversationMessages(conversationId: string) {
  await currentUserId();
  const { data, error } = await supabase.from("messages").select("*")
    .eq("conversation_id", conversationId).is("deleted_at", null)
    .order("created_at", { ascending: true });
  return fail(error, data);
}

export async function sendConversationMessage(conversationId: string, body: string) {
  const sender_id = await currentUserId();
  const { data, error } = await supabase.from("messages").insert({
    conversation_id: conversationId, sender_id, body: body.trim(), message_type: "text",
  }).select().single();
  return fail(error, data);
}

export async function markConversationRead(conversationId: string) {
  const user_id = await currentUserId();
  const { error } = await supabase.from("conversation_members").update({
    last_read_at: new Date().toISOString(),
  }).eq("conversation_id", conversationId).eq("user_id", user_id);
  if (error) throw error;
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

export async function uploadMediaFromUri(
  bucket: "avatars" | "post-media" | "product-media" | "chat-media",
  path: string,
  uri: string,
  contentType: string,
) {
  const response = await fetch(uri);
  if (!response.ok) throw new Error("Unable to read the selected file.");
  const blob = await response.blob();
  return uploadMedia(bucket, path, blob, contentType);
}

export function getPublicMediaUrl(
  bucket: "avatars" | "post-media" | "product-media",
  path: string,
) {
  requireSupabaseConfig();
  return supabase.storage.from(bucket).getPublicUrl(path).data.publicUrl;
}

export async function getPrivateMediaUrl(path: string, expiresInSeconds = 60 * 60) {
  await currentUserId();
  const { data, error } = await supabase.storage.from("chat-media")
    .createSignedUrl(path, expiresInSeconds);
  if (error) throw error;
  return data.signedUrl;
}

export async function removeMedia(
  bucket: "avatars" | "post-media" | "product-media" | "chat-media",
  paths: string[],
) {
  await currentUserId();
  const { data, error } = await supabase.storage.from(bucket).remove(paths);
  return fail(error, data);
}

export function supabaseConfigured() {
  return isSupabaseConfigured;
}
