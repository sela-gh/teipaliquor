import { useState, useEffect, useRef } from "react";
import { supabase as supabaseClient } from "../config/supabase";

// ─────────────────────────────────────────────────────────────────────────────
// SUPABASE CLIENT
// Replace the values below with your actual Supabase project URL and anon key
// ─────────────────────────────────────────────────────────────────────────────
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;



// ─────────────────────────────────────────────────────────────────────────────
// DATA HELPERS
// ─────────────────────────────────────────────────────────────────────────────
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


  .s-wrap { font-family: 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background: var(--bg); min-height: 100vh; color: var(--text); }

  /* ── TOP BAR ── */
  .s-topbar {
    background: var(--card); border-bottom: 1px solid var(--border);
    padding: 0 28px; height: 58px; display: flex; align-items: center;
    justify-content: space-between; position: sticky; top: 0; z-index: 40;
  }
  .s-topbar-left { display: flex; align-items: center; gap: 20px; }
  .s-title { font-family: 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; font-weight: 700; font-size: 18px; color: var(--text); }
  .s-tabs { display: flex; gap: 4px; }
  .s-tab {
    padding: 6px 14px; border-radius: 8px; font-size: 13px; font-weight: 500;
    cursor: pointer; border: none; background: transparent; color: var(--text2);
    transition: all 0.15s;
  }
  .s-tab:hover { background: var(--accent-light); color: var(--accent); }
  .s-tab.active { background: var(--accent); color: #fff; }
  .s-tab-badge {
    display: inline-block; background: var(--red); color: #fff;
    font-size: 10px; font-weight: 700; padding: 1px 5px;
    border-radius: 8px; margin-left: 5px;
  }
  .s-tab.active .s-tab-badge { background: rgba(255,255,255,0.3); }

  .s-topbar-right { display: flex; align-items: center; gap: 10px; }
  .s-date { font-size: 12px; color: var(--text2); }

  /* ── PIN LOGIN SCREEN ── */
  .pin-wrap { display: flex; align-items: center; justify-content: center; min-height: 100vh; background: var(--bg); font-family: 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; }
  .pin-card { background: var(--card); padding: 40px; border-radius: 24px; box-shadow: 0 10px 40px rgba(120,80,200,0.08); text-align: center; max-width: 340px; width: 100%; border: 1px solid var(--border); }
  .pin-title { font-family: 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; font-size: 24px; font-weight: 700; color: var(--text); margin-bottom: 6px; }
  .pin-sub { font-size: 13px; color: var(--text2); margin-bottom: 28px; }
  
  .pin-display { display: flex; justify-content: center; gap: 12px; margin-bottom: 32px; height: 16px; }
  .pin-dot { width: 16px; height: 16px; border-radius: 50%; border: 2px solid var(--border); transition: 0.2s; }
  .pin-dot.filled { background: var(--accent); border-color: var(--accent); }
  .pin-dot.error { border-color: var(--red); background: var(--red-light); }
  
  .pin-pad { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; }
  .pin-btn { background: var(--bg); border: 1px solid var(--border); border-radius: 14px; height: 60px; font-family: 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; font-size: 22px; font-weight: 700; color: var(--text); cursor: pointer; transition: 0.1s; display: flex; align-items: center; justify-content: center; }
  .pin-btn:hover { background: var(--accent-light); border-color: var(--accent); color: var(--accent); }
  .pin-btn:active { transform: scale(0.95); }
  
  .pin-error-text { color: var(--red); font-size: 12px; font-weight: 600; min-height: 18px; margin-bottom: 12px; }

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
  .btn-danger { background: var(--red); color: #fff; }
  .btn-danger:hover { background: #b91c1c; }
  .btn-ghost { background: transparent; color: var(--text2); border: 1px solid var(--border); }
  .btn-ghost:hover { background: var(--bg); }
  .btn-green { background: var(--green); color: #fff; }
  .btn-green:hover { background: #047857; }
  .btn-sm { padding: 5px 10px; font-size: 12px; }
  .btn:disabled { opacity: 0.5; cursor: not-allowed; }

  /* ── CONTENT ── */
  .s-content { padding: 24px 28px; }

  /* ── STAT ROW ── */
  .s-stats { display: grid; grid-template-columns: repeat(4,1fr); gap: 14px; margin-bottom: 22px; }
  .s-stat { background: var(--card); border-radius: var(--radius); padding: 14px 16px; border: 1px solid var(--border); }
  .s-stat-label { font-size: 11px; color: var(--text2); font-weight: 500; margin-bottom: 4px; text-transform: uppercase; letter-spacing: 0.05em; }
  .s-stat-value { font-family: 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; font-size: 20px; font-weight: 700; color: var(--text); }
  .s-stat-sub { font-size: 11px; color: var(--text3); margin-top: 2px; }
  .s-stat-sub.up { color: var(--green); }
  .s-stat-sub.down { color: var(--red); }

  /* ── TOOLBAR ── */
  .s-toolbar { display: flex; align-items: center; gap: 10px; margin-bottom: 16px; }
  .s-search-wrap { position: relative; flex: 1; max-width: 340px; }
  .s-search-wrap svg { position: absolute; left: 10px; top: 50%; transform: translateY(-50%); color: var(--text3); pointer-events: none; }
  .s-search { width: 100%; padding: 8px 12px 8px 34px; border: 1px solid var(--border); border-radius: 8px; font-size: 13px; background: var(--card); color: var(--text); font-family: 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; outline: none; }
  .s-search:focus { border-color: var(--accent); }
  .s-filter { padding: 8px 12px; border: 1px solid var(--border); border-radius: 8px; font-size: 13px; background: var(--card); color: var(--text2); font-family: 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; outline: none; cursor: pointer; }
  .s-filter:focus { border-color: var(--accent); }

  /* ── TABLE ── */
  .s-table-wrap { background: var(--card); border-radius: var(--radius-lg); border: 1px solid var(--border); overflow: hidden; }
  .s-table { width: 100%; border-collapse: collapse; }
  .s-table th { font-size: 11px; text-transform: uppercase; letter-spacing: 0.06em; color: var(--text2); font-weight: 500; padding: 11px 16px; text-align: left; background: #faf8ff; border-bottom: 1px solid var(--border); white-space: nowrap; }
  .s-table td { padding: 12px 16px; font-size: 13px; color: var(--text); border-bottom: 1px solid var(--border); vertical-align: middle; }
  .s-table tr:last-child td { border-bottom: none; }
  .s-table tbody tr:hover td { background: #faf8ff; cursor: pointer; }
  .s-table-empty { padding: 48px; text-align: center; color: var(--text3); font-size: 14px; }

  /* ── BADGES ── */
  .badge { display: inline-flex; align-items: center; gap: 4px; padding: 3px 9px; border-radius: 20px; font-size: 11px; font-weight: 600; white-space: nowrap; }
  .badge-green  { background: var(--green-light);  color: var(--green-text); }
  .badge-amber  { background: var(--amber-light);  color: var(--amber-text); }
  .badge-red    { background: var(--red-light);    color: var(--red-text); }
  .badge-blue   { background: var(--blue-light);   color: var(--blue-text); }
  .badge-teal   { background: var(--teal-light);   color: var(--teal-text); }
  .badge-purple { background: var(--accent-light); color: var(--accent); }

  /* ── MODAL OVERLAY ── */
  .modal-overlay {
    position: fixed; inset: 0; background: rgba(10,6,26,0.55);
    display: flex; align-items: center; justify-content: center;
    z-index: 200; padding: 20px;
  }
  .modal {
    background: var(--card); border-radius: var(--radius-lg);
    width: 100%; max-width: 620px; max-height: 90vh;
    display: flex; flex-direction: column; overflow: hidden;
    border: 1px solid var(--border);
  }
  .modal-lg { max-width: 780px; }
  .modal-sm { max-width: 420px; }
  .modal-header {
    padding: 18px 22px; border-bottom: 1px solid var(--border);
    display: flex; align-items: center; justify-content: space-between;
    flex-shrink: 0;
  }
  .modal-title { font-family: 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; font-weight: 700; font-size: 16px; color: var(--text); }
  .modal-close {
    width: 28px; height: 28px; border-radius: 6px; border: none;
    background: var(--bg); color: var(--text2); cursor: pointer;
    display: flex; align-items: center; justify-content: center; font-size: 16px;
  }
  .modal-close:hover { background: var(--border); }
  .modal-body { padding: 22px; overflow-y: auto; flex: 1; }
  .modal-footer {
    padding: 14px 22px; border-top: 1px solid var(--border);
    display: flex; align-items: center; justify-content: flex-end; gap: 10px;
    flex-shrink: 0;
  }

  /* ── NEW SALE MODAL ── */
  .ns-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 22px; }
  .ns-left { display: flex; flex-direction: column; gap: 12px; }
  .ns-right { display: flex; flex-direction: column; gap: 12px; border-left: 1px solid var(--border); padding-left: 22px; }
  .ns-section-label { font-size: 11px; text-transform: uppercase; letter-spacing: 0.07em; color: var(--text2); font-weight: 600; margin-bottom: 4px; }
  .ns-product-search { position: relative; }
  .ns-product-search input { width: 100%; }
  .ns-dropdown {
    position: absolute; top: calc(100% + 4px); left: 0; right: 0;
    background: var(--card); border: 1px solid var(--border); border-radius: 8px;
    max-height: 200px; overflow-y: auto; z-index: 10;
    box-shadow: 0 4px 16px rgba(0,0,0,0.08);
  }
  .ns-dropdown-item {
    padding: 10px 12px; cursor: pointer; display: flex; align-items: center; justify-content: space-between;
    font-size: 13px; border-bottom: 1px solid var(--border);
  }
  .ns-dropdown-item:last-child { border-bottom: none; }
  .ns-dropdown-item:hover { background: var(--accent-light); }
  .ns-dropdown-item .di-name { font-weight: 500; color: var(--text); }
  .ns-dropdown-item .di-cat { font-size: 11px; color: var(--text3); margin-top: 1px; }
  .ns-dropdown-item .di-price { font-family: 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; font-weight: 700; color: var(--accent); font-size: 13px; }
  .ns-cart { flex: 1; display: flex; flex-direction: column; gap: 8px; min-height: 120px; }
  .ns-cart-empty { flex: 1; display: flex; align-items: center; justify-content: center; color: var(--text3); font-size: 13px; border: 2px dashed var(--border); border-radius: 8px; }
  .ns-cart-item { display: flex; align-items: center; gap: 10px; padding: 10px 12px; background: var(--bg); border-radius: 8px; border: 1px solid var(--border); }
  .ns-cart-item-name { flex: 1; font-size: 13px; font-weight: 500; color: var(--text); }
  .ns-cart-item-cat { font-size: 11px; color: var(--text3); }
  .ns-qty-ctrl { display: flex; align-items: center; gap: 6px; }
  .ns-qty-btn { width: 24px; height: 24px; border-radius: 6px; border: 1px solid var(--border); background: var(--card); color: var(--text); cursor: pointer; font-size: 14px; display: flex; align-items: center; justify-content: center; font-weight: 700; }
  .ns-qty-btn:hover { background: var(--accent-light); border-color: var(--accent); color: var(--accent); }
  .ns-qty-val { font-size: 13px; font-weight: 600; min-width: 20px; text-align: center; }
  .ns-cart-item-price { font-family: 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; font-size: 13px; font-weight: 700; color: var(--text); min-width: 70px; text-align: right; }
  .ns-remove { background: none; border: none; color: var(--text3); cursor: pointer; padding: 2px; border-radius: 4px; display: flex; align-items: center; }
  .ns-remove:hover { color: var(--red); background: var(--red-light); }
  .ns-totals { border-top: 1px solid var(--border); padding-top: 12px; display: flex; flex-direction: column; gap: 5px; }
  .ns-total-row { display: flex; justify-content: space-between; font-size: 13px; color: var(--text2); }
  .ns-total-row.grand { font-family: 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; font-weight: 700; font-size: 16px; color: var(--text); margin-top: 4px; }
  .ns-pay-methods { display: grid; grid-template-columns: repeat(3,1fr); gap: 8px; margin-top: 4px; }
  .ns-pay-btn {
    padding: 10px 8px; border-radius: 8px; border: 2px solid var(--border);
    background: var(--bg); color: var(--text); font-size: 12px; font-weight: 600;
    cursor: pointer; display: flex; flex-direction: column; align-items: center; gap: 4px;
    transition: all 0.15s; font-family: 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  }
  .ns-pay-btn:hover { border-color: var(--accent); background: var(--accent-light); color: var(--accent); }
  .ns-pay-btn.selected { border-color: var(--accent); background: var(--accent); color: #fff; }
  .ns-pay-icon { font-size: 18px; }

  /* credit fields */
  .ns-credit-fields { margin-top: 10px; display: flex; flex-direction: column; gap: 8px; }

  /* mpesa popup */
  .mpesa-popup { background: var(--bg); border-radius: 10px; border: 1px solid var(--border); padding: 16px; margin-top: 10px; }
  .mpesa-popup-title { font-size: 13px; font-weight: 600; color: var(--text); margin-bottom: 10px; display: flex; align-items: center; gap: 6px; }
  .mpesa-status { display: flex; align-items: center; gap: 8px; padding: 10px 12px; border-radius: 8px; font-size: 13px; margin-top: 10px; }
  .mpesa-status.waiting { background: var(--amber-light); color: var(--amber-text); }
  .mpesa-status.success { background: var(--green-light); color: var(--green-text); }
  .mpesa-status.failed  { background: var(--red-light);   color: var(--red-text); }
  .spin { display: inline-block; animation: spin 1s linear infinite; }
  @keyframes spin { to { transform: rotate(360deg); } }

  /* ── FORM FIELDS ── */
  .field { display: flex; flex-direction: column; gap: 5px; }
  .field label { font-size: 12px; font-weight: 500; color: var(--text2); }
  .field input, .field select, .field textarea {
    padding: 9px 12px; border: 1px solid var(--border); border-radius: 8px;
    font-size: 13px; background: var(--card); color: var(--text);
    font-family: 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; outline: none; transition: border-color 0.15s;
  }
  .field input:focus, .field select:focus, .field textarea:focus { border-color: var(--accent); }
  .field input::placeholder { color: var(--text3); }
  .field-hint { font-size: 11px; color: var(--text3); }

  /* ── SALE DETAIL MODAL ── */
  .sd-header { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 18px; }
  .sd-id { font-size: 11px; color: var(--text3); font-family: monospace; }
  .sd-amounts { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 18px; }
  .sd-amount-box { background: var(--bg); border-radius: 8px; padding: 12px 14px; border: 1px solid var(--border); }
  .sd-amount-label { font-size: 11px; color: var(--text2); margin-bottom: 4px; }
  .sd-amount-value { font-family: 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; font-size: 18px; font-weight: 700; color: var(--text); }
  .sd-items-title { font-size: 12px; font-weight: 600; color: var(--text2); text-transform: uppercase; letter-spacing: 0.06em; margin-bottom: 8px; }
  .sd-item-row { display: flex; justify-content: space-between; align-items: center; padding: 9px 0; border-bottom: 1px solid var(--border); font-size: 13px; }
  .sd-item-row:last-child { border-bottom: none; }
  .sd-item-name { font-weight: 500; }
  .sd-item-qty { color: var(--text3); margin: 0 12px; }
  .sd-item-total { font-weight: 600; font-family: 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; }
  .sd-payments { margin-top: 16px; }

  /* ── UNALLOCATED TAB ── */
  .ua-card { background: var(--card); border-radius: var(--radius-lg); border: 1px solid var(--border); overflow: hidden; }
  .ua-header { padding: 14px 18px; border-bottom: 1px solid var(--border); display: flex; align-items: center; justify-content: space-between; }
  .ua-title { font-family: 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; font-weight: 600; font-size: 14px; }
  .ua-amount-total { font-family: 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; font-weight: 700; font-size: 15px; color: var(--accent); }

  /* ── TO BE PAID TAB ── */
  .credit-card { background: var(--card); border: 1px solid var(--border); border-radius: 10px; padding: 14px 16px; display: flex; align-items: center; gap: 14px; }
  .credit-card:hover { border-color: var(--accent); }
  .credit-avatar { width: 36px; height: 36px; border-radius: 50%; background: var(--accent-light); color: var(--accent); display: flex; align-items: center; justify-content: center; font-size: 13px; font-weight: 700; flex-shrink: 0; }
  .credit-info { flex: 1; }
  .credit-name { font-size: 13px; font-weight: 600; color: var(--text); }
  .credit-items { font-size: 11px; color: var(--text3); margin-top: 2px; }
  .credit-amount { text-align: right; }
  .credit-owed { font-family: 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; font-size: 15px; font-weight: 700; color: var(--red); }
  .credit-date { font-size: 11px; color: var(--text3); margin-top: 2px; }

  /* ── THERMAL RECEIPT ── */
  .receipt-print-area { width: 100%; }
  .receipt {
    background: #fff;
    color: #111;
    width: 100%;
    max-width: 302px;
    margin: 0 auto;
    padding: 14px 10px;
    border: 1px solid var(--border);
    border-radius: 10px;
    font-family: 'Arial', 'Helvetica Neue', sans-serif;
    font-size: 11px;
    line-height: 1.35;
  }
  .receipt-store {
    text-align: center;
    font-family: Arial, Helvetica, sans-serif;
    font-weight: 800;
    font-size: 19px;
    letter-spacing: .2px;
    margin-bottom: 2px;
  }
  .receipt-sub {
    text-align: center;
    font-size: 10px;
    color: #555;
    margin-bottom: 8px;
  }
  .receipt-meta {
    display: flex;
    justify-content: space-between;
    gap: 8px;
    font-size: 9px;
    color: #555;
    margin-bottom: 7px;
  }
  .receipt-divider {
    border: none;
    border-top: 1px dashed #888;
    margin: 8px 0;
  }
  .receipt-items-head,
  .receipt-item {
    display: grid;
    grid-template-columns: minmax(0, 1fr) 34px 72px;
    column-gap: 6px;
    align-items: start;
  }
  .receipt-items-head {
    font-size: 9px;
    font-weight: 700;
    text-transform: uppercase;
    color: #555;
    margin-bottom: 4px;
  }
  .receipt-item {
    font-size: 10.5px;
    margin: 5px 0;
  }
  .receipt-item-name {
    min-width: 0;
    overflow-wrap: anywhere;
    font-weight: 500;
  }
  .receipt-item-qty {
    text-align: center;
    white-space: nowrap;
  }
  .receipt-item-amount {
    text-align: right;
    white-space: nowrap;
    font-variant-numeric: tabular-nums;
  }
  .receipt-summary {
    width: 100%;
    margin-top: 4px;
  }
  .receipt-row {
    display: grid;
    grid-template-columns: 1fr auto;
    column-gap: 12px;
    align-items: baseline;
    font-size: 10.5px;
    margin: 4px 0;
  }
  .receipt-row span:last-child {
    text-align: right;
    white-space: nowrap;
    font-variant-numeric: tabular-nums;
  }
  .receipt-row.bold {
    font-weight: 700;
    font-size: 11px;
  }
  .receipt-row.total {
    font-family: Arial, Helvetica, sans-serif;
    font-weight: 800;
    font-size: 15px;
    margin-top: 7px;
  }
  .receipt-footer {
    text-align: center;
    font-size: 9.5px;
    color: #555;
    margin-top: 10px;
    line-height: 1.5;
  }
  .receipt-actions {
    display: flex;
    gap: 8px;
    justify-content: center;
    margin-top: 14px;
  }

  /* Thermal-printer print layout.
     80mm is the common portable/POS roll width.
     The browser's print dialog can still be used to select the actual printer. */
  @media print {
    @page {
      size: 80mm auto;
      margin: 0;
    }

    html, body {
      width: 80mm !important;
      min-width: 80mm !important;
      margin: 0 !important;
      padding: 0 !important;
      background: #fff !important;
    }

    body * {
      visibility: hidden !important;
    }

    .receipt-print-area,
    .receipt-print-area * {
      visibility: visible !important;
    }

    .receipt-print-area {
      position: static !important;
      width: 80mm !important;
      height: auto !important;
      min-height: 0 !important;
      margin: 0 !important;
      padding: 0 !important;
      background: #fff !important;
    }

    .receipt {
      width: 80mm !important;
      max-width: none !important;
      margin: 0 !important;
      padding: 5mm 4mm 3mm !important;
      border: none !important;
      border-radius: 0 !important;
      box-shadow: none !important;
      color: #000 !important;
    }

    .receipt-actions,
    .modal-header,
    .modal-footer,
    .modal-overlay {
      background: transparent !important;
    }

    .receipt-actions {
      display: none !important;
    }
  }

  /* ── TOAST ── */
  .toast-wrap { position: fixed; bottom: 24px; right: 24px; display: flex; flex-direction: column; gap: 8px; z-index: 999; }
  .toast { padding: 12px 18px; border-radius: 10px; font-size: 13px; font-weight: 500; display: flex; align-items: center; gap: 8px; min-width: 240px; box-shadow: 0 4px 20px rgba(0,0,0,0.12); animation: slideIn 0.2s ease; }
  .toast-success { background: var(--green); color: #fff; }
  .toast-error   { background: var(--red);   color: #fff; }
  .toast-info    { background: var(--accent); color: #fff; }
  @keyframes slideIn { from { transform: translateX(60px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }

  @media (max-width: 1040px) {
    .s-stats { grid-template-columns: repeat(2, minmax(0, 1fr)); }
    .ns-grid { grid-template-columns: 1fr; }
    .ns-right {
      border-left: none;
      border-top: 1px solid var(--border);
      padding-left: 0;
      padding-top: 18px;
    }
  }

  @media (max-width: 760px) {
    .s-wrap { min-height: auto; }
    .s-topbar {
      height: auto;
      min-height: 58px;
      padding: 12px 16px;
      gap: 10px;
      align-items: flex-start;
      flex-direction: column;
    }
    .s-topbar-left,
    .s-topbar-right {
      width: 100%;
      align-items: stretch;
      flex-direction: column;
      gap: 8px;
    }
    .s-tabs {
      width: 100%;
      overflow-x: auto;
      padding-bottom: 2px;
    }
    .s-tab {
      min-height: 40px;
      white-space: nowrap;
      flex: 0 0 auto;
    }
    .s-content { padding: 16px; }
    .s-stats {
      grid-template-columns: 1fr;
      gap: 10px;
    }
    .s-toolbar {
      align-items: stretch;
      flex-direction: column;
    }
    .s-search-wrap,
    .s-filter,
    .s-toolbar .btn {
      max-width: none;
      width: 100%;
      min-height: 40px;
    }
    .s-table-wrap {
      overflow-x: auto;
      border-radius: 8px;
    }
    .s-table { min-width: 860px; }
    .s-table th,
    .s-table td { padding: 10px 12px; }
    .modal-overlay {
      align-items: stretch;
      padding: 10px;
    }
    .modal,
    .modal-lg,
    .modal-sm {
      max-width: none;
      max-height: calc(100vh - 20px);
      border-radius: 10px;
    }
    .modal-body { padding: 16px; }
    .modal-footer { flex-wrap: wrap; }
    .modal-footer .btn,
    .btn {
      min-height: 40px;
      justify-content: center;
    }
    .modal-footer .btn { flex: 1; }
    .ns-grid,
    .sd-amounts {
      grid-template-columns: 1fr;
    }
    .ns-pay-methods {
      grid-template-columns: 1fr;
    }
    .ns-cart-item {
      align-items: flex-start;
      flex-wrap: wrap;
    }
    .ns-cart-item-name { flex-basis: 100%; }
    .ns-cart-item-price {
      text-align: left;
      min-width: 0;
    }
    .credit-card {
      align-items: flex-start;
      flex-wrap: wrap;
    }
    .credit-amount {
      width: 100%;
      text-align: left;
    }
    .pin-card {
      max-width: calc(100vw - 32px);
      padding: 28px 22px;
      border-radius: 16px;
    }
    .pin-btn {
      min-height: 58px;
      height: auto;
    }
    .receipt { max-width: 100%; }
    .toast-wrap {
      left: 16px;
      right: 16px;
      bottom: 16px;
    }
    .toast { min-width: 0; }
  }
`;

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────
const fmt = (n) => `KES ${Number(n).toLocaleString("en-KE", { minimumFractionDigits: 0 })}`;
const fmtTime = (iso) => {
  const d = new Date(iso);
  return d.toLocaleTimeString("en-KE", { hour: "2-digit", minute: "2-digit" });
};
const fmtDate = (iso) => {
  const d = new Date(iso);
  return d.toLocaleDateString("en-KE", { day: "numeric", month: "short", year: "numeric" });
};
const fmtDateTime = (iso) => `${fmtDate(iso)} ${fmtTime(iso)}`;
const today = () => new Date().toLocaleDateString("en-KE", { weekday: "short", day: "numeric", month: "long", year: "numeric" });
const initials = (name) => name ? name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0,2) : "?";

const PRODUCT_SELECT = `
  id,
  name,
  category_id,
  price,
  tax_rate,
  stock_quantity,
  barcode,
  categories(name)
`;

const SALE_SELECT = `
  id,
  user_id,
  subtotal,
  discount_type,
  discount_value,
  tax_total,
  total_amount,
  status,
  payment_status,
  device_sale_id,
  sync_status,
  created_at,
  customer_name,
  customer_phone,
  amount_paid,
  users(name),
  sale_items(
    id,
    product_id,
    quantity,
    price,
    cost_price,
    tax_rate,
    tax_amount,
    device_sale_item_id,
    products(name)
  ),
  payments(
    id,
    amount,
    method,
    transaction_reference,
    created_at
  )
`;

const MPESA_SELECT = `
  id,
  till_number,
  amount,
  msisdn,
  first_name,
  bill_ref_number,
  mpesa_receipt_number,
  transaction_time,
  allocated,
  sale_id,
  created_at
`;

function normalizeProduct(product, costPrice) {
  return {
    ...product,
    price: Number(product.price || 0),
    tax_rate: Number(product.tax_rate || 0),
    stock_quantity: Number(product.stock_quantity || 0),
    category: product.categories?.name || "Uncategorized",
    // Cost of the most recent purchase for this product, if any has ever been recorded.
    // Kept null (not 0) when unknown, so it's clear this item has never had a cost logged
    // rather than looking like it was bought for free.
    cost_price: costPrice == null ? null : Number(costPrice),
  };
}

// Builds a map of product_id -> most recent purchase cost_price, by looking at
// purchase_items joined to their parent purchase's created_at and keeping the newest.
async function fetchLatestCostByProduct() {
  const { data, error } = await supabaseClient
    .from("purchase_items")
    .select("product_id, cost_price, purchases(created_at)");

  if (error) throw error;

  const latest = new Map();
  for (const row of data || []) {
    const createdAt = row.purchases?.created_at || "";
    const existing = latest.get(row.product_id);
    if (!existing || createdAt > existing.createdAt) {
      latest.set(row.product_id, { cost_price: Number(row.cost_price || 0), createdAt });
    }
  }
  return latest;
}

function normalizeSale(sale) {
  return {
    ...sale,
    subtotal: Number(sale.subtotal || 0),
    discount_value: Number(sale.discount_value || 0),
    tax_total: Number(sale.tax_total || 0),
    total_amount: Number(sale.total_amount || 0),
    amount_paid: Number(sale.amount_paid || 0),
    items: (sale.sale_items || []).map((item) => ({
      id: item.id,
      product_id: item.product_id,
      qty: Number(item.quantity || 0),
      price: Number(item.price || 0),
      cost_price: item.cost_price == null ? null : Number(item.cost_price),
      tax_rate: Number(item.tax_rate || 0),
      tax_amount: Number(item.tax_amount || 0),
      name: item.products?.name || "Unnamed Product",
    })),
    // Each payment record with its own created_at (the date cash was actually received)
    payments: (sale.payments || []).map((p) => ({
      id: p.id,
      amount: Number(p.amount || 0),
      method: p.method,
      transaction_reference: p.transaction_reference,
      paid_at: p.created_at,
    })),
    staff_name: sale.users?.name || null,
  };
}

function normalizeMpesaTransaction(txn) {
  return {
    ...txn,
    amount: Number(txn.amount || 0),
  };
}

async function fetchProducts() {
  const [{ data, error }, latestCosts] = await Promise.all([
    supabaseClient.from("products").select(PRODUCT_SELECT).order("name", { ascending: true }),
    fetchLatestCostByProduct(),
  ]);

  if (error) throw error;
  return (data || []).map((p) => normalizeProduct(p, latestCosts.get(p.id)?.cost_price ?? null));
}

async function fetchSales() {
  const { data, error } = await supabaseClient
    .from("sales")
    .select(SALE_SELECT)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data || []).map(normalizeSale);
}

async function fetchMpesaTransactions() {
  const { data, error } = await supabaseClient
    .from("mpesa_transactions")
    .select(MPESA_SELECT)
    .order("transaction_time", { ascending: false });

  if (error) throw error;
  return (data || []).map(normalizeMpesaTransaction);
}

function payBadge(status) {
  if (status === "paid")    return <span className="badge badge-green">Paid</span>;
  if (status === "pending") return <span className="badge badge-amber">To Be Paid</span>;
  if (status === "partial") return <span className="badge badge-blue">Partial</span>;
  return <span className="badge badge-red">{status}</span>;
}

// ─────────────────────────────────────────────────────────────────────────────
// TOAST
// ─────────────────────────────────────────────────────────────────────────────
function Toast({ toasts }) {
  return (
    <div className="toast-wrap">
      {toasts.map(t => (
        <div key={t.id} className={`toast toast-${t.type}`}>
          {t.type === "success" && "✓"} {t.type === "error" && "✕"} {t.type === "info" && "ℹ"} {t.msg}
        </div>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MPESA STK PUSH COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
function MpesaPopup({ amount, onSuccess, onCancel }) {
  const [phone, setPhone]   = useState("");
  const [status, setStatus] = useState("idle"); // idle | sending | waiting | success | failed | timeout
  const [receipt, setReceipt]       = useState("");
  const [errorMsg, setErrorMsg]     = useState("");
  const [secondsLeft, setSecondsLeft] = useState(60);
  const pollRef    = useRef(null);
  const timerRef   = useRef(null);
  const pollSince  = useRef(null); // timestamp when we started polling

  // ── Normalise phone to 2547XXXXXXXX ──────────────────────────────────────
  const normalisePhone = (raw) => {
    const digits = raw.replace(/\D/g, "");
    if (digits.startsWith("0") && digits.length === 10)  return "254" + digits.slice(1);
    if (digits.startsWith("254") && digits.length === 12) return digits;
    if (digits.startsWith("7") && digits.length === 9)   return "254" + digits;
    return digits; // return as-is if unknown format — Safaricom will reject if wrong
  };

  // ── Poll Supabase mpesa_transactions for the callback receipt ────────────
  const startPolling = (normalisedPhone) => {
    const POLL_INTERVAL_MS = 3000;  // check every 3 seconds
    const TIMEOUT_MS       = 60000; // give up after 60 seconds
    pollSince.current = Date.now();
    setSecondsLeft(60);

    // countdown timer for UX
    timerRef.current = setInterval(() => {
      setSecondsLeft(prev => {
        if (prev <= 1) { clearInterval(timerRef.current); return 0; }
        return prev - 1;
      });
    }, 1000);

    pollRef.current = setInterval(async () => {
      const elapsed = Date.now() - pollSince.current;

      if (elapsed > TIMEOUT_MS) {
        clearInterval(pollRef.current);
        clearInterval(timerRef.current);
        setStatus("timeout");
        return;
      }

      try {
        // Look for a NEW unallocated mpesa_transaction matching this phone
        // that arrived after we sent the STK push
        const since = new Date(pollSince.current - 5000).toISOString(); // 5s buffer
        const { data: txns, error } = await supabaseClient
          .from("mpesa_transactions")
          .select("mpesa_receipt_number, amount, msisdn, transaction_time")
          .eq("msisdn", normalisedPhone)
          .eq("allocated", false)
          .gte("transaction_time", since)
          .order("transaction_time", { ascending: false })
          .limit(1);

        if (error) return; // silently retry on network hiccup

        if (txns && txns.length > 0) {
          // Found it — payment confirmed!
          const txn = txns[0];
          clearInterval(pollRef.current);
          clearInterval(timerRef.current);
          setReceipt(txn.mpesa_receipt_number);
          setStatus("success");
          onSuccess({ receipt: txn.mpesa_receipt_number, phone: normalisedPhone });
        }
      } catch (_) {
        // network error — keep polling
      }
    }, POLL_INTERVAL_MS);
  };

  const sendSTK = async () => {
    const normalised = normalisePhone(phone);
    if (!normalised || normalised.length < 12) {
      setErrorMsg("Enter a valid Kenyan number e.g. 0712345678");
      return;
    }
    setErrorMsg("");
    setStatus("sending");

    try {
      const res = await fetch(`${SUPABASE_URL}/functions/v1/mock-daraja`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({ phone: normalised, amount: Math.ceil(amount) }),
      });

      const data = await res.json();

      // Safaricom returns ResponseCode "0" when the STK was dispatched successfully
      if (!res.ok || data.ResponseCode !== "0") {
        const msg = data.errorMessage || data.ResponseDescription || data.error || "STK push rejected by Safaricom";
        throw new Error(msg);
      }

      // STK dispatched — now wait for the customer to tap their PIN
      setStatus("waiting");
      startPolling(normalised);

    } catch (err) {
      console.error("STK error:", err);
      setErrorMsg(err.message || "Failed to send STK push");
      setStatus("failed");
    }
  };

  // Cleanup on unmount
  useEffect(() => () => {
    clearInterval(pollRef.current);
    clearInterval(timerRef.current);
  }, []);

  return (
    <div className="mpesa-popup">
      <div className="mpesa-popup-title">
        <span style={{ fontSize: 20 }}>📱</span> M-Pesa STK Push — {fmt(amount)}
      </div>

      {(status === "idle" || status === "failed" || status === "timeout") && (
        <>
          <div className="field">
            <label>Customer phone number</label>
            <input
              type="tel"
              placeholder="07XXXXXXXX or 2547XXXXXXXX"
              value={phone}
              onChange={e => { setPhone(e.target.value); setErrorMsg(""); }}
              style={{ width: "100%" }}
              onKeyDown={e => e.key === "Enter" && sendSTK()}
            />
            {errorMsg && (
              <div style={{ fontSize: 11, color: "var(--red)", marginTop: 4 }}>{errorMsg}</div>
            )}
          </div>

          {status === "timeout" && (
            <div className="mpesa-status failed" style={{ marginTop: 8 }}>
              ⏱ Timed out — customer did not confirm within 60 seconds.
            </div>
          )}
          {status === "failed" && !errorMsg && (
            <div className="mpesa-status failed" style={{ marginTop: 8 }}>
              ✕ STK push failed. Check the phone number and try again.
            </div>
          )}

          <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
            <button className="btn btn-green" onClick={sendSTK} disabled={!phone}>
              {status === "timeout" ? "Retry" : "Send Request"}
            </button>
            <button className="btn btn-ghost btn-sm" onClick={onCancel}>Cancel</button>
          </div>
        </>
      )}

      {status === "sending" && (
        <div className="mpesa-status waiting">
          <span className="spin">⏳</span> Connecting to Safaricom…
        </div>
      )}

      {status === "waiting" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 4 }}>
          <div className="mpesa-status waiting">
            <span className="spin">⏳</span>
            <span>
              Prompt sent to <strong>{phone}</strong> — waiting for PIN confirmation…
              <span style={{ marginLeft: 6, fontFamily: "monospace", fontSize: 12 }}>{secondsLeft}s</span>
            </span>
          </div>
          <div style={{ fontSize: 11, color: "var(--text3)", paddingLeft: 4 }}>
            The customer should see an M-Pesa prompt on their phone. Ask them to enter their PIN.
          </div>
          <button
            className="btn btn-ghost btn-sm"
            style={{ alignSelf: "flex-start" }}
            onClick={() => {
              clearInterval(pollRef.current);
              clearInterval(timerRef.current);
              setStatus("idle");
            }}
          >
            Cancel
          </button>
        </div>
      )}

      {status === "success" && (
        <div className="mpesa-status success">
          ✓ Payment confirmed — Receipt: <strong>{receipt}</strong>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// NEW SALE MODAL
// ─────────────────────────────────────────────────────────────────────────────
function NewSaleModal({ products, onClose, onSaved, addToast, currentUser }) {
  const [search, setSearch] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [cart, setCart] = useState([]);
  const [payMethod, setPayMethod] = useState(null); // cash | mpesa | credit
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [mpesaSuccess, setMpesaSuccess] = useState(null);
  const [saving, setSaving] = useState(false);
  const [staffList, setStaffList] = useState([]);
  const [selectedStaffId, setSelectedStaffId] = useState("");
  const searchRef = useRef();

  useEffect(() => {
    supabaseClient.from("users").select("id, name").order("name", { ascending: true }).then(({ data }) => {
      if (data) setStaffList(data);
    });
  }, []);

  const filtered = search.length > 1
    ? products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()) || p.category.toLowerCase().includes(search.toLowerCase()))
    : products.slice(0, 8);

  const addToCart = (product) => {
    setCart(prev => {
      const existing = prev.find(c => c.id === product.id);
      if (existing) return prev.map(c => c.id === product.id ? { ...c, qty: c.qty + 1 } : c);
      return [...prev, { ...product, qty: 1 }];
    });
    setSearch(""); setShowDropdown(false);
    searchRef.current?.focus();
  };

  const updateQty = (id, delta) => {
    setCart(prev => prev.map(c => c.id === id ? { ...c, qty: Math.max(1, c.qty + delta) } : c));
  };

  const removeItem = (id) => setCart(prev => prev.filter(c => c.id !== id));

  const subtotal = cart.reduce((s, c) => s + c.price * c.qty, 0);
  const total = subtotal;

  const canSubmit = cart.length > 0 && selectedStaffId && (
    payMethod === "cash" ||
    payMethod === "credit" ||
    (payMethod === "mpesa" && mpesaSuccess)
  );

  const handleSave = async () => {
    if (!canSubmit) return;
    setSaving(true);
    try {
      const now = new Date().toISOString();
      const salePayload = {
        user_id: selectedStaffId || currentUser?.id || null,
        subtotal,
        discount_type: "fixed",
        discount_value: 0,
        tax_total: 0,
        total_amount: total,
        status: "completed",
        payment_status: payMethod === "credit" ? "pending" : "paid",
        amount_paid: payMethod === "credit" ? 0 : total,
        customer_name: customerName || null,
        customer_phone: customerPhone || null,
        sync_status: "synced",
        device_sale_id: crypto.randomUUID(),
      };

      const { data: insertedSale, error: saleError } = await supabaseClient
        .from("sales")
        .insert(salePayload)
        .select("id, user_id, subtotal, discount_type, discount_value, tax_total, total_amount, status, payment_status, device_sale_id, sync_status, created_at, customer_name, customer_phone, amount_paid")
        .single();

      if (saleError) throw saleError;

      const saleItemsPayload = cart.map((item) => ({
        sale_id: insertedSale.id,
        product_id: item.id,
        quantity: item.qty,
        price: item.price,
        cost_price: item.cost_price ?? null,
        tax_rate: item.tax_rate || 0,
        tax_amount: 0,
        device_sale_item_id: crypto.randomUUID(),
      }));

      const { error: saleItemsError } = await supabaseClient
        .from("sale_items")
        .insert(saleItemsPayload);

      if (saleItemsError) throw saleItemsError;

      if (payMethod !== "credit") {
        const { error: paymentError } = await supabaseClient
          .from("payments")
          .insert({
            sale_id: insertedSale.id,
            amount: total,
            method: payMethod,
            transaction_reference: mpesaSuccess?.receipt || null,
          });

        if (paymentError) throw paymentError;
      }

for (const item of cart) {
        // Fetch the latest stock from the database to prevent overwriting
        const { data: latestData } = await supabaseClient
          .from("products")
          .select("stock_quantity")
          .eq("id", item.id)
          .single();
          
        const currentStock = latestData ? Number(latestData.stock_quantity || 0) : Number(item.stock_quantity || 0);

        const { error: stockError } = await supabaseClient
          .from("products")
          .update({
            stock_quantity: Math.max(0, currentStock - item.qty),
            updated_at: now,
          })
          .eq("id", item.id);

        if (stockError) throw stockError;
      }

      const createdSale = normalizeSale({
        ...insertedSale,
        sale_items: cart.map((item) => ({
          id: crypto.randomUUID(),
          product_id: item.id,
          quantity: item.qty,
          price: item.price,
          cost_price: item.cost_price ?? null,
          tax_rate: item.tax_rate || 0,
          tax_amount: 0,
          products: { name: item.name },
        })),
      });

      
      addToast("success", "Sale recorded successfully!");
      await onSaved(createdSale);
      onClose();
    } catch (err) {
      addToast("error", "Failed to save sale: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal modal-lg">
        <div className="modal-header">
          <div className="modal-title">New Sale</div>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">
          <div className="ns-grid">
            {/* LEFT — product search */}
            <div className="ns-left">
              <div>
                <div className="ns-section-label">Add Products</div>
                <div className="ns-product-search">
                  <input
                    ref={searchRef}
                    className="s-search"
                    style={{ width: "100%", paddingLeft: 12 }}
                    placeholder="Search product by name or category…"
                    value={search}
                    onChange={e => { setSearch(e.target.value); setShowDropdown(true); }}
                    onFocus={() => setShowDropdown(true)}
                    onBlur={() => setTimeout(() => setShowDropdown(false), 150)}
                    autoFocus
                  />
                  {showDropdown && filtered.length > 0 && (
                    <div className="ns-dropdown">
                      {filtered.map(p => (
                        <div key={p.id} className="ns-dropdown-item" onMouseDown={() => addToCart(p)}>
                          <div>
                            <div className="di-name">{p.name}</div>
                            <div className="di-cat">{p.category} · Stock: {p.stock_quantity}</div>
                          </div>
                          <div className="di-price">{fmt(p.price)}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* cart */}
              <div className="ns-cart">
                {cart.length === 0
                  ? <div className="ns-cart-empty">Search and add products above</div>
                  : cart.map(item => (
                    <div key={item.id} className="ns-cart-item">
                      <div style={{ flex: 1 }}>
                        <div className="ns-cart-item-name">{item.name}</div>
                        <div className="ns-cart-item-cat">{item.category}</div>
                      </div>
                      <div className="ns-qty-ctrl">
                        <button className="ns-qty-btn" onClick={() => updateQty(item.id, -1)}>−</button>
                        <span className="ns-qty-val">{item.qty}</span>
                        <button className="ns-qty-btn" onClick={() => updateQty(item.id, 1)}>+</button>
                      </div>
                      <div className="ns-cart-item-price">{fmt(item.price * item.qty)}</div>
                      <button className="ns-remove" onClick={() => removeItem(item.id)}>
                        <svg width="14" height="14" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd"/></svg>
                      </button>
                    </div>
                  ))
                }
              </div>

              {/* totals */}
              {cart.length > 0 && (
                <div className="ns-totals">
                  <div className="ns-total-row"><span>Subtotal</span><span>{fmt(subtotal)}</span></div>
             
                  <div className="ns-total-row grand"><span>Total</span><span>{fmt(total)}</span></div>
                </div>
              )}
            </div>

            {/* RIGHT — payment */}
            <div className="ns-right">
              {/* Staff selector */}
              <div className="field">
                <label>👤 Served by (required)</label>
                <select value={selectedStaffId} onChange={e => setSelectedStaffId(e.target.value)}>
                  <option value="">— Select staff member —</option>
                  {staffList.map(u => (
                    <option key={u.id} value={u.id}>{u.name}</option>
                  ))}
                </select>
              </div>

              <div className="ns-section-label">Payment Method</div>
              <div className="ns-pay-methods">
                {[
                  { id: "cash",   icon: "💵", label: "Cash" },
                  { id: "mpesa",  icon: "📱", label: "M-Pesa" },
                  { id: "credit", icon: "📋", label: "To Be Paid" },
                ].map(m => (
                  <button
                    key={m.id}
                    className={`ns-pay-btn${payMethod === m.id ? " selected" : ""}`}
                    onClick={() => { setPayMethod(m.id); setMpesaSuccess(null); }}
                  >
                    <span className="ns-pay-icon">{m.icon}</span>
                    {m.label}
                  </button>
                ))}
              </div>

              {/* M-Pesa STK */}
              {payMethod === "mpesa" && !mpesaSuccess && (
                <MpesaPopup
                  amount={total}
                  onSuccess={(data) => { setMpesaSuccess(data); setCustomerPhone(data.phone); }}
                  onCancel={() => setPayMethod(null)}
                />
              )}
              {payMethod === "mpesa" && mpesaSuccess && (
                <div className="mpesa-status success" style={{ marginTop: 10 }}>
                  ✓ M-Pesa confirmed — {mpesaSuccess.receipt}
                </div>
              )}

              {/* Credit fields */}
              {payMethod === "credit" && (
                <div className="ns-credit-fields">
                  <div style={{ background: "var(--amber-light)", color: "var(--amber-text)", borderRadius: 8, padding: "10px 12px", fontSize: 12 }}>
                    This sale will be recorded as unpaid and appear in "To Be Paid".
                  </div>
                  <div className="field">
                    <label>Customer name (optional)</label>
                    <input placeholder="Leave blank if unknown" value={customerName} onChange={e => setCustomerName(e.target.value)} />
                  </div>
                  <div className="field">
                    <label>Customer phone (optional)</label>
                    <input placeholder="07XXXXXXXX" value={customerPhone} onChange={e => setCustomerPhone(e.target.value)} />
                  </div>
                </div>
              )}

              {/* Cash note */}
              {payMethod === "cash" && (
                <div style={{ background: "var(--green-light)", color: "var(--green-text)", borderRadius: 8, padding: "10px 12px", fontSize: 12, marginTop: 10 }}>
                  💵 Cash payment — Total due: <strong>{fmt(total)}</strong>
                </div>
              )}

              {/* Summary box */}
              {cart.length > 0 && (
                <div style={{ marginTop: "auto", paddingTop: 12, borderTop: "1px solid var(--border)" }}>
                  <div style={{ fontSize: 12, color: "var(--text2)", marginBottom: 6 }}>Order summary</div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, fontWeight: 500 }}>
                    <span>{cart.reduce((s,c) => s + c.qty, 0)} item{cart.reduce((s,c) => s + c.qty, 0) !== 1 ? "s" : ""}</span>
                    <span style={{ fontFamily: "Segoe UI, Roboto, Helvetica Neue, Arial, sans-serif", fontWeight: 700 }}>{fmt(total)}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn btn-ghost" onClick={onClose}>Discard</button>
          <button className="btn btn-primary" onClick={handleSave} disabled={!canSubmit || saving}>
            {saving ? "Saving…" : `Record Sale — ${fmt(total)}`}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SALE DETAIL MODAL
// ─────────────────────────────────────────────────────────────────────────────
function SaleDetailModal({ sale, onClose, onMarkPaid, addToast }) {
  const [marking, setMarking] = useState(false);
  const [payMethod, setPayMethod] = useState("cash");

  // 1. MOVE THIS LINE HERE so the whole component can see it!
  const balanceOwed = sale.total_amount - sale.amount_paid;

  const handleMarkPaid = async (paymentData = null) => {
    setMarking(true);
    try {
      // 2. Pass the balance explicitly to the main function
      await onMarkPaid(sale, {
        amount: balanceOwed, 
        method: paymentData?.receipt ? "mpesa" : payMethod,
        transactionReference: paymentData?.receipt || null,
      });
      
      addToast("success", "Payment applied successfully!");
      onClose();
    } catch (err) {
      addToast("error", "Failed to update: " + err.message);
    } finally {
      setMarking(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <div>
            <div className="modal-title">Sale Details</div>
            <div className="sd-id">#{sale.id.toUpperCase()}</div>
          </div>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
            <div>
              {payBadge(sale.payment_status)}
              <span style={{ marginLeft:8, fontSize:12, color:"var(--text3)" }}>{fmtDateTime(sale.created_at)}</span>
            </div>
            {sale.customer_name && (
              <span style={{ fontSize:13, color:"var(--text2)" }}>👤 {sale.customer_name}</span>
            )}
          </div>

          <div className="sd-amounts">
            <div className="sd-amount-box">
              <div className="sd-amount-label">Total Amount</div>
              <div className="sd-amount-value">{fmt(sale.total_amount)}</div>
            </div>
            <div className="sd-amount-box">
              <div className="sd-amount-label">Amount Paid</div>
              <div className="sd-amount-value" style={{ color: sale.amount_paid >= sale.total_amount ? "var(--green)" : "var(--red)" }}>
                {fmt(sale.amount_paid)}
              </div>
            </div>
            {sale.amount_paid < sale.total_amount && (
              <div className="sd-amount-box" style={{ gridColumn:"1/-1", background:"var(--red-light)" }}>
                <div className="sd-amount-label" style={{ color:"var(--red-text)" }}>Balance Owed</div>
                <div className="sd-amount-value" style={{ color:"var(--red)" }}>{fmt(sale.total_amount - sale.amount_paid)}</div>
              </div>
            )}
          </div>

          <div className="sd-items-title">Items</div>
{(sale.items || []).map((item, i) => (
              <div key={i} className="receipt-row">
                <span>{item.name} (x{item.qty} @ {fmt(item.price)})</span>
                <span>{fmt(item.price * item.qty)}</span>
              </div>
            ))}
            <hr className="receipt-divider" />
            <div className="receipt-row"><span>Subtotal</span><span>{fmt(sale.subtotal)}</span></div>
            <div className="receipt-row total"><span>TOTAL</span><span>{fmt(sale.total_amount)}</span></div>
          ))}

          {sale.payment_status !== "paid" && (
            <div style={{ marginTop:20, padding:"14px 16px", background:"var(--bg)", borderRadius:10, border:"1px solid var(--border)" }}>
              <div style={{ fontSize:13, fontWeight:600, marginBottom:10 }}>Collect Payment</div>
              <div style={{ display:"flex", gap:8, marginBottom:10 }}>
                {["cash","mpesa"].map(m => (
                  <button key={m} className={`ns-pay-btn${payMethod===m?" selected":""}`} style={{ flex:1 }} onClick={() => setPayMethod(m)}>
                    {m === "cash" ? "💵 Cash" : "📱 M-Pesa"}
                  </button>
                ))}
              </div>
              {payMethod === "mpesa" && (
                <MpesaPopup amount={sale.total_amount - sale.amount_paid} onSuccess={handleMarkPaid} onCancel={() => setPayMethod("cash")} />
              )}
            </div>
          )}
        </div>
        <div className="modal-footer">
          <button className="btn btn-ghost" onClick={onClose}>Close</button>
          {sale.payment_status !== "paid" && payMethod === "cash" && (
            <button className="btn btn-green" onClick={handleMarkPaid} disabled={marking}>
  {marking ? "Updating…" : `Pay Balance — ${fmt(balanceOwed)}`}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// RECEIPT MODAL
// ─────────────────────────────────────────────────────────────────────────────
function ReceiptModal({ sale, onClose }) {
  const paymentMethod = sale.payment_status === "pending"
    ? "To Be Paid"
    : (sale.payments?.length
        ? sale.payments[sale.payments.length - 1].method?.toUpperCase()
        : "Paid");

  const printReceipt = () => {
    const receipt = document.querySelector(".receipt-print-area .receipt");
    if (!receipt) return;

    // Print from a separate, receipt-only document. This prevents the
    // dashboard/app layout from creating a large blank area on the roll.
    const printWindow = window.open("", "_blank", "width=420,height=700");
    if (!printWindow) {
      window.print();
      return;
    }

    printWindow.document.open();
    printWindow.document.write(`<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <title>Receipt</title>
  <style>
    @page {
      size: 80mm auto;
      margin: 0;
    }

    * {
      box-sizing: border-box;
    }

    html, body {
      width: 80mm;
      margin: 0;
      padding: 0;
      background: #fff;
    }

    body {
      font-family: Arial, Helvetica, sans-serif;
      color: #000;
      font-size: 11px;
      line-height: 1.35;
    }

    .receipt {
      width: 80mm;
      margin: 0;
      padding: 5mm 4mm 3mm;
      background: #fff;
      color: #000;
      border: 0;
      border-radius: 0;
      box-shadow: none;
      overflow: visible;
    }

    .receipt-store {
      text-align: center;
      font-weight: 800;
      font-size: 19px;
      margin-bottom: 2px;
    }

    .receipt-sub {
      text-align: center;
      font-size: 10px;
      color: #555;
      margin-bottom: 8px;
    }

    .receipt-meta {
      display: flex;
      justify-content: space-between;
      gap: 8px;
      font-size: 9px;
      color: #555;
      margin-bottom: 7px;
    }

    .receipt-divider {
      border: 0;
      border-top: 1px dashed #888;
      margin: 8px 0;
    }

    .receipt-items-head,
    .receipt-item {
      display: grid;
      grid-template-columns: minmax(0, 1fr) 34px 72px;
      column-gap: 6px;
      align-items: start;
    }

    .receipt-items-head {
      font-size: 9px;
      font-weight: 700;
      text-transform: uppercase;
      color: #555;
      margin-bottom: 4px;
    }

    .receipt-item {
      font-size: 10.5px;
      margin: 5px 0;
    }

    .receipt-item-name {
      min-width: 0;
      overflow-wrap: anywhere;
      font-weight: 500;
    }

    .receipt-item-qty {
      text-align: center;
      white-space: nowrap;
    }

    .receipt-item-amount {
      text-align: right;
      white-space: nowrap;
      font-variant-numeric: tabular-nums;
    }

    .receipt-row {
      display: grid;
      grid-template-columns: 1fr auto;
      column-gap: 12px;
      align-items: baseline;
      font-size: 10.5px;
      margin: 4px 0;
    }

    .receipt-row span:last-child {
      text-align: right;
      white-space: nowrap;
      font-variant-numeric: tabular-nums;
    }

    .receipt-row.bold {
      font-weight: 700;
      font-size: 11px;
    }

    .receipt-row.total {
      font-weight: 800;
      font-size: 15px;
      margin-top: 7px;
    }

    .receipt-footer {
      text-align: center;
      font-size: 9.5px;
      color: #555;
      margin-top: 10px;
      line-height: 1.5;
    }
  </style>
</head>
<body>
  ${receipt.outerHTML}
  <script>
    window.addEventListener("load", function () {
      setTimeout(function () {
        window.focus();
        window.print();
      }, 150);
    });

    window.addEventListener("afterprint", function () {
      window.close();
    });
  <\/script>
</body>
</html>`);
    printWindow.document.close();
  };

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal modal-sm">
        <div className="modal-header">
          <div className="modal-title">Receipt</div>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <div className="modal-body">
          <div className="receipt-print-area">
            <div className="receipt">
              <div className="receipt-store">Teipa House</div>
              <div className="receipt-sub">Liquor Store</div>

              <div className="receipt-meta">
                <span>{fmtDate(sale.created_at)}</span>
                <span>{fmtTime(sale.created_at)}</span>
              </div>

              <hr className="receipt-divider" />

              <div className="receipt-items-head">
                <span>Item</span>
                <span style={{ textAlign: "center" }}>Qty</span>
                <span style={{ textAlign: "right" }}>Amount</span>
              </div>

              {(sale.items || []).map((item, i) => (
                <div key={i} className="receipt-item">
                  <span className="receipt-item-name">{item.name}</span>
                  <span className="receipt-item-qty">{item.qty}</span>
                  <span className="receipt-item-amount">{fmt(item.price * item.qty)}</span>
                </div>
              ))}

              <hr className="receipt-divider" />

              <div className="receipt-summary">
                <div className="receipt-row">
                  <span>Subtotal</span>
                  <span>{fmt(sale.subtotal)}</span>
                </div>

                <div className="receipt-row">
                  <span>Tax</span>
                  <span>{fmt(0)}</span>
                </div>

                <div className="receipt-row total">
                  <span>TOTAL</span>
                  <span>{fmt(sale.total_amount)}</span>
                </div>

                <hr className="receipt-divider" />

                <div className="receipt-row bold">
                  <span>Payment</span>
                  <span>{paymentMethod}</span>
                </div>
              </div>

              <div className="receipt-footer">
                Thank you for your business!<br />
                Please come again.
              </div>
            </div>
          </div>

          <div className="receipt-actions">
            <button className="btn btn-outline btn-sm" onClick={printReceipt}>
              🖨 Print Receipt
            </button>
            <button className="btn btn-ghost btn-sm" onClick={onClose}>Close</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SALES LIST TAB
// ─────────────────────────────────────────────────────────────────────────────
function SalesListTab({ sales, onNewSale, onSelectSale, onShowReceipt }) {
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [dateFilter, setDateFilter] = useState("today");

  const todayStr = new Date().toDateString();

  const filtered = sales.filter(s => {
    const matchSearch = !search || s.id.includes(search.toLowerCase()) ||
      (s.customer_name || "").toLowerCase().includes(search.toLowerCase()) ||
      (s.items || []).some(i => i.name.toLowerCase().includes(search.toLowerCase()));
    const matchStatus = filterStatus === "all" || s.payment_status === filterStatus;
    const matchDate = dateFilter === "all" || new Date(s.created_at).toDateString() === todayStr;
    return matchSearch && matchStatus && matchDate;
  });

  // ── REVENUE CALCULATIONS ─────────────────────────────────────────────────
  // "Today's Revenue" = sum of all payment amounts whose created_at is today.
  // This correctly counts debt payments made today even if the sale was yesterday,
  // and correctly excludes debts created today that haven't been paid yet.
  const todayRevenue = sales.reduce((total, sale) => {
    const paymentsToday = (sale.payments || []).filter(
      p => new Date(p.paid_at).toDateString() === todayStr
    );
    return total + paymentsToday.reduce((s, p) => s + p.amount, 0);
  }, 0);

  // "Transactions today" = sales created today (regardless of payment status)
  const todayCount = sales.filter(s => new Date(s.created_at).toDateString() === todayStr).length;

  const pendingCount = sales.filter(s => s.payment_status === "pending").length;
  const pendingAmount = sales.filter(s => s.payment_status === "pending").reduce((s,t) => s + (t.total_amount - t.amount_paid), 0);

  // "All Time Gross" = sum of all payments ever received (actual cash collected),
  // NOT sum of total_amount which includes unpaid debts.
  const allTimeCollected = sales.reduce((total, sale) => {
    return total + (sale.payments || []).reduce((s, p) => s + p.amount, 0);
  }, 0);
  // Count of all sales regardless of payment status
  const allTimeSalesCount = sales.length;

  return (
    <>
      {/* Stats */}
      <div className="s-stats">
        <div className="s-stat">
          <div className="s-stat-label">Today's Revenue</div>
          <div className="s-stat-value">{fmt(todayRevenue)}</div>
          <div className="s-stat-sub">{todayCount} transactions today</div>
        </div>
        <div className="s-stat">
          <div className="s-stat-label">Paid Sales</div>
          <div className="s-stat-value">{sales.filter(s => s.payment_status === "paid").length}</div>
          <div className="s-stat-sub up">Fully settled</div>
        </div>
        <div className="s-stat">
          <div className="s-stat-label">Pending / Credit</div>
          <div className="s-stat-value">{pendingCount}</div>
          <div className="s-stat-sub down">{fmt(pendingAmount)} outstanding</div>
        </div>
        <div className="s-stat">
          <div className="s-stat-label">Total Collected (All Time)</div>
          <div className="s-stat-value">{allTimeSalesCount}</div>
          <div className="s-stat-sub up">{fmt(allTimeCollected)} received</div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="s-toolbar">
        <div className="s-search-wrap">
          <svg width="14" height="14" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd"/></svg>
          <input className="s-search" placeholder="Search sale ID, product, customer…" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <select className="s-filter" value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
          <option value="all">All statuses</option>
          <option value="paid">Paid</option>
          <option value="pending">To Be Paid</option>
          <option value="partial">Partial</option>
        </select>
        <select className="s-filter" value={dateFilter} onChange={e => setDateFilter(e.target.value)}>
          <option value="today">Today</option>
          <option value="all">All time</option>
        </select>
        <button className="btn btn-primary" onClick={onNewSale} style={{ marginLeft:"auto" }}>
          <svg width="14" height="14" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd"/></svg>
          New Sale
        </button>
      </div>

      {/* Table */}
      <div className="s-table-wrap">
        {filtered.length === 0 ? (
          <div className="s-table-empty">No sales found for the selected filters.</div>
        ) : (
          <table className="s-table">
            <thead>
              <tr>
                <th>Time</th>
                <th>Staff</th>
                <th>Items</th>
                <th>Customer</th>
                <th>Total</th>
                <th>Paid</th>
                <th>Balance</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(sale => (
                <tr key={sale.id} onClick={() => onSelectSale(sale)}>
                  <td style={{ whiteSpace:"nowrap" }}>
                    <div style={{ fontWeight:500 }}>{fmtTime(sale.created_at)}</div>
                    <div style={{ fontSize:11, color:"var(--text3)" }}>{fmtDate(sale.created_at)}</div>
                  </td>
                  <td style={{ color: sale.staff_name ? "var(--text)" : "var(--text3)", fontSize:12 }}>
                    {sale.staff_name || <span style={{ fontStyle:"italic" }}>—</span>}
                  </td>
                  <td>
                    <div style={{ fontWeight:500 }}>{(sale.items||[])[0]?.name || "—"}</div>
                    {(sale.items||[]).length > 1 && <div style={{ fontSize:11, color:"var(--text3)" }}>+{sale.items.length-1} more</div>}
                  </td>
                  <td style={{ color: sale.customer_name ? "var(--text)" : "var(--text3)" }}>
                    {sale.customer_name || "—"}
                  </td>
                  <td style={{ fontFamily:"Segoe UI, Roboto, Helvetica Neue, Arial, sans-serif", fontWeight:700 }}>{fmt(sale.total_amount)}</td>
                  <td style={{ color:"var(--green)", fontWeight:500 }}>{fmt(sale.amount_paid)}</td>
                  <td style={{ color: sale.total_amount - sale.amount_paid > 0 ? "var(--red)" : "var(--text3)", fontWeight:500 }}>
                    {sale.total_amount - sale.amount_paid > 0 ? fmt(sale.total_amount - sale.amount_paid) : "—"}
                  </td>
                  <td>{payBadge(sale.payment_status)}</td>
                  <td onClick={e => e.stopPropagation()}>
                    <button className="btn btn-ghost btn-sm" onClick={() => onShowReceipt(sale)}>Receipt</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// TO BE PAID TAB
// ─────────────────────────────────────────────────────────────────────────────
function ToBePaidTab({ sales, onSelectSale }) {
  const pending = sales.filter(s => s.payment_status === "pending" || s.payment_status === "partial");
  const totalOwed = pending.reduce((s,t) => s + (t.total_amount - t.amount_paid), 0);

  return (
    <>
      <div className="s-stats" style={{ gridTemplateColumns:"repeat(3,1fr)" }}>
        <div className="s-stat">
          <div className="s-stat-label">Outstanding Sales</div>
          <div className="s-stat-value">{pending.length}</div>
          <div className="s-stat-sub down">Need collection</div>
        </div>
        <div className="s-stat">
          <div className="s-stat-label">Total Owed</div>
          <div className="s-stat-value">{fmt(totalOwed)}</div>
          <div className="s-stat-sub down">Across all credit sales</div>
        </div>
        <div className="s-stat">
          <div className="s-stat-label">Anonymous Credit</div>
          <div className="s-stat-value">{pending.filter(s => !s.customer_name).length}</div>
          <div className="s-stat-sub">No name recorded</div>
        </div>
      </div>

      {pending.length === 0 ? (
        <div style={{ textAlign:"center", padding:"48px 0", color:"var(--text3)", fontSize:14 }}>
          🎉 No outstanding credit sales. All caught up!
        </div>
      ) : (
        <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
          {pending.map(sale => (
            <div key={sale.id} className="credit-card" onClick={() => onSelectSale(sale)} style={{ cursor:"pointer" }}>
              <div className="credit-avatar">
                {sale.customer_name ? initials(sale.customer_name) : "?"}
              </div>
              <div className="credit-info">
                <div className="credit-name">{sale.customer_name || <span style={{ color:"var(--text3)", fontStyle:"italic" }}>Anonymous</span>}</div>
                <div className="credit-items">
                  {(sale.items||[]).map(i => `${i.name} ×${i.qty}`).join(", ")}
                </div>
                <div className="credit-items" style={{ marginTop:2 }}>{fmtDateTime(sale.created_at)}</div>
              </div>
              <div className="credit-amount">
                <div className="credit-owed">{fmt(sale.total_amount - sale.amount_paid)}</div>
                <div className="credit-date">owed</div>
                <button className="btn btn-outline btn-sm" style={{ marginTop:6 }} onClick={e => { e.stopPropagation(); onSelectSale(sale); }}>
                  Collect
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// UNALLOCATED FUNDS TAB
// ─────────────────────────────────────────────────────────────────────────────
function UnallocatedTab({ mpesaTxns, onAllocate }) {
  const unallocated = mpesaTxns.filter(t => !t.allocated);
  const allocated   = mpesaTxns.filter(t => t.allocated);
  const totalUnallocated = unallocated.reduce((s,t) => s + t.amount, 0);

  return (
    <>
      <div style={{ background:"var(--blue-light)", color:"var(--blue-text)", borderRadius:10, padding:"12px 16px", marginBottom:18, fontSize:13 }}>
        ℹ️ These are M-Pesa payments received on the till's line but not linked to any sale. They may have been sent manually via SIM toolkit. Match them to a sale or record them as standalone income.
      </div>

      <div className="s-stats" style={{ gridTemplateColumns:"repeat(3,1fr)", marginBottom:18 }}>
        <div className="s-stat">
          <div className="s-stat-label">Unallocated</div>
          <div className="s-stat-value">{unallocated.length}</div>
          <div className="s-stat-sub down">Need matching</div>
        </div>
        <div className="s-stat">
          <div className="s-stat-label">Unallocated Amount</div>
          <div className="s-stat-value">{fmt(totalUnallocated)}</div>
          <div className="s-stat-sub down">Not yet linked</div>
        </div>
        <div className="s-stat">
          <div className="s-stat-label">Allocated</div>
          <div className="s-stat-value">{allocated.length}</div>
          <div className="s-stat-sub up">Already matched</div>
        </div>
      </div>

      <div className="s-table-wrap" style={{ marginBottom:24 }}>
        <div style={{ padding:"12px 18px", borderBottom:"1px solid var(--border)", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          <span style={{ fontFamily:"Segoe UI, Roboto, Helvetica Neue, Arial, sans-serif", fontWeight:600, fontSize:14 }}>Unallocated Payments</span>
          <span style={{ fontFamily:"Segoe UI, Roboto, Helvetica Neue, Arial, sans-serif", fontWeight:700, color:"var(--accent)", fontSize:14 }}>{fmt(totalUnallocated)}</span>
        </div>
        {unallocated.length === 0 ? (
          <div className="s-table-empty">No unallocated funds — all M-Pesa payments are matched.</div>
        ) : (
          <table className="s-table">
            <thead>
              <tr>
                <th>Time</th>
                <th>Phone</th>
                <th>Name</th>
                <th>Reference</th>
                <th>Receipt #</th>
                <th>Amount</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {unallocated.map(txn => (
                <tr key={txn.id}>
                  <td style={{ whiteSpace:"nowrap", fontSize:12 }}>{fmtDateTime(txn.transaction_time)}</td>
                  <td style={{ fontFamily:"monospace", fontSize:12 }}>{txn.msisdn}</td>
                  <td style={{ fontWeight:500 }}>{txn.first_name || <span style={{ color:"var(--text3)" }}>—</span>}</td>
                  <td style={{ color:"var(--text2)", fontStyle: txn.bill_ref_number ? "normal" : "italic" }}>{txn.bill_ref_number || "none"}</td>
                  <td style={{ fontFamily:"monospace", fontSize:12, color:"var(--text2)" }}>{txn.mpesa_receipt_number}</td>
                  <td style={{ fontFamily:"Segoe UI, Roboto, Helvetica Neue, Arial, sans-serif", fontWeight:700, color:"var(--green)" }}>{fmt(txn.amount)}</td>
                  <td>
                    <button className="btn btn-outline btn-sm" onClick={() => onAllocate(txn)}>Allocate</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {allocated.length > 0 && (
        <div className="s-table-wrap">
          <div style={{ padding:"12px 18px", borderBottom:"1px solid var(--border)" }}>
            <span style={{ fontFamily:"Segoe UI, Roboto, Helvetica Neue, Arial, sans-serif", fontWeight:600, fontSize:14, color:"var(--text2)" }}>Already Allocated</span>
          </div>
          <table className="s-table">
            <thead>
              <tr><th>Time</th><th>Phone</th><th>Name</th><th>Receipt #</th><th>Amount</th><th>Linked Sale</th></tr>
            </thead>
            <tbody>
              {allocated.map(txn => (
                <tr key={txn.id}>
                  <td style={{ fontSize:12 }}>{fmtDateTime(txn.transaction_time)}</td>
                  <td style={{ fontFamily:"monospace", fontSize:12 }}>{txn.msisdn}</td>
                  <td>{txn.first_name || "—"}</td>
                  <td style={{ fontFamily:"monospace", fontSize:12 }}>{txn.mpesa_receipt_number}</td>
                  <td style={{ fontFamily:"Segoe UI, Roboto, Helvetica Neue, Arial, sans-serif", fontWeight:700 }}>{fmt(txn.amount)}</td>
                  <td><span className="badge badge-green">#{(txn.sale_id||"").toUpperCase()}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ─────────────────────────────────────────────────────────────────────────────
// ─────────────────────────────────────────────────────────────────────────────
// ALLOCATE MODAL  — links an mpesa txn to a sale (WALLET METHOD)
// ─────────────────────────────────────────────────────────────────────────────
function AllocateModal({ txn, sales, onClose, onAllocated, addToast }) {
  const [selectedSale, setSelectedSale] = useState("");
  const [saving, setSaving] = useState(false);
  const [staffList, setStaffList] = useState([]);
  const [allocatorId, setAllocatorId] = useState("");
  const candidates = sales.filter(s => s.payment_status === "pending" || s.payment_status === "partial");

  useEffect(() => {
    supabaseClient.from("users").select("id, name").order("name", { ascending: true }).then(({ data }) => {
      if (data) setStaffList(data);
    });
  }, []);

  const handleAllocate = async () => {
    if (!selectedSale) return;
    setSaving(true);
    try {
      const sale = sales.find(s => s.id === selectedSale);
      if (!sale) throw new Error("Sale not found");

      const balanceOwed = sale.total_amount - sale.amount_paid;
      let newAmountPaid = sale.amount_paid + txn.amount;
      let newStatus = "partial";
      let overpaymentMessage = "";

      // Math Logic: Check if it's a full payment or overpayment
      if (txn.amount >= balanceOwed) {
        newStatus = "paid";
        newAmountPaid = sale.total_amount; // Cap the sale at its maximum amount
        
        // WALLET METHOD: Handle the Overpayment Change
        if (txn.amount > balanceOwed) {
            const change = txn.amount - balanceOwed;
            overpaymentMessage = ` (KES ${change} added back to Unallocated Funds.)`;
            
           
            const { error: changeError } = await supabaseClient.from("mpesa_transactions").insert({
              till_number: txn.till_number,
              amount: change,
              msisdn: txn.msisdn,
              first_name: txn.first_name,
              bill_ref_number: txn.bill_ref_number,
              mpesa_receipt_number: `${txn.mpesa_receipt_number}-BAL-${Date.now()}`,
              transaction_time: txn.transaction_time,
              allocated: false,
              sale_id: null,
            });
            if (changeError) throw changeError;
        }
      }

        const { error: txnError } = await supabaseClient
        .from("mpesa_transactions")
        .update({ allocated: true, sale_id: selectedSale })
        .eq("id", txn.id);
      if (txnError) throw txnError;

      const { error: saleError } = await supabaseClient
        .from("sales")
        .update({ payment_status: newStatus, amount_paid: newAmountPaid })
        .eq("id", selectedSale);
      if (saleError) throw saleError;

      const allocatorName = staffList.find(u => u.id === allocatorId)?.name || "Unknown";
      const paymentAmount = Math.min(txn.amount, balanceOwed);
      const { error: paymentError } = await supabaseClient
        .from("payments")
        .insert({
          sale_id: selectedSale,
          amount: paymentAmount,
          method: "mpesa",
          transaction_reference: `${txn.mpesa_receipt_number} [allocated by ${allocatorName}]`,
        });
      if (paymentError) throw paymentError;

      // Toast feedback based on the math result
      if (newStatus === "paid") {
          addToast("success", "Sale fully paid!" + overpaymentMessage);
      } else {
          addToast("info", `Partial payment applied! KES ${sale.total_amount - newAmountPaid} remaining.`);
      }

      await onAllocated();
      onClose();
    } catch (e) {
      addToast("error", "Allocation failed: " + e.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal modal-sm">
        <div className="modal-header">
          <div className="modal-title">Allocate Payment</div>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">
          <div style={{ background:"var(--green-light)", color:"var(--green-text)", borderRadius:8, padding:"12px 14px", marginBottom:16 }}>
            <div style={{ fontSize:12, marginBottom:2 }}>M-Pesa payment from <strong>{txn.first_name || txn.msisdn}</strong></div>
            <div style={{ fontFamily:"Segoe UI, Roboto, Helvetica Neue, Arial, sans-serif", fontWeight:700, fontSize:20 }}>{fmt(txn.amount)}</div>
            <div style={{ fontSize:11, marginTop:2 }}>Receipt: {txn.mpesa_receipt_number} · {fmtDateTime(txn.transaction_time)}</div>
          </div>
          <div className="field">
            <label>Link to a pending sale</label>
            <select value={selectedSale} onChange={e => setSelectedSale(e.target.value)}>
              <option value="">— Select a sale —</option>
              {candidates.map(s => {
                const owed = s.total_amount - s.amount_paid;
                return (
                  <option key={s.id} value={s.id}>
                    #{s.id.toUpperCase()} · Owes: {fmt(owed)} · {s.customer_name || "Anonymous"}
                  </option>
                );
              })}
            </select>
          </div>
          <div className="field" style={{ marginTop: 10 }}>
            <label>👤 Allocated by (required)</label>
            <select value={allocatorId} onChange={e => setAllocatorId(e.target.value)}>
              <option value="">— Select staff member —</option>
              {staffList.map(u => (
                <option key={u.id} value={u.id}>{u.name}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn btn-green" onClick={handleAllocate} disabled={!selectedSale || !allocatorId || saving}>
            {saving ? "Processing…" : "Allocate Funds"}
          </button>
        </div>
      </div>
    </div>
  );
}
// ─────────────────────────────────────────────────────────────────────────────
// SECURITY: HASHING FUNCTION
// ─────────────────────────────────────────────────────────────────────────────
async function hashPIN(pin) {
  const encoder = new TextEncoder();
  const data = encoder.encode(pin);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// ─────────────────────────────────────────────────────────────────────────────
// CASHIER LOGIN SCREEN
// ─────────────────────────────────────────────────────────────────────────────
function CashierLogin({ onLogin }) {
  const [pin, setPin] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handlePadClick = (num) => {
    if (error) setError(false);
    if (pin.length < 4) {
      const newPin = pin + num;
      setPin(newPin);
      if (newPin.length === 4) verifyPin(newPin);
    }
  };

  const handleClear = () => {
    setPin("");
    setError(false);
  };

  const verifyPin = async (enteredPin) => {
    setLoading(true);
    try {
      const hashedPin = await hashPIN(enteredPin);

      const { data, error } = await supabaseClient
        .from("users")
        .select("id, name, role")
        .eq("password_hash", hashedPin)
        .limit(1);

      if (error) throw error;

      if (data && data.length > 0) {
        onLogin(data[0]);
      } else {
        setError(true);
        setPin("");
      }
    } catch (err) {
      console.error(err);
      setError(true);
      setPin("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pin-wrap">
      <div className="pin-card">
        <div className="pin-title">Teipa House</div>
        <div className="pin-sub">Enter Cashier PIN to unlock</div>

        <div className="pin-error-text">{error ? "Invalid PIN. Try again." : ""}</div>

        <div className="pin-display">
          {[0, 1, 2, 3].map(i => (
            <div key={i} className={`pin-dot ${pin.length > i ? "filled" : ""} ${error ? "error" : ""}`} />
          ))}
        </div>

        <div className="pin-pad">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
            <button key={num} className="pin-btn" onClick={() => handlePadClick(num)} disabled={loading}>
              {num}
            </button>
          ))}
          <button className="pin-btn" style={{ fontSize: 16, color: "var(--red)" }} onClick={handleClear} disabled={loading}>
            CLR
          </button>
          <button className="pin-btn" onClick={() => handlePadClick(0)} disabled={loading}>
            0
          </button>
          <div /> {/* Empty space for grid alignment */}
        </div>
      </div>
    </div>
  );
}
// ─────────────────────────────────────────────────────────────────────────────
// MAIN EXPORT
// ─────────────────────────────────────────────────────────────────────────────
export default function Sales() {
  const [currentUser, setCurrentUser] = useState(null); // PHASE 3: Auth State
  const [activeTab, setActiveTab] = useState("sales");
  const [sales, setSales] = useState([]);
  const [products, setProducts] = useState([]);
  const [mpesaTxns, setMpesaTxns] = useState([]);
  const [loadingData, setLoadingData] = useState(true);
  const [loadError, setLoadError] = useState("");

  const [showNewSale, setShowNewSale]     = useState(false);
  const [selectedSale, setSelectedSale]   = useState(null);
  const [receiptSale, setReceiptSale]     = useState(null);
  const [allocateTxn, setAllocateTxn]     = useState(null);

  const [toasts, setToasts] = useState([]);

  const addToast = (type, msg) => {
    const id = Date.now();
    setToasts(p => [...p, { id, type, msg }]);
    setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 3500);
  };

  const loadSalesData = async (isSilent = false) => {
    if (!isSilent) setLoadingData(true);
    setLoadError("");
    try {
      const [productsData, salesData, mpesaData] = await Promise.all([
        fetchProducts(),
        fetchSales(),
        fetchMpesaTransactions(),
      ]);

      setProducts(productsData);
      setSales(salesData);
      setMpesaTxns(mpesaData);
    } catch (err) {
      console.error(err);
      setLoadError(err.message || "Failed to load sales data.");
    } finally {
      if (!isSilent) setLoadingData(false);
    }
  };

useEffect(() => {
    // Initial load
    loadSalesData();

    // Silent background heartbeat (set to 15 seconds)
    const heartbeat = setInterval(() => {
      if (!document.hidden) {
        // We call the existing function which updates setSales, setProducts, etc.
        // React is smart enough to only update the text on screen, NOT blink the page.
        loadSalesData(true); 
      }
    }, 15000); 

    return () => clearInterval(heartbeat);
  }, [currentUser]);

  const pendingCount = sales.filter(s => s.payment_status === "pending").length;
  const unallocatedCount = mpesaTxns.filter(t => !t.allocated).length;

  const handleSaved = async (newSale) => {
    setSales(prev => [newSale, ...prev]);
    await loadSalesData();
  };

  const handleMarkPaid = async (sale, payment = {}) => {
    // 1. Catch the exact amount passed from the modal (or default to remaining if none provided)
    const paymentAmount = payment.amount || (sale.total_amount - sale.amount_paid);
    if (paymentAmount <= 0) return;

    // 2. Calculate the true new balance and status
    const newAmountPaid = sale.amount_paid + paymentAmount;
    const newStatus = newAmountPaid >= sale.total_amount ? "paid" : "partial";

    // 3. Update the sale dynamically (no hardcoding "paid")
    const { error: saleError } = await supabaseClient
      .from("sales")
      .update({
        payment_status: newStatus,
        amount_paid: newAmountPaid,
      })
      .eq("id", sale.id);
    if (saleError) throw saleError;

    // 4. Record the exact payment amount in the audit trail
    const { error: paymentError } = await supabaseClient
      .from("payments")
      .insert({
        sale_id: sale.id,
        amount: paymentAmount, // <--- Using the exact amount here!
        method: payment.method || "cash",
        transaction_reference: payment.transactionReference || null,
      });
    if (paymentError) throw paymentError;

    // Refresh the data silently so the UI updates
    await loadSalesData(true); 
};

  const handleAllocated = async () => {
    await loadSalesData();
  };

  // ── MAIN POS UI ──
  return (
    <>
      <style>{styles}</style>
      <div className="s-wrap">
        {/* TOP BAR */}
        <div className="s-topbar">
          <div className="s-topbar-left">
            <div className="s-title">Sales & Checkout</div>
            <div className="s-tabs">
              <button className={`s-tab${activeTab==="sales"?" active":""}`} onClick={() => setActiveTab("sales")}>All Sales</button>
              <button className={`s-tab${activeTab==="credit"?" active":""}`} onClick={() => setActiveTab("credit")}>To Be Paid {pendingCount > 0 && <span className="s-tab-badge">{pendingCount}</span>}</button>
              <button className={`s-tab${activeTab==="unallocated"?" active":""}`} onClick={() => setActiveTab("unallocated")}>Unallocated Funds {unallocatedCount > 0 && <span className="s-tab-badge">{unallocatedCount}</span>}</button>
            </div>
          </div>
          <div className="s-topbar-right">
            <div className="s-date">{today()}</div>

            {activeTab === "sales" && (
              <button className="btn btn-primary btn-sm" onClick={() => setShowNewSale(true)}>+ New Sale</button>
            )}
          </div>
        </div>

        {/* CONTENT */}
        <div className="s-content">
          {loadingData ? (
            <div className="s-table-empty">Loading sales data…</div>
          ) : loadError ? (
            <div className="s-table-empty">
              <div style={{ marginBottom: 12 }}>{loadError}</div>
              <button className="btn btn-outline" onClick={loadSalesData}>Retry</button>
            </div>
          ) : (
            <>
              {activeTab === "sales" && <SalesListTab sales={sales} onNewSale={() => setShowNewSale(true)} onSelectSale={setSelectedSale} onShowReceipt={setReceiptSale} />}
              {activeTab === "credit" && <ToBePaidTab sales={sales} onSelectSale={setSelectedSale} />}
              {activeTab === "unallocated" && <UnallocatedTab mpesaTxns={mpesaTxns} onAllocate={setAllocateTxn} />}
            </>
          )}
        </div>

        {/* MODALS */}
        {showNewSale && (
          <NewSaleModal
            products={products}
            onClose={() => setShowNewSale(false)}
            onSaved={handleSaved}
            addToast={addToast}
            currentUser={currentUser} /* ── PASS USER TO MODAL ── */
          />
        )}
        {selectedSale && <SaleDetailModal sale={selectedSale} onClose={() => setSelectedSale(null)} onMarkPaid={handleMarkPaid} addToast={addToast} />}
        {receiptSale && <ReceiptModal sale={receiptSale} onClose={() => setReceiptSale(null)} />}
        {allocateTxn && <AllocateModal txn={allocateTxn} sales={sales} onClose={() => setAllocateTxn(null)} onAllocated={handleAllocated} addToast={addToast} />}

        <Toast toasts={toasts} />
      </div>
    </>
  );
}
