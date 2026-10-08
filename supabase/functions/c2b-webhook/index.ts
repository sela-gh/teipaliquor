import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

function requiredEnv(name: string) {
  const value = Deno.env.get(name);
  if (!value) throw new Error(`Missing required env var: ${name}`);
  return value;
}

function parseMpesaTime(value?: string) {
  if (!value || value.length !== 14) return new Date().toISOString();

  const t = value;
  return new Date(
    `${t.slice(0, 4)}-${t.slice(4, 6)}-${t.slice(6, 8)}T${t.slice(8, 10)}:${t.slice(10, 12)}:${t.slice(12, 14)}Z`,
  ).toISOString();
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const payload = await req.json();
    console.log("Received M-Pesa webhook:", JSON.stringify(payload));

    const supabaseAdmin = createClient(
      requiredEnv("SUPABASE_URL"),
      requiredEnv("SUPABASE_SERVICE_ROLE_KEY"),
    );

    if (payload?.Body?.stkCallback) {
      const body = payload.Body.stkCallback;

      if (body.ResultCode === 0) {
        const items = body.CallbackMetadata?.Item || [];
        const amount = items.find((obj: { Name: string }) => obj.Name === "Amount")?.Value;
        const receiptNumber = items.find((obj: { Name: string }) => obj.Name === "MpesaReceiptNumber")?.Value;
        const phone = items.find((obj: { Name: string }) => obj.Name === "PhoneNumber")?.Value;
        const transactionDate = items.find((obj: { Name: string }) => obj.Name === "TransactionDate")?.Value;

        const { error } = await supabaseAdmin.from("mpesa_transactions").insert({
          till_number: requiredEnv("MPESA_SHORTCODE"),
          amount: Number(amount || 0),
          msisdn: phone?.toString() || null,
          first_name: "STK Customer",
          bill_ref_number: "POS Checkout",
          mpesa_receipt_number: receiptNumber,
          transaction_time: parseMpesaTime(transactionDate?.toString()),
          allocated: false,
          sale_id: null,
        });

        if (error) throw error;
      } else {
        console.log("Ignoring unsuccessful STK callback:", JSON.stringify(body));
      }
    } else if (payload.TransID) {
      const fullName =
        [payload.FirstName, payload.MiddleName, payload.LastName].filter(Boolean).join(" ") ||
        "Unknown";

      const { error } = await supabaseAdmin.from("mpesa_transactions").insert({
        till_number: payload.BusinessShortCode,
        amount: Number(payload.TransAmount || 0),
        msisdn: payload.MSISDN,
        first_name: fullName,
        bill_ref_number: payload.BillRefNumber || "Manual C2B",
        mpesa_receipt_number: payload.TransID,
        transaction_time: parseMpesaTime(payload.TransTime),
        allocated: false,
        sale_id: null,
      });

      if (error) throw error;
    } else {
      console.log("Ignoring unsupported M-Pesa webhook payload.");
    }

    return new Response(JSON.stringify({ ResultCode: 0, ResultDesc: "Success" }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Webhook error:", error);
    return new Response(
      JSON.stringify({
        ResultCode: 1,
        ResultDesc: "Rejected",
        DebugError: error instanceof Error ? error.message : String(error),
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 },
    );
  }
});
