import { useState, useEffect, useRef } from "react";
import { supabase as supabaseClient } from "../config/supabase";

// ─────────────────────────────────────────────────────────────────────────────
// STYLES
// ─────────────────────────────────────────────────────────────────────────────
const styles = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

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
    --blue: #2563eb;
    --blue-light: #dbeafe;
    --blue-text: #1e40af;
    --teal: #0f766e;
    --teal-light: #ccfbf1;
    --teal-text: #134e4a;
    --text: #1a1230;
    --text2: #6b5e8a;
    --text3: #9d8fba;
    --radius: 10px;
    --radius-lg: 14px;
  }

  .p-wrap { font-family: 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background: var(--bg); min-height: 100vh; color: var(--text); }

  /* ── TOP BAR ── */
  .p-topbar {
    background: var(--card); border-bottom: 1px solid var(--border);
    padding: 0 28px; height: 58px; display: flex; align-items: center;
    justify-content: space-between; position: sticky; top: 0; z-index: 40;
  }
  .p-topbar-left { display: flex; align-items: center; gap: 20px; }
  .p-title { font-family: 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; font-weight: 700; font-size: 18px; color: var(--text); }
  .p-tabs { display: flex; gap: 4px; }
  .p-tab {
    padding: 6px 14px; border-radius: 8px; font-size: 13px; font-weight: 500;
    cursor: pointer; border: none; background: transparent; color: var(--text2);
    transition: all 0.15s; font-family: 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  }
  .p-tab:hover { background: var(--accent-light); color: var(--accent); }
  .p-tab.active { background: var(--accent); color: #fff; }
  .p-topbar-right { display: flex; align-items: center; gap: 10px; }
  .p-date { font-size: 12px; color: var(--text2); }

  /* ── BUTTONS ── */
  .btn {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 7px 16px; border-radius: 8px; font-size: 13px; font-weight: 500;
    cursor: pointer; border: none; font-family: 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
    transition: all 0.15s;
  }
  .btn-primary { background: var(--accent); color: #fff; }
  .btn-primary:hover { background: var(--accent-hover); }
  .btn-outline { background: transparent; color: var(--accent); border: 1px solid var(--accent); }
  .btn-outline:hover { background: var(--accent-light); }
  .btn-ghost { background: transparent; color: var(--text2); border: 1px solid var(--border); }
  .btn-ghost:hover { background: var(--bg); }
  .btn-green { background: var(--green); color: #fff; }
  .btn-green:hover { background: #047857; }
  .btn-danger { background: var(--red); color: #fff; }
  .btn-danger:hover { background: #b91c1c; }
  .btn-sm { padding: 5px 10px; font-size: 12px; }
  .btn:disabled { opacity: 0.5; cursor: not-allowed; }

  /* ── CONTENT ── */
  .p-content { padding: 24px 28px; }

  /* ── STAT ROW ── */
  .p-stats { display: grid; grid-template-columns: repeat(4,1fr); gap: 14px; margin-bottom: 22px; }
  .p-stat { background: var(--card); border-radius: var(--radius); padding: 14px 16px; border: 1px solid var(--border); }
  .p-stat-label { font-size: 11px; color: var(--text2); font-weight: 500; margin-bottom: 4px; text-transform: uppercase; letter-spacing: 0.05em; }
  .p-stat-value { font-family: 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; font-size: 20px; font-weight: 700; color: var(--text); }
  .p-stat-sub { font-size: 11px; color: var(--text3); margin-top: 2px; }
  .p-stat-sub.up { color: var(--green); }
  .p-stat-sub.down { color: var(--red); }

  /* ── TOOLBAR ── */
  .p-toolbar { display: flex; align-items: center; gap: 10px; margin-bottom: 16px; }
  .p-search-wrap { position: relative; flex: 1; max-width: 340px; }
  .p-search-wrap svg { position: absolute; left: 10px; top: 50%; transform: translateY(-50%); color: var(--text3); pointer-events: none; }
  .p-search { width: 100%; padding: 8px 12px 8px 34px; border: 1px solid var(--border); border-radius: 8px; font-size: 13px; background: var(--card); color: var(--text); font-family: 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; outline: none; }
  .p-search:focus { border-color: var(--accent); }
  .p-filter { padding: 8px 12px; border: 1px solid var(--border); border-radius: 8px; font-size: 13px; background: var(--card); color: var(--text2); font-family: 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; outline: none; cursor: pointer; }
  .p-filter:focus { border-color: var(--accent); }

  /* ── TABLE ── */
  .p-table-wrap { background: var(--card); border-radius: var(--radius-lg); border: 1px solid var(--border); overflow: hidden; }
  .p-table { width: 100%; border-collapse: collapse; }
  .p-table th { font-size: 11px; text-transform: uppercase; letter-spacing: 0.06em; color: var(--text2); font-weight: 500; padding: 11px 16px; text-align: left; background: #faf8ff; border-bottom: 1px solid var(--border); white-space: nowrap; }
  .p-table td { padding: 12px 16px; font-size: 13px; color: var(--text); border-bottom: 1px solid var(--border); vertical-align: middle; }
  .p-table tr:last-child td { border-bottom: none; }
  .p-table tbody tr:hover td { background: #faf8ff; cursor: pointer; }
  .p-table-empty { padding: 48px; text-align: center; color: var(--text3); font-size: 14px; }

  /* ── BADGES ── */
  .badge { display: inline-flex; align-items: center; gap: 4px; padding: 3px 9px; border-radius: 20px; font-size: 11px; font-weight: 600; white-space: nowrap; }
  .badge-green  { background: var(--green-light);  color: var(--green-text); }
  .badge-amber  { background: var(--amber-light);  color: var(--amber-text); }
  .badge-red    { background: var(--red-light);    color: var(--red-text); }
  .badge-blue   { background: var(--blue-light);   color: var(--blue-text); }

  /* ── MODAL ── */
  .modal-overlay {
    position: fixed; inset: 0; background: rgba(10,6,26,0.55);
    display: flex; align-items: center; justify-content: center;
    z-index: 200; padding: 20px;
  }
  .modal {
    background: var(--card); border-radius: var(--radius-lg);
    width: 100%; max-width: 680px; max-height: 92vh;
    display: flex; flex-direction: column; overflow: hidden;
    border: 1px solid var(--border);
    box-shadow: 0 20px 60px rgba(0,0,0,0.15);
  }
  .modal-sm { max-width: 440px; }
  .modal-header {
    padding: 18px 22px; border-bottom: 1px solid var(--border);
    display: flex; align-items: center; justify-content: space-between; flex-shrink: 0;
  }
  .modal-title { font-family: 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; font-weight: 700; font-size: 16px; color: var(--text); }
  .modal-subtitle { font-size: 12px; color: var(--text3); margin-top: 2px; }
  .modal-close {
    width: 28px; height: 28px; border-radius: 6px; border: none;
    background: var(--bg); color: var(--text2); cursor: pointer;
    display: flex; align-items: center; justify-content: center; font-size: 16px;
  }
  .modal-close:hover { background: var(--border); }
  .modal-body { padding: 22px; overflow-y: auto; flex: 1; display: flex; flex-direction: column; gap: 18px; }
  .modal-footer {
    padding: 14px 22px; border-top: 1px solid var(--border);
    display: flex; align-items: center; justify-content: flex-end; gap: 10px; flex-shrink: 0;
  }

  /* ── FORM FIELDS ── */
  .field { display: flex; flex-direction: column; gap: 5px; }
  .field label { font-size: 12px; font-weight: 500; color: var(--text2); }
  .field input, .field select, .field textarea {
    padding: 9px 12px; border: 1px solid var(--border); border-radius: 8px;
    font-size: 13px; background: var(--card); color: var(--text);
    font-family: 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; outline: none; transition: border-color 0.15s;
  }
  .field input:focus, .field select:focus { border-color: var(--accent); }
  .field input::placeholder { color: var(--text3); }
  .field-row { display: grid; gap: 12px; }
  .field-row-2 { grid-template-columns: 1fr 1fr; }

  /* ── NEW PURCHASE MODAL ── */
  .np-section { display: flex; flex-direction: column; gap: 10px; }
  .np-section-label {
    font-size: 11px; text-transform: uppercase; letter-spacing: 0.07em;
    color: var(--text2); font-weight: 600; padding-bottom: 8px;
    border-bottom: 1px solid var(--border);
  }

  /* Product search dropdown */
  .np-product-search { position: relative; }
  .np-dropdown {
    position: absolute; top: calc(100% + 4px); left: 0; right: 0;
    background: var(--card); border: 1px solid var(--border); border-radius: 8px;
    max-height: 220px; overflow-y: auto; z-index: 50;
    box-shadow: 0 4px 20px rgba(0,0,0,0.1);
  }
  .np-dropdown-item {
    padding: 10px 14px; cursor: pointer; display: flex; align-items: center;
    justify-content: space-between; font-size: 13px;
    border-bottom: 1px solid var(--border); transition: background 0.1s;
  }
  .np-dropdown-item:last-child { border-bottom: none; }
  .np-dropdown-item:hover { background: var(--accent-light); }
  .np-di-name { font-weight: 500; color: var(--text); }
  .np-di-meta { font-size: 11px; color: var(--text3); margin-top: 2px; }
  .np-di-stock { font-size: 12px; font-weight: 600; color: var(--accent); }

  /* Cart / items list */
  .np-items-list { display: flex; flex-direction: column; gap: 8px; min-height: 80px; }
  .np-items-empty {
    display: flex; align-items: center; justify-content: center;
    border: 2px dashed var(--border); border-radius: 8px; padding: 24px;
    color: var(--text3); font-size: 13px;
  }
  .np-item-row {
    display: grid; grid-template-columns: 1fr 80px 120px 100px 32px;
    gap: 10px; align-items: center;
    background: var(--bg); border-radius: 8px; padding: 10px 12px;
    border: 1px solid var(--border);
  }
  .np-item-name { font-size: 13px; font-weight: 500; color: var(--text); }
  .np-item-cat  { font-size: 11px; color: var(--text3); }
  .np-item-input {
    padding: 6px 10px; border: 1px solid var(--border); border-radius: 6px;
    font-size: 13px; font-family: 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
    background: var(--card); color: var(--text); outline: none; width: 100%;
  }
  .np-item-input:focus { border-color: var(--accent); }
  .np-item-total {
    font-family: 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; font-weight: 700; font-size: 13px;
    color: var(--text); text-align: right;
  }
  .np-remove-btn {
    width: 26px; height: 26px; border-radius: 6px; border: none;
    background: transparent; color: var(--text3); cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    transition: all 0.15s;
  }
  .np-remove-btn:hover { background: var(--red-light); color: var(--red); }

  /* Item row header */
  .np-item-header {
    display: grid; grid-template-columns: 1fr 80px 120px 100px 32px;
    gap: 10px; padding: 0 12px; margin-bottom: -2px;
  }
  .np-item-header span {
    font-size: 10px; text-transform: uppercase; letter-spacing: 0.06em;
    color: var(--text3); font-weight: 500;
  }

  /* Totals */
  .np-totals {
    border-top: 1px solid var(--border); padding-top: 12px;
    display: flex; flex-direction: column; gap: 6px;
  }
  .np-total-row { display: flex; justify-content: space-between; font-size: 13px; color: var(--text2); }
  .np-total-row.grand {
    font-family: 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; font-weight: 700; font-size: 17px;
    color: var(--text); padding-top: 6px; border-top: 1px solid var(--border);
    margin-top: 2px;
  }

  /* ── RECEIPT MODAL ── */
  .receipt { background: #fff; border-radius: 10px; border: 1px solid var(--border); padding: 20px; font-family: 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; max-width: 320px; margin: 0 auto; color: #000; }
  .receipt-store { text-align: center; font-family: 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; font-weight: 800; font-size: 16px; margin-bottom: 2px; }
  .receipt-sub { text-align: center; font-size: 11px; color: #666; margin-bottom: 12px; }
  .receipt-divider { border: none; border-top: 1px dashed #ccc; margin: 10px 0; }
  .receipt-row { display: flex; justify-content: space-between; font-size: 12px; margin: 4px 0; }
  .receipt-row.bold { font-weight: 700; font-size: 13px; }
  .receipt-row.total { font-family: 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; font-weight: 800; font-size: 15px; margin-top: 6px; }
  .receipt-footer { text-align: center; font-size: 11px; color: #666; margin-top: 12px; }

  /* ── PURCHASE DETAIL MODAL ── */
  .pd-meta { display: flex; flex-direction: column; gap: 4px; margin-bottom: 16px; }
  .pd-meta-row { display: flex; justify-content: space-between; font-size: 13px; }
  .pd-meta-label { color: var(--text2); }
  .pd-meta-value { font-weight: 500; color: var(--text); }
  .pd-items-title {
    font-size: 11px; font-weight: 600; color: var(--text2);
    text-transform: uppercase; letter-spacing: 0.06em; margin-bottom: 8px;
  }
  .pd-item-row {
    display: flex; justify-content: space-between; align-items: center;
    padding: 9px 0; border-bottom: 1px solid var(--border); font-size: 13px;
  }
  .pd-item-row:last-child { border-bottom: none; }
  .pd-item-name { font-weight: 500; }
  .pd-total-box {
    background: var(--accent-light); border-radius: 8px;
    padding: 12px 16px; display: flex; justify-content: space-between;
    align-items: center; margin-top: 16px;
  }
  .pd-total-label { font-size: 13px; color: var(--accent); font-weight: 500; }
  .pd-total-value { font-family: 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; font-weight: 800; font-size: 20px; color: var(--accent); }

  /* ── TOAST ── */
  .toast-wrap { position: fixed; bottom: 24px; right: 24px; display: flex; flex-direction: column; gap: 8px; z-index: 999; }
  .toast {
    padding: 12px 18px; border-radius: 10px; font-size: 13px; font-weight: 500;
    display: flex; align-items: center; gap: 8px; min-width: 240px;
    box-shadow: 0 4px 20px rgba(0,0,0,0.12); animation: slideIn 0.2s ease;
  }
  .toast-success { background: var(--green); color: #fff; }
  .toast-error   { background: var(--red);   color: #fff; }
  .toast-info    { background: var(--accent); color: #fff; }
  @keyframes slideIn { from { transform: translateX(60px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }

  .p-loading { display: flex; align-items: center; justify-content: center; padding: 80px; color: var(--text3); font-size: 14px; gap: 10px; }
  .spin { display: inline-block; animation: spin 1s linear infinite; }
  @keyframes spin { to { transform: rotate(360deg); } }

  /* ── SUPPLIER CARD in list ── */
  .supplier-list { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 16px; }
  .supplier-card {
    background: var(--card); border: 1px solid var(--border); border-radius: var(--radius-lg);
    padding: 16px 20px; display: flex; align-items: center; gap: 16px;
    transition: all 0.2s ease; cursor: default;
  }
  .supplier-card:hover { 
    border-color: var(--accent); 
    box-shadow: 0 4px 15px rgba(124,58,237,0.08); 
    transform: translateY(-2px); 
  }
  .supplier-avatar {
    width: 46px; height: 46px; border-radius: 12px;
    background: var(--accent-light); color: var(--accent);
    display: flex; align-items: center; justify-content: center;
    font-family: 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; font-weight: 700; font-size: 15px; flex-shrink: 0;
  }
  .supplier-info { flex: 1; overflow: hidden; }
  .supplier-name { 
    font-family: 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; font-size: 15px; font-weight: 700; color: var(--text); 
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  }
  .supplier-contact { 
    font-size: 12px; color: var(--text3); margin-top: 4px; 
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  }
  .supplier-stats { text-align: right; flex-shrink: 0; }
  .supplier-total { font-family: 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; font-weight: 800; font-size: 16px; color: var(--accent); }
  .supplier-count { 
    font-size: 11px; font-weight: 600; color: var(--text2); margin-top: 6px; 
    background: var(--bg); padding: 4px 8px; border-radius: 8px; display: inline-block; 
  }

  @media (max-width: 1040px) {
    .p-stats { grid-template-columns: repeat(2, minmax(0, 1fr)); }
    .supplier-list { grid-template-columns: 1fr; }
  }

  @media (max-width: 760px) {
    .p-wrap {
      min-height: auto;
    }
    .p-topbar {
      height: auto;
      min-height: 58px;
      padding: 12px 16px;
      gap: 10px;
      align-items: flex-start;
      flex-direction: column;
    }
    .p-topbar-left,
    .p-topbar-right {
      width: 100%;
      align-items: stretch;
      flex-direction: column;
      gap: 8px;
    }
    .p-tabs {
      width: 100%;
      overflow-x: auto;
      padding-bottom: 2px;
    }
    .p-tab {
      min-height: 40px;
      white-space: nowrap;
      flex: 0 0 auto;
    }
    .p-content {
      padding: 16px;
    }
    .p-stats {
      grid-template-columns: 1fr;
      gap: 10px;
    }
    .p-toolbar {
      align-items: stretch;
      flex-direction: column;
    }
    .p-search-wrap,
    .p-filter,
    .p-toolbar .btn {
      max-width: none;
      width: 100%;
      min-height: 40px;
    }
    .p-table-wrap {
      overflow-x: auto;
      border-radius: 8px;
    }
    .p-table {
      min-width: 860px;
    }
    .p-table th,
    .p-table td {
      padding: 10px 12px;
    }
    .modal-overlay {
      align-items: stretch;
      padding: 10px;
    }
    .modal {
      max-width: none;
      max-height: calc(100vh - 20px);
      border-radius: 10px;
    }
    .modal-body {
      padding: 16px;
    }
    .modal-footer {
      flex-wrap: wrap;
    }
    .modal-footer .btn {
      min-height: 40px;
      flex: 1;
      justify-content: center;
    }
    .field-row-2,
    .np-item-row,
    .np-item-header {
      grid-template-columns: 1fr;
    }
    .np-item-header {
      display: none;
    }
    .np-item-row {
      gap: 8px;
      align-items: stretch;
    }
    .np-item-total {
      text-align: left;
    }
    .receipt {
      max-width: 100%;
    }
    .supplier-card {
      align-items: flex-start;
    }
    .supplier-stats {
      text-align: left;
    }
  }
`;

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────
const fmt    = (n) => `KES ${Number(n || 0).toLocaleString("en-KE", { minimumFractionDigits: 0 })}`;
const fmtDate = (iso) => new Date(iso).toLocaleDateString("en-KE", { day: "numeric", month: "short", year: "numeric" });
const fmtTime = (iso) => new Date(iso).toLocaleTimeString("en-KE", { hour: "2-digit", minute: "2-digit" });
const fmtDateTime = (iso) => `${fmtDate(iso)} ${fmtTime(iso)}`;
const today   = () => new Date().toLocaleDateString("en-KE", { weekday: "short", day: "numeric", month: "long", year: "numeric" });
const initials = (name) => (name || "?").split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2);

// ─────────────────────────────────────────────────────────────────────────────
// SUPABASE SELECT STRINGS
// ─────────────────────────────────────────────────────────────────────────────
const PURCHASE_SELECT = `
  id,
  supplier_id,
  subtotal,
  tax_total,
  total_amount,
  discount_type,
  discount_value,
  created_at,
  suppliers(id, name, phone, email),
  purchase_items(
    id,
    product_id,
    quantity,
    cost_price,
    products(id, name, stock_quantity, categories(name))
  )
`;

const SUPPLIER_SELECT = `id, name, phone, email, created_at`;

const PRODUCT_SELECT  = `
  id, name, price, tax_rate, stock_quantity, barcode,
  categories(name)
`;

// ─────────────────────────────────────────────────────────────────────────────
// NORMALIZERS
// ─────────────────────────────────────────────────────────────────────────────
function normalizePurchase(p) {
  return {
    ...p,
    subtotal:       Number(p.subtotal || 0),
    tax_total:      Number(p.tax_total || 0),
    total_amount:   Number(p.total_amount || 0),
    discount_value: Number(p.discount_value || 0),
    supplier_name:  p.suppliers?.name  || "Unknown Supplier",
    supplier_phone: p.suppliers?.phone || "",
    items: (p.purchase_items || []).map(i => ({
      id:         i.id,
      product_id: i.product_id,
      quantity:   Number(i.quantity   || 0),
      cost_price: Number(i.cost_price || 0),
      name:       i.products?.name || "Unknown Product",
      category:   i.products?.categories?.name || "Uncategorized",
      stock_quantity: Number(i.products?.stock_quantity || 0),
    })),
  };
}

function normalizeSupplier(s) { return { ...s }; }

function normalizeProduct(p) {
  return {
    ...p,
    price:          Number(p.price || 0),
    tax_rate:       Number(p.tax_rate || 0),
    stock_quantity: Number(p.stock_quantity || 0),
    category:       p.categories?.name || "Uncategorized",
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// FETCH FUNCTIONS
// ─────────────────────────────────────────────────────────────────────────────
async function fetchPurchases() {
  const { data, error } = await supabaseClient
    .from("purchases")
    .select(PURCHASE_SELECT)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data || []).map(normalizePurchase);
}

async function fetchSuppliers() {
  const { data, error } = await supabaseClient
    .from("suppliers")
    .select(SUPPLIER_SELECT)
    .order("name", { ascending: true });
  if (error) throw error;
  return (data || []).map(normalizeSupplier);
}

async function fetchProducts() {
  const { data, error } = await supabaseClient
    .from("products")
    .select(PRODUCT_SELECT)
    .order("name", { ascending: true });
  if (error) throw error;
  return (data || []).map(normalizeProduct);
}


// ─────────────────────────────────────────────────────────────────────────────
// TOAST
// ─────────────────────────────────────────────────────────────────────────────
function Toast({ toasts }) {
  return (
    <div className="toast-wrap">
      {toasts.map(t => (
        <div key={t.id} className={`toast toast-${t.type}`}>
          {t.type === "success" ? "✓" : t.type === "error" ? "✕" : "ℹ"} {t.msg}
        </div>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PURCHASE RECEIPT MODAL
// ─────────────────────────────────────────────────────────────────────────────
function PurchaseReceipt({ purchase, items, onClose }) {
  if (!purchase) return null;
  return (
    <div className="modal-overlay">
      <div className="modal modal-sm">
        <div className="modal-header">
          <div className="modal-title">Purchase Receipt</div>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">
          <div className="receipt">
            <div className="receipt-store">SpiritsPOS - STOCK INWARD</div>
            <div className="receipt-sub">Supplier: {purchase.suppliers?.name || "Unknown"}</div>
            <div className="receipt-sub">{new Date().toLocaleString()}</div>
            <hr className="receipt-divider" />
            
            <div className="receipt-row bold">
              <span>Item (Qty)</span>
              <span>Subtotal</span>
            </div>
            
            {items.map((item, i) => (
              <div key={i} className="receipt-row">
                <span>{item.product.name} (x{item.qty})</span>
                <span>{fmt(item.qty * item.cost_price)}</span>
              </div>
            ))}
            
            <hr className="receipt-divider" />
            <div className="receipt-row"><span>Subtotal (Excl. VAT)</span><span>{fmt(purchase.subtotal)}</span></div>
            <div className="receipt-row"><span>Discount</span><span>− {fmt(purchase.discount_value || 0)}</span></div>
            <div className="receipt-row"><span>VAT (16%)</span><span>{fmt(purchase.tax_total)}</span></div>
            <div className="receipt-row total"><span>TOTAL PAID</span><span>{fmt(purchase.total_amount)}</span></div>
            <div className="receipt-footer">Stock successfully reconciled.</div>
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn btn-primary" onClick={() => window.print()}>🖨 Print Receipt</button>
          <button className="btn btn-ghost" onClick={onClose}>Done</button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// NEW PURCHASE MODAL
// ─────────────────────────────────────────────────────────────────────────────
function NewPurchaseModal({ suppliers, products, onClose, onSaved, addToast }) {
  const [supplierId, setSupplierId]   = useState("");
  const [search,     setSearch]       = useState("");
  const [showDrop,   setShowDrop]     = useState(false);
  const [items,      setItems]        = useState([]); 
  const [discountType,  setDiscountType]  = useState("none"); 
  const [discountValue, setDiscountValue] = useState("");
  const [saving, setSaving] = useState(false);
  
  // Receipt State
  const [showReceipt, setShowReceipt] = useState(false);
  const [savedPurchase, setSavedPurchase] = useState(null);
  
  const searchRef = useRef();

  const filteredProducts = search.length > 0
    ? products.filter(p =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.category.toLowerCase().includes(search.toLowerCase())
      )
    : products.slice(0, 10);

  const addItem = (product) => {
    setItems(prev => {
      const existing = prev.find(i => i.product.id === product.id);
      if (existing) {
        return prev.map(i => i.product.id === product.id ? { ...i, qty: i.qty + 1 } : i);
      }
      return [...prev, {
        product,
        qty: 1,
        cost_price: product.price || 0, // Defaulting to selling price for convenience
      }];
    });
    setSearch("");
    setShowDrop(false);
    searchRef.current?.focus();
  };

  const removeItem = (productId) => setItems(prev => prev.filter(i => i.product.id !== productId));

  const updateItem = (productId, field, value) => {
    setItems(prev => prev.map(i =>
      i.product.id === productId
        ? { ...i, [field]: field === "qty" ? Math.max(1, Number(value) || 1) : Number(value) || 0 }
        : i
    ));
  };

  // ── TAX & MATH LOGIC ───────────────────────────────────────────────────────
  const rawSubtotal = items.reduce((s, i) => s + (i.qty * i.cost_price), 0);
  
  // 1. The literal value to save to the database (e.g., 12 or 500)
  const dbDiscountValue = Number(discountValue) || 0;
  
  // 2. The calculated KES amount to subtract from the bill
  let discountAmountInKes = 0;

  if (discountType === "fixed") {
    discountAmountInKes = Math.min(dbDiscountValue, rawSubtotal);
  } else if (discountType === "percent") {
    discountAmountInKes = rawSubtotal * (Math.min(dbDiscountValue, 100) / 100);
  }
    
  // 3. Force exact 2 decimal rounding and calculate totals
  const discountedSubtotal = Math.max(0, rawSubtotal - discountAmountInKes);
  const vatAmount = Number((discountedSubtotal * 0.16).toFixed(2));
  const total = Number((discountedSubtotal + vatAmount).toFixed(2));

  const canSubmit = items.length > 0 && supplierId;

 // ── SAVE LOGIC ─────────────────────────────────────────────────────────────
  const handleSave = async () => {
    if (!canSubmit) return;
    setSaving(true);
    try {
      // 1. Insert Purchase Record
      const { data: purchase, error: purchaseError } = await supabaseClient
        .from("purchases")
        .insert({
          supplier_id:    supplierId,
          subtotal:       rawSubtotal,
          tax_total:      vatAmount,
          total_amount:   total,
          discount_type:  discountType === "none" ? null : discountType, // Keeps it as 'percent'
          discount_value: discountType === "none" ? 0 : dbDiscountValue, // Saves 12 instead of 12667
        })
        .select("*, suppliers(name)")
        .single();

      if (purchaseError) throw purchaseError;

      // 2. Insert Items
      const purchaseItemsPayload = items.map(i => ({
        purchase_id: purchase.id,
        product_id:  i.product.id,
        quantity:    i.qty,
        cost_price:  i.cost_price,
      }));

      const { error: itemsError } = await supabaseClient
        .from("purchase_items")
        .insert(purchaseItemsPayload);

      if (itemsError) throw itemsError;

      // 3. Update Inventory Manually
      for (const item of items) {
        const newStock = item.product.stock_quantity + item.qty;
        const { error: stockError } = await supabaseClient
          .from("products")
          .update({
            stock_quantity: newStock,
            updated_at: new Date().toISOString(),
          })
          .eq("id", item.product.id);

        if (stockError) throw stockError;
      }

      addToast("success", `Purchase recorded! Stock updated.`);
      setSavedPurchase(purchase);
      setShowReceipt(true);
      onSaved();
    } catch (err) {
      addToast("error", "Failed to record purchase: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  // If receipt is showing, hide the form and show the receipt component
  if (showReceipt) {
    return <PurchaseReceipt purchase={savedPurchase} items={items} onClose={onClose} />;
  }

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <div>
            <div className="modal-title">New Purchase Order</div>
            <div className="modal-subtitle">Add multiple items. Costs entered are Before VAT.</div>
          </div>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <div className="modal-body">
          {/* ── SUPPLIER ── */}
          <div className="np-section">
            <div className="np-section-label">Supplier</div>
            <div className="field">
              <select value={supplierId} onChange={e => setSupplierId(e.target.value)}>
                <option value="">— Choose a supplier —</option>
                {suppliers.map(s => (
                  <option key={s.id} value={s.id}>{s.name}{s.phone ? ` · ${s.phone}` : ""}</option>
                ))}
              </select>
            </div>
          </div>

          {/* ── PRODUCTS ── */}
          <div className="np-section">
            <div className="np-section-label">Products Received</div>

            {/* Search */}
            <div className="np-product-search">
              <input
                ref={searchRef}
                className="p-search"
                style={{ paddingLeft: 12, width: "100%", borderColor: items.length > 0 ? "var(--accent)" : "var(--border)" }}
                placeholder="Keep typing to add more products..."
                value={search}
                onChange={e => { setSearch(e.target.value); setShowDrop(true); }}
                onFocus={() => setShowDrop(true)}
                onBlur={() => setTimeout(() => setShowDrop(false), 150)}
              />
              {showDrop && filteredProducts.length > 0 && (
                <div className="np-dropdown">
                  {filteredProducts.map(p => (
                    <div key={p.id} className="np-dropdown-item" onMouseDown={() => addItem(p)}>
                      <div>
                        <div className="np-di-name">{p.name}</div>
                        <div className="np-di-meta">{p.category} · Stock: {p.stock_quantity}</div>
                      </div>
                      <div className="np-di-stock">+ Add</div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Items list */}
            {items.length > 0 && (
              <>
                <div className="np-item-header">
                  <span>Product</span>
                  <span>Qty</span>
                  <span>Cost/Unit (Excl. VAT)</span>
                  <span style={{ textAlign: "right" }}>Total</span>
                  <span></span>
                </div>
                <div className="np-items-list">
                  {items.map(item => (
                    <div key={item.product.id} className="np-item-row">
                      <div>
                        <div className="np-item-name">{item.product.name}</div>
                        <div className="np-item-cat">{item.product.category}</div>
                      </div>
                      <input
                        className="np-item-input"
                        type="number"
                        min="1"
                        value={item.qty}
                        onChange={e => updateItem(item.product.id, "qty", e.target.value)}
                      />
                      <input
                        className="np-item-input"
                        type="number"
                        min="0"
                        step="0.01"
                        value={item.cost_price}
                        onChange={e => updateItem(item.product.id, "cost_price", e.target.value)}
                        placeholder="0.00"
                      />
                      <div className="np-item-total">{fmt(item.qty * item.cost_price)}</div>
                      <button className="np-remove-btn" onClick={() => removeItem(item.product.id)} title="Remove">✕</button>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* ── TOTALS & TAX ── */}
          {items.length > 0 && (
            <div className="np-totals">
              <div className="np-total-row">
                <span>Subtotal (Excl. VAT)</span>
                <span>{fmt(rawSubtotal)}</span>
              </div>
              
              {/* Discount Section inside Totals for cleaner UI */}
              <div style={{ display: "flex", gap: 10, marginTop: 10, marginBottom: 10, padding: 10, background: "var(--bg)", borderRadius: 8 }}>
                <select style={{ fontSize: 12, padding: 4 }} value={discountType} onChange={e => { setDiscountType(e.target.value); setDiscountValue(""); }}>
                  <option value="none">No Discount</option>
                  <option value="fixed">Fixed (KES)</option>
                  <option value="percent">Percent (%)</option>
                </select>
                {discountType !== "none" && (
                  <input
                    style={{ fontSize: 12, padding: 4, width: 80 }}
                    type="number"
                    value={discountValue}
                    onChange={e => setDiscountValue(e.target.value)}
                    placeholder="Amount"
                  />
                )}
              </div>

              {discountAmount > 0 && (
                <div className="np-total-row" style={{ color: "var(--green)" }}>
                  <span>Discount</span>
                  <span>− {fmt(discountAmount)}</span>
                </div>
              )}

              <div className="np-total-row">
                <span>VAT (16%)</span>
                <span>{fmt(vatAmount)}</span>
              </div>

              <div className="np-total-row grand">
                <span>Grand Total</span>
                <span>{fmt(total)}</span>
              </div>
            </div>
          )}

          {/* Stock preview notice */}
          {items.length > 0 && (
            <div style={{ background: "var(--green-light)", color: "var(--green-text)", borderRadius: 8, padding: "10px 14px", fontSize: 12 }}>
              📦 Confirming this order will add the following stock:
              {items.map(i => (
                <span key={i.product.id} style={{ display: "block", marginTop: 4, fontWeight: 500 }}>
                  {i.product.name}: {i.product.stock_quantity} → {i.product.stock_quantity + i.qty} units
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button
            className="btn btn-primary"
            onClick={handleSave}
            disabled={!canSubmit || saving}
          >
            {saving ? "Recording…" : `Confirm Purchase — ${fmt(total)}`}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PURCHASE DETAIL MODAL
// ─────────────────────────────────────────────────────────────────────────────
function PurchaseDetailModal({ purchase, onClose }) {
  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal modal-sm">
        <div className="modal-header">
          <div>
            <div className="modal-title">Purchase Details</div>
            <div className="modal-subtitle" style={{ fontFamily: "monospace" }}>#{purchase.id.toUpperCase().slice(0, 8)}</div>
          </div>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">
          <div className="pd-meta">
            <div className="pd-meta-row">
              <span className="pd-meta-label">Supplier</span>
              <span className="pd-meta-value">{purchase.supplier_name}</span>
            </div>
            <div className="pd-meta-row">
              <span className="pd-meta-label">Date</span>
              <span className="pd-meta-value">{fmtDateTime(purchase.created_at)}</span>
            </div>
          </div>

          <div>
            <div className="pd-items-title">Items Received</div>
            {purchase.items.map((item, i) => (
              <div key={i} className="pd-item-row">
                <div>
                  <span className="pd-item-name">{item.name}</span>
                </div>
                <span className="pd-item-qty">× {item.quantity}</span>
                <span className="pd-item-cost">{fmt(item.cost_price * item.quantity)}</span>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 16, borderTop: "1px solid var(--border)", paddingTop: 12 }}>
             <div className="pd-meta-row">
              <span className="pd-meta-label">Subtotal</span>
              <span className="pd-meta-value">{fmt(purchase.subtotal)}</span>
            </div>
             <div className="pd-meta-row" style={{ marginTop: 4 }}>
              <span className="pd-meta-label">VAT (16%)</span>
              <span className="pd-meta-value">{fmt(purchase.tax_total)}</span>
            </div>
          </div>

          <div className="pd-total-box">
            <span className="pd-total-label">Total Paid</span>
            <span className="pd-total-value">{fmt(purchase.total_amount)}</span>
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn btn-ghost" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PURCHASES LIST TAB
// ─────────────────────────────────────────────────────────────────────────────
function PurchasesListTab({ purchases, suppliers, products, onNewPurchase, onSelectPurchase, addToast }) {
  const [search,     setSearch]     = useState("");
  const [filterSup,  setFilterSup]  = useState("all");
  const [dateFilter, setDateFilter] = useState("all");

  const todayStr = new Date().toDateString();

  const filtered = purchases.filter(p => {
    const matchSearch = !search ||
      p.supplier_name.toLowerCase().includes(search.toLowerCase()) ||
      p.items.some(i => i.name.toLowerCase().includes(search.toLowerCase()));
    const matchSup  = filterSup === "all" || p.supplier_id === filterSup;
    const matchDate = dateFilter === "all" || new Date(p.created_at).toDateString() === todayStr;
    return matchSearch && matchSup && matchDate;
  });

  const todayTotal   = purchases.filter(p => new Date(p.created_at).toDateString() === todayStr)
    .reduce((s, p) => s + p.total_amount, 0);
  const allTimeTotal = purchases.reduce((s, p) => s + p.total_amount, 0);
  const todayCount   = purchases.filter(p => new Date(p.created_at).toDateString() === todayStr).length;
  const totalUnits   = purchases.reduce((s, p) => s + p.items.reduce((si, i) => si + i.quantity, 0), 0);

  return (
    <>
      <div className="p-stats">
        <div className="p-stat">
          <div className="p-stat-label">Today's Purchases</div>
          <div className="p-stat-value">{fmt(todayTotal)}</div>
          <div className="p-stat-sub">{todayCount} order{todayCount !== 1 ? "s" : ""} today</div>
        </div>
        <div className="p-stat">
          <div className="p-stat-label">All Time Spent</div>
          <div className="p-stat-value">{fmt(allTimeTotal)}</div>
          <div className="p-stat-sub">{purchases.length} total orders</div>
        </div>
        <div className="p-stat">
          <div className="p-stat-label">Units Received</div>
          <div className="p-stat-value">{totalUnits.toLocaleString()}</div>
          <div className="p-stat-sub up">Across all purchases</div>
        </div>
        <div className="p-stat">
          <div className="p-stat-label">Suppliers Used</div>
          <div className="p-stat-value">{new Set(purchases.map(p => p.supplier_id)).size}</div>
          <div className="p-stat-sub">{suppliers.length} total suppliers</div>
        </div>
      </div>

      <div className="p-toolbar">
        <div className="p-search-wrap">
          <input
            className="p-search"
            placeholder="Search supplier or product…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <select className="p-filter" value={filterSup} onChange={e => setFilterSup(e.target.value)}>
          <option value="all">All suppliers</option>
          {suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
        </select>
        <select className="p-filter" value={dateFilter} onChange={e => setDateFilter(e.target.value)}>
          <option value="all">All time</option>
          <option value="today">Today</option>
        </select>
        <button className="btn btn-primary" onClick={onNewPurchase} style={{ marginLeft: "auto" }}>
          + New Purchase
        </button>
      </div>

      <div className="p-table-wrap">
        {filtered.length === 0 ? (
          <div className="p-table-empty">No purchases found. Record your first purchase order above.</div>
        ) : (
          <table className="p-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Supplier</th>
                <th>Items</th>
                <th>Units</th>
                <th>Total Cost</th>
                <th>Stock Impact</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(p => {
                const totalUnitsInOrder = p.items.reduce((s, i) => s + i.quantity, 0);
                return (
                  <tr key={p.id} onClick={() => onSelectPurchase(p)}>
                    <td style={{ whiteSpace: "nowrap" }}>
                      <div style={{ fontWeight: 500 }}>{fmtDate(p.created_at)}</div>
                      <div style={{ fontSize: 11, color: "var(--text3)" }}>{fmtTime(p.created_at)}</div>
                    </td>
                    <td>
                      <div style={{ fontWeight: 500 }}>{p.supplier_name}</div>
                    </td>
                    <td>
                      <div style={{ fontWeight: 500 }}>{p.items[0]?.name || "—"}</div>
                      {p.items.length > 1 && (
                        <div style={{ fontSize: 11, color: "var(--text3)" }}>+{p.items.length - 1} more</div>
                      )}
                    </td>
                    <td>
                      <span className="badge badge-blue">{totalUnitsInOrder} units</span>
                    </td>
                    <td style={{ fontFamily: "Segoe UI, Roboto, Helvetica Neue, Arial, sans-serif", fontWeight: 700 }}>{fmt(p.total_amount)}</td>
                    <td>
                      {p.items.slice(0, 2).map(i => (
                        <div key={i.product_id} style={{ fontSize: 11, color: "var(--green-text)", background: "var(--green-light)", borderRadius: 4, padding: "2px 6px", display: "inline-block", marginRight: 4, marginBottom: 2 }}>
                          +{i.quantity} {i.name.split(" ")[0]}
                        </div>
                      ))}
                    </td>
                    <td onClick={e => e.stopPropagation()}>
                      <button className="btn btn-ghost btn-sm" onClick={() => onSelectPurchase(p)}>View</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SUPPLIERS TAB
// ─────────────────────────────────────────────────────────────────────────────
function SuppliersTab({ suppliers, purchases }) {
  const supplierStats = suppliers.map(s => {
    const supplierPurchases = purchases.filter(p => p.supplier_id === s.id);
    const totalSpent = supplierPurchases.reduce((sum, p) => sum + p.total_amount, 0);
    const orderCount = supplierPurchases.length;
    const lastOrder  = supplierPurchases[0]?.created_at || null;
    return { ...s, totalSpent, orderCount, lastOrder };
  }).sort((a, b) => b.totalSpent - a.totalSpent);

  if (suppliers.length === 0) {
    return (
      <div className="p-table-empty" style={{ paddingTop: 60 }}>
        No suppliers yet. Add suppliers in the <strong>Contacts</strong> section.
      </div>
    );
  }

  return (
    <div className="supplier-list">
      {supplierStats.map(s => (
        <div key={s.id} className="supplier-card">
          <div className="supplier-avatar">{initials(s.name)}</div>
          <div className="supplier-info">
            <div className="supplier-name">{s.name}</div>
            <div className="supplier-contact">
              {[s.phone, s.email].filter(Boolean).join(" · ") || "No contact info"}
            </div>
            {s.lastOrder && (
              <div className="supplier-contact" style={{ marginTop: 2 }}>
                Last order: {fmtDate(s.lastOrder)}
              </div>
            )}
          </div>
          <div className="supplier-stats">
            <div className="supplier-total">{fmt(s.totalSpent)}</div>
            <div className="supplier-count">{s.orderCount} order{s.orderCount !== 1 ? "s" : ""}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN EXPORT
// ─────────────────────────────────────────────────────────────────────────────
export default function Purchases() {
  const [activeTab,  setActiveTab]  = useState("purchases");
  const [purchases,  setPurchases]  = useState([]);
  const [suppliers,  setSuppliers]  = useState([]);
  const [products,   setProducts]   = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [loadError,  setLoadError]  = useState("");

  const [showNew,       setShowNew]       = useState(false);
  const [selectedPurch, setSelectedPurch] = useState(null);

  const [toasts, setToasts] = useState([]);

  const addToast = (type, msg) => {
    const id = Date.now();
    setToasts(p => [...p, { id, type, msg }]);
    setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 3500);
  };

  const loadData = async (isSilent = false) => {
    if (!isSilent) setLoading(true);
    setLoadError("");
    try {
      const [purchasesData, suppliersData, productsData] = await Promise.all([
        fetchPurchases(),
        fetchSuppliers(),
        fetchProducts(),
      ]);
      setPurchases(purchasesData);
      setSuppliers(suppliersData);
      setProducts(productsData);
    } catch (err) {
      console.error(err);
      setLoadError(err.message || "Failed to load purchases data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    const hb = setInterval(() => { if (!document.hidden) loadData(true); }, 20000);
    return () => clearInterval(hb);
  }, []);

  const handleSaved = async () => {
    await loadData(true);
  };

  return (
    <>
      <style>{styles}</style>
      <div className="p-wrap">
        <div className="p-topbar">
          <div className="p-topbar-left">
            <div className="p-title">Purchases</div>
            <div className="p-tabs">
              <button
                className={`p-tab${activeTab === "purchases" ? " active" : ""}`}
                onClick={() => setActiveTab("purchases")}
              >
                Purchase Orders
              </button>
              <button
                className={`p-tab${activeTab === "suppliers" ? " active" : ""}`}
                onClick={() => setActiveTab("suppliers")}
              >
                Suppliers
              </button>
            </div>
          </div>
          <div className="p-topbar-right">
            <div className="p-date">{today()}</div>
            <button className="btn btn-primary btn-sm" onClick={() => setShowNew(true)}>
              + New Purchase
            </button>
          </div>
        </div>

        <div className="p-content">
          {loading ? (
            <div className="p-loading">
              <span className="spin">⏳</span> Loading purchases data…
            </div>
          ) : loadError ? (
            <div className="p-table-empty">
              <div style={{ marginBottom: 12 }}>{loadError}</div>
              <button className="btn btn-outline" onClick={() => loadData()}>Retry</button>
            </div>
          ) : (
            <>
              {activeTab === "purchases" && (
                <PurchasesListTab
                  purchases={purchases}
                  suppliers={suppliers}
                  products={products}
                  onNewPurchase={() => setShowNew(true)}
                  onSelectPurchase={setSelectedPurch}
                  addToast={addToast}
                />
              )}
              {activeTab === "suppliers" && (
                <SuppliersTab
                  suppliers={suppliers}
                  purchases={purchases}
                />
              )}
            </>
          )}
        </div>

        {showNew && (
          <NewPurchaseModal
            suppliers={suppliers}
            products={products}
            onClose={() => setShowNew(false)}
            onSaved={handleSaved}
            addToast={addToast}
          />
        )}
        {selectedPurch && (
          <PurchaseDetailModal
            purchase={selectedPurch}
            onClose={() => setSelectedPurch(null)}
          />
        )}

        <Toast toasts={toasts} />
      </div>
    </>
  );
}
