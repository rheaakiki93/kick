import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import timingMorning from "@/assets/product-scene-no-bottle.png";
import timingWorkout from "@/assets/timing-workout-no-bottle.png";
import timingEvening from "@/assets/timing-evening-no-bottle.png";
import { useLanguage } from "@/contexts/LanguageContext";

const FAQ = () => {
  const { t } = useLanguage();

  const ritualAnswers = [
    {
      id: "morning",
      title: t("faq.morning_title"),
      subtitle: t("faq.morning_subtitle"),
      description: t("faq.morning_desc"),
      image: timingMorning,
    },
    {
      id: "workout",
      title: t("faq.workout_title"),
      subtitle: t("faq.workout_subtitle"),
      description: t("faq.workout_desc"),
      image: timingWorkout,
    },
    {
      id: "evening",
      title: t("faq.evening_title"),
      subtitle: t("faq.evening_subtitle"),
      description: t("faq.evening_desc"),
      image: timingEvening,
    },
  ];

  const faqs: { id: string; question: string; type?: "ritual"; answer?: string }[] = [
    { id: "ritual", question: t("faq.ritual_q"), type: "ritual" },
    { id: "ingredients", question: t("faq.ingredients_q"), answer: t("faq.ingredients_a") },
    { id: "frequency", question: t("faq.frequency_q"), answer: t("faq.frequency_a") },
    { id: "storage", question: t("faq.storage_q"), answer: t("faq.storage_a") },
    { id: "taste", question: t("faq.taste_q"), answer: t("faq.taste_a") },
  ];

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
            {t("faq.label")}
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.1] tracking-tight text-foreground font-sans">
            {t("faq.title")}
          </h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-3xl mx-auto"
        >
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq) => (
              <AccordionItem
                key={faq.id}
                value={faq.id}
                className="border border-border rounded-none px-6 data-[state=open]:bg-muted/30"
              >
                <AccordionTrigger className="text-left text-lg md:text-xl font-semibold text-foreground hover:no-underline py-6">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="pb-6">
                  {faq.type === "ritual" ? (
                    <div className="space-y-6">
                      <p className="text-muted-foreground leading-relaxed mb-6">
                        {t("faq.ritual_intro")}
                      </p>
                      {ritualAnswers.map((ritual) => (
                        <div
                          key={ritual.id}
                          className="grid grid-cols-1 md:grid-cols-[120px_1fr] gap-4 pb-6 border-b border-border last:border-0 last:pb-0"
                        >
                          <div className="aspect-square md:aspect-auto overflow-hidden">
                            <img src={ritual.image} alt={ritual.title} className="w-full h-full object-cover" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-foreground mb-1">{ritual.title}</h4>
                            <p className="text-xs uppercase tracking-wider text-muted-foreground/60 mb-2">{ritual.subtitle}</p>
                            <p className="text-sm text-muted-foreground leading-relaxed">{ritual.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground leading-relaxed">{faq.answer}</p>
                  )}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
};

export default FAQ;
