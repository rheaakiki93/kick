import { useEffect, useMemo, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, LogOut, RefreshCw } from "lucide-react";

type Order = {
  id: string;
  created_at: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  cap: string;
  notes: string | null;
  pack_label: string;
  amount: number;
  currency: string;
  status: string;
};

type PageView = { path: string; visitor_id: string | null; created_at: string };

const eur = (n: number) => `€${n.toFixed(2)}`;
const fmtDate = (s: string) =>
  new Date(s).toLocaleString("it-IT", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" });

/* ---------------- Login gate ---------------- */

const LoginForm = ({ onSignedIn }: { onSignedIn: () => void }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    setLoading(false);
    if (error) {
      setError(error.message);
      return;
    }
    onSignedIn();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-950 text-neutral-100 px-4">
      <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4">
        <div>
          <h1 className="text-2xl font-bold">Kick Analytics</h1>
          <p className="text-neutral-400 text-sm mt-1">Private dashboard — sign in to continue.</p>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="email" className="text-neutral-300">Email</Label>
          <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)}
            className="bg-neutral-900 border-neutral-700 text-neutral-100" autoFocus />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="password" className="text-neutral-300">Password</Label>
          <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)}
            className="bg-neutral-900 border-neutral-700 text-neutral-100" />
        </div>
        {error && <p className="text-sm text-red-400">{error}</p>}
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Sign in"}
        </Button>
      </form>
    </div>
  );
};

/* ---------------- Dashboard ---------------- */

const Metric = ({ label, value }: { label: string; value: string | number }) => (
  <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-5">
    <p className="text-neutral-400 text-xs uppercase tracking-wide">{label}</p>
    <p className="text-3xl font-bold mt-1">{value}</p>
  </div>
);

const Dashboard = ({ onSignOut }: { onSignOut: () => void }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [views, setViews] = useState<PageView[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    const [o, v] = await Promise.all([
      supabase.from("orders").select("*").order("created_at", { ascending: false }),
      supabase.from("page_views").select("path, visitor_id, created_at"),
    ]);
    if (o.error || v.error) {
      setError(o.error?.message || v.error?.message || "Failed to load data");
    } else {
      setOrders((o.data as Order[]) ?? []);
      setViews((v.data as PageView[]) ?? []);
    }
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const markPaid = async (id: string) => {
    const prev = orders;
    setOrders((os) => os.map((o) => (o.id === id ? { ...o, status: "paid" } : o)));
    const { error } = await supabase.from("orders").update({ status: "paid" }).eq("id", id);
    if (error) {
      setOrders(prev);
      setError(error.message);
    }
  };

  const paidOrders = useMemo(() => orders.filter((o) => o.status === "paid"), [orders]);
  const totalRevenue = useMemo(() => paidOrders.reduce((s, o) => s + Number(o.amount), 0), [paidOrders]);
  const uniqueVisitors = useMemo(
    () => new Set(views.map((v) => v.visitor_id).filter(Boolean)).size,
    [views]
  );

  const viewsByPath = useMemo(() => {
    const map = new Map<string, { views: number; visitors: Set<string> }>();
    for (const v of views) {
      const e = map.get(v.path) ?? { views: 0, visitors: new Set<string>() };
      e.views += 1;
      if (v.visitor_id) e.visitors.add(v.visitor_id);
      map.set(v.path, e);
    }
    return [...map.entries()]
      .map(([path, e]) => ({ path, views: e.views, visitors: e.visitors.size }))
      .sort((a, b) => b.views - a.views);
  }, [views]);

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 px-4 sm:px-8 py-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <header className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Kick Analytics</h1>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={load} disabled={loading}
              className="border-neutral-700 bg-transparent text-neutral-200 hover:bg-neutral-900">
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            </Button>
            <Button variant="outline" size="sm" onClick={onSignOut}
              className="border-neutral-700 bg-transparent text-neutral-200 hover:bg-neutral-900">
              <LogOut className="w-4 h-4 mr-1" /> Sign out
            </Button>
          </div>
        </header>

        {error && <p className="text-red-400">{error}</p>}
        {loading && orders.length === 0 && views.length === 0 ? (
          <div className="flex items-center gap-2 text-neutral-400"><Loader2 className="w-4 h-4 animate-spin" /> Loading…</div>
        ) : (
          <>
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
              <Metric label="Total page views" value={views.length} />
              <Metric label="Unique visitors" value={uniqueVisitors} />
              <Metric label="Orders" value={orders.length} />
              <Metric label="Paid orders" value={paidOrders.length} />
              <Metric label="Paid revenue" value={eur(totalRevenue)} />
            </div>

            {/* Views per page */}
            <section>
              <h2 className="text-lg font-semibold mb-3">Views per page</h2>
              <div className="overflow-x-auto rounded-lg border border-neutral-800">
                <table className="w-full text-sm">
                  <thead className="bg-neutral-900 text-neutral-400 text-left">
                    <tr>
                      <th className="px-4 py-2 font-medium">Page</th>
                      <th className="px-4 py-2 font-medium text-right">Views</th>
                      <th className="px-4 py-2 font-medium text-right">Unique visitors</th>
                    </tr>
                  </thead>
                  <tbody>
                    {viewsByPath.length === 0 ? (
                      <tr><td colSpan={3} className="px-4 py-6 text-neutral-500 text-center">No views yet.</td></tr>
                    ) : viewsByPath.map((r) => (
                      <tr key={r.path} className="border-t border-neutral-800">
                        <td className="px-4 py-2 font-mono">{r.path}</td>
                        <td className="px-4 py-2 text-right">{r.views}</td>
                        <td className="px-4 py-2 text-right">{r.visitors}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {/* Orders */}
            <section>
              <h2 className="text-lg font-semibold mb-1">Orders</h2>
              <p className="text-neutral-500 text-xs mb-3">
                An order is saved when a customer submits the checkout form and is sent to Revolut — it starts as "Pending" and does not mean they paid.
                Check the Revolut Business app for a matching transaction, then click "mark paid" here. Only paid orders count toward paid revenue.
              </p>
              <div className="overflow-x-auto rounded-lg border border-neutral-800">
                <table className="w-full text-sm whitespace-nowrap">
                  <thead className="bg-neutral-900 text-neutral-400 text-left">
                    <tr>
                      <th className="px-4 py-2 font-medium">Status</th>
                      <th className="px-4 py-2 font-medium">Date</th>
                      <th className="px-4 py-2 font-medium">Pack</th>
                      <th className="px-4 py-2 font-medium text-right">Amount</th>
                      <th className="px-4 py-2 font-medium">Name</th>
                      <th className="px-4 py-2 font-medium">Email</th>
                      <th className="px-4 py-2 font-medium">Phone</th>
                      <th className="px-4 py-2 font-medium">Address</th>
                      <th className="px-4 py-2 font-medium">CAP</th>
                      <th className="px-4 py-2 font-medium">Notes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.length === 0 ? (
                      <tr><td colSpan={10} className="px-4 py-6 text-neutral-500 text-center">No orders yet.</td></tr>
                    ) : orders.map((o) => (
                      <tr key={o.id} className="border-t border-neutral-800">
                        <td className="px-4 py-2">
                          {o.status === "paid" ? (
                            <span className="inline-flex items-center rounded-full bg-emerald-900/40 text-emerald-400 text-xs px-2 py-1">Paid</span>
                          ) : (
                            <button
                              onClick={() => markPaid(o.id)}
                              className="inline-flex items-center rounded-full bg-amber-900/40 text-amber-400 text-xs px-2 py-1 hover:bg-amber-900/70 transition-colors"
                              title="Confirm in Revolut first, then click to mark paid"
                            >
                              Pending — mark paid
                            </button>
                          )}
                        </td>
                        <td className="px-4 py-2 text-neutral-400">{fmtDate(o.created_at)}</td>
                        <td className="px-4 py-2">{o.pack_label}</td>
                        <td className="px-4 py-2 text-right">{eur(Number(o.amount))}</td>
                        <td className="px-4 py-2">{o.name}</td>
                        <td className="px-4 py-2">{o.email}</td>
                        <td className="px-4 py-2">{o.phone}</td>
                        <td className="px-4 py-2 whitespace-normal max-w-xs">{o.address}, {o.city}</td>
                        <td className="px-4 py-2">{o.cap}</td>
                        <td className="px-4 py-2 whitespace-normal max-w-xs text-neutral-400">{o.notes || "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </>
        )}
      </div>
    </div>
  );
};

/* ---------------- Route entry ---------------- */

const Analytics = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Keep search engines out of the private dashboard.
    const meta = document.createElement("meta");
    meta.name = "robots";
    meta.content = "noindex, nofollow";
    document.head.appendChild(meta);

    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setReady(true);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => {
      sub.subscription.unsubscribe();
      document.head.removeChild(meta);
    };
  }, []);

  if (!ready) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-950 text-neutral-400">
        <Loader2 className="w-5 h-5 animate-spin" />
      </div>
    );
  }

  if (!session) return <LoginForm onSignedIn={() => { /* onAuthStateChange updates session */ }} />;

  return <Dashboard onSignOut={() => supabase.auth.signOut()} />;
};

export default Analytics;
