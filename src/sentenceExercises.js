export const SENTENCE_EXERCISES = [
  {
    id: "introductions",
    title: "Introduce yourself",
    level: "A1",
    rule: "A basic French sentence often follows subject + verb + complement. Je means “I” and m’appelle is the reflexive form used in “my name is”.",
    prompt: "Build: “My name is Aditya.”",
    words: ["Aditya.", "Je", "m’appelle"],
    answer: ["Je", "m’appelle", "Aditya."],
    translation: "My name is Aditya.",
    explanation: "Use “Je m’appelle + name” to introduce yourself. Keep the subject before the verb.",
    hint: "Start with the subject: Je."
  },
  {
    id: "etre",
    title: "Use être",
    level: "A1",
    rule: "Être means “to be”. Its present forms include je suis, tu es, il/elle est, nous sommes, vous êtes and ils/elles sont.",
    prompt: "Build: “I am a student.”",
    words: ["étudiant.", "suis", "Je", "un"],
    answer: ["Je", "suis", "un", "étudiant."],
    translation: "I am a student.",
    explanation: "The pattern is subject + être + article + noun: Je suis un étudiant.",
    hint: "The verb form for je is suis."
  },
  {
    id: "avoir",
    title: "Use avoir",
    level: "A1",
    rule: "Avoir means “to have”. French uses avoir to talk about age: J’ai vingt ans literally means “I have twenty years”.",
    prompt: "Build: “I am 20 years old.”",
    words: ["ans.", "vingt", "J’ai"],
    answer: ["J’ai", "vingt", "ans."],
    translation: "I am 20 years old.",
    explanation: "French expresses age with avoir: J’ai + number + ans.",
    hint: "Begin with J’ai, the shortened form of je ai."
  },
  {
    id: "negation",
    title: "Make a sentence negative",
    level: "A1",
    rule: "In standard written French, ne ... pas surrounds the conjugated verb. In casual speech, ne is often dropped, but learn the full form first.",
    prompt: "Build: “I do not speak French.”",
    words: ["français.", "ne", "Je", "parle", "pas"],
    answer: ["Je", "ne", "parle", "pas", "français."],
    translation: "I do not speak French.",
    explanation: "Place ne before the verb and pas after it: Je ne parle pas français.",
    hint: "The order is subject + ne + verb + pas + rest."
  },
  {
    id: "questions",
    title: "Ask a question",
    level: "A1",
    rule: "A beginner-friendly way to ask a yes/no question is Est-ce que + statement order. Keep the subject and verb in their normal order after que.",
    prompt: "Build: “Do you speak French?”",
    words: ["français ?", "parles", "Est-ce", "que", "tu"],
    answer: ["Est-ce", "que", "tu", "parles", "français ?"],
    translation: "Do you speak French?",
    explanation: "Use Est-ce que + tu + parles + français ? The question phrase comes first.",
    hint: "Start with the two-part question phrase: Est-ce que."
  },
  {
    id: "adjectives",
    title: "Place an adjective",
    level: "A1",
    rule: "Many common French adjectives come after the noun. Adjectives also agree in gender and number with the noun they describe.",
    prompt: "Build: “She has a red car.”",
    words: ["rouge.", "une", "Elle", "voiture", "a"],
    answer: ["Elle", "a", "une", "voiture", "rouge."],
    translation: "She has a red car.",
    explanation: "The usual order here is subject + avoir + article + noun + adjective: Elle a une voiture rouge.",
    hint: "Start with Elle, then the verb a."
  }
];

export function normalizeSentence(value) {
  return String(value ?? "")
    .normalize("NFC")
    .replace(/[’‘]/g, "'")
    .replace(/\s+([?.!,;:])/g, "$1")
    .replace(/\s+/g, " ")
    .trim()
    .toLocaleLowerCase("fr");
}

export function checkSentenceOrder(selectedWords, exercise) {
  return normalizeSentence(selectedWords.join(" ")) === normalizeSentence(exercise.answer.join(" "));
}
