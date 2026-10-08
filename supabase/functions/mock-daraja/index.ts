import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const MPESA_ENV = Deno.env.get("MPESA_ENV") || "sandbox";
const MPESA_BASE_URL =
  MPESA_ENV === "production"
    ? "https://api.safaricom.co.ke"
    : "https://sandbox.safaricom.co.ke";

function requiredEnv(name: string) {
  const value = Deno.env.get(name);
  if (!value) throw new Error(`Missing required env var: ${name}`);
  return value;
}

function timestampNow() {
  const now = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  return [
    now.getFullYear(),
    pad(now.getMonth() + 1),
    pad(now.getDate()),
    pad(now.getHours()),
    pad(now.getMinutes()),
    pad(now.getSeconds()),
  ].join("");
}

async function readJsonResponse(response: Response, label: string) {
  const text = await response.text();
  if (!text) {
    throw new Error(`${label} returned an empty response with status ${response.status}`);
  }

  try {
    return JSON.parse(text);
  } catch (_) {
    throw new Error(`${label} returned non-JSON response with status ${response.status}: ${text.slice(0, 300)}`);
  }
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const requestText = await req.text();
    let requestBody;
    try {
      requestBody = requestText ? JSON.parse(requestText) : {};
    } catch (_) {
      throw new Error(`Invalid request JSON: ${requestText.slice(0, 300)}`);
    }

    const { phone, amount } = requestBody;

    const consumerKey = requiredEnv("MPESA_CONSUMER_KEY");
    const consumerSecret = requiredEnv("MPESA_CONSUMER_SECRET");
    const passkey = requiredEnv("MPESA_PASSKEY");
    const shortcode = requiredEnv("MPESA_SHORTCODE");
    const callbackUrl =
      Deno.env.get("MPESA_CALLBACK_URL") ||
      `${requiredEnv("SUPABASE_URL")}/functions/v1/c2b-webhook`;
    const transactionType =
      Deno.env.get("MPESA_TRANSACTION_TYPE") ||
      (MPESA_ENV === "production" ? "CustomerBuyGoodsOnline" : "CustomerPayBillOnline");

    console.log("M-Pesa runtime config:", JSON.stringify({
      env: MPESA_ENV,
      baseUrl: MPESA_BASE_URL,
      shortcode,
      transactionType,
      callbackUrl,
    }));

    const credentials = btoa(`${consumerKey}:${consumerSecret}`);
    const tokenResponse = await fetch(
      `${MPESA_BASE_URL}/oauth/v1/generate?grant_type=client_credentials`,
      { headers: { Authorization: `Basic ${credentials}` } },
    );
    const tokenData = await readJsonResponse(tokenResponse, "M-Pesa auth");

    if (!tokenData.access_token) {
      throw new Error(`Auth failed: ${JSON.stringify(tokenData)}`);
    }

    const timestamp = timestampNow();
    const password = btoa(`${shortcode}${passkey}${timestamp}`);

    const stkPayload = {
      BusinessShortCode: shortcode,
      Password: password,
      Timestamp: timestamp,
      TransactionType: transactionType,
      Amount: Math.ceil(Number(amount)),
      PartyA: phone,
      PartyB: shortcode,
      PhoneNumber: phone,
      CallBackURL: callbackUrl,
      AccountReference: Deno.env.get("MPESA_ACCOUNT_REFERENCE") || "SpiritsPOS",
      TransactionDesc: Deno.env.get("MPESA_TRANSACTION_DESC") || "POS Checkout",
    };

    const stkResponse = await fetch(`${MPESA_BASE_URL}/mpesa/stkpush/v1/processrequest`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(stkPayload),
    });

    const data = await readJsonResponse(stkResponse, "M-Pesa STK push");

    if (data.ResponseCode !== "0") {
      return new Response(
        JSON.stringify({
          error:
            data.errorMessage ||
            data.ResponseDescription ||
            "STK push rejected by Safaricom",
          raw: data,
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 },
      );
    }

    return new Response(
      JSON.stringify({
        ResponseCode: data.ResponseCode,
        ResponseDescription: data.ResponseDescription,
        CustomerMessage: data.CustomerMessage,
        CheckoutRequestID: data.CheckoutRequestID,
        checkoutRequestId: data.CheckoutRequestID,
        MerchantRequestID: data.MerchantRequestID,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 },
    );
  } catch (error) {
    console.error("mock-daraja error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : String(error) }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 },
    );
  }
});
