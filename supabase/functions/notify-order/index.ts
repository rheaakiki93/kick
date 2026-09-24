import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Strip anything outside printable ASCII — API keys are always plain ASCII,
// and stray non-ASCII/whitespace picked up from copy-paste breaks HTTP headers.
const sanitizeSecret = (s: string | undefined): string => (s ?? "").replace(/[^\x21-\x7E]/g, "");

const escapeHtml = (s: string): string =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

// Kick brand orange, matching the site's --secondary token.
const BRAND_ORANGE = "#F97A20";
const BRAND_CREAM = "#FBF3E7";

const sendEmail = async (
  resendKey: string,
  payload: { from: string; to: string; subject: string; html: string }
): Promise<{ ok: boolean; error?: string }> => {
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${resendKey}`, "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const body = await res.text();
  if (!res.ok) {
    const error = `Resend ${res.status}: ${body}`;
    console.error(error);
    return { ok: false, error };
  }
  return { ok: true };
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { orderId } = await req.json();
    if (!orderId || typeof orderId !== "string") {
      return new Response(JSON.stringify({ error: "Missing orderId" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { data: order, error: fetchError } = await supabase
      .from("orders")
      .select("*")
      .eq("id", orderId)
      .single();

    if (fetchError || !order) {
      console.error("Order lookup failed:", fetchError);
      return new Response(JSON.stringify({ error: "Order not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const resendKey = sanitizeSecret(Deno.env.get("RESEND_API_KEY"));
    const fromAddress = sanitizeSecret(Deno.env.get("NOTIFY_FROM_EMAIL")) || "Kick <onboarding@resend.dev>";
    const ownerAddress = sanitizeSecret(Deno.env.get("NOTIFY_ORDER_TO_EMAIL")) || "rhea@kicklab.it";

    if (!resendKey) {
      console.error("RESEND_API_KEY not set");
      return new Response(JSON.stringify({ error: "RESEND_API_KEY not set" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const addressLine = [order.address, order.cap, order.city].filter(Boolean).join(", ");
    const amountLine = `€${Number(order.amount).toFixed(2)}`;

    // --- Internal notification (plain, functional) ---
    const ownerRows: [string, string][] = [
      ["Name", order.name ?? ""],
      ["Email", order.email ?? ""],
      ["Phone", order.phone ?? ""],
      ["Quantity", order.pack_label ?? ""],
      ["Amount", amountLine],
      ["Address", addressLine],
      ["Requested date", order.pickup_date ?? ""],
      ["Notes", order.notes ?? "—"],
    ];
    const ownerHtml = `
      <h2>New large order request</h2>
      <table cellpadding="6" style="border-collapse:collapse">
        ${ownerRows
          .map(
            ([label, value]) =>
              `<tr><td style="font-weight:bold;vertical-align:top">${escapeHtml(label)}</td><td>${escapeHtml(value)}</td></tr>`
          )
          .join("")}
      </table>
    `;

    // --- Customer-facing confirmation (branded) ---
    const firstName = escapeHtml((order.name ?? "").trim().split(" ")[0] || "there");
    const customerRows: [string, string][] = [
      ["Quantity", order.pack_label ?? ""],
      ["Estimated total", amountLine],
      ["Delivery address", addressLine],
      ["Requested date", order.pickup_date ?? ""],
    ];
    const customerHtml = `
      <div style="background:${BRAND_CREAM};padding:32px 16px;font-family:Arial,Helvetica,sans-serif;">
        <table role="presentation" width="100%" style="max-width:520px;margin:0 auto;background:#ffffff;border-collapse:collapse;">
          <tr>
            <td style="background:${BRAND_ORANGE};padding:28px 32px;text-align:center;">
              <img src="https://www.kicklab.it/images/kick-logo-white.png" width="140" alt="kick," style="display:inline-block;width:140px;height:auto;border:0;" />
            </td>
          </tr>
          <tr>
            <td style="padding:32px;">
              <h1 style="margin:0 0 12px;font-size:22px;color:${BRAND_ORANGE};font-weight:800;">Thanks, ${firstName}!</h1>
              <p style="margin:0 0 24px;font-size:15px;line-height:1.5;color:#3a2a1a;">
                We've got your order request and will be in touch shortly to confirm the details and payment.
              </p>
              <table role="presentation" width="100%" cellpadding="6" style="border-collapse:collapse;margin-bottom:24px;">
                ${customerRows
                  .map(
                    ([label, value]) => `
                      <tr>
                        <td style="font-weight:bold;color:#3a2a1a;font-size:13px;text-transform:uppercase;letter-spacing:0.04em;vertical-align:top;padding:8px 0;border-bottom:1px solid ${BRAND_CREAM};">${escapeHtml(label)}</td>
                        <td style="text-align:right;color:#3a2a1a;font-size:14px;padding:8px 0;border-bottom:1px solid ${BRAND_CREAM};">${escapeHtml(value)}</td>
                      </tr>`
                  )
                  .join("")}
              </table>
              <p style="margin:0;font-size:14px;line-height:1.5;color:#6b5a4a;">
                Questions in the meantime? Just reply to this email.
              </p>
            </td>
          </tr>
          <tr>
            <td style="background:${BRAND_CREAM};padding:20px 32px;text-align:center;font-size:12px;color:#9a8a7a;">
              Kick is a project by Kicklab · <a href="https://www.instagram.com/kick_lab_/" style="color:${BRAND_ORANGE};text-decoration:none;">@kick_lab_</a>
            </td>
          </tr>
        </table>
      </div>
    `;

    const [ownerResult, customerResult] = await Promise.all([
      sendEmail(resendKey, {
        from: fromAddress,
        to: ownerAddress,
        subject: `New order request — ${order.pack_label ?? ""}`,
        html: ownerHtml,
      }),
      order.email
        ? sendEmail(resendKey, {
            from: fromAddress,
            to: order.email,
            subject: "We've got your Kick order request",
            html: customerHtml,
          })
        : Promise.resolve({ ok: false, error: "No customer email on order" }),
    ]);

    return new Response(
      JSON.stringify({
        ok: ownerResult.ok || customerResult.ok,
        ownerEmailSent: ownerResult.ok,
        ownerEmailError: ownerResult.error ?? null,
        customerEmailSent: customerResult.ok,
        customerEmailError: customerResult.error ?? null,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("notify-order error:", err);
    return new Response(JSON.stringify({ error: "Unexpected error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
