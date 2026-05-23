import { Instagram, Facebook } from "lucide-react";
import { Link } from "react-router-dom";
import kickLogo from "@/assets/kick-logo.png";
import { useLanguage } from "@/contexts/LanguageContext";

const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer className="bg-secondary">
      <div className="container mx-auto px-6 py-[20px] pt-[40px]">
        <div className="grid md:grid-cols-4 gap-12">
          <div className="md:col-span-1">
            <a href="/" className="block h-8 overflow-hidden mb-4">
              <img src={kickLogo} alt="kick" className="h-24 w-auto -mt-8 -ml-2 brightness-0 invert" />
            </a>
            <p className="text-white/50 text-sm leading-relaxed">{t("footer.tagline")}</p>
          </div>

          <div>
            <h4 className="font-medium text-white mb-4 text-sm uppercase tracking-wide font-sans">{t("footer.company")}</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/our-story" onClick={() => window.scrollTo(0, 0)} className="text-white/50 hover:text-white transition-colors text-sm">
                  {t("footer.our_story")}
                </Link>
              </li>
              <li>
                <Link to="/#ingredients" className="text-white/50 hover:text-white transition-colors text-sm">
                  {t("nav.ingredients")}
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-white/50 hover:text-white transition-colors text-sm">
                  {t("footer.faq")}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-medium text-white mb-4 text-sm uppercase tracking-wide font-sans">{t("footer.follow")}</h4>
            <div className="flex gap-3">
              <a href="https://www.instagram.com/kickmilano/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors group">
                <Instagram className="w-5 h-5 text-white/60 group-hover:text-white" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-white/40 text-sm">{t("footer.rights")}</p>
          <div className="flex gap-6">
            <a href="#" className="text-white/40 hover:text-white/60 text-sm transition-colors">{t("footer.privacy")}</a>
            <a href="#" className="text-white/40 hover:text-white/60 text-sm transition-colors">{t("footer.terms")}</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
