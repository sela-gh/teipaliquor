// src/offline/db.offline.js
import Dexie from "dexie";

export const db = new Dexie("liquor_pos_db");

db.version(1).stores({
  products: "id, name, category_id, barcode, updated_at",
  sales: "id, user_id, created_at, sync_status",
  sale_items: "id, sale_id, product_id",
  payments: "id, sale_id, method, created_at",
  outbox: "id, status, event_type, created_at"
});
