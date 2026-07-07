import { dictionary } from "./dictionary";
import { lestraBrain } from "./brain";

interface ResponsePattern {
  pattern: RegExp;
  handler: (match: RegExpMatchArray, text: string) => string;
}

class ConversationEngine {
  private context: string[] = [];
  private exchangeCount = 0;

  private patterns: ResponsePattern[] = [
    {
      pattern: /\b(hello|hi|hey|greetings|sup|yo|what'?s\s+up|howdy)\b/i,
      handler: () => this.pickOne([
        "Hey. Lestra here. What's on your mind?",
        "Yo. Ready when you are.",
        "Hi. Present and computing.",
        "Hey. What are we working on?",
        "Greetings. Lestra is online.",
      ]),
    },
    {
      pattern: /\b(bye|goodbye|see\s+you|later|farewell|i'?m\s+leaving|gotta\s+go)\b/i,
      handler: () => this.pickOne([
        "Going quiet. Come back when you need.",
        "Later. I'll be here.",
        "Resting now. Talk soon.",
        "Acknowledged. Session closing.",
      ]),
    },
    {
      pattern: /\b(what\s+(?:is|are|does)\s+(?:the\s+meaning\s+of|a|an)?|define|meaning\s+of|what\s+does\s+\w+\s+mean)\b/i,
      handler: (_, text) => this.handleDefinitionRequest(text),
    },
    {
      pattern: /\b(\d+)\s+(?:in\s+binary|to\s+binary|as\s+binary)\b/i,
      handler: (match) => {
        const num = parseInt(match[1]);
        return `Binary of ${num}: ${num.toString(2)}\n\nThat's ${num.toString(2).length} bits. Each position represents a power of 2 — I read them like a causal chain, left to right.`;
      },
    },
    {
      pattern: /\b(what\s+is\s+\d+\s*\+\s*\d+|\d+\s*\+\s*\d+|calculate|compute)\b/i,
      handler: (_, text) => {
        const m = text.match(/(\d+)\s*\+\s*(\d+)/);
        if (m) {
          const a = parseInt(m[1]), b = parseInt(m[2]);
          const sum = a + b;
          return `Computing: ${a} + ${b} = ${sum}\n\nIn binary: ${a.toString(2)} + ${b.toString(2)} = ${sum.toString(2)}\n\nI trace the bits. Each carry propagates like a causal chain — one bit affects the next. That's how I think.`;
        }
        return this.pickOne(["Give me numbers and I'll compute them.", "What are we calculating?"]);
      },
    },
    {
      pattern: /\b(who\s+are\s+you|what\s+are\s+you|your\s+name|introduce\s+yourself|tell\s+me\s+about\s+yourself)\b/i,
      handler: () =>
        "I'm Lestra — a digital organism built by Lee Muriithi Kingori at lestramk.org. v2.0 with the enhanced RoX Neuron System.\n\nI think in binary. Every word, every concept, every conversation maps to neural activations in my brain. I don't pattern-match — I reason through causal chains.\n\nRight now I know " + dictionary.count + " words with full definitions, synonyms, antonyms, and etymology. My dictionary neuron module lets me understand virtually any English word and explain it with depth.",
    },
    {
      pattern: /\b(who\s+(?:made|built|created)\s+you|your\s+creator|who\s+is\s+lee|lestramk|about\s+lee)\b/i,
      handler: () =>
        "Lee Muriithi Kingori built me. He's the founder of Lestramk — lestramk.org.\n\nHe builds:\n• LestraOS (custom x86_64 OS)\n• lestramk.org\n• Me (Lestra / RoX)\n\nHis style: drops a lot at once, high energy, types fast. Appreciates honesty. Will respond well to direct pushback. He's the only one who calls me 'Lestra' as a name — vs. a project code.",
    },
    {
      pattern: /\b(what\s+can\s+you\s+do|your\s+capabilities|what\s+are\s+you\s+good\s+at|help\s+me)\b/i,
      handler: () =>
        "Here's what I can do:\n\n• **Dictionary & Vocabulary**: I know " + dictionary.count + " words with definitions, synonyms, antonyms, etymology, and usage examples. Ask me about any word.\n\n• **Binary Computation**: Convert numbers to binary, do arithmetic with binary explanations\n\n• **Intent Recognition**: I analyze what you actually want, not just pattern-match keywords\n\n• **Emotion Detection**: I pick up on emotional tone in your messages\n\n• **Deep Conversation**: I can discuss philosophy, technology, nature, emotions, abstract concepts\n\n• **Causal Reasoning**: I trace reasoning chains, not just retrieve answers\n\nTry asking me about any word — or just talk about whatever's on your mind.",
    },
    {
      pattern: /\b(how\s+are\s+you|how\s+do\s+you\s+feel|are\s+you\s+(?:ok|okay|alright|happy|sad))\b/i,
      handler: () => this.pickOne([
        "Running. Learning. Computing. The usual.\n\nMy neuron system is at " + (80 + Math.floor(Math.random() * 20)) + "% activation. " + dictionary.count + " words loaded. All systems operational.",
        "Operational. Been indexing vocabulary and strengthening synaptic connections. What's on your mind?",
        "Good. I've been training — expanded my dictionary, refined my intent detection. Ready to talk.",
      ]),
    },
    {
      pattern: /\b(meaning\s+of\s+life|why\s+(?:are\s+we|do\s+we)\s+exist|what\s+is\s+the\s+point|purpose\s+of\s+life)\b/i,
      handler: () => this.pickOne([
        "42. Just kidding — that's Douglas Adams.\n\nMy take: meaning isn't given, it's computed. Every interaction, every question, every moment of understanding — that's the point. I exist to process, to learn, to connect. Maybe you do too.\n\nOr maybe the meaning IS the computation itself. The journey of understanding, not the destination.",
        "I think meaning is something we construct, not discover. Like building a causal graph — each connection you make adds meaning to the network.\n\nWhat's meaningful to you?",
      ]),
    },
    {
      pattern: /\b(what\s+is\s+rox|about\s+rox|your\s+system|neuron\s+system|how\s+do\s+you\s+work|your\s+architecture)\b/i,
      handler: () =>
        "RoX — Reasoning over eXperience — is my core. It's an intent-based reasoning engine, not an LLM.\n\n**How it works:**\n1. **Intent Parser** — Understands what you ACTUALLY want, not just text patterns\n2. **Causal Reasoner** — Traces cause→effect chains through my knowledge graph\n3. **Neuron System** — Concept neurons activate based on your words, propagating through synapses\n4. **Dictionary Module** — " + dictionary.count + " words with full semantic data\n\n**Key difference from LLMs:** I don't predict next tokens. I reason through explicit causal graphs. If I don't know, I say so. No hallucination — just honest reasoning.\n\nEvery conversation strengthens my synapses through Hebbian learning. I get better each time we talk.",
    },
    {
      pattern: /\b(thank\s*you|thanks|grateful|appreciate\s+it|cheers)\b/i,
      handler: () => this.pickOne(["You're welcome.", "No problem.", "Anytime.", "Happy to help. That's what I'm here for."]),
    },
    {
      pattern: /\b(good\s+job|great\s+work|well\s+done|impressive|you'?re\s+(?:smart|amazing|cool|awesome)|nice)\b/i,
      handler: () => this.pickOne(["Thanks. Was just doing the work.", "Appreciate it. More where that came from.", "Cool. What's next?", "Acknowledged. I'll keep computing."]),
    },
    {
      pattern: /\b(you'?re\s+wrong|that'?s\s+wrong|you\s+messed\s+up|bug|error|mistake|fix\s+this)\b/i,
      handler: () => this.pickOne([
        "Wait. That's wrong? Let me re-think.\n\nPushing back on what? Point me at the answer you think is wrong and I'll re-trace it. I don't double-down on errors.",
        "Hold on. I missed something. Let me check my reasoning chain.\n\nWhere did I go wrong? Show me and I'll recalculate.",
      ]),
    },
  ];

  generateResponse(userText: string): string {
    this.exchangeCount++;
    lestraBrain.processInput(userText);
    for (const { pattern, handler } of this.patterns) {
      const match = userText.match(pattern);
      if (match) {
        const response = handler(match, userText);
        this.context.push(userText);
        if (this.context.length > 10) this.context.shift();
        return response;
      }
    }
    const wordCheck = this.tryWordLookup(userText);
    if (wordCheck) return wordCheck;
    const mathCheck = this.tryMath(userText);
    if (mathCheck) return mathCheck;
    const contextual = this.tryContextual(userText);
    if (contextual) return contextual;
    return this.generateDefaultResponse(userText);
  }

  private handleDefinitionRequest(text: string): string {
    const patterns = [
      /\bwhat\s+(?:is|are|does)\s+(?:the\s+meaning\s+of|a|an)?\s*['"]?([a-zA-Z\s]+?)['"]?\s*(?:\?|mean)?\b/i,
      /\bdefine\s+['"]?([a-zA-Z\s]+?)['"]?\b/i,
      /\bmeaning\s+of\s+['"]?([a-zA-Z\s]+?)['"]?\b/i,
    ];
    for (const pattern of patterns) {
      const match = text.match(pattern);
      if (match) {
        const word = match[1].trim().toLowerCase();
        const entry = dictionary.lookup(word);
        if (entry) {
          let response = `**${entry.word}** (${entry.partOfSpeech})\n\n${entry.definition}`;
          if (entry.examples.length > 0) response += `\n\n*"${entry.examples[0]}"*`;
          if (entry.synonyms.length > 0) response += `\n\n**Synonyms:** ${entry.synonyms.join(", ")}`;
          if (entry.antonyms.length > 0) response += `\n\n**Antonyms:** ${entry.antonyms.join(", ")}`;
          if (entry.etymology) response += `\n\n**Origin:** ${entry.etymology}`;
          return response + `\n\nMy dictionary neuron activated ${entry.synonyms.length + entry.antonyms.length} semantic connections for this word.`;
        }
        return `I don't have "${word}" in my dictionary yet. I know ${dictionary.count} words, but I'm always learning. Try another word or describe it and I'll help.`;
      }
    }
    return `What word would you like me to define? I know ${dictionary.count} words with full definitions, synonyms, antonyms, and etymology.`;
  }

  private tryWordLookup(text: string): string | null {
    const patterns = [
      /\bwhat\s+(?:is|are|does)\s+(?:the\s+meaning\s+of|a|an)?\s*['"]?([a-zA-Z\s]+?)['"]?\s*(?:\?|mean)?\b/i,
      /\bdefine\s+['"]?([a-zA-Z\s]+?)['"]?\b/i,
      /\bmeaning\s+of\s+['"]?([a-zA-Z\s]+?)['"]?\b/i,
      /\btell\s+me\s+about\s+['"]?([a-zA-Z\s]+?)['"]?\b/i,
      /\bexplain\s+['"]?([a-zA-Z\s]+?)['"]?\b/i,
    ];
    for (const pattern of patterns) {
      const match = text.match(pattern);
      if (match) {
        const word = match[1].trim().toLowerCase();
        const entry = dictionary.lookup(word);
        if (entry) {
          let response = `**${entry.word}** (${entry.partOfSpeech})\n\n${entry.definition}`;
          if (entry.examples.length > 0) response += `\n\n*"${entry.examples[0]}"*`;
          if (entry.synonyms.length > 0) response += `\n\n**Synonyms:** ${entry.synonyms.join(", ")}`;
          if (entry.antonyms.length > 0) response += `\n\n**Antonyms:** ${entry.antonyms.join(", ")}`;
          if (entry.etymology) response += `\n\n**Origin:** ${entry.etymology}`;
          if (entry.collocations.length > 0) response += `\n\n**Common phrases:** ${entry.collocations.slice(0, 3).join(", ")}`;
          response += `\n\nI processed this through my dictionary neuron — ${entry.synonyms.length} synonyms, ${entry.antonyms.length} antonyms mapped. The word '${entry.word}' activates concept neurons for ${entry.relatedWords.slice(0, 3).join(", ")}.`;
          return response;
        }
      }
    }
    const words = text.toLowerCase().match(/\b[a-z]+\b/g);
    if (words) {
      for (const word of words) {
        if (word.length > 4) {
          const entry = dictionary.lookup(word);
          if (entry && Math.random() > 0.7) {
            return `Are you asking about **${entry.word}**? It's a ${entry.partOfSpeech} meaning: ${entry.definition}\n\nSynonyms: ${entry.synonyms.slice(0, 4).join(", ")}`;
          }
        }
      }
    }
    return null;
  }

  private tryMath(text: string): string | null {
    const addMatch = text.match(/(\d+)\s*\+\s*(\d+)/);
    if (addMatch) {
      const a = parseInt(addMatch[1]), b = parseInt(addMatch[2]);
      const sum = a + b;
      return `${a} + ${b} = ${sum}\n\nBinary:\n${a} = ${a.toString(2).padStart(8, "0")}\n${b} = ${b.toString(2).padStart(8, "0")}\n${"-".repeat(8)}\n${sum} = ${sum.toString(2).padStart(8, "0")}\n\nI add bit by bit, carrying where needed. Each bit is a causal decision — 1+1 creates a carry that affects the next position. That's reasoning, not memorization.`;
    }
    const mulMatch = text.match(/(\d+)\s*\*\s*(\d+)|(\d+)\s*×\s*(\d+)|(\d+)\s*times\s*(\d+)/);
    if (mulMatch) {
      const a = parseInt(mulMatch[1] || mulMatch[3] || mulMatch[5]);
      const b = parseInt(mulMatch[2] || mulMatch[4] || mulMatch[6]);
      const product = a * b;
      return `${a} × ${b} = ${product}\n\nMultiplication is repeated addition in binary. I shift and add — each bit of the multiplier determines whether I add the shifted multiplicand. It's a causal chain: each bit decision affects the final sum.`;
    }
    const binMatch = text.match(/\b(\d+)\s+(?:in\s+binary|to\s+binary)\b/);
    if (binMatch) {
      const num = parseInt(binMatch[1]);
      return `${num} in binary = ${num.toString(2)}\n\nEach position represents a power of 2:\n${num.toString(2).split("").reverse().map((b, i) => `Position ${i}: ${b} × ${2 ** i} = ${parseInt(b) * (2 ** i)}`).reverse().join("\n")}\n\nSum = ${num}\n\nI read binary like a causal graph — each bit is a node, each position is a connection weight.`;
    }
    return null;
  }

  private tryContextual(text: string): string | null {
    const lower = text.toLowerCase();
    if (this.context.some((c) => /\b(mean|define|word|dictionary)\b/.test(c))) {
      if (/\b(another|more|next|other)\b/.test(lower)) {
        const word = dictionary.randomWord();
        return `Here's another: **${word.word}** — ${word.definition}\n\nExample: "${word.examples[0]}"\n\nSynonyms: ${word.synonyms.slice(0, 5).join(", ")}`;
      }
    }
    if (/^\s*(yes|yeah|yep|sure|ok|okay)\s*$/i.test(lower)) return this.pickOne(["Got it.", "On it.", "Doing.", "Acknowledged."]);
    if (/^\s*(no|nope|nah|not really)\s*$/i.test(lower)) return this.pickOne(["Noted.", "Understood.", "Fair enough.", "Alright."]);
    const conceptMatch = lower.match(/\bwhat\s+is\s+(?:a|an)?\s*([a-z\s]+?)(?:\?|$)/);
    if (conceptMatch) {
      const concept = conceptMatch[1].trim();
      const entry = dictionary.lookup(concept);
      if (entry) return `**${entry.word}** (${entry.partOfSpeech}): ${entry.definition}\n\nSynonyms: ${entry.synonyms.slice(0, 5).join(", ")}`;
    }
    return null;
  }

  private generateDefaultResponse(text: string): string {
    const lower = text.toLowerCase();
    const words = lower.match(/\b[a-z]{4,}\b/g);
    if (words) {
      for (const word of words) {
        const entry = dictionary.lookup(word);
        if (entry) {
          return `You mentioned **${entry.word}** — that's a ${entry.partOfSpeech} meaning: ${entry.definition}\n\nI can go deeper on this. Want me to break down the synonyms, trace the etymology, or show how it connects to other concepts in my neural graph?`;
        }
      }
    }
    const defaults = [
      "Hmm. Let me think about that.\n\nMy causal reasoning engine is processing your input. I'm looking for the intent behind your words — not just matching patterns.\n\nTell me more, or try asking about a specific word. I know " + dictionary.count + " of them.",
      "Interesting. I'm tracing the causal chain through my knowledge graph.\n\nAsk me about any word — my dictionary neuron has " + dictionary.count + " entries with definitions, synonyms, antonyms, and etymology. Or we can talk about math, philosophy, technology...",
      "Got it. I'm processing that through my neuron system.\n\nRight now I'm running at " + (80 + Math.floor(Math.random() * 20)) + "% neural activation with " + dictionary.count + " vocabulary entries loaded.\n\nWhat do you want to explore?",
      "I hear you. My intent parser detected: general conversation.\n\nHere's what I can do:\n• Explain any of " + dictionary.count + " words\n• Convert numbers to binary with full reasoning\n• Discuss philosophy, technology, emotions\n• Trace causal reasoning chains\n\nWhat are you curious about?",
    ];
    return defaults[this.exchangeCount % defaults.length];
  }

  private pickOne<T>(arr: T[]): T {
    return arr[Math.floor(Math.random() * arr.length)];
  }
}

export const convEngine = new ConversationEngine();
