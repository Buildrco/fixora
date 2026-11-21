import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { colors, radius } from "../../constants/theme";
import { DetailSection, ProfileDetailShell, detailStyles } from "../../components/ProfileDetailShell";
import { listMyOrders } from "../../data/fixoraRepository";

type Order = { id: string; order_number?: string; status?: string; created_at?: string; total?: number | string; currency?: string; delivery_address?: string; order_items?: Array<{ product_name?: string; quantity?: number }> };

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => {
    let active = true;
    listMyOrders().then(rows => { if (active) setOrders(rows as Order[]); })
      .catch(reason => { if (active) setError(reason instanceof Error ? reason.message : "Could not load your orders."); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);
  const formatPrice = (amount: number, currency = "GHS") => {
    try { return new Intl.NumberFormat("en-GH", { style: "currency", currency }).format(amount); }
    catch { return `${currency} ${amount.toLocaleString()}`; }
  };
  return <ProfileDetailShell title="Orders" eyebrow="YOUR ORDER HISTORY" subtitle="Keep track of your purchases and delivery status in one place.">
    <DetailSection title="Recent orders" action={`${orders.length} total`}>
      {loading ? <ActivityIndicator color={colors.blue} style={{ padding: 24 }} /> : null}
      {error ? <Text style={s.issue}>{error}</Text> : null}
      {orders.map(order => {
        const items = order.order_items || [];
        const itemSummary = items.map(item => `${item.quantity || 1} × ${item.product_name || "Product"}`).join(", ");
        const completed = String(order.status || "").toLowerCase() === "completed";
        return <View key={order.id} style={s.card}><View style={s.copy}>
          <View style={s.row}><Text style={s.name}>{order.order_number || "Order"}</Text><Ionicons name="receipt-outline" size={17} color={colors.muted} /></View>
          <Text style={s.issue}>{itemSummary || "Order details unavailable"}</Text>
          <Text style={s.date}>{order.created_at ? new Date(order.created_at).toLocaleString() : "Date unavailable"}</Text>
          {order.delivery_address ? <Text style={s.date}>{order.delivery_address}</Text> : null}
          <View style={s.status}><View style={[s.dot, completed && s.done]} /><Text style={s.statusText}>{order.status || "Pending"}</Text><Text style={s.total}>{formatPrice(Number(order.total || 0), order.currency || "GHS")}</Text></View>
        </View></View>;
      })}
    </DetailSection>
    {!loading && !error && orders.length === 0 ? <View style={detailStyles.empty}><Text style={detailStyles.emptyEmoji}>🧾</Text><Text style={detailStyles.emptyTitle}>No orders yet</Text><Text style={detailStyles.emptyCopy}>Your shop purchases will appear here.</Text></View> : null}
  </ProfileDetailShell>;
}

const s = StyleSheet.create({ card: { borderWidth: 1, borderColor: colors.line, borderRadius: radius.lg, overflow: "hidden", marginBottom: 12, backgroundColor: colors.card }, copy: { padding: 13 }, row: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" }, name: { color: colors.ink, fontSize: 15, fontWeight: "800" }, issue: { color: colors.muted, fontSize: 13, marginTop: 4 }, date: { color: colors.muted, fontSize: 11, marginTop: 9 }, status: { flexDirection: "row", alignItems: "center", gap: 6, marginTop: 11 }, dot: { width: 7, height: 7, borderRadius: 4, backgroundColor: colors.accent }, done: { backgroundColor: colors.green }, statusText: { color: colors.ink, fontSize: 12, fontWeight: "700", flex: 1 }, total: { color: colors.ink, fontSize: 12, fontWeight: "800" } });