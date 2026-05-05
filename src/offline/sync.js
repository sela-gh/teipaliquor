// src/offline/sync.js
import { db } from "./db.offline";
import { supabase } from "../config/supabase";

export async function syncPendingSales() {
  const jobs = await db.outbox.where("status").equals("pending").toArray();

  for (const job of jobs) {
    if (job.event_type !== "SALE_CREATED") continue;

    const sale = await db.sales.get(job.payload.sale_id);
    const items = await db.sale_items.where("sale_id").equals(job.payload.sale_id).toArray();
    const payment = await db.payments.where("sale_id").equals(job.payload.sale_id).first();

    if (!sale || !items.length) continue;

    const { data: insertedSale, error: saleError } = await supabase
      .from("sales")
      .insert({
        user_id: sale.user_id,
        subtotal: sale.subtotal,
        discount_type: sale.discount_type ?? "fixed",
        discount_value: sale.discount_value ?? 0,
        tax_total: sale.tax_total ?? 0,
        total_amount: sale.total_amount,
        status: sale.status ?? "completed",
        payment_status: sale.payment_status ?? "paid",
        device_sale_id: sale.id,
        sync_status: "synced",
        created_at: sale.created_at
      })
      .select("id")
      .single();

    if (saleError) continue;

    const mappedItems = items.map((i) => ({
      sale_id: insertedSale.id,
      product_id: i.product_id,
      quantity: i.quantity,
      price: i.price,
      cost_price: i.cost_price ?? null,
      tax_rate: i.tax_rate ?? 0,
      tax_amount: i.tax_amount ?? 0,
      device_sale_item_id: i.id
    }));

    const { error: itemError } = await supabase.from("sale_items").insert(mappedItems);
    if (itemError) continue;

    if (payment) {
      const { error: paymentError } = await supabase.from("payments").insert({
        sale_id: insertedSale.id,
        amount: payment.amount,
        method: payment.method,
        transaction_reference: payment.transaction_reference ?? null,
        created_at: payment.created_at
      });
      if (paymentError) continue;
    }

    await db.sales.update(sale.id, { sync_status: "synced" });
    await db.outbox.update(job.id, { status: "done" });
  }
}
