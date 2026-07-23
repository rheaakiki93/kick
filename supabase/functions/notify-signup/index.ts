import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Strip anything outside printable ASCII — API keys are always plain ASCII,
// and stray non-ASCII/whitespace picked up from copy-paste breaks HTTP headers.
const sanitizeSecret = (s: string | undefined): string => (s ?? "").replace(/[^\x21-\x7E]/g, "");

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email } = await req.json();
    const trimmed = (email ?? "").trim();

    if (!EMAIL_RE.test(trimmed)) {
      return new Response(JSON.stringify({ error: "Invalid email address" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { error: insertError } = await supabase.from("notify_signups").insert({ email: trimmed });

    // Unique violation = already on the list; treat as success, skip re-sending the email.
    const alreadySubscribed = insertError?.code === "23505";
    if (insertError && !alreadySubscribed) {
      console.error("Insert failed:", insertError);
      return new Response(JSON.stringify({ error: "Could not save signup" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    let emailSent = false;
    let emailError: string | null = null;

    if (!alreadySubscribed) {
      const resendKey = sanitizeSecret(Deno.env.get("RESEND_API_KEY"));
      const fromAddress = sanitizeSecret(Deno.env.get("NOTIFY_FROM_EMAIL")) || "Kick <onboarding@resend.dev>";
      if (resendKey) {
        try {
          const emailRes = await fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: { Authorization: `Bearer ${resendKey}`, "Content-Type": "application/json" },
            body: JSON.stringify({
              from: fromAddress,
              to: trimmed,
              subject: "You're on the list",
              html: "<p>Thanks for your interest in Kick! We'll email you the moment the eshop reopens.</p>",
            }),
          });

          const emailResBody = await emailRes.text();
          if (emailRes.ok) {
            emailSent = true;
            await supabase.from("notify_signups").update({ confirmation_sent: true }).eq("email", trimmed);
          } else {
            emailError = `Resend ${emailRes.status}: ${emailResBody}`;
            console.error("Resend error:", emailError);
          }
        } catch (sendErr) {
          // Signup is already saved — a broken email send shouldn't fail the whole request.
          emailError = `threw: ${sendErr instanceof Error ? sendErr.message : String(sendErr)}`;
          console.error("Resend request threw:", sendErr);
        }
      } else {
        emailError = "RESEND_API_KEY not set";
        console.error(emailError);
      }
    }

    // emailSent/emailError are surfaced in the response (not just server logs) so the
    // signup flow can be verified end-to-end without needing dashboard log access.
    return new Response(JSON.stringify({ ok: true, alreadySubscribed, emailSent, emailError }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("notify-signup error:", err);
    return new Response(JSON.stringify({ error: "Unexpected error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
