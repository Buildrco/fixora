const url = process.env.EXPO_PUBLIC_SUPABASE_URL;
const key = process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

if (!url || !key) {
  console.error("Supabase smoke test failed: Expo URL or publishable key is missing.");
  process.exit(1);
}

const endpoint = new URL("/rest/v1/products?select=id&limit=1", url);
const response = await fetch(endpoint, {
  headers: {
    apikey: key,
    Authorization: `Bearer ${key}`,
    Accept: "application/json",
  },
});

if (!response.ok) {
  console.error(`Supabase smoke test failed: products read returned HTTP ${response.status}.`);
  process.exit(1);
}

console.log("Supabase smoke test passed: publishable-key REST read from public.products succeeded.");
