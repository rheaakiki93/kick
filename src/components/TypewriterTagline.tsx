import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

const TypewriterTagline = () => {
  const { t } = useLanguage();
  const phrases = [t("typewriter.energy"), t("typewriter.immunity"), t("typewriter.gut")];
  
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [hidden, setHidden] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setHidden(latest > 100);
  });

  useEffect(() => {
    // Reset when language changes
    setPhraseIndex(0);
    setDisplayText("");
    setIsDeleting(false);
  }, [t("typewriter.energy")]);

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
      timeout = setTimeout(
        () => setDisplayText(currentPhrase.slice(0, displayText.length + 1)),
        80
      );
    }

    return () => clearTimeout(timeout);
  }, [displayText, isDeleting, phraseIndex, phrases]);

  return (
    <motion.div
      animate={{ y: hidden ? -100 : 0, opacity: hidden ? 0 : 1 }}
      transition={{ duration: 0.3 }}
      className="fixed top-[4.5rem] left-0 z-40 container mx-auto px-6">
      <span className="text-sm font-sans font-medium text-white tracking-[0.2em] uppercase h-5 inline-flex items-center mx-[15px]">
        {displayText}
        <motion.span
          animate={{ opacity: [1, 0] }}
          transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
          className="inline-block w-[1px] h-[0.9em] bg-white ml-0.5" />
      </span>
    </motion.div>
  );
};

export default TypewriterTagline;
