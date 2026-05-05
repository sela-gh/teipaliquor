import { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  ArrowDownRight,
  ArrowUpRight,
  BarChart3,
  Banknote,
  Boxes,
  CalendarDays,
  CreditCard,
  Download,
  PackageSearch,
  RefreshCw,
  ShoppingCart,
  Target,
  TrendingUp,
  Wallet,
} from "lucide-react";
import { supabase as supabaseClient } from "../config/supabase";

const styles = `
  .ra-wrap {
    min-height: 100vh;
    background: #f5f2ff;
    color: #1a1230;
    font-family: 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  }
  .ra-topbar {
    height: 58px;
    padding: 0 28px;
    background: #fff;
    border-bottom: 1px solid rgba(120,80,200,0.12);
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: sticky;
    top: 0;
    z-index: 40;
  }
  .ra-title {
    font-family: 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
    font-size: 18px;
    font-weight: 700;
  }
  .ra-top-actions {
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .ra-content {
    padding: 22px 28px 36px;
    display: grid;
    gap: 16px;
  }
  .ra-button,
  .ra-select {
    height: 36px;
    border-radius: 8px;
    border: 1px solid rgba(120,80,200,0.16);
    background: #fff;
    color: #1a1230;
    font: inherit;
    font-size: 13px;
  }
  .ra-button {
    padding: 0 12px;
    display: inline-flex;
    align-items: center;
    gap: 7px;
    cursor: pointer;
  }
  .ra-button:hover,
  .ra-select:hover {
    border-color: #7c3aed;
  }
  .ra-button-primary {
    background: #7c3aed;
    color: #fff;
    border-color: #7c3aed;
  }
  .ra-button-primary:hover {
    background: #6d28d9;
  }
  .ra-select {
    padding: 0 34px 0 12px;
    cursor: pointer;
  }
  .ra-kpi-grid {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 14px;
  }
  .ra-card,
  .ra-panel {
    background: #fff;
    border: 1px solid rgba(120,80,200,0.12);
    border-radius: 8px;
  }
  .ra-card {
    padding: 15px 16px;
    min-height: 132px;
    display: grid;
    gap: 9px;
  }
  .ra-card-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
  }
  .ra-icon {
    width: 34px;
    height: 34px;
    border-radius: 8px;
    display: grid;
    place-items: center;
    flex: 0 0 auto;
  }
  .ra-icon.purple { background: #ede9fe; color: #6d28d9; }
  .ra-icon.green { background: #d1fae5; color: #047857; }
  .ra-icon.amber { background: #fef3c7; color: #b45309; }
  .ra-icon.blue { background: #dbeafe; color: #1d4ed8; }
  .ra-kpi-label {
    font-size: 12px;
    color: #6b5e8a;
    font-weight: 600;
  }
  .ra-kpi-value {
    font-family: 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
    font-size: 23px;
    font-weight: 800;
    color: #1a1230;
    line-height: 1.05;
  }
  .ra-kpi-foot {
    font-size: 11.5px;
    color: #6b5e8a;
    display: flex;
    align-items: center;
    gap: 5px;
  }
  .ra-kpi-foot.good { color: #047857; }
  .ra-kpi-foot.bad { color: #dc2626; }
  .ra-main-grid {
    display: grid;
    grid-template-columns: minmax(0, 1.35fr) minmax(360px, 0.65fr);
    gap: 16px;
  }
  .ra-panel {
    overflow: hidden;
  }
  .ra-panel-header {
    min-height: 48px;
    padding: 13px 16px;
    border-bottom: 1px solid rgba(120,80,200,0.12);
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
  }
  .ra-panel-title {
    font-family: 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
    font-size: 14px;
    font-weight: 700;
  }
  .ra-panel-sub {
    font-size: 11.5px;
    color: #6b5e8a;
  }
  .ra-panel-body {
    padding: 16px;
  }
  .ra-chart {
    height: 258px;
    display: grid;
    grid-template-columns: 52px 1fr;
    gap: 12px;
  }
  .ra-y-axis {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: flex-end;
    color: #9d8fba;
    font-size: 10px;
    padding-bottom: 22px;
  }
  .ra-bars {
    height: 100%;
    display: grid;
    grid-template-columns: repeat(var(--bar-count), minmax(26px, 1fr));
    align-items: end;
    gap: 8px;
    border-left: 1px solid rgba(120,80,200,0.1);
    border-bottom: 1px solid rgba(120,80,200,0.14);
    padding: 8px 0 0 10px;
  }
  .ra-bar-item {
    min-width: 0;
    height: 100%;
    display: grid;
    grid-template-rows: 1fr 18px;
    gap: 5px;
  }
  .ra-bar-stack {
    display: flex;
    align-items: end;
    gap: 3px;
    height: 100%;
  }
  .ra-bar {
    flex: 1;
    min-width: 8px;
    border-radius: 5px 5px 0 0;
    transition: opacity 0.15s;
  }
  .ra-bar:hover { opacity: 0.78; }
  .ra-bar.sales { background: #7c3aed; }
  .ra-bar.profit { background: #22d3a5; }
  .ra-bar-label {
    font-size: 10px;
    color: #6b5e8a;
    text-align: center;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .ra-legend {
    display: flex;
    align-items: center;
    gap: 14px;
    font-size: 11.5px;
    color: #6b5e8a;
  }
  .ra-dot {
    width: 8px;
    height: 8px;
    border-radius: 99px;
    display: inline-block;
    margin-right: 5px;
  }
  .ra-dot.sales { background: #7c3aed; }
  .ra-dot.profit { background: #22d3a5; }
  .ra-split-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 16px;
  }
  .ra-table {
    width: 100%;
    border-collapse: collapse;
  }
  .ra-table th {
    text-align: left;
    font-size: 10.5px;
    color: #6b5e8a;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    background: #faf8ff;
    padding: 10px 12px;
    border-bottom: 1px solid rgba(120,80,200,0.12);
  }
  .ra-table td {
    padding: 11px 12px;
    border-bottom: 1px solid rgba(120,80,200,0.1);
    font-size: 12.5px;
    vertical-align: middle;
  }
  .ra-table tr:last-child td {
    border-bottom: none;
  }
  .ra-name {
    font-weight: 700;
    color: #1a1230;
  }
  .ra-muted {
    color: #6b5e8a;
  }
  .ra-progress {
    height: 7px;
    border-radius: 99px;
    background: #ede9fe;
    overflow: hidden;
    min-width: 88px;
  }
  .ra-progress span {
    display: block;
    height: 100%;
    border-radius: inherit;
    background: #7c3aed;
  }
  .ra-progress.green span { background: #22d3a5; }
  .ra-progress.amber span { background: #f59e0b; }
  .ra-payment-list,
  .ra-risk-list {
    display: grid;
    gap: 10px;
  }
  .ra-payment-row,
  .ra-risk-row {
    display: grid;
    grid-template-columns: 34px 1fr auto;
    align-items: center;
    gap: 10px;
    padding: 10px;
    background: #faf8ff;
    border: 1px solid rgba(120,80,200,0.1);
    border-radius: 8px;
  }
  .ra-payment-main,
  .ra-risk-main {
    display: grid;
    gap: 4px;
    min-width: 0;
  }
  .ra-payment-name,
  .ra-risk-name {
    font-size: 13px;
    font-weight: 700;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .ra-payment-meta,
  .ra-risk-meta {
    font-size: 11.5px;
    color: #6b5e8a;
  }
  .ra-amount {
    font-family: 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
    font-weight: 800;
    white-space: nowrap;
  }
  .ra-alert {
    padding: 13px 14px;
    border-radius: 8px;
    border: 1px solid #fed7aa;
    background: #fff7ed;
    color: #9a3412;
    font-size: 12.5px;
    display: flex;
    align-items: center;
    gap: 9px;
  }
  .ra-state {
    padding: 70px 24px;
    text-align: center;
    color: #6b5e8a;
  }
  .ra-state-title {
    font-family: 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
    color: #1a1230;
    font-weight: 800;
    margin-bottom: 8px;
  }
  .ra-spinner {
    width: 22px;
    height: 22px;
    border: 2px solid #ede9fe;
    border-top-color: #7c3aed;
    border-radius: 50%;
    animation: ra-spin 0.85s linear infinite;
    margin: 0 auto 10px;
  }
  @keyframes ra-spin { to { transform: rotate(360deg); } }
  @media (max-width: 1180px) {
    .ra-kpi-grid,
    .ra-split-grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
    .ra-main-grid {
      grid-template-columns: 1fr;
    }
  }
  @media (max-width: 760px) {
    .ra-topbar {
      height: auto;
      padding: 14px 16px;
      align-items: flex-start;
      gap: 12px;
      flex-direction: column;
    }
    .ra-top-actions {
      width: 100%;
      flex-wrap: wrap;
    }
    .ra-content {
      padding: 16px;
    }
    .ra-kpi-grid,
    .ra-split-grid {
      grid-template-columns: 1fr;
    }
    .ra-card {
      min-height: 116px;
    }
    .ra-button,
    .ra-select {
      min-height: 40px;
      flex: 1 1 160px;
    }
    .ra-chart {
      grid-template-columns: 38px 1fr;
      overflow-x: auto;
    }
    .ra-bars {
      min-width: 520px;
    }
    .ra-panel {
      border-radius: 8px;
    }
    .ra-panel-header {
      align-items: flex-start;
      flex-direction: column;
    }
    .ra-legend {
      flex-wrap: wrap;
    }
    .ra-table {
      min-width: 680px;
    }
    .ra-panel:has(.ra-table) {
      overflow-x: auto;
    }
    .ra-payment-row,
    .ra-risk-row {
      grid-template-columns: 34px minmax(0, 1fr);
      align-items: flex-start;
    }
    .ra-payment-row .ra-amount,
    .ra-risk-row .ra-amount {
      grid-column: 2;
      justify-self: start;
    }
  }
`;

const fmt = (n) => `KES ${Number(n || 0).toLocaleString("en-KE", { maximumFractionDigits: 0 })}`;
const pct = (n) => `${Number(n || 0).toFixed(1)}%`;
const dayKey = (iso) => new Date(iso).toISOString().slice(0, 10);
const dayLabel = (key) => new Date(`${key}T12:00:00`).toLocaleDateString("en-KE", { day: "2-digit", month: "short" });
const methodLabel = (method) => {
  if (!method) return "Unknown";
  if (method.toLowerCase() === "mpesa") return "M-Pesa";
  return method.charAt(0).toUpperCase() + method.slice(1);
};

const SALES_SELECT = `
  id,
  total_amount,
  amount_paid,
  tax_total,
  discount_value,
  payment_status,
  status,
  created_at,
  sale_items(
    id,
    product_id,
    quantity,
    price,
    cost_price,
    products(name, categories(name))
  ),
  payments(id, amount, method, created_at)
`;

const PURCHASES_SELECT = `
  id,
  supplier_id,
  total_amount,
  created_at,
  suppliers(name),
  purchase_items(
    id,
    product_id,
    quantity,
    cost_price,
    products(name, categories(name))
  )
`;

async function loadReportData() {
  const [salesRes, purchasesRes, productsRes, mpesaRes] = await Promise.all([
    supabaseClient.from("sales").select(SALES_SELECT).order("created_at", { ascending: false }),
    supabaseClient.from("purchases").select(PURCHASES_SELECT).order("created_at", { ascending: false }),
    supabaseClient.from("products").select("id, name, price, stock_quantity, categories(name)").order("name", { ascending: true }),
    supabaseClient.from("mpesa_transactions").select("id, amount, allocated, transaction_time").order("transaction_time", { ascending: false }),
  ]);

  const errors = [salesRes.error, purchasesRes.error, productsRes.error, mpesaRes.error].filter(Boolean);
  if (errors.length) throw errors[0];

  return {
    sales: salesRes.data || [],
    purchases: purchasesRes.data || [],
    products: productsRes.data || [],
    mpesa: mpesaRes.data || [],
  };
}

function withinRange(row, range) {
  if (range === "all") return true;
  const days = range === "today" ? 1 : Number(range);
  const created = new Date(row.created_at || row.transaction_time);
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  start.setDate(start.getDate() - (days - 1));
  return created >= start;
}

function buildAnalytics(raw, range) {
  const sales = raw.sales.filter((s) => withinRange(s, range));
  const purchases = raw.purchases.filter((p) => withinRange(p, range));
  const mpesa = raw.mpesa.filter((m) => withinRange({ transaction_time: m.transaction_time }, range));

  const productMeta = new Map(raw.products.map((p) => [p.id, {
    name: p.name,
    category: p.categories?.name || "Uncategorized",
    price: Number(p.price || 0),
    stock: Number(p.stock_quantity || 0),
  }]));

  const revenue = sales.reduce((sum, s) => sum + Number(s.total_amount || 0), 0);
  const paid = sales.reduce((sum, s) => sum + Number(s.amount_paid || 0), 0);
  const receivables = sales.reduce((sum, s) => sum + Math.max(0, Number(s.total_amount || 0) - Number(s.amount_paid || 0)), 0);
  const purchaseSpend = purchases.reduce((sum, p) => sum + Number(p.total_amount || 0), 0);
  const unitsSold = sales.reduce((sum, s) => sum + (s.sale_items || []).reduce((n, i) => n + Number(i.quantity || 0), 0), 0);
  const grossProfit = sales.reduce((sum, s) => sum + (s.sale_items || []).reduce((n, i) => {
    const qty = Number(i.quantity || 0);
    const price = Number(i.price || 0);
    const cost = i.cost_price == null ? 0 : Number(i.cost_price);
    return n + (price - cost) * qty;
  }, 0), 0);

  const productRows = new Map();
  const categoryRows = new Map();
  sales.forEach((sale) => {
    (sale.sale_items || []).forEach((item) => {
      const meta = productMeta.get(item.product_id) || {};
      const name = item.products?.name || meta.name || "Unnamed product";
      const category = item.products?.categories?.name || meta.category || "Uncategorized";
      const qty = Number(item.quantity || 0);
      const lineRevenue = Number(item.price || 0) * qty;
      const lineProfit = (Number(item.price || 0) - Number(item.cost_price || 0)) * qty;
      const current = productRows.get(item.product_id) || { id: item.product_id, name, category, units: 0, revenue: 0, profit: 0 };
      current.units += qty;
      current.revenue += lineRevenue;
      current.profit += lineProfit;
      productRows.set(item.product_id, current);

      const cat = categoryRows.get(category) || { name: category, revenue: 0, units: 0 };
      cat.revenue += lineRevenue;
      cat.units += qty;
      categoryRows.set(category, cat);
    });
  });

  const supplierRows = new Map();
  purchases.forEach((purchase) => {
    const name = purchase.suppliers?.name || "Unknown supplier";
    const current = supplierRows.get(purchase.supplier_id) || { id: purchase.supplier_id, name, spend: 0, orders: 0, units: 0 };
    current.spend += Number(purchase.total_amount || 0);
    current.orders += 1;
    current.units += (purchase.purchase_items || []).reduce((sum, item) => sum + Number(item.quantity || 0), 0);
    supplierRows.set(purchase.supplier_id, current);
  });

  const paymentRows = new Map();
  sales.forEach((sale) => {
    (sale.payments || []).forEach((payment) => {
      const method = methodLabel(payment.method);
      const current = paymentRows.get(method) || { method, amount: 0, count: 0 };
      current.amount += Number(payment.amount || 0);
      current.count += 1;
      paymentRows.set(method, current);
    });
  });

  const dailyRows = new Map();
  sales.forEach((sale) => {
    const key = dayKey(sale.created_at);
    const current = dailyRows.get(key) || { key, sales: 0, profit: 0, orders: 0 };
    current.sales += Number(sale.total_amount || 0);
    current.orders += 1;
    current.profit += (sale.sale_items || []).reduce((sum, item) => {
      return sum + (Number(item.price || 0) - Number(item.cost_price || 0)) * Number(item.quantity || 0);
    }, 0);
    dailyRows.set(key, current);
  });

  const inventoryValue = raw.products.reduce((sum, p) => sum + Number(p.price || 0) * Number(p.stock_quantity || 0), 0);
  const lowStock = raw.products
    .map((p) => ({
      id: p.id,
      name: p.name,
      category: p.categories?.name || "Uncategorized",
      stock: Number(p.stock_quantity || 0),
      value: Number(p.price || 0) * Number(p.stock_quantity || 0),
    }))
    .filter((p) => p.stock <= 10)
    .sort((a, b) => a.stock - b.stock || b.value - a.value);

  const unallocatedMpesa = mpesa.filter((m) => !m.allocated).reduce((sum, m) => sum + Number(m.amount || 0), 0);
  const paymentTotal = [...paymentRows.values()].reduce((sum, row) => sum + row.amount, 0);
  const daily = [...dailyRows.values()].sort((a, b) => a.key.localeCompare(b.key)).slice(-14);
  const topProducts = [...productRows.values()].sort((a, b) => b.revenue - a.revenue).slice(0, 8);
  const topCategories = [...categoryRows.values()].sort((a, b) => b.revenue - a.revenue).slice(0, 6);
  const topSuppliers = [...supplierRows.values()].sort((a, b) => b.spend - a.spend).slice(0, 6);
  const paymentMix = [...paymentRows.values()].sort((a, b) => b.amount - a.amount);
  const avgBasket = sales.length ? revenue / sales.length : 0;
  const margin = revenue ? (grossProfit / revenue) * 100 : 0;

  return {
    sales,
    purchases,
    revenue,
    paid,
    receivables,
    purchaseSpend,
    unitsSold,
    grossProfit,
    margin,
    avgBasket,
    inventoryValue,
    lowStock,
    unallocatedMpesa,
    paymentTotal,
    daily,
    topProducts,
    topCategories,
    topSuppliers,
    paymentMix,
  };
}

function KpiCard({ label, value, foot, tone, icon: Icon, trend = "up" }) {
  return (
    <div className="ra-card">
      <div className="ra-card-head">
        <div className={`ra-icon ${tone}`}><Icon size={18} /></div>
        {trend === "down" ? <ArrowDownRight size={17} color="#dc2626" /> : <ArrowUpRight size={17} color="#047857" />}
      </div>
      <div className="ra-kpi-label">{label}</div>
      <div className="ra-kpi-value">{value}</div>
      <div className={`ra-kpi-foot ${trend === "down" ? "bad" : "good"}`}>{foot}</div>
    </div>
  );
}

function RevenueChart({ rows }) {
  const max = Math.max(...rows.map((r) => Math.max(r.sales, r.profit)), 1);
  return (
    <div className="ra-chart">
      <div className="ra-y-axis">
        <span>{fmt(max)}</span>
        <span>{fmt(max / 2)}</span>
        <span>KES 0</span>
      </div>
      <div className="ra-bars" style={{ "--bar-count": Math.max(rows.length, 1) }}>
        {rows.length === 0 ? (
          <div className="ra-state" style={{ gridColumn: "1 / -1", padding: 30 }}>No sales in this period</div>
        ) : rows.map((row) => (
          <div className="ra-bar-item" key={row.key} title={`${dayLabel(row.key)}: ${fmt(row.sales)}`}>
            <div className="ra-bar-stack">
              <div className="ra-bar sales" style={{ height: `${Math.max(3, (row.sales / max) * 100)}%` }} />
              <div className="ra-bar profit" style={{ height: `${Math.max(3, (row.profit / max) * 100)}%` }} />
            </div>
            <div className="ra-bar-label">{dayLabel(row.key)}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function RankedTable({ rows, columns, empty }) {
  if (!rows.length) return <div className="ra-state">{empty}</div>;
  return (
    <table className="ra-table">
      <thead>
        <tr>{columns.map((c) => <th key={c.key} style={c.style}>{c.label}</th>)}</tr>
      </thead>
      <tbody>
        {rows.map((row, idx) => (
          <tr key={row.id || row.name || row.method}>
            {columns.map((column) => (
              <td key={column.key} style={column.style}>{column.render(row, idx)}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default function Reports() {
  const [range, setRange] = useState("30");
  const [raw, setRaw] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = async (isSilent = false) => {
    if (!isSilent) setLoading(true);
    setError("");
    try {
      setRaw(await loadReportData());
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to load reports.");
    } finally {
      if (!isSilent) setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const analytics = useMemo(() => raw ? buildAnalytics(raw, range) : null, [raw, range]);
  const periodLabel = range === "all" ? "All time" : range === "today" ? "Today" : `Last ${range} days`;
  const maxProductRevenue = Math.max(...(analytics?.topProducts || []).map((p) => p.revenue), 1);
  const maxCategoryRevenue = Math.max(...(analytics?.topCategories || []).map((c) => c.revenue), 1);

  const exportCsv = () => {
    if (!analytics) return;
    const rows = [
      ["Metric", "Value"],
      ["Period", periodLabel],
      ["Revenue", analytics.revenue],
      ["Gross profit", analytics.grossProfit],
      ["Margin", analytics.margin.toFixed(2)],
      ["Average basket", analytics.avgBasket.toFixed(2)],
      ["Receivables", analytics.receivables],
      ["Purchase spend", analytics.purchaseSpend],
      ["Inventory value", analytics.inventoryValue],
      ["Low stock items", analytics.lowStock.length],
      ["Unallocated M-Pesa", analytics.unallocatedMpesa],
    ];
    const csv = rows.map((row) => row.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `spiritspos-report-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <style>{styles}</style>
      <div className="ra-wrap">
        <div className="ra-topbar">
          <div className="ra-title">Reports & Analytics</div>
          <div className="ra-top-actions">
            <select className="ra-select" value={range} onChange={(e) => setRange(e.target.value)} aria-label="Report period">
              <option value="today">Today</option>
              <option value="7">Last 7 days</option>
              <option value="30">Last 30 days</option>
              <option value="90">Last 90 days</option>
              <option value="all">All time</option>
            </select>
            <button className="ra-button" onClick={() => load(true)}><RefreshCw size={15} /> Refresh</button>
            <button className="ra-button ra-button-primary" onClick={exportCsv}><Download size={15} /> Export</button>
          </div>
        </div>

        <div className="ra-content">
          {loading ? (
            <div className="ra-panel ra-state">
              <div className="ra-spinner" />
              <div className="ra-state-title">Loading analytics</div>
              <div>Pulling sales, purchases, inventory, and payments.</div>
            </div>
          ) : error ? (
            <div className="ra-panel ra-state">
              <div className="ra-state-title">Reports could not load</div>
              <div style={{ marginBottom: 14 }}>{error}</div>
              <button className="ra-button ra-button-primary" onClick={load}>Retry</button>
            </div>
          ) : analytics && (
            <>
              {analytics.unallocatedMpesa > 0 && (
                <div className="ra-alert">
                  <AlertTriangle size={17} />
                  <span>{fmt(analytics.unallocatedMpesa)} in M-Pesa payments is still unallocated for {periodLabel.toLowerCase()}.</span>
                </div>
              )}

              <div className="ra-kpi-grid">
                <KpiCard label="Net sales" value={fmt(analytics.revenue)} foot={`${analytics.sales.length} completed orders`} tone="purple" icon={TrendingUp} />
                <KpiCard label="Gross profit" value={fmt(analytics.grossProfit)} foot={`${pct(analytics.margin)} margin`} tone="green" icon={Target} />
                <KpiCard label="Receivables" value={fmt(analytics.receivables)} foot="Pending and partial sales" tone="amber" icon={Wallet} trend={analytics.receivables > 0 ? "down" : "up"} />
                <KpiCard label="Inventory value" value={fmt(analytics.inventoryValue)} foot={`${analytics.lowStock.length} low stock alerts`} tone="blue" icon={Boxes} trend={analytics.lowStock.length ? "down" : "up"} />
              </div>

              <div className="ra-main-grid">
                <div className="ra-panel">
                  <div className="ra-panel-header">
                    <div>
                      <div className="ra-panel-title">Revenue & Profit Trend</div>
                      <div className="ra-panel-sub">{periodLabel} by sales date</div>
                    </div>
                    <div className="ra-legend">
                      <span><span className="ra-dot sales" />Sales</span>
                      <span><span className="ra-dot profit" />Profit</span>
                    </div>
                  </div>
                  <div className="ra-panel-body">
                    <RevenueChart rows={analytics.daily} />
                  </div>
                </div>

                <div className="ra-panel">
                  <div className="ra-panel-header">
                    <div>
                      <div className="ra-panel-title">Executive Snapshot</div>
                      <div className="ra-panel-sub">{periodLabel}</div>
                    </div>
                    <CalendarDays size={17} color="#7c3aed" />
                  </div>
                  <div className="ra-panel-body ra-payment-list">
                    <div className="ra-payment-row">
                      <div className="ra-icon purple"><ShoppingCart size={17} /></div>
                      <div className="ra-payment-main">
                        <div className="ra-payment-name">Average basket</div>
                        <div className="ra-payment-meta">{analytics.unitsSold.toLocaleString()} units sold</div>
                      </div>
                      <div className="ra-amount">{fmt(analytics.avgBasket)}</div>
                    </div>
                    <div className="ra-payment-row">
                      <div className="ra-icon green"><Banknote size={17} /></div>
                      <div className="ra-payment-main">
                        <div className="ra-payment-name">Cash collected</div>
                        <div className="ra-payment-meta">Recorded sale payments</div>
                      </div>
                      <div className="ra-amount">{fmt(analytics.paid)}</div>
                    </div>
                    <div className="ra-payment-row">
                      <div className="ra-icon amber"><PackageSearch size={17} /></div>
                      <div className="ra-payment-main">
                        <div className="ra-payment-name">Purchasing spend</div>
                        <div className="ra-payment-meta">{analytics.purchases.length} purchase orders</div>
                      </div>
                      <div className="ra-amount">{fmt(analytics.purchaseSpend)}</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="ra-split-grid">
                <div className="ra-panel">
                  <div className="ra-panel-header">
                    <div>
                      <div className="ra-panel-title">Top Products</div>
                      <div className="ra-panel-sub">Revenue, units, and margin contribution</div>
                    </div>
                    <BarChart3 size={17} color="#7c3aed" />
                  </div>
                  <RankedTable
                    rows={analytics.topProducts}
                    empty="No product sales in this period."
                    columns={[
                      { key: "product", label: "Product", render: (row) => <><div className="ra-name">{row.name}</div><div className="ra-muted">{row.category}</div></> },
                      { key: "units", label: "Units", style: { textAlign: "right" }, render: (row) => row.units.toLocaleString() },
                      { key: "revenue", label: "Revenue", style: { textAlign: "right" }, render: (row) => fmt(row.revenue) },
                      { key: "share", label: "Share", render: (row) => <div className="ra-progress"><span style={{ width: `${Math.max(3, (row.revenue / maxProductRevenue) * 100)}%` }} /></div> },
                    ]}
                  />
                </div>

                <div className="ra-panel">
                  <div className="ra-panel-header">
                    <div>
                      <div className="ra-panel-title">Category Mix</div>
                      <div className="ra-panel-sub">Which shelves are carrying revenue</div>
                    </div>
                    <TrendingUp size={17} color="#22d3a5" />
                  </div>
                  <RankedTable
                    rows={analytics.topCategories}
                    empty="No category performance yet."
                    columns={[
                      { key: "name", label: "Category", render: (row) => <div className="ra-name">{row.name}</div> },
                      { key: "units", label: "Units", style: { textAlign: "right" }, render: (row) => row.units.toLocaleString() },
                      { key: "revenue", label: "Revenue", style: { textAlign: "right" }, render: (row) => fmt(row.revenue) },
                      { key: "share", label: "Share", render: (row) => <div className="ra-progress green"><span style={{ width: `${Math.max(3, (row.revenue / maxCategoryRevenue) * 100)}%` }} /></div> },
                    ]}
                  />
                </div>
              </div>

              <div className="ra-split-grid">
                <div className="ra-panel">
                  <div className="ra-panel-header">
                    <div>
                      <div className="ra-panel-title">Payment Mix</div>
                      <div className="ra-panel-sub">Collected channels and transaction counts</div>
                    </div>
                    <CreditCard size={17} color="#7c3aed" />
                  </div>
                  <div className="ra-panel-body ra-payment-list">
                    {analytics.paymentMix.length === 0 ? (
                      <div className="ra-state">No payments recorded in this period.</div>
                    ) : analytics.paymentMix.map((row) => (
                      <div className="ra-payment-row" key={row.method}>
                        <div className={`ra-icon ${row.method === "M-Pesa" ? "green" : "purple"}`}>
                          {row.method === "M-Pesa" ? <Wallet size={17} /> : <Banknote size={17} />}
                        </div>
                        <div className="ra-payment-main">
                          <div className="ra-payment-name">{row.method}</div>
                          <div className="ra-payment-meta">{row.count} payment{row.count === 1 ? "" : "s"} · {pct(analytics.paymentTotal ? (row.amount / analytics.paymentTotal) * 100 : 0)}</div>
                        </div>
                        <div className="ra-amount">{fmt(row.amount)}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="ra-panel">
                  <div className="ra-panel-header">
                    <div>
                      <div className="ra-panel-title">Inventory Risk</div>
                      <div className="ra-panel-sub">Items at or below 10 units</div>
                    </div>
                    <AlertTriangle size={17} color="#d97706" />
                  </div>
                  <div className="ra-panel-body ra-risk-list">
                    {analytics.lowStock.length === 0 ? (
                      <div className="ra-state">No low-stock products right now.</div>
                    ) : analytics.lowStock.slice(0, 8).map((row) => (
                      <div className="ra-risk-row" key={row.id}>
                        <div className="ra-icon amber"><Boxes size={17} /></div>
                        <div className="ra-risk-main">
                          <div className="ra-risk-name">{row.name}</div>
                          <div className="ra-risk-meta">{row.category} · inventory value {fmt(row.value)}</div>
                        </div>
                        <div className="ra-amount">{row.stock}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="ra-panel">
                <div className="ra-panel-header">
                  <div>
                    <div className="ra-panel-title">Supplier Spend</div>
                    <div className="ra-panel-sub">Purchase concentration and units received</div>
                  </div>
                  <PackageSearch size={17} color="#7c3aed" />
                </div>
                <RankedTable
                  rows={analytics.topSuppliers}
                  empty="No supplier purchases in this period."
                  columns={[
                    { key: "supplier", label: "Supplier", render: (row) => <div className="ra-name">{row.name}</div> },
                    { key: "orders", label: "Orders", style: { textAlign: "right" }, render: (row) => row.orders.toLocaleString() },
                    { key: "units", label: "Units Received", style: { textAlign: "right" }, render: (row) => row.units.toLocaleString() },
                    { key: "spend", label: "Spend", style: { textAlign: "right" }, render: (row) => fmt(row.spend) },
                  ]}
                />
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}

