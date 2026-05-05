import { useEffect, useMemo, useState } from "react";
import Sales from "./sales";
import Purchases from "./purchases";
import Products from "./products";
import Reports from "./reports";
import { supabase as supabaseClient } from "../config/supabase";

const styles = `
  * { margin: 0; padding: 0; box-sizing: border-box; }

  :root {
    --sidebar-bg: #0f0c1a;
    --sidebar-accent: #f5c842;
    --sidebar-text: #e8e0ff;
    --sidebar-muted: #7a6f9a;
    --sidebar-hover: rgba(245,200,66,0.08);
    --sidebar-active: rgba(245,200,66,0.14);
    --main-bg: #f5f2ff;
    --card-bg: #ffffff;
    --text-primary: #1a1230;
    --text-secondary: #6b5e8a;
    --accent1: #7c3aed;
    --accent2: #f5c842;
    --accent3: #22d3a5;
    --accent4: #f97316;
    --border: rgba(120,80,200,0.12);
    --badge-green: #d1fae5;
    --badge-green-text: #065f46;
    --badge-amber: #fef3c7;
    --badge-amber-text: #92400e;
    --badge-red: #fee2e2;
    --badge-red-text: #991b1b;
    --badge-blue: #dbeafe;
    --badge-blue-text: #1e40af;
    --sidebar-width: 230px;
  }

  .pos-root {
    font-family: 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
    background: var(--main-bg);
    display: flex;
    min-height: 100vh;
    overflow: hidden;
  }

  .sidebar {
    width: var(--sidebar-width);
    background: var(--sidebar-bg);
    display: flex;
    flex-direction: column;
    position: fixed;
    left: 0; top: 0; bottom: 0;
    z-index: 100;
    border-right: 1px solid rgba(245,200,66,0.12);
  }
  .sidebar-logo {
    padding: 22px 20px 18px;
    border-bottom: 1px solid rgba(245,200,66,0.1);
    display: flex; align-items: center; gap: 10px;
  }
  .logo-icon {
    width: 34px; height: 34px; border-radius: 8px;
    background: var(--sidebar-accent);
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
  }
  .logo-text {
    font-family: 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; font-weight: 800;
    font-size: 15px; color: #fff; line-height: 1.1;
  }
  .logo-sub {
    font-size: 10px; color: var(--sidebar-muted);
    font-weight: 400; letter-spacing: 0.05em;
  }
  .nav-section { padding: 16px 10px 6px; }
  .nav-label {
    font-size: 10px; letter-spacing: 0.1em; text-transform: uppercase;
    color: var(--sidebar-muted); padding: 0 10px; margin-bottom: 6px; font-weight: 500;
  }
  .nav-item {
    display: flex; align-items: center; gap: 10px;
    padding: 9px 12px; border-radius: 8px; cursor: pointer;
    color: var(--sidebar-text); font-size: 13.5px; font-weight: 400;
    transition: background 0.15s; position: relative; margin-bottom: 2px;
    border: none; background: transparent; width: 100%; text-align: left;
  }
  .nav-item:hover { background: var(--sidebar-hover); }
  .nav-item.active {
    background: var(--sidebar-active);
    color: var(--sidebar-accent);
    font-weight: 500;
  }
  .nav-item.active::before {
    content: '';
    position: absolute; left: 0; top: 20%; bottom: 20%;
    width: 3px; border-radius: 0 3px 3px 0;
    background: var(--sidebar-accent);
  }
  .nav-icon { width: 17px; height: 17px; flex-shrink: 0; opacity: 0.85; }

  .main { margin-left: var(--sidebar-width); flex: 1; display: flex; flex-direction: column; min-height: 100vh; }
  .topbar {
    background: #fff; border-bottom: 1px solid var(--border);
    padding: 0 28px; height: 58px; display: flex; align-items: center; justify-content: space-between;
    position: sticky; top: 0; z-index: 50;
  }
  .page-title {
    font-family: 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; font-weight: 700;
    font-size: 18px; color: var(--text-primary);
  }
  .topbar-right { display: flex; align-items: center; gap: 14px; }
  .topbar-date { font-size: 12.5px; color: var(--text-secondary); }
  .topbar-btn {
    background: var(--accent1); color: #fff; border: none;
    padding: 7px 16px; border-radius: 8px; font-size: 13px; font-weight: 500;
    cursor: pointer; font-family: 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
    display: flex; align-items: center; gap: 6px;
  }
  .topbar-btn:hover { background: #6d28d9; }

  .content { padding: 24px 28px; flex: 1; overflow-y: auto; max-height: calc(100vh - 58px); }

  .stat-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; margin-bottom: 22px; }
  .stat-card {
    background: var(--card-bg); border-radius: 12px;
    padding: 16px 18px; border: 1px solid var(--border);
  }
  .stat-label { font-size: 12px; color: var(--text-secondary); margin-bottom: 6px; font-weight: 500; }
  .stat-value {
    font-family: 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; font-size: 22px;
    font-weight: 700; color: var(--text-primary); margin-bottom: 4px;
  }
  .stat-change { font-size: 11.5px; }
  .up { color: #059669; }
  .down { color: #dc2626; }
  .neutral { color: var(--text-secondary); }
  .stat-icon {
    width: 32px; height: 32px; border-radius: 8px;
    display: flex; align-items: center; justify-content: center; margin-bottom: 10px;
  }

  .panels { display: grid; grid-template-columns: 1fr 340px; gap: 16px; }
  .panel { background: var(--card-bg); border-radius: 12px; border: 1px solid var(--border); overflow: hidden; }
  .panel-header {
    padding: 14px 18px; border-bottom: 1px solid var(--border);
    display: flex; align-items: center; justify-content: space-between;
  }
  .panel-title { font-family: 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; font-weight: 600; font-size: 14px; color: var(--text-primary); }
  .panel-action { font-size: 12px; color: var(--accent1); cursor: pointer; font-weight: 500; border: none; background: transparent; font-family: inherit; }

  .pos-table { width: 100%; border-collapse: collapse; }
  .pos-table th {
    font-size: 11px; text-transform: uppercase; letter-spacing: 0.06em;
    color: var(--text-secondary); font-weight: 500; padding: 10px 16px;
    text-align: left; background: #faf8ff; border-bottom: 1px solid var(--border);
  }
  .pos-table td {
    padding: 11px 16px; font-size: 13px;
    color: var(--text-primary); border-bottom: 1px solid var(--border);
  }
  .pos-table tr:last-child td { border-bottom: none; }
  .pos-table tbody tr:hover td { background: #faf8ff; }
  .empty-cell { padding: 42px 16px !important; color: var(--text-secondary) !important; text-align: center; }

  .badge { display: inline-block; padding: 3px 9px; border-radius: 20px; font-size: 11px; font-weight: 500; }
  .badge-green { background: var(--badge-green); color: var(--badge-green-text); }
  .badge-amber { background: var(--badge-amber); color: var(--badge-amber-text); }
  .badge-red   { background: var(--badge-red);   color: var(--badge-red-text); }
  .badge-blue  { background: var(--badge-blue);  color: var(--badge-blue-text); }

  .actions-list { padding: 10px; display: grid; gap: 8px; }
  .action-item {
    display: flex; align-items: center; gap: 12px; padding: 12px 14px;
    border-radius: 10px; border: 1px solid var(--border); cursor: pointer;
    background: #faf8ff; transition: border-color 0.15s;
  }
  .action-item:hover { border-color: var(--accent1); }
  .action-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
  .action-text { font-size: 13px; font-weight: 500; color: var(--text-primary); }
  .action-sub  { font-size: 11px; color: var(--text-secondary); }
  .action-arrow{ margin-left: auto; color: var(--text-secondary); font-size: 14px; }

  .bar-chart { padding: 12px 18px 16px; display: flex; align-items: flex-end; gap: 6px; height: 90px; }
  .bar-wrap { flex: 1; display: flex; flex-direction: column; align-items: center; gap: 4px; height: 100%; justify-content: flex-end; }
  .bar { width: 100%; border-radius: 4px 4px 0 0; transition: opacity 0.2s; cursor: pointer; min-height: 3px; }
  .bar:hover { opacity: 0.75 !important; }
  .bar-lbl { font-size: 10px; color: var(--text-secondary); }

  .coming-soon {
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    min-height: 60vh; gap: 12px; color: var(--text-secondary);
  }
  .coming-soon-title { font-family: 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; font-size: 20px; font-weight: 700; color: var(--text-primary); }
  .coming-soon-sub   { font-size: 14px; }
  .dashboard-state {
    background: #fff;
    border: 1px solid var(--border);
    border-radius: 12px;
    padding: 42px 20px;
    text-align: center;
    color: var(--text-secondary);
  }
  .dashboard-state strong {
    display: block;
    font-family: 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
    color: var(--text-primary);
    font-size: 16px;
    margin-bottom: 8px;
  }

  @media (max-width: 1024px) {
    .stat-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
    .panels { grid-template-columns: 1fr; }
  }

  @media (max-width: 760px) {
    .pos-root {
      display: block;
      overflow: visible;
    }
    .sidebar {
      position: sticky;
      top: 0;
      width: 100%;
      height: auto;
      max-height: 48vh;
      overflow-y: auto;
      border-right: none;
      border-bottom: 1px solid rgba(245,200,66,0.12);
    }
    .sidebar-logo {
      padding: 14px 16px;
    }
    .nav-section {
      padding: 8px 8px 4px;
      display: flex;
      gap: 6px;
      overflow-x: auto;
      scrollbar-width: thin;
    }
    .nav-label {
      display: none;
    }
    .nav-item {
      width: auto;
      flex: 0 0 auto;
      min-height: 40px;
      padding: 9px 11px;
      white-space: nowrap;
      font-size: 13px;
    }
    .nav-item.active::before {
      left: 10px;
      right: 10px;
      top: auto;
      bottom: 0;
      width: auto;
      height: 2px;
      border-radius: 2px;
    }
    .main {
      margin-left: 0;
      min-height: auto;
    }
    .topbar {
      height: auto;
      min-height: 58px;
      padding: 12px 16px;
      gap: 12px;
      align-items: flex-start;
      flex-direction: column;
    }
    .topbar-right {
      width: 100%;
      justify-content: space-between;
      flex-wrap: wrap;
    }
    .topbar-btn {
      min-height: 40px;
      padding: 9px 14px;
    }
    .content {
      padding: 16px;
      max-height: none;
      overflow: visible;
    }
    .stat-grid {
      grid-template-columns: 1fr;
      gap: 10px;
    }
    .stat-card {
      min-height: 116px;
    }
    .panel {
      border-radius: 8px;
    }
    .panel-header {
      padding: 12px 14px;
      gap: 10px;
      align-items: flex-start;
    }
    .bar-chart {
      height: 118px;
      overflow-x: auto;
      align-items: flex-end;
    }
    .bar-wrap {
      min-width: 44px;
    }
    .pos-table {
      min-width: 620px;
    }
    .panel:has(.pos-table) {
      overflow-x: auto;
    }
    .actions-list {
      padding: 8px;
    }
    .action-item {
      min-height: 56px;
    }
  }
`;

const IconDashboard = () => (<svg className="nav-icon" viewBox="0 0 20 20" fill="currentColor"><path d="M3 4a1 1 0 011-1h4a1 1 0 011 1v5a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm0 9a1 1 0 011-1h4a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1v-2zm8-9a1 1 0 011-1h4a1 1 0 011 1v2a1 1 0 01-1 1h-4a1 1 0 01-1-1V4zm0 7a1 1 0 011-1h4a1 1 0 011 1v5a1 1 0 01-1 1h-4a1 1 0 01-1-1v-5z"/></svg>);
const IconCart     = () => (<svg className="nav-icon" viewBox="0 0 20 20" fill="currentColor"><path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zm12 15a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 104 0 2 2 0 00-4 0z"/></svg>);
const IconBox      = () => (<svg className="nav-icon" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4zm-6 3a1 1 0 112 0 1 1 0 01-2 0zm7-1a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd"/></svg>);
const IconArchive  = () => (<svg className="nav-icon" viewBox="0 0 20 20" fill="currentColor"><path d="M4 3a2 2 0 100 4h12a2 2 0 100-4H4z"/><path fillRule="evenodd" d="M3 8h14v7a2 2 0 01-2 2H5a2 2 0 01-2-2V8zm5 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" clipRule="evenodd"/></svg>);
const IconUsers    = () => (<svg className="nav-icon" viewBox="0 0 20 20" fill="currentColor"><path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z"/></svg>);
const IconChart    = () => (<svg className="nav-icon" viewBox="0 0 20 20" fill="currentColor"><path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z"/></svg>);
const IconSettings = () => (<svg className="nav-icon" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd"/></svg>);
const IconPlus     = () => (<svg width="14" height="14" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd"/></svg>);

const NAV_ITEMS = [
  { label: "Main", items: [
    { id: "dashboard", label: "Dashboard",          icon: <IconDashboard /> },
    { id: "sales",     label: "Sales & Checkout",   icon: <IconCart /> },
    { id: "products",  label: "Products",           icon: <IconBox /> },
    { id: "purchases", label: "Purchases",          icon: <IconArchive /> },
  ]},
  { label: "People", items: [
    { id: "contacts",  label: "Contacts",           icon: <IconUsers /> },
  ]},
  { label: "Insights", items: [
    { id: "reports",   label: "Reports & Analytics",icon: <IconChart /> },
  ]},
  { label: "System", items: [
    { id: "settings",  label: "Settings",           icon: <IconSettings /> },
  ]},
];

const fmtKES = (n) => `KES ${Number(n || 0).toLocaleString("en-KE", { maximumFractionDigits: 0 })}`;
const startOfToday = () => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
};
const dateKey = (date) => date.toISOString().slice(0, 10);
const shortDay = (date) => date.toLocaleDateString("en-KE", { weekday: "short" });

const SALE_SELECT = `
  id,
  total_amount,
  amount_paid,
  payment_status,
  status,
  created_at,
  sale_items(
    id,
    product_id,
    quantity,
    price,
    products(name, categories(name))
  )
`;

async function fetchDashboardData() {
  const [salesRes, productsRes, suppliersRes] = await Promise.all([
    supabaseClient.from("sales").select(SALE_SELECT).order("created_at", { ascending: false }).limit(100),
    supabaseClient.from("products").select("id, stock_quantity").order("name", { ascending: true }),
    supabaseClient.from("suppliers").select("id, created_at").order("created_at", { ascending: false }),
  ]);

  const error = salesRes.error || productsRes.error || suppliersRes.error;
  if (error) throw error;

  return {
    sales: salesRes.data || [],
    products: productsRes.data || [],
    suppliers: suppliersRes.data || [],
  };
}

function paymentBadge(status) {
  if (status === "paid") return { label: "Paid", className: "badge-green" };
  if (status === "partial") return { label: "Partial", className: "badge-blue" };
  if (status === "pending") return { label: "To be paid", className: "badge-amber" };
  return { label: status || "Recorded", className: "badge-red" };
}

function buildDashboard(data) {
  const today = startOfToday();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const weekStart = new Date(today);
  weekStart.setDate(weekStart.getDate() - 6);

  const todaySales = data.sales.filter((sale) => new Date(sale.created_at) >= today);
  const yesterdaySales = data.sales.filter((sale) => {
    const created = new Date(sale.created_at);
    return created >= yesterday && created < today;
  });

  const todayRevenue = todaySales.reduce((sum, sale) => sum + Number(sale.total_amount || 0), 0);
  const yesterdayRevenue = yesterdaySales.reduce((sum, sale) => sum + Number(sale.total_amount || 0), 0);
  const revenueChange = yesterdayRevenue
    ? `${todayRevenue >= yesterdayRevenue ? "Up" : "Down"} ${Math.abs(((todayRevenue - yesterdayRevenue) / yesterdayRevenue) * 100).toFixed(1)}% vs yesterday`
    : "No prior-day revenue";

  const lowStock = data.products.filter((product) => Number(product.stock_quantity || 0) <= 10).length;
  const newSuppliers = data.suppliers.filter((supplier) => new Date(supplier.created_at) >= weekStart).length;

  const stats = [
    {
      label: "Today's Revenue",
      value: fmtKES(todayRevenue),
      change: revenueChange,
      dir: todayRevenue >= yesterdayRevenue ? "up" : "down",
      iconBg: "#ede9fe",
      icon: <svg width="16" height="16" viewBox="0 0 20 20" fill="#7c3aed"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.1a4.5 4.5 0 00-1.7.65C6.6 6.23 6 7.01 6 8c0 .99.6 1.77 1.3 2.25.49.32 1.06.54 1.7.66v1.94c-.4-.13-.68-.32-.84-.5a1 1 0 10-1.52 1.3c.57.65 1.42 1.08 2.36 1.26V15a1 1 0 102 0v-.09a4.5 4.5 0 001.7-.66C13.4 13.77 14 12.99 14 12c0-.99-.6-1.77-1.3-2.25A4.5 4.5 0 0011 9.09V7.15c.39.13.68.32.84.5a1 1 0 101.52-1.3A4.12 4.12 0 0011 5.09V5z"/></svg>,
    },
    {
      label: "Transactions",
      value: todaySales.length.toLocaleString("en-KE"),
      change: `${data.sales.length.toLocaleString("en-KE")} recent records loaded`,
      dir: "neutral",
      iconBg: "#d1fae5",
      icon: <svg width="16" height="16" viewBox="0 0 20 20" fill="#059669"><path d="M3 1a1 1 0 000 2h1.22l1.67 6.69-.89.9C3.74 11.85 4.63 14 6.41 14H15a1 1 0 000-2H6.41l1-1H14a1 1 0 00.9-.55l3-6A1 1 0 0017 3H6.28l-.31-1.24A1 1 0 005 1H3z"/></svg>,
    },
    {
      label: "Stock Items",
      value: data.products.length.toLocaleString("en-KE"),
      change: `${lowStock.toLocaleString("en-KE")} low stock alert${lowStock === 1 ? "" : "s"}`,
      dir: lowStock ? "down" : "up",
      iconBg: "#fef3c7",
      icon: <svg width="16" height="16" viewBox="0 0 20 20" fill="#d97706"><path d="M4 3a2 2 0 100 4h12a2 2 0 100-4H4z"/><path d="M3 8h14v7a2 2 0 01-2 2H5a2 2 0 01-2-2V8zm5 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z"/></svg>,
    },
    {
      label: "Suppliers",
      value: data.suppliers.length.toLocaleString("en-KE"),
      change: `${newSuppliers.toLocaleString("en-KE")} new this week`,
      dir: newSuppliers ? "up" : "neutral",
      iconBg: "#fee2e2",
      icon: <svg width="16" height="16" viewBox="0 0 20 20" fill="#dc2626"><path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5zM12.93 17c.05-.33.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07z"/></svg>,
    },
  ];

  const bars = Array.from({ length: 7 }, (_, index) => {
    const date = new Date(weekStart);
    date.setDate(weekStart.getDate() + index);
    const key = dateKey(date);
    const value = data.sales
      .filter((sale) => dateKey(new Date(sale.created_at)) === key)
      .reduce((sum, sale) => sum + Number(sale.total_amount || 0), 0);
    return { day: shortDay(date), value };
  });
  const maxBar = Math.max(...bars.map((bar) => bar.value), 1);

  const transactions = data.sales.slice(0, 5).map((sale) => {
    const firstItem = sale.sale_items?.[0];
    const moreCount = Math.max(0, Number(sale.sale_items?.length || 0) - 1);
    const badge = paymentBadge(sale.payment_status);
    return {
      id: sale.id,
      item: firstItem?.products?.name || `Sale ${sale.id.slice(0, 8)}`,
      category: firstItem?.products?.categories?.name || "Sale",
      qty: (sale.sale_items || []).reduce((sum, item) => sum + Number(item.quantity || 0), 0),
      amount: fmtKES(sale.total_amount),
      status: badge.label,
      badge: badge.className,
      moreCount,
    };
  });

  const actions = [
    { label: "New Purchase Order", sub: "Record incoming stock", dot: "#7c3aed", page: "purchases" },
    { label: "Manage Products", sub: `${data.products.length.toLocaleString("en-KE")} products in inventory`, dot: "#f5c842", page: "products" },
    { label: "Supplier Directory", sub: `${data.suppliers.length.toLocaleString("en-KE")} suppliers recorded`, dot: "#22d3a5", page: "contacts" },
    { label: "Low Stock Report", sub: `${lowStock.toLocaleString("en-KE")} item${lowStock === 1 ? "" : "s"} need attention`, dot: "#f97316", page: "reports" },
    { label: "Sales Analytics", sub: `${todaySales.length.toLocaleString("en-KE")} transaction${todaySales.length === 1 ? "" : "s"} today`, dot: "#dc2626", page: "reports" },
  ];

  return {
    stats,
    transactions,
    actions,
    bars: bars.map((bar, index) => ({
      ...bar,
      height: `${Math.max(3, (bar.value / maxBar) * 100)}%`,
      color: index === 6 ? "#f5c842" : "#7c3aed",
      opacity: index === 6 ? 1 : 0.62,
    })),
  };
}

function Sidebar({ activeId, onNavigate }) {
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="logo-icon">
          <svg viewBox="0 0 24 24" fill="none" width="18" height="18">
            <path d="M9 2h6l1 5H8L9 2z" fill="#0f0c1a" />
            <rect x="7" y="7" width="10" height="14" rx="2" fill="#0f0c1a" opacity="0.85" />
            <rect x="10" y="10" width="4" height="1.5" rx="0.75" fill="#f5c842" />
          </svg>
        </div>
        <div>
          <div className="logo-text">SpiritsPOS</div>
          <div className="logo-sub">Liquor Store System</div>
        </div>
      </div>
      {NAV_ITEMS.map((section) => (
        <div className="nav-section" key={section.label}>
          <div className="nav-label">{section.label}</div>
          {section.items.map((item) => (
            <button
              key={item.id}
              className={`nav-item${activeId === item.id ? " active" : ""}`}
              onClick={() => onNavigate(item.id, item.label)}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </div>
      ))}
    </aside>
  );
}

function StatCards({ stats }) {
  return (
    <div className="stat-grid">
      {stats.map((s) => (
        <div className="stat-card" key={s.label}>
          <div className="stat-icon" style={{ background: s.iconBg }}>{s.icon}</div>
          <div className="stat-label">{s.label}</div>
          <div className="stat-value">{s.value}</div>
          <div className={`stat-change ${s.dir}`}>{s.change}</div>
        </div>
      ))}
    </div>
  );
}

function WeeklyBarChart({ bars, onNavigate }) {
  return (
    <div className="panel" style={{ marginBottom: 16 }}>
      <div className="panel-header">
        <div className="panel-title">Weekly Sales</div>
        <button className="panel-action" onClick={() => onNavigate("reports", "Reports & Analytics")}>View full report</button>
      </div>
      <div className="bar-chart">
        {bars.map((b) => (
          <div className="bar-wrap" key={b.day} title={fmtKES(b.value)}>
            <div className="bar" style={{ height: b.height, background: b.color, opacity: b.opacity }} />
            <div className="bar-lbl">{b.day}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function RecentTransactions({ transactions, onNavigate }) {
  return (
    <div className="panel">
      <div className="panel-header">
        <div className="panel-title">Recent Transactions</div>
        <button className="panel-action" onClick={() => onNavigate("sales", "Sales & Checkout")}>View all</button>
      </div>
      <table className="pos-table">
        <thead>
          <tr><th>Item</th><th>Category</th><th>Qty</th><th>Amount</th><th>Status</th></tr>
        </thead>
        <tbody>
          {transactions.length === 0 ? (
            <tr>
              <td className="empty-cell" colSpan={5}>No sales have been recorded yet.</td>
            </tr>
          ) : transactions.map((t) => (
            <tr key={t.id}>
              <td style={{ fontWeight: 500 }}>
                {t.item}{t.moreCount > 0 ? ` +${t.moreCount} more` : ""}
              </td>
              <td>{t.category}</td>
              <td>{t.qty}</td>
              <td style={{ fontWeight: 500 }}>{t.amount}</td>
              <td><span className={`badge ${t.badge}`}>{t.status}</span></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function QuickActions({ actions, onNavigate }) {
  return (
    <div className="panel">
      <div className="panel-header">
        <div className="panel-title">Quick Actions</div>
      </div>
      <div className="actions-list">
        {actions.map((a) => (
          <div className="action-item" key={a.label} onClick={() => onNavigate(a.page, a.label)}>
            <div className="action-dot" style={{ background: a.dot }} />
            <div>
              <div className="action-text">{a.label}</div>
              <div className="action-sub">{a.sub}</div>
            </div>
            <div className="action-arrow">&gt;</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ComingSoon({ title }) {
  return (
    <div className="coming-soon">
      <div className="coming-soon-title">{title}</div>
      <div className="coming-soon-sub">This section has not been configured yet.</div>
    </div>
  );
}

export default function Dashboard() {
  const [activeId, setActiveId] = useState("dashboard");
  const [pageTitle, setPageTitle] = useState("Dashboard");
  const [dashboardData, setDashboardData] = useState(null);
  const [dashboardLoading, setDashboardLoading] = useState(true);
  const [dashboardError, setDashboardError] = useState("");

  const handleNavigate = (id, label) => {
    setActiveId(id);
    setPageTitle(label);
  };

  const loadDashboard = async () => {
    setDashboardLoading(true);
    setDashboardError("");
    try {
      setDashboardData(await fetchDashboardData());
    } catch (error) {
      console.error(error);
      setDashboardError(error.message || "Dashboard data could not be loaded.");
    } finally {
      setDashboardLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const dashboard = useMemo(() => dashboardData ? buildDashboard(dashboardData) : null, [dashboardData]);

  const dateStr = new Date().toLocaleDateString("en-KE", {
    weekday: "short", day: "numeric", month: "long", year: "numeric",
  });

  return (
    <>
      <style>{styles}</style>
      <div className="pos-root">
        <Sidebar activeId={activeId} onNavigate={handleNavigate} />

        <main className="main">
          {activeId === "sales" ? (
            <Sales />
          ) : activeId === "purchases" ? (
            <Purchases />
          ) : activeId === "products" ? (
            <Products />
          ) : activeId === "reports" ? (
            <Reports />
          ) : (
            <>
              <div className="topbar">
                <div className="page-title">{pageTitle}</div>
                <div className="topbar-right">
                  <div className="topbar-date">{dateStr}</div>
                  {activeId === "dashboard" && (
                    <button className="topbar-btn" onClick={() => handleNavigate("sales", "Sales & Checkout")}>
                      <IconPlus /> New Sale
                    </button>
                  )}
                </div>
              </div>

              <div className="content">
                {activeId === "dashboard" && (
                  dashboardLoading ? (
                    <div className="dashboard-state">
                      <strong>Loading dashboard</strong>
                      Pulling current sales, inventory, and supplier records.
                    </div>
                  ) : dashboardError ? (
                    <div className="dashboard-state">
                      <strong>Dashboard could not load</strong>
                      <div style={{ marginBottom: 14 }}>{dashboardError}</div>
                      <button className="topbar-btn" onClick={loadDashboard}>Retry</button>
                    </div>
                  ) : dashboard && (
                    <>
                      <StatCards stats={dashboard.stats} />
                      <WeeklyBarChart bars={dashboard.bars} onNavigate={handleNavigate} />
                      <div className="panels">
                        <RecentTransactions transactions={dashboard.transactions} onNavigate={handleNavigate} />
                        <QuickActions actions={dashboard.actions} onNavigate={handleNavigate} />
                      </div>
                    </>
                  )
                )}
                {activeId === "contacts" && <ComingSoon title="Contacts" />}
                {activeId === "settings" && <ComingSoon title="Settings" />}
              </div>
            </>
          )}
        </main>
      </div>
    </>
  );
}

