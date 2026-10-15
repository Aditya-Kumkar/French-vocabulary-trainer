export const LEARNING_TOPICS = [
  {
    id: "articles", title: "Articles", subtitle: "le, la, l’, les · un, une, des", level: "A1", icon: "📘",
    lesson: "French uses a small word before a noun. Learn these first: **le** (the, masculine), **la** (the, feminine), and **les** (the, plural). Use **l’** before a vowel sound.",
    examples: [["le livre", "the book (masculine)"], ["la table", "the table (feminine)"], ["l’école", "the school"], ["les amis", "the friends"], ["un stylo / une pomme", "a pen / an apple"], ["des livres", "some books"]],
    questions: [
      { prompt: "___ maison (the house)", options: ["le", "la", "les"], answer: "la", explain: "Maison is feminine: la maison." },
      { prompt: "___ école (the school)", options: ["la", "l’", "les"], answer: "l’", explain: "École starts with a vowel, so la becomes l’école." },
      { prompt: "___ chats (the cats)", options: ["le", "la", "les"], answer: "les", explain: "Les is the definite article for plural nouns." },
    ],
  },
  {
    id: "possessives", title: "Possessive adjectives", subtitle: "mon, ma, mes · ton, ta, tes", level: "A1", icon: "🧑‍🤝‍🧑",
    lesson: "These words mean **my** or **your**. Use **mon/ma** for one thing and **mes** for more than one. The word changes to match the thing, not the person.",
    examples: [["mon frère / ma sœur / mes amis", "my brother / my sister / my friends"], ["ton livre / ta maison / tes clés", "your book / your house / your keys"], ["son père / sa mère / ses parents", "his/her father / mother / parents"], ["mon amie", "my female friend (vowel sound)"]],
    questions: [
      { prompt: "___ sœur (my sister)", options: ["mon", "ma", "mes"], answer: "ma", explain: "Sœur is feminine singular, so use ma." },
      { prompt: "___ amis (your friends, informal)", options: ["ton", "ta", "tes"], answer: "tes", explain: "Plural owned noun: tes amis." },
      { prompt: "___ école (my school)", options: ["ma", "mon", "mes"], answer: "mon", explain: "Use mon before a feminine singular noun beginning with a vowel sound: mon école." },
    ],
  },
  {
    id: "demonstratives", title: "Demonstrative adjectives", subtitle: "ce, cet, cette, ces", level: "A1", icon: "👉",
    lesson: "These words mean **this** or **these**. Start with three patterns: **ce** (masculine), **cette** (feminine), and **ces** (plural). Use **cet** before a masculine word that starts with a vowel sound.",
    examples: [["ce garçon", "this/that boy"], ["cet homme", "this/that man"], ["cette fille", "this/that girl"], ["ces livres", "these/those books"]],
    questions: [
      { prompt: "___ arbre (this tree)", options: ["ce", "cet", "cette"], answer: "cet", explain: "Arbre is masculine and starts with a vowel: cet arbre." },
      { prompt: "___ voiture (this car)", options: ["ce", "cette", "ces"], answer: "cette", explain: "Voiture is feminine singular: cette voiture." },
      { prompt: "___ étudiants (these students)", options: ["cet", "cette", "ces"], answer: "ces", explain: "Use ces with plural nouns." },
    ],
  },
  {
    id: "numbers", title: "Numbers", subtitle: "0–100 · counting and age", level: "A1", icon: "🔢",
    lesson: "Start with a few numbers at a time. You do not need to memorise them all today. One useful phrase is **J’ai vingt ans** — “I am twenty years old.”",
    examples: [["zéro, un, deux, trois", "0, 1, 2, 3"], ["onze, douze, treize, quatorze, quinze, seize", "11–16"], ["vingt, trente, quarante, cinquante", "20, 30, 40, 50"], ["soixante, soixante-dix, quatre-vingts, quatre-vingt-dix", "60, 70, 80, 90"], ["J’ai vingt ans.", "I am twenty years old."]],
    questions: [
      { prompt: "How do you say 15?", options: ["quatorze", "quinze", "seize"], answer: "quinze", explain: "Quinze means fifteen." },
      { prompt: "How do you say 40?", options: ["trente", "quarante", "cinquante"], answer: "quarante", explain: "Quarante means forty." },
      { prompt: "Complete: J’___ dix-huit ans.", options: ["suis", "ai", "est"], answer: "ai", explain: "French expresses age with avoir: J’ai dix-huit ans." },
    ],
  },
  {
    id: "colours", title: "Colours", subtitle: "les couleurs · masculine and feminine", level: "A1", icon: "🎨",
    lesson: "Learn the colour first, then use it in a short phrase. Many colours change a little depending on the noun. For now, remember **une voiture rouge** means “a red car”.",
    examples: [["rouge", "red"], ["bleu / bleue", "blue (masculine / feminine)"], ["vert / verte", "green"], ["noir / noire", "black"], ["blanc / blanche", "white"], ["une voiture rouge", "a red car"]],
    questions: [
      { prompt: "A blue feminine noun: une voiture ___", options: ["bleu", "bleue", "bleus"], answer: "bleue", explain: "Bleu agrees with feminine voiture: bleue." },
      { prompt: "A black masculine noun: un chat ___", options: ["noir", "noire", "noires"], answer: "noir", explain: "Chat is masculine singular: noir." },
      { prompt: "Which colour usually stays unchanged?", options: ["vert", "blanc", "orange"], answer: "orange", explain: "Colour names derived from things, such as orange and marron, are generally invariable." },
    ],
  },
  {
    id: "body", title: "Body parts", subtitle: "la tête · les mains · le corps", level: "A1", icon: "🧍",
    lesson: "Learn each body part together with its little word: **la tête** (head), **le nez** (nose), **la bouche** (mouth). A useful phrase is **J’ai mal à la tête** — “I have a headache.”",
    examples: [["la tête", "head"], ["les yeux", "eyes (singular: l’œil)"], ["le nez", "nose"], ["la bouche", "mouth"], ["les mains", "hands (singular: la main)"], ["les jambes / les pieds", "legs / feet"], ["J’ai mal au dos.", "My back hurts."]],
    questions: [
      { prompt: "___ tête (the head)", options: ["le", "la", "les"], answer: "la", explain: "Tête is feminine: la tête." },
      { prompt: "“The eyes” in French", options: ["les yeux", "les nez", "les mains"], answer: "les yeux", explain: "Œil is irregular in the plural: les yeux." },
      { prompt: "Complete: J’ai mal ___ tête.", options: ["à la", "au", "aux"], answer: "à la", explain: "La phrase is: J’ai mal à la tête." },
    ],
  },
  {
    id: "weekdays", title: "Days of the week", subtitle: "lundi → dimanche", level: "A1", icon: "📅",
    lesson: "Learn the days in order. French days usually start with a lowercase letter. **Lundi** means Monday; **dimanche** means Sunday.",
    examples: [["lundi, mardi, mercredi", "Monday, Tuesday, Wednesday"], ["jeudi, vendredi", "Thursday, Friday"], ["samedi, dimanche", "Saturday, Sunday"], ["Nous avons cours le lundi.", "We have class on Mondays."]],
    questions: [
      { prompt: "Which means Wednesday?", options: ["mardi", "mercredi", "jeudi"], answer: "mercredi", explain: "Mercredi means Wednesday." },
      { prompt: "Which day comes after vendredi?", options: ["jeudi", "samedi", "dimanche"], answer: "samedi", explain: "Samedi (Saturday) follows vendredi (Friday)." },
      { prompt: "French days of the week usually begin with…", options: ["a capital letter", "a lowercase letter", "an accent"], answer: "a lowercase letter", explain: "Days are normally written in lowercase in French." },
    ],
  },
  {
    id: "months", title: "Months", subtitle: "janvier → décembre", level: "A1", icon: "🗓️",
    lesson: "Months usually start with a lowercase letter in French. To say “in May”, say **en mai**. You can learn the months a few at a time.",
    examples: [["janvier, février, mars", "January, February, March"], ["avril, mai, juin", "April, May, June"], ["juillet, août, septembre", "July, August, September"], ["octobre, novembre, décembre", "October, November, December"], ["Je suis né en mai.", "I was born in May."]],
    questions: [
      { prompt: "How do you say August?", options: ["avril", "août", "octobre"], answer: "août", explain: "Août means August." },
      { prompt: "Which month comes before juillet?", options: ["mai", "juin", "août"], answer: "juin", explain: "Juin (June) comes before juillet (July)." },
      { prompt: "Complete: Je suis né ___ mars.", options: ["à", "en", "au"], answer: "en", explain: "Use en with months: en mars." },
    ],
  },
];
