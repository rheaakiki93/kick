import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import igPost1 from "@/assets/ig-post-1.jpg";
import igPost2 from "@/assets/ig-post-2.jpg";
import igPost3 from "@/assets/ig-post-3.jpg";
import igPost4 from "@/assets/ig-post-4.jpg";

type L = { en: string; it: string };

// Real posts from @kick_lab_ — thumbnails are hosted locally since
// Instagram's CDN image URLs are signed and expire; each still links out
// to the actual live post.
const POSTS = [
  { src: igPost1, href: "https://www.instagram.com/kick_lab_/reel/DYNw-5Dzfpy/" },
  { src: igPost2, href: "https://www.instagram.com/kick_lab_/p/DWBc4XwjHc7/" },
  { src: igPost3, href: "https://www.instagram.com/kick_lab_/p/DbnjgJEjEvT/" },
  { src: igPost4, href: "https://www.instagram.com/kick_lab_/reel/DakaFKxMKNS/" },
];

const INSTAGRAM_URL = "https://www.instagram.com/kick_lab_/";

// The actual Instagram glyph — rounded-square gradient badge, camera
// outline, lens circle and flash dot — not a generic outline substitute.
const InstagramLogo = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 48 48" className={className}>
    <defs>
      <linearGradient id="ig-gradient" x1="0%" y1="100%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#FFDD55" />
        <stop offset="45%" stopColor="#FF543E" />
        <stop offset="100%" stopColor="#C837AB" />
      </linearGradient>
    </defs>
    <rect x="3" y="3" width="42" height="42" rx="12" fill="url(#ig-gradient)" />
    <rect x="13" y="13" width="22" height="22" rx="6" fill="none" stroke="white" strokeWidth="2.5" />
    <circle cx="24" cy="24" r="6" fill="none" stroke="white" strokeWidth="2.5" />
    <circle cx="32.5" cy="15.5" r="1.6" fill="white" />
  </svg>
);

const SocialGrid = () => {
  const { language } = useLanguage();
  const tr = (s: L) => s[language];

  return (
    <section className="bg-kick-cream py-10">
      <motion.a
        href={INSTAGRAM_URL}
        target="_blank"
        rel="noopener noreferrer"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="flex items-center justify-center gap-3 mb-6 px-6"
      >
        <div className="text-center">
          <span className="text-xs tracking-[0.2em] uppercase text-primary mb-1 block">
            {tr({ en: "Follow along", it: "Seguici" })}
          </span>
          <h2 className="text-2xl md:text-3xl font-bold leading-[1.1] tracking-tight text-primary font-sans">
            @kick_lab_
          </h2>
        </div>
        <InstagramLogo className="w-9 h-9 md:w-10 md:h-10 flex-shrink-0" />
      </motion.a>

      <div className="grid grid-cols-4 gap-px bg-border w-full">
        {POSTS.map((post, i) => (
          <a
            key={i}
            href={post.href}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative aspect-square bg-muted overflow-hidden block"
          >
            <img src={post.src} alt="" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
            <div className="absolute inset-0 bg-kick-dark/0 group-hover:bg-kick-dark/40 transition-colors duration-300 flex items-center justify-center">
              <InstagramLogo className="w-7 h-7 sm:w-9 sm:h-9 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          </a>
        ))}
      </div>
    </section>
  );
};

export default SocialGrid;
