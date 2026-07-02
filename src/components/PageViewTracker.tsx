import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { trackPageView } from "@/lib/analytics";

// Records a page view on every route change. Skips the private /analytics page
// so the dashboard doesn't inflate its own numbers.
export const PageViewTracker = () => {
  const location = useLocation();

  useEffect(() => {
    if (location.pathname.startsWith("/analytics")) return;
    trackPageView(location.pathname);
  }, [location.pathname]);

  return null;
};
