import React from 'react';
import ReactDOM from 'react-dom/client';
import Dashboard from './components/Dashboard'; // Import the file I sent
import { syncPendingSales } from "./offline/sync";
import "./index.css";

// 1. The "Sniffer" Logic
// This listens for the internet coming back to reconcile records
window.addEventListener("online", () => {
  console.log("Internet is back! Sniffing for pending records...");
  syncPendingSales();
});

// Run an initial sync check when the app first loads
syncPendingSales();

// 2. The React Launcher
// This takes your Dashboard.jsx and puts it on the screen
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Dashboard />
  </React.StrictMode>
);