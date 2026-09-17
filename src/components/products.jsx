import { useState, useEffect, useMemo, useRef } from "react";
import { supabase as supabaseClient } from "../config/supabase";

// ─────────────────────────────────────────────────────────────────────────────
// PRODUCTS PAGE (Optimized)
// ─────────────────────────────────────────────────────────────────────────────

const LOW_STOCK_THRESHOLD = 10;

// ── STYLES ───────────────────────────────────────────────────────────────────
const styles = `
  *, *::before, *::after { box-sizing: border-box; }

  :root {
    --bg: #f5f2ff;
    --card: #ffffff;
    --border: rgba(120,80,200,0.12);
    --accent: #7c3aed;
    --accent-light: #ede9fe;
    --accent-hover: #6d28d9;
    --gold: #f5c842;
    --green: #059669;
    --green-light: #d1fae5;
    --green-text: #065f46;
    --amber: #d97706;
    --amber-light: #fef3c7;
    --amber-text: #92400e;
    --red: #dc2626;
    --red-light: #fee2e2;
    --red-text: #991b1b;
    --text: #1a1230;
    --text2: #6b5e8a;
    --text3: #9d8fba;
    --radius: 10px;
    --radius-lg: 14px;
  }

  .pr-wrap { font-family: 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background: var(--bg); min-height: 100vh; color: var(--text); }

  /* ── TOP BAR ── */
  .pr-topbar {
    background: var(--card); border-bottom: 1px solid var(--border);
    padding: 0 28px; height: 58px; display: flex; align-items: center;
    justify-content: space-between; position: sticky; top: 0; z-index: 40;
  }
  .pr-topbar-left  { display: flex; align-items: center; gap: 20px; }
  .pr-title        { font-family: 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; font-weight: 700; font-size: 18px; }
  .pr-topbar-right { display: flex; align-items: center; gap: 10px; }
  .pr-date         { font-size: 12px; color: var(--text2); }

  /* ── BUTTONS ── */
  .btn {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 8px 14px; border-radius: var(--radius); font-size: 13px;
    font-weight: 500; cursor: pointer; border: 1px solid transparent;
    font-family: 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; transition: all 0.15s;
  }
  .btn-primary   { background: var(--accent); color: #fff; }
  .btn-primary:hover { background: var(--accent-hover); }
  .btn-secondary { background: var(--card); color: var(--text); border-color: var(--border); }
  .btn-secondary:hover { border-color: var(--accent); color: var(--accent); }
  .btn-danger    { background: transparent; color: var(--red); border-color: var(--red-light); }
  .btn-danger:hover { background: var(--red-light); }
  .btn-icon      { padding: 6px 8px; }

  /* ── CONTENT ── */
  .pr-content { padding: 22px 28px 40px; max-width: 1480px; margin: 0 auto; }

  .pr-stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; margin-bottom: 20px; }
  .pr-stat-card {
    background: var(--card); border: 1px solid var(--border);
    border-radius: 12px; padding: 16px 18px;
  }
  .pr-stat-label { font-size: 12px; color: var(--text2); margin-bottom: 6px; font-weight: 500; }
  .pr-stat-value { font-family: 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; font-size: 22px; font-weight: 700; }
  .pr-stat-sub   { font-size: 11.5px; color: var(--text2); margin-top: 4px; }
  .pr-stat-sub.warn { color: var(--amber); }
  .pr-stat-sub.bad  { color: var(--red); }

  /* ── TOOLBAR ── */
  .pr-toolbar {
    background: var(--card); border: 1px solid var(--border);
    border-radius: 12px; padding: 12px 16px; margin-bottom: 14px;
    display: flex; gap: 10px; align-items: center; flex-wrap: wrap;
  }
  .pr-search { flex: 1; min-width: 220px; position: relative; }
  .pr-search input {
    width: 100%; height: 36px; padding: 0 12px 0 34px;
    border: 1px solid var(--border); border-radius: var(--radius);
    background: #faf8ff; font-size: 13px; font-family: inherit; color: var(--text);
    outline: none; transition: border-color 0.15s;
  }
  .pr-search input:focus { border-color: var(--accent); background: #fff; }
  .pr-search svg { position: absolute; left: 11px; top: 10px; color: var(--text3); }

  .pr-select {
    height: 36px; padding: 0 30px 0 12px;
    border: 1px solid var(--border); border-radius: var(--radius);
    background: #faf8ff; font-size: 13px; color: var(--text);
    cursor: pointer; font-family: inherit; appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6' viewBox='0 0 10 6' fill='none'%3E%3Cpath d='M1 1L5 5L9 1' stroke='%236b5e8a' stroke-width='1.5' stroke-linecap='round'/%3E%3C/svg%3E");
    background-repeat: no-repeat; background-position: right 10px center;
  }

  .pr-view-toggle { display: inline-flex; border: 1px solid var(--border); border-radius: var(--radius); overflow: hidden; }
  .pr-view-btn {
    padding: 7px 12px; background: var(--card); border: none; cursor: pointer;
    color: var(--text2); font-size: 12px; font-family: inherit;
    display: inline-flex; align-items: center; gap: 5px;
  }
  .pr-view-btn.active { background: var(--accent); color: #fff; }

  /* ── TABLE ── */
  .pr-panel { background: var(--card); border: 1px solid var(--border); border-radius: 12px; overflow: hidden; }
  .pr-table { width: 100%; border-collapse: collapse; }
  .pr-table th {
    font-size: 11px; text-transform: uppercase; letter-spacing: 0.06em;
    color: var(--text2); font-weight: 500; padding: 11px 16px;
    text-align: left; background: #faf8ff; border-bottom: 1px solid var(--border);
  }
  .pr-table td {
    padding: 12px 16px; font-size: 13px; color: var(--text);
    border-bottom: 1px solid var(--border); vertical-align: middle;
  }
  .pr-table tbody tr:hover td { background: #faf8ff; }
  .pr-table tr:last-child td { border-bottom: none; }
  .pr-name { font-weight: 500; }
  .pr-barcode { font-family: ui-monospace, monospace; font-size: 11.5px; color: var(--text2); }

  .badge { display: inline-block; padding: 3px 9px; border-radius: 20px; font-size: 11px; font-weight: 500; }
  .badge-green  { background: var(--green-light); color: var(--green-text); }
  .badge-amber  { background: var(--amber-light); color: var(--amber-text); }
  .badge-red    { background: var(--red-light);   color: var(--red-text); }

  .pr-row-actions { display: flex; gap: 6px; justify-content: flex-end; }

  /* ── GRID VIEW ── */
  .pr-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 16px; }
  .pr-card {
    background: var(--card); border: 1px solid var(--border);
    border-radius: 12px; padding: 18px; display: flex; flex-direction: column; gap: 10px;
    transition: all 0.2s ease; cursor: default;
  }
  .pr-card:hover { border-color: var(--accent); box-shadow: 0 4px 15px rgba(124,58,237,0.08); transform: translateY(-2px); }
  .pr-card-top { display: flex; justify-content: space-between; align-items: flex-start; gap: 8px; }
  .pr-card-name { font-weight: 600; font-size: 15px; line-height: 1.3; color: var(--text); }
  .pr-card-cat  { font-size: 12px; color: var(--text2); margin-top: 4px; }
  .pr-card-price { font-family: 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; font-size: 20px; font-weight: 700; color: var(--accent); margin: 4px 0; }
  .pr-card-meta { display: flex; justify-content: space-between; font-size: 12px; color: var(--text2); padding-top: 10px; border-top: 1px dashed var(--border); }
  .pr-card-actions { display: flex; gap: 8px; margin-top: 8px; }

  /* ── MODAL ── */
  .pr-overlay {
    position: fixed; inset: 0; background: rgba(15,12,26,0.55);
    display: flex; align-items: center; justify-content: center;
    z-index: 100; padding: 20px;
  }
  .pr-modal {
    background: var(--card); border-radius: var(--radius-lg);
    width: 100%; max-width: 520px; max-height: 90vh; overflow-y: auto;
    box-shadow: 0 25px 60px -12px rgba(15,12,26,0.4);
  }
  .pr-modal-header {
    padding: 18px 22px; border-bottom: 1px solid var(--border);
    display: flex; justify-content: space-between; align-items: center;
  }
  .pr-modal-title { font-family: 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; font-weight: 700; font-size: 17px; }
  .pr-modal-close {
    background: none; border: none; cursor: pointer; color: var(--text2);
    width: 28px; height: 28px; border-radius: 6px; display: flex;
    align-items: center; justify-content: center; font-size: 20px;
  }
  .pr-modal-close:hover { background: var(--bg); color: var(--text); }
  .pr-modal-body { padding: 20px 22px; display: grid; gap: 14px; }
  .pr-modal-footer {
    padding: 14px 22px; border-top: 1px solid var(--border);
    display: flex; gap: 8px; justify-content: flex-end;
  }

  .pr-field { display: grid; gap: 5px; }
  .pr-field label { font-size: 12px; color: var(--text2); font-weight: 500; }
  .pr-field input, .pr-field select {
    height: 38px; padding: 0 12px; border: 1px solid var(--border);
    border-radius: var(--radius); background: #faf8ff; font-size: 13px;
    font-family: inherit; color: var(--text); outline: none;
    transition: border-color 0.15s;
  }
  .pr-field input:focus, .pr-field select:focus { border-color: var(--accent); background: #fff; }
  .pr-field-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }

  /* ── EMPTY / LOADING ── */
  .pr-empty { padding: 60px 20px; text-align: center; color: var(--text2); }
  .pr-empty-title { font-family: 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; font-size: 16px; color: var(--text); margin-bottom: 6px; }
  .pr-empty-sub   { font-size: 13px; }
  .pr-spinner {
    width: 20px; height: 20px; border: 2px solid var(--accent-light);
    border-top-color: var(--accent); border-radius: 50%;
    animation: spin 0.8s linear infinite; display: inline-block;
  }
  @keyframes spin { to { transform: rotate(360deg); } }

  /* ── TOAST ── */
  .pr-toast {
    position: fixed; bottom: 24px; right: 24px; z-index: 200;
    background: var(--text); color: #fff; padding: 12px 18px;
    border-radius: var(--radius); font-size: 13px; font-weight: 500;
    box-shadow: 0 10px 25px rgba(0,0,0,0.15);
    animation: slideUp 0.2s ease;
  }
  .pr-toast.success { background: var(--green); }
  .pr-toast.error   { background: var(--red); }
  @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: none; opacity: 1; } }

  @media (max-width: 900px) {
    .pr-stats { grid-template-columns: repeat(2, 1fr); }
    .pr-content { padding: 16px; }
  }

  @media (max-width: 760px) {
    .pr-wrap {
      min-height: auto;
    }
    .pr-topbar {
      height: auto;
      min-height: 58px;
      padding: 12px 16px;
      gap: 10px;
      align-items: flex-start;
      flex-direction: column;
    }
    .pr-topbar-left,
    .pr-topbar-right {
      width: 100%;
      justify-content: space-between;
      flex-wrap: wrap;
    }
    .pr-content {
      padding: 16px;
    }
    .pr-stats {
      grid-template-columns: 1fr;
      gap: 10px;
    }
    .pr-toolbar {
      padding: 10px;
      align-items: stretch;
      flex-direction: column;
    }
    .pr-search,
    .pr-select,
    .pr-view-toggle {
      width: 100%;
      min-width: 0;
    }
    .pr-view-btn {
      min-height: 40px;
      flex: 1;
      justify-content: center;
    }
    .pr-panel {
      overflow-x: auto;
      border-radius: 8px;
    }
    .pr-table {
      min-width: 780px;
    }
    .pr-table th,
    .pr-table td {
      padding: 10px 12px;
    }
    .pr-grid {
      grid-template-columns: 1fr;
      gap: 12px;
    }
    .pr-card {
      border-radius: 8px;
    }
    .pr-card-actions .btn,
    .btn {
      min-height: 40px;
      justify-content: center;
    }
    .pr-overlay {
      align-items: stretch;
      padding: 10px;
    }
    .pr-modal {
      max-width: none;
      max-height: calc(100vh - 20px);
      border-radius: 10px;
    }
    .pr-modal-body {
      padding: 16px;
    }
    .pr-field-row {
      grid-template-columns: 1fr;
    }
    .pr-modal-footer {
      flex-wrap: wrap;
    }
    .pr-modal-footer .btn {
      flex: 1;
    }
  }
`;

// ── Icons ────────────────────────────────────────────────────────────────────
const IconSearch = () => <svg width="14" height="14" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="9" cy="9" r="6" /><path d="M14 14l3.5 3.5" strokeLinecap="round" /></svg>;
const IconPlus = () => <svg width="14" height="14" viewBox="0 0 20 20" fill="currentColor"><path d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" /></svg>;
const IconEdit = () => <svg width="13" height="13" viewBox="0 0 20 20" fill="currentColor"><path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828zM2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" /></svg>;
const IconTrash = () => <svg width="13" height="13" viewBox="0 0 20 20" fill="currentColor"><path d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" /></svg>;
const IconList = () => <svg width="12" height="12" viewBox="0 0 20 20" fill="currentColor"><path d="M3 4h14v2H3V4zm0 5h14v2H3V9zm0 5h14v2H3v-2z" /></svg>;
const IconGrid = () => <svg width="12" height="12" viewBox="0 0 20 20" fill="currentColor"><path d="M3 3h6v6H3V3zm8 0h6v6h-6V3zM3 11h6v6H3v-6zm8 0h6v6h-6v-6z" /></svg>;

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS — Supabase data layer
// ─────────────────────────────────────────────────────────────────────────────
const fmtKES = (n) => `KES ${Number(n || 0).toLocaleString("en-KE", { minimumFractionDigits: 0 })}`;

async function fetchProducts() {
  const { data, error } = await supabaseClient
    .from("products")
    .select("id, name, category_id, price, tax_rate, stock_quantity, barcode, created_at, updated_at")
    .order("name", { ascending: true });
  if (error) throw error;
  return data || [];
}

async function fetchCategories() {
  const { data, error } = await supabaseClient
    .from("categories")
    .select("id, name")
    .order("name", { ascending: true });
  if (error) throw error;
  return data || [];
}

// Ensure products purchased exist in the database so they can be managed
async function reconcileMissingFromPurchases(existingProducts) {
  const { data: pi, error } = await supabaseClient.from("purchase_items").select("product_id");
  if (error || !pi?.length) return;

  const have = new Set(existingProducts.map((p) => p.id));
  const missing = [...new Set(pi.map((r) => r.product_id))].filter((id) => id && !have.has(id));
  
  if (!missing.length) return;

  const stubs = missing.map((id) => ({
    id, name: "Unnamed product", price: 0, tax_rate: 0, stock_quantity: 0,
  }));
  await supabaseClient.from("products").insert(stubs);
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
export default function Products() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [stockFilter, setStockFilter] = useState("all");
  const [view, setView] = useState("list"); 
  const [editing, setEditing] = useState(null); 
  const [toast, setToast] = useState(null);
  const reconciledRef = useRef(false);

  const showToast = (msg, kind = "success") => {
    setToast({ msg, kind });
    setTimeout(() => setToast(null), 2500);
  };

  // LIGHTNING FAST LOAD: Directly uses the database stock_quantity
  const loadAll = async (skipReconcile = false) => {
    if (!skipReconcile) setLoading(true);
    try {
      const [prodList, catList] = await Promise.all([fetchProducts(), fetchCategories()]);

      if (!skipReconcile && !reconciledRef.current) {
        await reconcileMissingFromPurchases(prodList);
        reconciledRef.current = true;
      }

      setProducts(prodList);
      setCategories(catList);
    } catch (err) {
      console.error(err);
      showToast(err.message || "Failed to load products", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAll();

    // Listen to real-time changes safely
    const channel = supabaseClient
      .channel("products-page")
      .on("postgres_changes", { event: "*", schema: "public", table: "products" }, () => loadAll(true))
      .subscribe();

    return () => {
      supabaseClient.removeChannel(channel);
    };
  }, []);

  // ── Derived Data ───────────────────────────────────────────────────────────
  const categoryById = useMemo(() => {
    const m = new Map();
    categories.forEach((c) => m.set(c.id, c.name));
    return m;
  }, [categories]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return products.filter((p) => {
      if (categoryFilter !== "all" && p.category_id !== categoryFilter) return false;
      if (stockFilter === "low" && !(p.stock_quantity > 0 && p.stock_quantity <= LOW_STOCK_THRESHOLD)) return false;
      if (stockFilter === "out" && p.stock_quantity > 0) return false;
      if (q) {
        const inName = p.name?.toLowerCase().includes(q);
        const inBarcode = p.barcode?.toLowerCase().includes(q);
        if (!inName && !inBarcode) return false;
      }
      return true;
    });
  }, [products, search, categoryFilter, stockFilter]);

  const stats = useMemo(() => {
    const total = products.length;
    const low = products.filter((p) => p.stock_quantity > 0 && p.stock_quantity <= LOW_STOCK_THRESHOLD).length;
    const out = products.filter((p) => p.stock_quantity <= 0).length;
    const value = products.reduce((sum, p) => sum + Number(p.price || 0) * Number(p.stock_quantity || 0), 0);
    return { total, low, out, value };
  }, [products]);

  // ── Handlers ───────────────────────────────────────────────────────────────
 const saveProduct = async (form) => {
    try {
      if (!form.id) {
        throw new Error("Adding products manually is disabled. Please add through Purchases.");
      }

      // ONLY allow updating the price and tax rate. Everything else is ignored.
      const payload = {
        price: Number(form.price) || 0,
        tax_rate: Number(form.tax_rate) || 0,
        updated_at: new Date().toISOString(),
      };
      
      const { error } = await supabaseClient.from("products").update(payload).eq("id", form.id);
      if (error) throw error;
      
      showToast("Pricing updated successfully");
      setEditing(null);
      loadAll(true);
    } catch (err) {
      showToast(err.message || "Update failed", "error");
    }
  };

  const deleteProduct = async (p) => {
    if (!window.confirm(`Delete "${p.name}"? This cannot be undone.`)) return;
    try {
      const { error } = await supabaseClient.from("products").delete().eq("id", p.id);
      if (error) throw error;
      showToast("Product deleted");
      loadAll(true);
    } catch (err) {
      showToast("Delete failed: Product likely has sales or purchases linked to it.", "error");
    }
  };

  const stockBadge = (q) => {
    if (q <= 0) return <span className="badge badge-red">Out of stock</span>;
    if (q <= LOW_STOCK_THRESHOLD) return <span className="badge badge-amber">Low ({q})</span>;
    return <span className="badge badge-green">{q} in stock</span>;
  };

  return (
    <>
      <style>{styles}</style>
      <div className="pr-wrap">
        <div className="pr-topbar">
          <div className="pr-topbar-left">
            <div className="pr-title">Products</div>
          </div>
         <div className="pr-topbar-right">
            <div className="pr-date">
              {new Date().toLocaleDateString("en-KE", { weekday: "long", month: "short", day: "numeric" })}
            </div>
            {/* The "Add Product" button has been intentionally deleted from here to enforce workflow */}
          </div>
        </div>

        <div className="pr-content">
          {/* ... Stats and Toolbar stay exactly the same ... */}
        </div>

        <div className="pr-content">
          <div className="pr-stats">
            <div className="pr-stat-card">
              <div className="pr-stat-label">Total products</div>
              <div className="pr-stat-value">{stats.total}</div>
              <div className="pr-stat-sub">Across {categories.length} categories</div>
            </div>
            <div className="pr-stat-card">
              <div className="pr-stat-label">Inventory value</div>
              <div className="pr-stat-value">{fmtKES(stats.value)}</div>
              <div className="pr-stat-sub">Sum of price × stock</div>
            </div>
            <div className="pr-stat-card">
              <div className="pr-stat-label">Low stock</div>
              <div className="pr-stat-value">{stats.low}</div>
              <div className={`pr-stat-sub ${stats.low ? "warn" : ""}`}>
                ≤ {LOW_STOCK_THRESHOLD} units
              </div>
            </div>
            <div className="pr-stat-card">
              <div className="pr-stat-label">Out of stock</div>
              <div className="pr-stat-value">{stats.out}</div>
              <div className={`pr-stat-sub ${stats.out ? "bad" : ""}`}>Restock needed</div>
            </div>
          </div>

          <div className="pr-toolbar">
            <div className="pr-search">
              <IconSearch />
              <input
                placeholder="Search by name or barcode…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <select className="pr-select" value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
              <option value="all">All categories</option>
              {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
            <select className="pr-select" value={stockFilter} onChange={(e) => setStockFilter(e.target.value)}>
              <option value="all">All stock</option>
              <option value="low">Low stock</option>
              <option value="out">Out of stock</option>
            </select>
            <div className="pr-view-toggle">
              <button className={`pr-view-btn ${view === "list" ? "active" : ""}`} onClick={() => setView("list")}>
                <IconList /> List
              </button>
              <button className={`pr-view-btn ${view === "grid" ? "active" : ""}`} onClick={() => setView("grid")}>
                <IconGrid /> Grid
              </button>
            </div>
          </div>

          {loading ? (
            <div className="pr-panel pr-empty">
              <div className="pr-spinner" />
              <div style={{ marginTop: 10 }}>Loading products…</div>
            </div>
          ) : filtered.length === 0 ? (
           <div className="pr-panel pr-empty">
              <div className="pr-empty-title">No products found</div>
              <div className="pr-empty-sub">
                Record your first Purchase Order to populate your inventory.
              </div>
            </div>
          ) : view === "list" ? (
            <div className="pr-panel">
              <table className="pr-table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Category</th>
                    <th>Barcode</th>
                    <th style={{ textAlign: "right" }}>Price</th>
                    
                    <th>Stock</th>
                    <th style={{ textAlign: "right" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((p) => (
                    <tr key={p.id}>
                      <td className="pr-name">{p.name}</td>
                      <td>{categoryById.get(p.category_id) || <span style={{ color: "var(--text3)" }}>—</span>}</td>
                      <td className="pr-barcode">{p.barcode || "—"}</td>
                      <td style={{ textAlign: "right", fontWeight: 500 }}>{fmtKES(p.price)}</td>
                      
                      <td>{stockBadge(p.stock_quantity || 0)}</td>
                      <td>
                        <div className="pr-row-actions">
                          <button className="btn btn-secondary btn-icon" onClick={() => setEditing(p)} title="Edit">
                            <IconEdit />
                          </button>
                          <button className="btn btn-danger btn-icon" onClick={() => deleteProduct(p)} title="Delete">
                            <IconTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="pr-grid">
              {filtered.map((p) => (
                <div className="pr-card" key={p.id}>
                  <div className="pr-card-top">
                    <div>
                      <div className="pr-card-name">{p.name}</div>
                      <div className="pr-card-cat">{categoryById.get(p.category_id) || "Uncategorised"}</div>
                    </div>
                    {stockBadge(p.stock_quantity || 0)}
                  </div>
                  <div className="pr-card-price">{fmtKES(p.price)}</div>
                  <div className="pr-card-meta">
                    <span>Tax {Number(p.tax_rate || 0)}%</span>
                    <span className="pr-barcode">{p.barcode || "no barcode"}</span>
                  </div>
                  <div className="pr-card-actions">
                    <button className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setEditing(p)}>
                      <IconEdit /> Edit
                    </button>
                    <button className="btn btn-danger btn-icon" onClick={() => deleteProduct(p)}>
                      <IconTrash />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {editing && (
          <ProductModal
            product={editing === "new" ? null : editing}
            categories={categories}
            onClose={() => setEditing(null)}
            onSave={saveProduct}
          />
        )}

        {toast && <div className={`pr-toast ${toast.kind}`}>✓ {toast.msg}</div>}
      </div>
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PRODUCT MODAL
// ─────────────────────────────────────────────────────────────────────────────
function ProductModal({ product, categories, onClose, onSave }) {
  const [form, setForm] = useState({
    id: product?.id || null,
    name: product?.name || "",
    category_id: product?.category_id || "",
    price: product?.price ?? "",
    tax_rate: product?.tax_rate ?? 16,
    stock_quantity: product?.stock_quantity ?? 0,
    barcode: product?.barcode || "",
  });
  const [saving, setSaving] = useState(false);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const submit = async (e) => {
    e.preventDefault();
    if (!product) return; // Failsafe
    setSaving(true);
    await onSave(form);
    setSaving(false);
  };

  const disabledStyle = { opacity: 0.6, cursor: "not-allowed", background: "var(--bg)" };

  return (
    <div className="pr-overlay" onClick={onClose}>
      <form className="pr-modal" onClick={(e) => e.stopPropagation()} onSubmit={submit}>
        <div className="pr-modal-header">
          <div>
            <div className="pr-modal-title">Edit Pricing</div>
            <div style={{ fontSize: 11, color: "var(--accent)", marginTop: 2 }}>Name and Stock are managed via Purchases</div>
          </div>
          <button type="button" className="pr-modal-close" onClick={onClose}>×</button>
        </div>
        
        <div className="pr-modal-body">
          <div className="pr-field">
            <label>Name 🔒</label>
            <input value={form.name} disabled style={disabledStyle} />
          </div>
          
          <div className="pr-field">
            <label>Category 🔒</label>
            <select value={form.category_id} disabled style={disabledStyle}>
              <option value="">— No category —</option>
              {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          
          <div className="pr-field-row">
            <div className="pr-field">
              <label>Selling Price (KES) *</label>
              {/* This is the ONLY editable input */}
              <input 
                type="number" min="0" step="0.01" 
                value={form.price} onChange={(e) => set("price", e.target.value)} 
                required autoFocus 
                style={{ borderColor: "var(--accent)", borderWidth: 2 }}
              />
            </div>
            <div className="pr-field">
              <label>Tax rate (%)</label>
              <input type="number" min="0" step="0.01" value={form.tax_rate} onChange={(e) => set("tax_rate", e.target.value)} />
            </div>
          </div>
          
          <div className="pr-field-row">
            <div className="pr-field">
              <label>Stock quantity 🔒</label>
              <input type="number" value={form.stock_quantity} disabled style={disabledStyle} />
            </div>
            <div className="pr-field">
              <label>Barcode 🔒</label>
              <input value={form.barcode} disabled style={disabledStyle} />
            </div>
          </div>
        </div>
        
        <div className="pr-modal-footer">
          <button type="button" className="btn btn-secondary" onClick={onClose} disabled={saving}>Cancel</button>
          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? "Saving…" : "Update Pricing"}
          </button>
        </div>
      </form>
    </div>
  );
}
