import { useState } from "react";
import { motion } from "framer-motion";
import { QRCodeSVG } from "qrcode.react";
import { Instagram } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";

const SITE_URL = "https://kicklab.it/survey";

const Survey = () => {
  const { toast } = useToast();
  const { t } = useLanguage();
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    rating: "",
    feedback: "",
    ginger_spice_rating: "",
    knows_benefits: "",
    weekly_frequency: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.from("survey_responses").insert({
      rating: form.rating ? parseInt(form.rating) : null,
      feedback: form.feedback.trim() || null,
      ginger_spice_rating: form.ginger_spice_rating ? parseInt(form.ginger_spice_rating) : null,
      knows_benefits: form.knows_benefits === "" ? null : form.knows_benefits === "yes",
      weekly_frequency: form.weekly_frequency ? parseInt(form.weekly_frequency) : null
    });

    setLoading(false);

    if (error) {
      toast({
        title: t("survey.toast_error_title"),
        description: t("survey.toast_error_desc"),
        variant: "destructive"
      });
      return;
    }

    setSubmitted(true);
    toast({
      title: t("survey.toast_success_title"),
      description: t("survey.toast_success_desc")
    });
  };

  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-xs tracking-[0.2em] uppercase text-muted-foreground mb-4 block">
            {t("survey.label")}
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.1] tracking-tight text-foreground font-sans">
            {t("survey.title")}
          </h1>
        </motion.div>

        {/* Instagram CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="max-w-2xl mx-auto mb-16"
        >
          <a
            href="https://www.instagram.com/kick_lab_/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-4 bg-secondary text-white px-8 py-5 hover:scale-[1.02] transition-transform shadow-none"
          >
            <Instagram className="w-8 h-8" />
            <div className="text-left">
              <p className="tracking-tight text-sm font-normal">@kick_lab_</p>
              <p className="text-sm text-white/80">Seguici su Instagram</p>
            </div>
          </a>
        </motion.div>

        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-16 items-start">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col items-center text-center"
          >
            <div className="bg-white p-6 shadow-lg mb-6">
              <QRCodeSVG value={SITE_URL} size={200} level="H" bgColor="#ffffff" fgColor="#1a1a1a" />
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
              {t("survey.qr_hint")}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            {submitted ? (
              <div className="text-center py-12">
                <h3 className="text-2xl font-bold text-foreground mb-3 font-sans">
                  {t("survey.thank_title")}
                </h3>
                <p className="text-muted-foreground">{t("survey.thank_desc")}</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">{t("survey.rate")}</label>
                  <div className="flex gap-2">
                    {["1", "2", "3", "4", "5"].map((n) => (
                      <button
                        key={n}
                        type="button"
                        onClick={() => setForm({ ...form, rating: n })}
                        className={`w-12 h-12 rounded-none border text-sm font-semibold transition-all ${
                          form.rating === n
                            ? "bg-primary text-primary-foreground border-primary"
                            : "bg-muted/30 text-foreground border-border hover:border-primary/50"
                        }`}
                      >
                        {n}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">{t("survey.spice")}</label>
                  <div className="flex items-center gap-2">
                    <div className="flex gap-2">
                      {[
                        { value: "0", label: "🔥" },
                        { value: "1", label: "🔥🔥" },
                        { value: "2", label: "🔥🔥🔥" },
                        { value: "3", label: "🔥🔥🔥🔥" },
                      ].map((item) => (
                        <button
                          key={item.value}
                          type="button"
                          onClick={() => setForm({ ...form, ginger_spice_rating: item.value })}
                          className={`min-w-12 h-12 px-2 rounded-none border text-sm font-semibold transition-all ${
                            form.ginger_spice_rating === item.value
                              ? "bg-primary text-primary-foreground border-primary"
                              : "bg-muted/30 text-foreground border-border hover:border-primary/50"
                          }`}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">{t("survey.frequency")}</label>
                  <div className="flex gap-2">
                    {[
                      { value: "1", label: "1" },
                      { value: "2", label: "2-3" },
                      { value: "3", label: "4-5" },
                      { value: "4", label: t("survey.frequency_daily") },
                    ].map((item) => (
                      <button
                        key={item.value}
                        type="button"
                        onClick={() => setForm({ ...form, weekly_frequency: item.value })}
                        className={`flex-1 py-3 rounded-none border text-sm font-semibold transition-all ${
                          form.weekly_frequency === item.value
                            ? "bg-primary text-primary-foreground border-primary"
                            : "bg-muted/30 text-foreground border-border hover:border-primary/50"
                        }`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">{t("survey.benefits_q")}</label>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setForm({ ...form, knows_benefits: "yes" })}
                      className={`flex-1 py-3 rounded-none border text-sm font-semibold transition-all ${
                        form.knows_benefits === "yes"
                          ? "bg-primary text-primary-foreground border-primary"
                          : "bg-muted/30 text-foreground border-border hover:border-primary/50"
                      }`}
                    >
                      {t("survey.benefits_yes")}
                    </button>
                    <button
                      type="button"
                      onClick={() => setForm({ ...form, knows_benefits: "no" })}
                      className={`flex-1 py-3 rounded-none border text-sm font-semibold transition-all ${
                        form.knows_benefits === "no"
                          ? "bg-primary text-primary-foreground border-primary"
                          : "bg-muted/30 text-foreground border-border hover:border-primary/50"
                      }`}
                    >
                      {t("survey.benefits_no")}
                    </button>
                  </div>
                  <a href="/faq" target="_blank" className="inline-block mt-2 text-xs text-primary underline underline-offset-2 hover:text-primary/80 transition-colors">
                    {t("survey.learn_more")}
                  </a>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">{t("survey.tell_more")}</label>
                  <textarea
                    value={form.feedback}
                    onChange={(e) => setForm({ ...form, feedback: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-3 bg-muted/30 border border-border rounded-none text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary text-sm resize-none"
                    placeholder={t("survey.placeholder")}
                  />
                </div>
                <Button type="submit" variant="hero" size="xl" className="w-full" disabled={loading}>
                  {loading ? t("survey.submitting") : t("survey.submit")}
                </Button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Survey;
