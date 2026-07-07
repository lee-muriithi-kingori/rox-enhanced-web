export interface Message {
  id: string;
  role: "user" | "lestra";
  text: string;
  timestamp: number;
}

export interface BrainStatus {
  neuronCount: number;
  synapseCount: number;
  neuronsActive: number;
  vocabularySize: number;
  conversationTurns: number;
  detectedEmotion: string;
  activeConcepts: string[];
  recentIntents: { name: string; confidence: number }[];
}

export interface DictionaryEntry {
  word: string;
  partOfSpeech: string;
  definition: string;
  examples: string[];
  synonyms: string[];
  antonyms: string[];
  etymology: string;
  relatedWords: string[];
  collocations: string[];
}
