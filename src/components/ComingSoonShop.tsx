import { useState } from "react";
import { motion } from "framer-motion";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Mail, Instagram } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";

type L = { en: string; it: string };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const ComingSoonShop = () => {
  const { language } = useLanguage();
  const tr = (s: L) => s[language];

  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "done" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState<L | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!EMAIL_RE.test(email.trim())) {
      setErrorMsg({ en: "Please enter a valid email address.", it: "Inserisci un indirizzo email valido." });
      return;
    }

    setStatus("submitting");
    const { error } = await supabase.functions.invoke("notify-signup", {
      body: { email: email.trim() },
    });

    if (error) {
      setStatus("error");
      setErrorMsg({ en: "Something went wrong. Please try again.", it: "Si è verificato un errore. Riprova." });
      return;
    }

    setStatus("done");
  };

  return (
    <Layout>
      <section className="min-h-screen flex items-center justify-center pt-24 bg-[hsl(25,90%,94%)]">
        <div className="container mx-auto px-6 max-w-xl text-center py-16">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="inline-flex items-center gap-3 text-primary text-xs font-bold uppercase tracking-[0.2em] mb-4"
          >
            <span className="w-6 h-px bg-primary" />
            {tr({ en: "Coming soon", it: "In arrivo" })}
            <span className="w-6 h-px bg-primary" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="text-foreground leading-[1.05] tracking-tight"
          >
            <span className="block text-2xl sm:text-3xl font-medium text-foreground/80">
              {tr({ en: "we're taking a", it: "ci stiamo prendendo una" })}
            </span>
            <span className="block text-5xl sm:text-6xl font-bold text-primary mt-1">
              {tr({ en: "little pause", it: "piccola pausa" })}
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.25 }}
            className="text-muted-foreground text-lg mt-6 leading-relaxed"
          >
            {tr({
              en: "Online orders are paused for now. Leave your email and we'll let you know the moment fresh ginger shots are back.",
              it: "Gli ordini online sono in pausa. Lasciaci la tua email e ti avviseremo appena i ginger shot freschi saranno di nuovo disponibili.",
            })}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.35 }}
            className="max-w-md mx-auto mt-9"
          >
            {status === "done" ? (
              <div className="flex items-center justify-center gap-2 bg-[hsl(25,90%,86%)] border border-primary/25 rounded-full py-4 px-6 text-foreground font-semibold shadow-sm">
                <Mail className="w-5 h-5 text-primary" />
                {tr({ en: "You're on the list — check your inbox!", it: "Sei in lista — controlla la tua email!" })}
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="flex items-center gap-1.5 bg-[hsl(25,90%,86%)] border border-primary/25 rounded-full p-1.5 shadow-sm"
              >
                <Input
                  type="email"
                  required
                  placeholder={tr({ en: "you@email.com", it: "tu@email.com" })}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 min-w-0 h-11 rounded-full border-0 bg-transparent text-foreground placeholder:text-foreground/50 focus-visible:ring-1 focus-visible:ring-primary/50 focus-visible:ring-offset-0 pl-5"
                />
                <Button
                  type="submit"
                  className="flex-shrink-0 h-11 px-6 rounded-full bg-primary text-primary-foreground font-bold uppercase tracking-wide text-xs sm:text-sm hover:bg-primary/90"
                  disabled={status === "submitting"}
                >
                  {status === "submitting" ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    tr({ en: "Get notified", it: "Notificami" })
                  )}
                </Button>
              </form>
            )}
            {errorMsg && <p className="text-sm text-destructive mt-3">{tr(errorMsg)}</p>}
          </motion.div>

          <motion.a
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            href="https://www.instagram.com/kick_lab_/"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-3 mt-10 text-foreground/70 hover:text-foreground transition-colors"
          >
            <span className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-white border border-primary/20 shadow-sm group-hover:bg-primary group-hover:border-primary group-hover:scale-110 transition-all duration-300">
              <Instagram className="w-6 h-6 group-hover:text-primary-foreground transition-colors" />
            </span>
            <span className="text-sm font-medium">
              {tr({ en: "Follow along on Instagram", it: "Seguici su Instagram" })}
            </span>
          </motion.a>
        </div>
      </section>
    </Layout>
  );
};

export default ComingSoonShop;
