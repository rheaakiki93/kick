import { createContext, useContext, useState, ReactNode } from "react";

export type Language = "en" | "it";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Translations
const translations: Record<Language, Record<string, string>> = {
  en: {
    // Header
    "nav.ingredients": "Ingredients",
    "nav.benefits": "Benefits",
    "nav.about": "About",
    "nav.shop": "Shop",
    "nav.coming_soon": "coming soon",

    // Typewriter
    "typewriter.energy": "YOUR ENERGY",
    "typewriter.immunity": "YOUR IMMUNITY",
    "typewriter.gut": "YOUR GUT",

    // Marquee
    "marquee.vegan": "VEGAN",
    "marquee.no_sugar": "NO ADDED SUGARS",
    "marquee.natural_energy": "NATURAL ENERGY",
    "marquee.natural_ingredients": "NATURAL INGREDIENTS",
    "marquee.cold_pressed": "COLD PRESSED",
    "marquee.plant_based": "PLANT BASED",
    "marquee.immunity_boost": "IMMUNITY BOOST",
    "marquee.made_in_italy": "MADE IN ITALY",

    // Ingredients
    "ingredients.label": "100% Natural Formula",
    "ingredients.title_1": "PURE",
    "ingredients.title_2": "INGREDIENTS",
    "ingredients.description": "Cold-pressed daily. No fillers. No additives. Just three powerful ingredients working in synergy for maximum effect.",
    "ingredients.composition": "60ml Shot Composition",
    "ingredients.natural": "100% Natural",
    "ingredients.ginger": "Ginger",
    "ingredients.lemon": "Lemon",
    "ingredients.apple": "Apple",
    "ingredients.view_benefits": "View benefits",
    "ingredients.scroll_hint": "Use arrows to explore",
    "ingredients.ginger_root": "Ginger Root",
    "ingredients.fresh_lemon": "Fresh Lemon",
    "ingredients.green_apple": "Green Apple",
    "ingredients.ginger_benefit": "Anti-inflammatory",
    "ingredients.lemon_benefit": "Vitamin C Boost",
    "ingredients.apple_benefit": "Natural Sweetness",
    "ingredients.ginger_desc": "Fresh organic ginger packed with gingerols for metabolism boost.",
    "ingredients.lemon_desc": "Organic citrus providing essential vitamin C and alkalizing benefits.",
    "ingredients.apple_desc": "Crisp apples adding natural sweetness and antioxidants.",

    // Benefits
    "benefits.label": "Science-Backed",
    "benefits.title": "FEEL THE DIFFERENCE",
    "benefits.energy_title": "ENERGY & METABOLISM",
    "benefits.energy_headline": "Clean energy that ignites your metabolic fire",
    "benefits.energy_source": "Ginger's thermogenic effect",
    "benefits.energy_h1": "Ginger naturally increases <strong>thermogenesis</strong> and <strong>circulation</strong>.",
    "benefits.energy_h2": "You feel warmer, more awake, and <strong>metabolically active</strong>.",
    "benefits.energy_h3": "Proven to help your body move <strong>oxygen</strong> and <strong>nutrients</strong> more efficiently.",
    "benefits.digestion_title": "DIGESTION",
    "benefits.digestion_headline": "Resets digestion and reduces bloating",
    "benefits.digestion_source": "Ginger + lemon + apple synergy",
    "benefits.digestion_h1": "Ginger speeds up <strong>gastric emptying</strong> and reduces <strong>bloating</strong>.",
    "benefits.digestion_h2": "Lemon and apple pectin support <strong>digestive enzymes</strong> and <strong>gut balance</strong>.",
    "benefits.digestion_h3": "Proven to help food move through your system more <strong>smoothly</strong>.",
    "benefits.immunity_title": "IMMUNITY & RECOVERY",
    "benefits.immunity_headline": "Daily defense and inflammation support",
    "benefits.immunity_source": "Vitamin C + antioxidants + gingerols",
    "benefits.immunity_h1": "<strong>Gingerols</strong> fight <strong>inflammation</strong> and oxidative stress.",
    "benefits.immunity_h2": "<strong>Vitamin C</strong> supports normal <strong>immune function</strong>.",
    "benefits.immunity_h3": "Proven to support your body's natural <strong>recovery process</strong>.",

    // About
    "about.label": "Our Story",
    "about.title_1": "CRAFTED FOR",
    "about.title_2": "WELLNESS",
    "about.description": "Kick was born from a simple belief: what you put into your body should be pure, powerful, and purposeful. We cold-press daily, sourcing only the finest organic ingredients from trusted farms committed to sustainable practices.",
    "about.learn_more": "Learn more",

    // When to Take
    "when.label": "Ritual",
    "when.title": "WHEN TO TAKE YOUR SHOT",
    "when.morning_time": "MORNING",
    "when.morning_title": "The Morning Reset",
    "when.morning_desc": "Take on an empty stomach for maximum absorption and an energizing boost.",
    "when.morning_long": "Start your day with a powerful dose of natural energy. The morning is when your body is most receptive to nutrients, making it the perfect time to fuel up with ginger, apple, and lemon. This ritual kickstarts your metabolism and sets the tone for a productive day ahead.",
    "when.workout_time": "PRE-WORKOUT",
    "when.workout_title": "The Performance Boost",
    "when.workout_desc": "Ideal before or after movement.",
    "when.workout_long": "Ginger's natural thermogenic effect supports circulation and gently raises body temperature, helping your body prepare for activity and recover afterward.\n\nTake your shot around 30 minutes before training to stimulate metabolism and blood flow, or after exercise to support digestion and help reduce inflammation as your body recovers.",
    "when.evening_time": "EVENING",
    "when.evening_title": "The Evening Repair",
    "when.evening_desc": "After dinner to aid digestion and reduce inflammation overnight.",
    "when.evening_long": "Wind down with a recovery ritual that works while you rest. The anti-inflammatory compounds in ginger support overnight muscle repair and reduce post-workout soreness. This evening dose also aids digestion, helping your body process nutrients more efficiently.",

    // FAQ
    "faq.label": "Questions",
    "faq.title": "EVERYTHING YOU NEED TO KNOW",
    "faq.ritual_q": "What is the optimal shot ritual?",
    "faq.ritual_intro": "There's no single perfect moment—only the one that fits your rhythm. Here are three rituals our community swears by:",
    "faq.morning_title": "The Morning Reset",
    "faq.morning_subtitle": "On an empty stomach",
    "faq.morning_desc": "Start your day with a powerful dose of natural energy. The morning is when your body is most receptive to nutrients, making it the perfect time to fuel up with ginger, apple, and lemon. This ritual kickstarts your metabolism and sets the tone for a productive day ahead.",
    "faq.workout_title": "The Performance Boost",
    "faq.workout_subtitle": "Before or after movement",
    "faq.workout_desc": "Ginger's natural thermogenic effect supports circulation and gently raises body temperature, helping your body prepare for activity and recover afterward. Take your shot around 30 minutes before training to stimulate metabolism and blood flow, or after exercise to support digestion and help reduce inflammation as your body recovers.",
    "faq.evening_title": "The Evening Repair",
    "faq.evening_subtitle": "After dinner",
    "faq.evening_desc": "Wind down with a recovery ritual that works while you rest. The anti-inflammatory compounds in ginger support overnight muscle repair and reduce post-workout soreness. This evening dose also aids digestion, helping your body process nutrients more efficiently.",
    "faq.ingredients_q": "What's inside each shot?",
    "faq.ingredients_a": "Every 60ml shot contains pure, cold-pressed ginger root, fresh lemon, and green apple—nothing else. No water, no preservatives, no added sugars. Just three powerful ingredients working in harmony.",
    "faq.frequency_q": "How often should I take a shot?",
    "faq.frequency_a": "We recommend one shot daily for consistent benefits. Some choose to take up to two shots on high-intensity days or when feeling under the weather. Listen to your body—it knows what it needs.",
    "faq.storage_q": "How should I store my shots?",
    "faq.storage_a": "Keep your shots refrigerated at all times. Once opened, consume within 24 hours for maximum freshness and potency.",
    "faq.taste_q": "Is it going to burn?",
    "faq.taste_a": "You'll feel the ginger's natural warmth—that's how you know it's working. The apple and lemon balance the intensity, creating a bright, invigorating flavor that wakes up your senses without overwhelming them.",

    // Footer
    "footer.tagline": "Piccolo formato, grande kick. Your daily immunity shot.",
    "footer.company": "Company",
    "footer.our_story": "Our Story",
    "footer.faq": "FAQ",
    "footer.follow": "Follow",
    "footer.rights": "© 2025 Kick. All rights reserved.",
    "footer.privacy": "Privacy",
    "footer.terms": "Terms",

    // Our Story page
    "story.label": "Our Story",
    "story.title": "CRAFTED FOR WELLNESS",
    "story.subtitle": "Born from a simple belief: what you put into your body should be pure, powerful, and purposeful.",
    "story.intro": "Hi, I'm Rhea.",
    "story.p1": "I was born and raised in Lebanon. I later moved to Paris for studies, where I stayed for ten years before relocating to Milan.",
    "story.p2": "Between work, friends <strong>and a few too many aperitivos</strong>, I was always searching for easy ways to <strong>get my body back on track</strong>.",
    "story.p3": "It was in Paris that I discovered <strong>functional ginger-based shots</strong> — <strong>quick, natural, and effective</strong>. A couple of sips and you feel reborn.",
    "story.p4": "When I arrived in Milan, <strong>unable to find them anywhere</strong>, <strong>I decided to create them</strong>, also using the exceptional ingredients available in Italy.",
    "story.p5": "<strong>That's how Kick was born.</strong>",
    "story.p6": "We started with a first version using just three ingredients: <strong>ginger, green apple, and lemon</strong>. All top-quality, organic fruit.",
    "story.tagline": "Piccolo formato, grande Kick",
    "story.mission_label": "The Mission",
    "story.mission_title": "WHY WE STARTED KICK",
    "story.mission_p1": "We noticed something missing in the wellness space — real, uncompromising quality. Too many products cut corners with fillers, artificial ingredients, and misleading labels. We decided to do things differently.",
    "story.mission_p2": "Every Kick shot is cold-pressed daily from organic ingredients sourced directly from trusted farms committed to sustainable, regenerative practices. No shortcuts. No compromises.",
    "story.values_title": "OUR VALUES",
    "story.pure": "PURE",
    "story.pure_desc": "100% organic ingredients, cold-pressed daily. No preservatives, no artificial flavours, no fillers. Just nature's best.",
    "story.powerful": "POWERFUL",
    "story.powerful_desc": "Concentrated shots packed with ginger, turmeric, lemon, and apple cider vinegar — ingredients backed by centuries of use and modern science.",
    "story.purposeful": "PURPOSEFUL",
    "story.purposeful_desc": "Every ingredient earns its place. We formulate with intention, targeting immunity, energy, and gut health in every single shot.",
    "story.see_ingredients": "See our ingredients",

    // Survey
    "survey.label": "We'd love to hear from you",
    "survey.title": "SHARE YOUR EXPERIENCE",
    "survey.qr_hint": "Scan the QR code to share this page with friends — or save it for later.",
    "survey.thank_title": "Thank you! 🙌",
    "survey.thank_desc": "Your feedback helps us make Kick even better.",
    "survey.rate": "How would you rate Kick?",
    "survey.spice": "How much did the ginger spice level make you cry?",
    "survey.frequency": "How many times a week would you drink it? 🗓️",
    "survey.frequency_daily": "Every day!",
    "survey.benefits_q": "Did you know ginger is practically a superhero in a bottle? 🦸",
    "survey.benefits_yes": "Of course, I'm an expert",
    "survey.benefits_no": "No, tell me everything!",
    "survey.learn_more": "Learn more →",
    "survey.tell_more": "Tell us more",
    "survey.placeholder": "What did you like? What would you improve?",
    "survey.submit": "Submit Feedback",
    "survey.submitting": "Submitting...",
    "survey.toast_error_title": "Something went wrong",
    "survey.toast_error_desc": "Please try again later.",
    "survey.toast_success_title": "Thanks for your feedback!",
    "survey.toast_success_desc": "We appreciate you taking the time to share your thoughts.",

    // NotFound
    "notfound.title": "404",
    "notfound.message": "Oops! Page not found",
    "notfound.link": "Return to Home",
  },
  it: {
    // Header
    "nav.ingredients": "Ingredienti",
    "nav.benefits": "Benefici",
    "nav.about": "Chi siamo",
    "nav.shop": "Shop",
    "nav.coming_soon": "in arrivo",

    // Typewriter
    "typewriter.energy": "LA TUA ENERGIA",
    "typewriter.immunity": "LA TUA IMMUNITÀ",
    "typewriter.gut": "IL TUO INTESTINO",

    // Marquee
    "marquee.vegan": "VEGANO",
    "marquee.no_sugar": "SENZA ZUCCHERI AGGIUNTI",
    "marquee.natural_energy": "ENERGIA NATURALE",
    "marquee.natural_ingredients": "INGREDIENTI NATURALI",
    "marquee.cold_pressed": "SPREMUTO A FREDDO",
    "marquee.plant_based": "100% VEGETALE",
    "marquee.immunity_boost": "BOOST IMMUNITARIO",
    "marquee.made_in_italy": "MADE IN ITALY",

    // Ingredients
    "ingredients.label": "Formula 100% Naturale",
    "ingredients.title_1": "INGREDIENTI",
    "ingredients.title_2": "PURI",
    "ingredients.description": "Spremuti a freddo ogni giorno. Senza riempitivi. Senza additivi. Solo tre ingredienti potenti in sinergia per il massimo effetto.",
    "ingredients.composition": "Composizione Shot 60ml",
    "ingredients.natural": "100% Naturale",
    "ingredients.ginger": "Zenzero",
    "ingredients.lemon": "Limone",
    "ingredients.apple": "Mela",
    "ingredients.view_benefits": "Scopri i benefici",
    "ingredients.scroll_hint": "Usa le frecce per esplorare",
    "ingredients.ginger_root": "Radice di Zenzero",
    "ingredients.fresh_lemon": "Limone Fresco",
    "ingredients.green_apple": "Mela Verde",
    "ingredients.ginger_benefit": "Anti-infiammatorio",
    "ingredients.lemon_benefit": "Boost di Vitamina C",
    "ingredients.apple_benefit": "Dolcezza Naturale",
    "ingredients.ginger_desc": "Zenzero biologico fresco ricco di gingeroli per stimolare il metabolismo.",
    "ingredients.lemon_desc": "Agrumi biologici che forniscono vitamina C essenziale e benefici alcalinizzanti.",
    "ingredients.apple_desc": "Mele croccanti che aggiungono dolcezza naturale e antiossidanti.",

    // Benefits
    "benefits.label": "Basato sulla Scienza",
    "benefits.title": "SENTI LA DIFFERENZA",
    "benefits.energy_title": "ENERGIA E METABOLISMO",
    "benefits.energy_headline": "Energia pulita che accende il tuo fuoco metabolico",
    "benefits.energy_source": "Effetto termogenico dello zenzero",
    "benefits.energy_h1": "Lo zenzero aumenta naturalmente la <strong>termogenesi</strong> e la <strong>circolazione</strong>.",
    "benefits.energy_h2": "Ti senti più caldo, più sveglio e <strong>metabolicamente attivo</strong>.",
    "benefits.energy_h3": "Dimostrato che aiuta il corpo a trasportare <strong>ossigeno</strong> e <strong>nutrienti</strong> in modo più efficiente.",
    "benefits.digestion_title": "DIGESTIONE",
    "benefits.digestion_headline": "Ripristina la digestione e riduce il gonfiore",
    "benefits.digestion_source": "Sinergia zenzero + limone + mela",
    "benefits.digestion_h1": "Lo zenzero accelera lo <strong>svuotamento gastrico</strong> e riduce il <strong>gonfiore</strong>.",
    "benefits.digestion_h2": "Limone e pectina di mela supportano gli <strong>enzimi digestivi</strong> e l'<strong>equilibrio intestinale</strong>.",
    "benefits.digestion_h3": "Dimostrato che aiuta il cibo a muoversi nel sistema in modo più <strong>fluido</strong>.",
    "benefits.immunity_title": "IMMUNITÀ E RECUPERO",
    "benefits.immunity_headline": "Difesa quotidiana e supporto antinfiammatorio",
    "benefits.immunity_source": "Vitamina C + antiossidanti + gingeroli",
    "benefits.immunity_h1": "I <strong>gingeroli</strong> combattono l'<strong>infiammazione</strong> e lo stress ossidativo.",
    "benefits.immunity_h2": "La <strong>Vitamina C</strong> supporta la normale <strong>funzione immunitaria</strong>.",
    "benefits.immunity_h3": "Dimostrato che supporta il naturale <strong>processo di recupero</strong> del corpo.",

    // About
    "about.label": "La Nostra Storia",
    "about.title_1": "CREATO PER IL",
    "about.title_2": "BENESSERE",
    "about.description": "Kick è nato da una semplice convinzione: ciò che metti nel tuo corpo dovrebbe essere puro, potente e con uno scopo. Spremiamo a freddo ogni giorno, utilizzando solo i migliori ingredienti biologici da aziende agricole di fiducia impegnate in pratiche sostenibili.",
    "about.learn_more": "Scopri di più",

    // When to Take
    "when.label": "Rituale",
    "when.title": "QUANDO PRENDERE IL TUO SHOT",
    "when.morning_time": "MATTINA",
    "when.morning_title": "Il Reset Mattutino",
    "when.morning_desc": "Prendi a stomaco vuoto per il massimo assorbimento e una carica energizzante.",
    "when.morning_long": "Inizia la giornata con una potente dose di energia naturale. La mattina è il momento in cui il tuo corpo è più ricettivo ai nutrienti, rendendolo il momento perfetto per fare il pieno di zenzero, mela e limone. Questo rituale attiva il metabolismo e imposta il tono per una giornata produttiva.",
    "when.workout_time": "PRE-ALLENAMENTO",
    "when.workout_title": "Il Boost Prestazionale",
    "when.workout_desc": "Ideale prima o dopo il movimento.",
    "when.workout_long": "L'effetto termogenico naturale dello zenzero supporta la circolazione e alza delicatamente la temperatura corporea, aiutando il corpo a prepararsi all'attività e a recuperare dopo.\n\nPrendi il tuo shot circa 30 minuti prima dell'allenamento per stimolare il metabolismo e il flusso sanguigno, o dopo l'esercizio per supportare la digestione e ridurre l'infiammazione durante il recupero.",
    "when.evening_time": "SERA",
    "when.evening_title": "La Riparazione Serale",
    "when.evening_desc": "Dopo cena per aiutare la digestione e ridurre l'infiammazione durante la notte.",
    "when.evening_long": "Rilassati con un rituale di recupero che funziona mentre riposi. I composti anti-infiammatori dello zenzero supportano la riparazione muscolare notturna e riducono i dolori post-allenamento. Questa dose serale aiuta anche la digestione, permettendo al corpo di elaborare i nutrienti in modo più efficiente.",

    // FAQ
    "faq.label": "Domande",
    "faq.title": "TUTTO QUELLO CHE DEVI SAPERE",
    "faq.ritual_q": "Qual è il rituale ottimale per lo shot?",
    "faq.ritual_intro": "Non esiste un momento perfetto unico — solo quello che si adatta al tuo ritmo. Ecco tre rituali che la nostra community adora:",
    "faq.morning_title": "Il Reset Mattutino",
    "faq.morning_subtitle": "A stomaco vuoto",
    "faq.morning_desc": "Inizia la giornata con una potente dose di energia naturale. La mattina è il momento in cui il tuo corpo è più ricettivo ai nutrienti, rendendolo il momento perfetto per fare il pieno di zenzero, mela e limone. Questo rituale attiva il metabolismo e imposta il tono per una giornata produttiva.",
    "faq.workout_title": "Il Boost Prestazionale",
    "faq.workout_subtitle": "Prima o dopo il movimento",
    "faq.workout_desc": "L'effetto termogenico naturale dello zenzero supporta la circolazione e alza delicatamente la temperatura corporea, aiutando il corpo a prepararsi all'attività e a recuperare dopo. Prendi il tuo shot circa 30 minuti prima dell'allenamento per stimolare il metabolismo e il flusso sanguigno, o dopo l'esercizio per supportare la digestione e ridurre l'infiammazione durante il recupero.",
    "faq.evening_title": "La Riparazione Serale",
    "faq.evening_subtitle": "Dopo cena",
    "faq.evening_desc": "Rilassati con un rituale di recupero che funziona mentre riposi. I composti anti-infiammatori dello zenzero supportano la riparazione muscolare notturna e riducono i dolori post-allenamento. Questa dose serale aiuta anche la digestione, permettendo al corpo di elaborare i nutrienti in modo più efficiente.",
    "faq.ingredients_q": "Cosa c'è dentro ogni shot?",
    "faq.ingredients_a": "Ogni shot da 60ml contiene puro zenzero spremuto a freddo, limone fresco e mela verde — nient'altro. Niente acqua, niente conservanti, niente zuccheri aggiunti. Solo tre ingredienti potenti che lavorano in armonia.",
    "faq.frequency_q": "Quanto spesso dovrei prendere uno shot?",
    "faq.frequency_a": "Raccomandiamo uno shot al giorno per benefici costanti. Alcuni scelgono di prenderne due nei giorni di alta intensità o quando si sentono giù di corda. Ascolta il tuo corpo — sa di cosa ha bisogno.",
    "faq.storage_q": "Come devo conservare i miei shot?",
    "faq.storage_a": "Conserva i tuoi shot in frigorifero in ogni momento. Una volta aperto, consuma entro 24 ore per massima freschezza e potenza.",
    "faq.taste_q": "Brucerà?",
    "faq.taste_a": "Sentirai il calore naturale dello zenzero — è così che sai che funziona. La mela e il limone bilanciano l'intensità, creando un sapore brillante e rinvigorente che sveglia i tuoi sensi senza sopraffarli.",

    // Footer
    "footer.tagline": "Piccolo formato, grande kick. Il tuo shot immunitario quotidiano.",
    "footer.company": "Azienda",
    "footer.our_story": "La Nostra Storia",
    "footer.faq": "FAQ",
    "footer.follow": "Seguici",
    "footer.rights": "© 2025 Kick. Tutti i diritti riservati.",
    "footer.privacy": "Privacy",
    "footer.terms": "Termini",

    // Our Story page
    "story.label": "La Nostra Storia",
    "story.title": "CREATO PER IL BENESSERE",
    "story.subtitle": "Nato da una semplice convinzione: ciò che metti nel tuo corpo dovrebbe essere puro, potente e con uno scopo.",
    "story.intro": "Ciao, sono Rhea.",
    "story.p1": "Sono nata e cresciuta in Libano. Per studio, mi sono poi trasferita a Parigi dove sono rimasta per dieci anni prima di spostarmi a Milano.",
    "story.p2": "Tra lavoro, amici <strong>e qualche aperitivo di troppo</strong>, sono sempre stata alla ricerca di facili strategie per <strong>rimettere il corpo in carreggiata</strong>.",
    "story.p3": "È proprio a Parigi che ho scoperto gli <strong>shot funzionali a base di zenzero</strong> e non solo — <strong>veloci, naturali ed efficaci</strong>. Un paio di sorsi e ti senti rinato.",
    "story.p4": "Quando sono arrivata a Milano, <strong>non trovandoli da nessuna parte</strong>, <strong>ho deciso di crearli</strong>, utilizzando anche gli ingredienti eccezionali disponibili in Italia.",
    "story.p5": "<strong>Così è nato Kick.</strong>",
    "story.p6": "Siamo partiti con una prima versione a base di solo tre ingredienti: <strong>zenzero, mela verde e limone</strong>. Tutta frutta di altissima qualità e biologica.",
    "story.tagline": "Piccolo formato, grande Kick",
    "story.mission_label": "La Missione",
    "story.mission_title": "PERCHÉ ABBIAMO CREATO KICK",
    "story.mission_p1": "Abbiamo notato qualcosa che mancava nel mondo del benessere — una qualità vera e senza compromessi. Troppi prodotti tagliano i costi con riempitivi, ingredienti artificiali e etichette fuorvianti. Abbiamo deciso di fare le cose diversamente.",
    "story.mission_p2": "Ogni shot Kick è spremuto a freddo ogni giorno da ingredienti biologici provenienti direttamente da aziende agricole di fiducia impegnate in pratiche sostenibili e rigenerative. Nessuna scorciatoia. Nessun compromesso.",
    "story.values_title": "I NOSTRI VALORI",
    "story.pure": "PURO",
    "story.pure_desc": "Ingredienti 100% biologici, spremuti a freddo ogni giorno. Senza conservanti, senza aromi artificiali, senza riempitivi. Solo il meglio della natura.",
    "story.powerful": "POTENTE",
    "story.powerful_desc": "Shot concentrati ricchi di zenzero, curcuma, limone e aceto di mele — ingredienti supportati da secoli di utilizzo e dalla scienza moderna.",
    "story.purposeful": "CON UNO SCOPO",
    "story.purposeful_desc": "Ogni ingrediente si guadagna il suo posto. Formuliamo con intenzione, mirando a immunità, energia e salute intestinale in ogni singolo shot.",
    "story.see_ingredients": "Scopri i nostri ingredienti",

    // Survey
    "survey.label": "Ci piacerebbe sentire la tua opinione",
    "survey.title": "CONDIVIDI LA TUA ESPERIENZA",
    "survey.qr_hint": "Scansiona il codice QR per condividere questa pagina con gli amici — o salvala per dopo.",
    "survey.thank_title": "Grazie! 🙌",
    "survey.thank_desc": "Il tuo feedback ci aiuta a rendere Kick ancora migliore.",
    "survey.rate": "Come valuteresti Kick?",
    "survey.spice": "Quanto ti ha fatto piangere il livello di zenzero?",
    "survey.frequency": "Quante volte a settimana lo berresti? 🗓️",
    "survey.frequency_daily": "Ogni giorno!",
    "survey.benefits_q": "Sapevi che lo zenzero è praticamente un supereroe in bottiglia? 🦸",
    "survey.benefits_yes": "Certo, sono un esperto",
    "survey.benefits_no": "No, raccontami tutto!",
    "survey.learn_more": "Per saperne di più →",
    "survey.tell_more": "Dicci di più",
    "survey.placeholder": "Cosa ti è piaciuto? Cosa miglioreresti?",
    "survey.submit": "Invia Feedback",
    "survey.submitting": "Invio in corso...",
    "survey.toast_error_title": "Qualcosa è andato storto",
    "survey.toast_error_desc": "Riprova più tardi.",
    "survey.toast_success_title": "Grazie per il tuo feedback!",
    "survey.toast_success_desc": "Apprezziamo che tu abbia dedicato del tempo per condividere le tue opinioni.",

    // NotFound
    "notfound.title": "404",
    "notfound.message": "Oops! Pagina non trovata",
    "notfound.link": "Torna alla Home",
  },
};

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem("kick-language");
    return (saved === "it" ? "it" : "en") as Language;
  });

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem("kick-language", lang);
  };

  const t = (key: string): string => {
    return translations[language][key] || translations.en[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useLanguage must be used within LanguageProvider");
  return context;
};
