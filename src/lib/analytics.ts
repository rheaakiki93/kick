// Lightweight, privacy-friendly page-view tracking.
// Records only the path, referrer and an anonymous per-browser id — no personal
// data. Inserts are allowed for everyone; reads are locked to the logged-in
// owner via RLS (see the page_views policies).

import { supabase } from "@/integrations/supabase/client";

const VISITOR_KEY = "kick-visitor-id";

const getVisitorId = (): string | null => {
  try {
    let id = localStorage.getItem(VISITOR_KEY);
    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem(VISITOR_KEY, id);
    }
    return id;
  } catch {
    return null;
  }
};

export const trackPageView = async (path: string) => {
  try {
    await supabase.from("page_views").insert({
      path,
      referrer: document.referrer || null,
      visitor_id: getVisitorId(),
    });
  } catch {
    // Never let analytics break the page.
  }
};
