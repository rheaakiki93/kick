import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { Instagram } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import kickLogo from "@/assets/kick-logo.png";
import { useLanguage } from "@/contexts/LanguageContext";
import { CartDrawer } from "@/components/CartDrawer";

const Header = () => {
  const [hidden, setHidden] = useState(false);
  const { scrollY } = useScroll();
  const { language, setLanguage, t } = useLanguage();

  // Typewriter logic
  const phrases = [t("typewriter.energy"), t("typewriter.immunity"), t("typewriter.gut")];
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentPhrase = phrases[phraseIndex];
    let timeout: ReturnType<typeof setTimeout>;
    if (!isDeleting && displayText === currentPhrase) {
      timeout = setTimeout(() => setIsDeleting(true), 1800);
    } else if (isDeleting && displayText === "") {
      setIsDeleting(false);
      setPhraseIndex((prev) => (prev + 1) % phrases.length);
    } else if (isDeleting) {
      timeout = setTimeout(() => setDisplayText((prev) => prev.slice(0, -1)), 50);
    } else {
      timeout = setTimeout(() => setDisplayText(currentPhrase.slice(0, displayText.length + 1)), 80);
    }
    return () => clearTimeout(timeout);
  }, [displayText, isDeleting, phraseIndex]);
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
      className="fixed top-0 left-0 right-0 z-50 border-0"
      style={{ backgroundColor: 'hsl(25, 95%, 55%)' }}
    >
      <div className="container mx-auto px-6 flex items-center justify-between pt-6 pb-1">
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
          </div>

          {/* Cart */}
          <CartDrawer />
        </div>
      </div>

      {/* Typewriter tagline — inside the orange bar */}
      <div className="container mx-auto px-6 pb-2">
        <span className="text-sm font-sans font-medium text-white tracking-[0.2em] uppercase h-5 inline-flex items-center mx-[15px]">
          {displayText}
          <motion.span
            animate={{ opacity: [1, 0] }}
            transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
            className="inline-block w-[1px] h-[0.9em] bg-white ml-0.5"
          />
        </span>
      </div>
    </motion.header>
  );
};

export default Header;
