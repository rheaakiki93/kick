import { useEffect } from "react";

interface SEOProps {
  title: string;
  description: string;
  path: string;
}

const upsertMeta = (attr: "name" | "property", key: string, content: string) => {
  let el = document.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
};

// Per-page title/description/canonical so each route gets its own search
// snippet instead of every page sharing index.html's homepage tags. Plain
// DOM writes rather than react-helmet-async — that library silently failed
// to update document.title in the production build here (worked in dev).
const SEO = ({ title, description, path }: SEOProps) => {
  useEffect(() => {
    const url = `https://www.kicklab.it${path}`;
    document.title = title;

    upsertMeta("name", "description", description);
    upsertMeta("property", "og:url", url);
    upsertMeta("property", "og:title", title);
    upsertMeta("property", "og:description", description);
    upsertMeta("name", "twitter:title", title);
    upsertMeta("name", "twitter:description", description);

    let canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.appendChild(canonical);
    }
    canonical.href = url;
  }, [title, description, path]);

  return null;
};

export default SEO;
