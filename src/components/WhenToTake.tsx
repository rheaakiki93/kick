import { motion } from "framer-motion";
import timingMorning from "@/assets/timing-morning.jpg";
import timingWorkout from "@/assets/timing-workout.jpg";
import timingEvening from "@/assets/timing-evening.jpg";
import { useLanguage } from "@/contexts/LanguageContext";

const WhenToTake = () => {
  const { t } = useLanguage();

  const timings = [
    {
      time: t("when.morning_time"),
      title: t("when.morning_title"),
      description: t("when.morning_desc"),
      longDescription: t("when.morning_long"),
      image: timingMorning,
      number: "01"
    },
    {
      time: t("when.workout_time"),
      title: t("when.workout_title"),
      description: t("when.workout_desc"),
      longDescription: t("when.workout_long"),
      image: timingWorkout,
      number: "02"
    },
    {
      time: t("when.evening_time"),
      title: t("when.evening_title"),
      description: t("when.evening_desc"),
      longDescription: t("when.evening_long"),
      image: timingEvening,
      number: "03"
    }
  ];

  return (
    <section id="when-to-take" className="py-24 bg-background">
      <div className="container mx-auto px-6 mb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <span className="text-xs tracking-[0.2em] uppercase text-muted-foreground mb-4 block">
            {t("when.label")}
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.1] tracking-tight text-foreground font-sans">
            {t("when.title")}
          </h2>
        </motion.div>
      </div>

      <div className="flex flex-col">
        {timings.map((timing, index) => (
          <motion.div
            key={timing.time}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: index * 0.15 }}
            className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] border-t border-border last:border-b"
          >
            <div className="relative aspect-[4/3] lg:aspect-auto lg:min-h-[320px] overflow-hidden">
              <img src={timing.image} alt={timing.title} className="absolute inset-0 w-full h-full object-cover" />
              <div className="absolute inset-0 flex items-start justify-end p-4">
                <span className="text-[3rem] lg:text-[4rem] font-bold text-background/50 leading-none select-none">
                  {timing.number}
                </span>
              </div>
            </div>
            <div className="flex flex-col justify-start p-8 lg:px-16 lg:pt-8 lg:pb-16 bg-background">
              <h3 className="text-3xl lg:text-4xl font-bold text-foreground mb-6 leading-none mt-0 font-sans">
                {timing.title}
              </h3>
              <p className="text-base text-muted-foreground leading-relaxed mb-4">
                {timing.description}
              </p>
              <p className="text-sm text-muted-foreground/80 leading-relaxed">
                {timing.longDescription}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default WhenToTake;
