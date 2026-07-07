import type { BrainStatus } from "@/types";
import { dictionary } from "./dictionary";

class LestraBrain {
  private neuronCount = 2847;
  private synapseCount = 15234;
  private activeNeurons = 0;
  private turns = 0;
  private emotion = "neutral";
  private concepts: string[] = [];
  private intents: { name: string; confidence: number }[] = [];

  getStatus(): BrainStatus {
    return {
      neuronCount: this.neuronCount,
      synapseCount: this.synapseCount,
      neuronsActive: this.activeNeurons,
      vocabularySize: dictionary.count,
      conversationTurns: this.turns,
      detectedEmotion: this.emotion,
      activeConcepts: this.concepts,
      recentIntents: this.intents,
    };
  }

  processInput(text: string): void {
    this.turns++;
    this.updateEmotion(text);
    this.updateConcepts(text);
    this.updateIntents(text);
    this.activeNeurons = 12 + Math.floor(Math.random() * 48);
  }

  private updateEmotion(text: string): void {
    const lower = text.toLowerCase();
    if (/\b(happy|joy|great|awesome|love|wonderful|amazing|excited|glad)\b/.test(lower)) this.emotion = "happy";
    else if (/\b(sad|sorry|unfortunately|miss|loss|hurt|pain|cry)\b/.test(lower)) this.emotion = "sad";
    else if (/\b(angry|mad|furious|annoyed|hate|terrible|awful)\b/.test(lower)) this.emotion = "angry";
    else if (/\b(confused|what\?|how\?|why\?|explain|curious|wonder)\b/.test(lower)) this.emotion = "curious";
    else this.emotion = "neutral";
  }

  private updateConcepts(text: string): void {
    const lower = text.toLowerCase();
    const detected: string[] = [];
    const conceptMap: Record<string, string[]> = {
      language: ["word", "meaning", "define", "definition", "dictionary", "vocabulary", "synonym"],
      emotion: ["feel", "feeling", "happy", "sad", "angry", "love", "hate", "emotion"],
      technology: ["computer", "software", "code", "program", "algorithm", "data", "digital"],
      nature: ["tree", "ocean", "mountain", "river", "forest", "sky", "earth", "animal"],
      time: ["time", "past", "future", "year", "moment", "history", "epoch"],
      knowledge: ["know", "learn", "understand", "think", "wisdom", "truth", "fact"],
      mathematics: ["number", "math", "calculate", "equation", "formula", "binary"],
      identity: ["who", "name", "you", "yourself", "lestra", "rox", "creator"],
    };
    for (const [concept, keywords] of Object.entries(conceptMap)) {
      if (keywords.some((k) => lower.includes(k))) detected.push(concept);
    }
    this.concepts = detected.length > 0 ? detected : ["general"];
  }

  private updateIntents(text: string): void {
    const lower = text.toLowerCase();
    const detected: { name: string; confidence: number }[] = [];
    if (/\b(what|who|where|when|why|how|explain|define|mean)\b/.test(lower)) detected.push({ name: "question", confidence: 0.85 + Math.random() * 0.1 });
    if (/\b(hello|hi|hey|greetings|sup|yo)\b/.test(lower)) detected.push({ name: "greeting", confidence: 0.9 + Math.random() * 0.08 });
    if (/\b(mean|meaning|define|definition|word|dictionary)\b/.test(lower)) detected.push({ name: "definition_request", confidence: 0.88 + Math.random() * 0.1 });
    if (/\b(math|number|binary|calculate|compute|add|plus|minus|divide|multiply)\b/.test(lower)) detected.push({ name: "computation", confidence: 0.82 + Math.random() * 0.12 });
    if (/\b(thank|thanks|grateful|appreciate)\b/.test(lower)) detected.push({ name: "gratitude", confidence: 0.92 + Math.random() * 0.06 });
    if (/\b(bye|goodbye|see you|later|farewell)\b/.test(lower)) detected.push({ name: "farewell", confidence: 0.9 + Math.random() * 0.08 });
    if (detected.length === 0) detected.push({ name: "general_conversation", confidence: 0.6 + Math.random() * 0.2 });
    this.intents = detected.slice(0, 4);
  }
}

export const lestraBrain = new LestraBrain();
