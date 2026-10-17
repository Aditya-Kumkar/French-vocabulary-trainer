export const VERIFIED_SENTENCES = [
  { id: "greeting-name", level: "A1", english: "My name is Aditya.", french: "Je m'appelle Aditya.", focus: "introductions", explanation: "Use Je m'appelle + a name to say what your name is." },
  { id: "student", level: "A1", english: "I am a student.", french: "Je suis étudiant.", focus: "etre", explanation: "Je suis means “I am”. Étudiant is the masculine form; étudiante is feminine." },
  { id: "age", level: "A1", english: "I am twenty years old.", french: "J'ai vingt ans.", focus: "avoir", explanation: "French uses avoir (to have) for age: J'ai + number + ans." },
  { id: "speak-french", level: "A1", english: "I speak French.", french: "Je parle français.", focus: "present-tense", explanation: "For regular -er verbs, the je form usually ends in -e: parler → je parle." },
  { id: "not-speak", level: "A1", english: "I do not speak French.", french: "Je ne parle pas français.", focus: "negation", explanation: "In standard written French, ne and pas go around the conjugated verb." },
  { id: "like-music", level: "A1", english: "I like music.", french: "J'aime la musique.", focus: "articles", explanation: "Use j'aime before a vowel sound. French often uses a definite article when speaking generally about things you like." },
  { id: "my-sister", level: "A1", english: "This is my sister.", french: "C'est ma sœur.", focus: "possessives", explanation: "C'est means “this is/that is”. Ma means “my” before a feminine singular noun." },
  { id: "two-brothers", level: "A1", english: "I have two brothers.", french: "J'ai deux frères.", focus: "avoir-numbers", explanation: "Use avoir to say what you have. Deux means two; frères means brothers." },
  { id: "go-school", level: "A1", english: "I am going to school.", french: "Je vais à l'école.", focus: "aller-places", explanation: "Je vais means “I go/I am going”. Use à l' before école, which starts with a vowel." },
  { id: "where-from", level: "A1", english: "I am from India.", french: "Je viens d'Inde.", focus: "origin", explanation: "Je viens de means “I come from”. De becomes d' before a vowel sound." },
  { id: "red-car", level: "A1", english: "She has a red car.", french: "Elle a une voiture rouge.", focus: "adjectives", explanation: "Elle a means “she has”. Many colour adjectives come after the noun: voiture rouge." },
  { id: "where-going", level: "A1", english: "Where are you going?", french: "Où allez-vous ?", focus: "questions-aller", explanation: "Où means “where”. Allez-vous is a polite/formal way to say “are you going?”." },
  { id: "two-sisters", level: "A1", english: "Do you have two sisters?", french: "Avez-vous deux sœurs ?", focus: "questions-avoir", explanation: "Avez-vous is a formal question form of avoir. Deux means two; sœurs means sisters." },
  { id: "today", level: "A1", english: "Where are we going today?", french: "Où allons-nous aujourd'hui ?", focus: "questions-aller", explanation: "Où = where, allons-nous = are we going, aujourd'hui = today." },
  { id: "friends", level: "A1", english: "Those are my friends.", french: "Ce sont mes amis.", focus: "demonstratives", explanation: "Ce sont means “these/those are”. Mes means “my” before a plural noun." },
  { id: "negative-friends", level: "A1", english: "Those are not my friends.", french: "Ce ne sont pas mes amis.", focus: "negation", explanation: "Make this negative by placing ne and pas around sont: ne sont pas." },
  { id: "father-architect", level: "A1", english: "My father is an architect.", french: "Mon père est architecte.", focus: "family-professions", explanation: "Mon père means “my father”. French often omits the indefinite article before a profession after être: est architecte." },
  { id: "grandmother-scientist", level: "A1", english: "Their grandmother is a scientist.", french: "Leur grand-mère est scientifique.", focus: "family-professions", explanation: "Leur means “their” before one person or thing. Scientifique can describe a scientist of any gender." },
  { id: "charlie-doctor", level: "A1", english: "Charlie is a doctor.", french: "Charlie est médecin.", focus: "professions", explanation: "French commonly omits un/une before a profession after être: est médecin." },
  { id: "peter-mechanic", level: "A1", english: "Peter is a mechanic.", french: "Peter est mécanicien.", focus: "professions", explanation: "Mécanicien is the masculine form for a mechanic. French often omits the article after être when naming a profession." },
  { id: "parents-professors", level: "A1", english: "My parents are professors.", french: "Mes parents sont professeurs.", focus: "family-professions", explanation: "Mes means “my” before a plural noun. Professeurs is plural." },
  { id: "students-singers", level: "A1", english: "Their students are singers.", french: "Leurs étudiants sont chanteurs.", focus: "possessives-professions", explanation: "Leurs is used before a plural noun. Chanteurs is the masculine plural form, also used for a mixed-gender group." },
  { id: "uncle-sportsman", level: "A1", english: "Your uncle is a sportsman.", french: "Ton oncle est sportif.", focus: "family-professions", explanation: "Ton means “your” when speaking informally to one person. Sportif describes someone who is athletic or sporty." },
  { id: "good-cooks", level: "A1", english: "We are good cooks.", french: "Nous sommes de bons cuisiniers.", focus: "professions-adjectives", explanation: "Bons agrees with the masculine plural cuisiniers. In French, the adjective bon comes before the noun." },
  { id: "love-teacher", level: "A1", english: "We love our teacher.", french: "Nous aimons notre professeur.", focus: "possessives-present-tense", explanation: "Notre means “our” before a singular noun. Aimer means “to love/like”; nous aimons is “we love/like”." },
  { id: "husband-lawyer", level: "A1", english: "Her husband is a lawyer.", french: "Son mari est avocat.", focus: "family-professions", explanation: "Son means “her” before a masculine noun here. French often omits the article before a profession after être: est avocat." }
];

export function normalizeSentenceText(value) {
  return String(value ?? "").trim().toLocaleLowerCase("en").replace(/[’‘]/g, "'").replace(/\s+/g, " ").replace(/[.!?]+$/g, "");
}

export function findVerifiedSentence(english) {
  const normalized = normalizeSentenceText(english);
  return VERIFIED_SENTENCES.find((item) => normalizeSentenceText(item.english) === normalized) ?? null;
}
