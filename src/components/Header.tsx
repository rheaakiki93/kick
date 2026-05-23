import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { Instagram } from "lucide-react";
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import kickLogo from "@/assets/kick-logo.png";
import { useLanguage } from "@/contexts/LanguageContext";

const Header = () => {
  const [hidden, setHidden] = useState(false);
  const { scrollY } = useScroll();
  const { language, setLanguage, t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();

  const scrollToSection = (id: string) => {
    if (location.pathname === "/") {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    } else {
      navigate("/");
      setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
      }, 300);
    }
  };

  useMotionValueEvent(scrollY, "change", (latest) => {
    if (latest > 100) {
      setHidden(true);
    } else {
      setHidden(false);
    }
  });

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ 
        y: hidden ? -100 : 0, 
        opacity: hidden ? 0 : 1 
      }}
      transition={{ duration: 0.3 }}
      className="fixed top-0 left-0 right-0 z-50"
    >
      <div className="container mx-auto px-6 flex items-center justify-between py-6">
        <a href="/" className="block h-10 overflow-hidden">
          <img src={kickLogo} alt="kick" className="h-28 w-auto -mt-9 brightness-0 invert" />
        </a>
        
        <nav className="hidden md:flex items-center gap-10">
          <button onClick={() => scrollToSection("ingredients")} className="text-sm font-medium text-white/90 hover:text-white transition-colors tracking-wide uppercase">
            {t("nav.ingredients")}
          </button>
          <button onClick={() => scrollToSection("benefits")} className="text-sm font-medium text-white/90 hover:text-white transition-colors tracking-wide uppercase">
            {t("nav.benefits")}
          </button>
          <a href="/our-story" className="text-sm font-medium text-white/90 hover:text-white transition-colors tracking-wide uppercase" onClick={() => window.scrollTo(0, 0)}>
            {t("nav.about")}
          </a>
        </nav>

        <div className="flex items-center gap-6">
          {/* Instagram */}
          <a href="https://www.instagram.com/kickmilano/" target="_blank" rel="noopener noreferrer" className="text-white/90 hover:text-white transition-colors">
            <Instagram className="w-5 h-5" />
          </a>
          {/* Language Toggle */}
          <div className="flex items-center gap-1 text-sm font-medium tracking-wide uppercase">
            <button
              onClick={() => setLanguage("en")}
              className={`transition-colors ${language === "en" ? "text-white" : "text-white/40 hover:text-white/70"}`}
            >
              EN
            </button>
            <span className="text-white/30">/</span>
            <button
              onClick={() => setLanguage("it")}
              className={`transition-colors ${language === "it" ? "text-white" : "text-white/40 hover:text-white/70"}`}
            >
              IT
            </button>
          </div>

          {/* Shop */}
          <div className="relative">
            <a href="/shop" className="text-sm font-medium text-white tracking-wide uppercase relative after:content-[''] after:absolute after:w-full after:h-[1px] after:bg-white after:bottom-0 after:left-0">
              {t("nav.shop")}
            </a>
            <span className="absolute -bottom-4 left-1/2 -translate-x-1/2 text-[10px] text-white/60 italic font-serif whitespace-nowrap" style={{ fontFamily: 'Georgia, serif' }}>
              coming soon
            </span>
          </div>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;
