import Layout from "@/components/Layout";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import kickBottleGinger from "@/assets/kick-bottle-ginger.png";
import illustrationDrinking from "@/assets/illustration-drinking.png";
import { useLanguage } from "@/contexts/LanguageContext";
import StoryJourneyMap from "@/components/StoryJourneyMap";

const OurStory = () => {
  const { t } = useLanguage();

  return (
    <Layout showHeaderBackground>
      <div className="pt-20">
        {/* Hero Section */}
        <section className="bg-secondary py-24 text-secondary md:py-[50px]">
          <div className="container mx-auto px-6">
            <div className="grid items-start gap-8 md:grid-cols-[minmax(0,1.15fr)_minmax(280px,0.85fr)] lg:gap-12">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="max-w-3xl"
              >
                <span className="mb-6 block text-xs uppercase tracking-[0.2em] text-destructive-foreground">
                  {t("story.label")}
                </span>
                <h1 className="mb-8 font-sans text-5xl font-bold leading-[1.05] tracking-tight md:text-5xl">
                  <span className="text-4xl text-secondary-foreground">{t("story.title")}</span>
                  <br />
                </h1>
                <p className="mb-6 max-w-xl text-lg font-semibold leading-relaxed text-destructive-foreground opacity-80">
                  {t("story.subtitle")}
                </p>
                <div className="max-w-xl space-y-3 text-sm leading-relaxed text-secondary">
                  <p className="text-white opacity-80">{t("story.intro")}</p>
                  <p className="text-white opacity-80">{t("story.p1")}</p>
                  <p className="text-destructive-foreground opacity-80" dangerouslySetInnerHTML={{ __html: t("story.p2") }} />
                  <p className="text-destructive-foreground opacity-80" dangerouslySetInnerHTML={{ __html: t("story.p3") }} />
                  <p className="text-destructive-foreground opacity-80" dangerouslySetInnerHTML={{ __html: t("story.p4") }} />
                  <p className="text-destructive-foreground opacity-80" dangerouslySetInnerHTML={{ __html: t("story.p5") }} />
                  <p className="text-destructive-foreground opacity-80" dangerouslySetInnerHTML={{ __html: t("story.p6") }} />
                  <p className="text-xl font-bold text-secondary-foreground">{t("story.tagline")}</p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="-mr-4 -mt-4 flex justify-end self-start md:-mr-8 md:-mt-8"
              >
                <img
                  src={illustrationDrinking}
                  alt="Woman drinking a wellness shot"
                  className="w-full object-contain px-4 pb-0 pt-12 opacity-90 md:w-[32rem] md:px-0 md:py-[100px] lg:w-[38rem]"
                />
              </motion.div>
            </div>
          </div>
        </section>

        <StoryJourneyMap />

        {/* Mission Section */}
        <section className="bg-background py-24 md:py-32 pt-[50px]">
          <div className="container mx-auto px-6">
            <div className="grid items-start gap-6 md:grid-cols-[minmax(0,1fr)_auto] md:gap-8 lg:gap-10">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
                className="min-w-0"
              >
                <span className="mb-4 block text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  {t("story.mission_label")}
                </span>
                <h2 className="mb-6 font-sans text-3xl font-bold tracking-tight text-foreground md:text-4xl">
                  {t("story.mission_title")}
                </h2>
                <p className="mb-6 max-w-3xl text-sm leading-relaxed text-muted-foreground">
                  {t("story.mission_p1")}
                </p>
                <p className="max-w-3xl text-sm leading-relaxed text-muted-foreground">
                  {t("story.mission_p2")}
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.2 }}
                className="flex justify-end self-start md:pt-2"
              >
                <div className="relative flex h-28 w-28 items-center justify-center rounded-full bg-secondary/10 md:h-36 md:w-36 lg:h-40 lg:w-40">
                  <img
                    src={kickBottleGinger}
                    alt="Kick immunity shot bottle with ginger"
                    className="h-20 object-contain md:h-28 lg:h-32"
                  />
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="bg-secondary py-24 text-secondary-foreground md:py-[12px] pb-[20px] pt-[20px]">
          <div className="container mx-auto px-6 py-0 pb-[20px] pt-[40px]">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="mb-16 text-center"
            >
              <h2 className="text-left font-sans text-3xl font-bold tracking-tight md:text-4xl">
                {t("story.values_title")}
              </h2>
            </motion.div>

            <div className="grid gap-12 md:grid-cols-3">
              {[
                { title: t("story.pure"), description: t("story.pure_desc") },
                { title: t("story.powerful"), description: t("story.powerful_desc") },
                { title: t("story.purposeful"), description: t("story.purposeful_desc") },
              ].map((value, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: i * 0.15 }}
                  className="text-center"
                >
                  <h3 className="mb-4 text-left font-sans text-2xl font-bold">{value.title}</h3>
                  <p className="text-left text-sm leading-relaxed text-white/70">{value.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Sourcing Section */}
        <section className="bg-secondary py-12 md:py-6">
          <div className="container mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <a
                href="/#ingredients"
                className="group inline-flex items-center gap-2 text-lg font-bold text-secondary-foreground"
              >
                {t("story.see_ingredients")}
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </a>
              <div className="border-t border-secondary-foreground/30 opacity-70 my-[3px] mt-[20px] mb-0" />
            </motion.div>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default OurStory;
