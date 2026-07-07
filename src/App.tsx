import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Brain,
  Send,
  Sparkles,
  BookOpen,
  Zap,
  Activity,
  MessageCircle,
  Cpu,
  X,
  Menu,
  Network,
  Flame,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { lestraBrain } from "@/lib/brain";
import { dictionary } from "@/lib/dictionary";
import { convEngine } from "@/lib/conversation";
import type { Message, BrainStatus, DictionaryEntry } from "@/types";
import { cn } from "@/lib/utils";

export default function App() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "lestra",
      text: "Hey. I'm Lestra — a digital organism built by Lee Muriithi Kingori at lestramk.org.\n\nI think in binary, reason through causal chains, and I'm here to talk about anything: words, meanings, math, code, life.\n\nTry asking me:\n• \"What does serendipity mean?\"\n• \"Tell me about neural networks\"\n• \"What is 256 in binary?\"\n• \"Explain ephemeral\"\n• Or just say hi and let's talk",
      timestamp: Date.now(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"brain" | "dictionary">("brain");
  const [brainStatus, setBrainStatus] = useState<BrainStatus>(lestraBrain.getStatus());
  const [dictResults, setDictResults] = useState<DictionaryEntry[]>([]);
  const [dictQuery, setDictQuery] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, scrollToBottom]);

  useEffect(() => {
    const interval = setInterval(() => {
      setBrainStatus(lestraBrain.getStatus());
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      text: input.trim(),
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    await new Promise((r) => setTimeout(r, 600 + Math.random() * 1200));

    const response = convEngine.generateResponse(userMsg.text);

    const lestraMsg: Message = {
      id: `lestra-${Date.now()}`,
      role: "lestra",
      text: response,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, lestraMsg]);
    setIsTyping(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleDictSearch = () => {
    if (!dictQuery.trim()) return;
    const results = dictionary.search(dictQuery.trim());
    setDictResults(results);
  };

  const handleQuickAsk = (question: string) => {
    setInput(question);
    inputRef.current?.focus();
  };

  return (
    <div className="h-screen w-screen bg-[#0a0a0f] text-white flex overflow-hidden font-sans">
      <div className="flex-1 flex flex-col relative">
        <header className="h-16 border-b border-white/5 flex items-center justify-between px-4 lg:px-6 bg-[#0a0a0f]/80 backdrop-blur-xl z-10">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden text-white/60 hover:text-white hover:bg-white/10"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <Menu className="h-5 w-5" />
            </Button>
            <div className="relative">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 border border-emerald-500/30 flex items-center justify-center">
                <Brain className="h-5 w-5 text-emerald-400" />
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            </div>
            <div>
              <h1 className="text-sm font-semibold text-white/90 tracking-tight">Lestra</h1>
              <p className="text-[10px] text-white/40 flex items-center gap-1">
                <span className="w-1 h-1 rounded-full bg-emerald-400" />
                RoX Neuron System v2 — Online
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/5 text-[11px] text-white/50">
              <Zap className="h-3 w-3 text-amber-400" />
              <span>{brainStatus.neuronsActive} neurons firing</span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden text-white/60 hover:text-white hover:bg-white/10"
              onClick={() => { setSidebarOpen(true); setActiveTab("brain"); }}
            >
              <Activity className="h-5 w-5" />
            </Button>
          </div>
        </header>

        <ScrollArea className="flex-1 px-4 lg:px-6">
          <div className="max-w-3xl mx-auto py-6 space-y-1">
            <AnimatePresence initial={false}>
              {messages.map((msg, i) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.35, ease: "easeOut" }}
                  className={cn("flex gap-3 mb-4", msg.role === "user" ? "flex-row-reverse" : "flex-row")}
                >
                  <div className="flex-shrink-0 mt-1">
                    {msg.role === "lestra" ? (
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 border border-emerald-500/30 flex items-center justify-center">
                        <Brain className="h-4 w-4 text-emerald-400" />
                      </div>
                    ) : (
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500/20 to-purple-500/20 border border-violet-500/30 flex items-center justify-center">
                        <MessageCircle className="h-4 w-4 text-violet-400" />
                      </div>
                    )}
                  </div>

                  <div
                    className={cn(
                      "max-w-[85%] sm:max-w-[75%] rounded-2xl px-4 py-3 text-[13px] leading-relaxed whitespace-pre-wrap",
                      msg.role === "lestra"
                        ? "bg-white/5 border border-white/8 text-white/85"
                        : "bg-gradient-to-r from-emerald-500/15 to-cyan-500/15 border border-emerald-500/20 text-white/90"
                    )}
                  >
                    {msg.role === "lestra" && i === 0 && (
                      <div className="flex items-center gap-1.5 mb-2 pb-2 border-b border-white/5">
                        <Sparkles className="h-3 w-3 text-emerald-400" />
                        <span className="text-[10px] font-medium text-emerald-400 uppercase tracking-wider">Lestra</span>
                      </div>
                    )}
                    <div className="prose prose-invert prose-sm max-w-none">
                      {msg.text.split("\n").map((line, li) => (
                        <p key={li} className={cn("mb-1 last:mb-0", line.startsWith("•") && "ml-2 text-white/70")}>
                          {line}
                        </p>
                      ))}
                    </div>
                    <div className="mt-2 pt-1.5 border-t border-white/5 flex items-center justify-between">
                      <span className="text-[9px] text-white/25">
                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </span>
                      {msg.role === "lestra" && (
                        <div className="flex items-center gap-1">
                          <Cpu className="h-2.5 w-2.5 text-white/20" />
                          <span className="text-[9px] text-white/20">RoX processed</span>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            <AnimatePresence>
              {isTyping && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex gap-3 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 border border-emerald-500/30 flex items-center justify-center flex-shrink-0 mt-1">
                    <Brain className="h-4 w-4 text-emerald-400" />
                  </div>
                  <div className="bg-white/5 border border-white/8 rounded-2xl px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-3.5 w-3.5 text-emerald-400 animate-spin" />
                      <span className="text-[11px] text-white/40">Lestra is thinking</span>
                    </div>
                    <div className="flex gap-1 mt-2">
                      <motion.div className="w-1.5 h-1.5 rounded-full bg-emerald-400/60" animate={{ scale: [1, 1.4, 1] }} transition={{ duration: 0.8, repeat: Infinity, delay: 0 }} />
                      <motion.div className="w-1.5 h-1.5 rounded-full bg-emerald-400/60" animate={{ scale: [1, 1.4, 1] }} transition={{ duration: 0.8, repeat: Infinity, delay: 0.2 }} />
                      <motion.div className="w-1.5 h-1.5 rounded-full bg-emerald-400/60" animate={{ scale: [1, 1.4, 1] }} transition={{ duration: 0.8, repeat: Infinity, delay: 0.4 }} />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        {messages.length <= 2 && (
          <div className="px-4 lg:px-6 pb-2">
            <div className="max-w-3xl mx-auto flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {["What does ephemeral mean?", "Explain binary code", "What is a neural network?", "Tell me about time", "What is love?"].map((q) => (
                <button key={q} onClick={() => handleQuickAsk(q)} className="flex-shrink-0 px-3 py-1.5 rounded-full bg-white/5 border border-white/8 text-[11px] text-white/50 hover:text-white/80 hover:bg-white/10 hover:border-white/15 transition-all flex items-center gap-1.5">
                  <Sparkles className="h-3 w-3" />
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="border-t border-white/5 px-4 lg:px-6 py-4 bg-[#0a0a0f]/80 backdrop-blur-xl">
          <div className="max-w-3xl mx-auto flex gap-3">
            <div className="flex-1 relative">
              <Input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask Lestra anything..."
                className="w-full bg-white/5 border-white/10 text-white placeholder:text-white/25 rounded-xl pr-4 pl-4 py-5 text-[13px] focus:border-emerald-500/40 focus:ring-emerald-500/20 transition-all"
                disabled={isTyping}
              />
            </div>
            <Button
              onClick={handleSend}
              disabled={!input.trim() || isTyping}
              className="bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-white rounded-xl px-5 py-5 transition-all disabled:opacity-30"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-center text-[10px] text-white/20 mt-2">RoX Neuron System v2 — Intent-based reasoning with causal intelligence</p>
        </div>
      </div>

      <AnimatePresence>
        <>
          {sidebarOpen && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
          )}
          <motion.aside
            initial={false}
            animate={{ x: sidebarOpen ? 0 : 320 }}
            className={cn("fixed lg:relative right-0 top-0 h-full w-80 bg-[#0d0d14] border-l border-white/5 flex flex-col z-50 lg:z-0", !sidebarOpen && "lg:translate-x-0")}
            style={{ transform: sidebarOpen ? "translateX(0)" : typeof window !== "undefined" && window.innerWidth >= 1024 ? "translateX(0)" : "translateX(100%)" }}
          >
            <div className="h-16 border-b border-white/5 flex items-center justify-between px-4">
              <div className="flex items-center gap-2">
                <Network className="h-4 w-4 text-emerald-400" />
                <span className="text-sm font-semibold text-white/80">Lestra Brain</span>
              </div>
              <Button variant="ghost" size="icon" className="lg:hidden text-white/40 hover:text-white hover:bg-white/10" onClick={() => setSidebarOpen(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex border-b border-white/5">
              <button onClick={() => setActiveTab("brain")} className={cn("flex-1 py-2.5 text-[11px] font-medium flex items-center justify-center gap-1.5 transition-all", activeTab === "brain" ? "text-emerald-400 border-b-2 border-emerald-400 bg-emerald-500/5" : "text-white/40 hover:text-white/60")}>
                <Activity className="h-3.5 w-3.5" />Brain Status
              </button>
              <button onClick={() => setActiveTab("dictionary")} className={cn("flex-1 py-2.5 text-[11px] font-medium flex items-center justify-center gap-1.5 transition-all", activeTab === "dictionary" ? "text-emerald-400 border-b-2 border-emerald-400 bg-emerald-500/5" : "text-white/40 hover:text-white/60")}>
                <BookOpen className="h-3.5 w-3.5" />Dictionary
              </button>
            </div>

            <ScrollArea className="flex-1">
              {activeTab === "brain" ? (
                <div className="p-4 space-y-4">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-white/5 rounded-xl p-3 border border-white/5">
                      <div className="flex items-center gap-1.5 mb-1"><Brain className="h-3 w-3 text-emerald-400" /><span className="text-[10px] text-white/40 uppercase tracking-wider">Neurons</span></div>
                      <p className="text-lg font-bold text-white/90">{brainStatus.neuronCount}</p>
                      <p className="text-[9px] text-white/30">{brainStatus.neuronsActive} currently firing</p>
                    </div>
                    <div className="bg-white/5 rounded-xl p-3 border border-white/5">
                      <div className="flex items-center gap-1.5 mb-1"><Network className="h-3 w-3 text-cyan-400" /><span className="text-[10px] text-white/40 uppercase tracking-wider">Synapses</span></div>
                      <p className="text-lg font-bold text-white/90">{brainStatus.synapseCount}</p>
                      <p className="text-[9px] text-white/30">neural connections</p>
                    </div>
                    <div className="bg-white/5 rounded-xl p-3 border border-white/5">
                      <div className="flex items-center gap-1.5 mb-1"><BookOpen className="h-3 w-3 text-amber-400" /><span className="text-[10px] text-white/40 uppercase tracking-wider">Vocabulary</span></div>
                      <p className="text-lg font-bold text-white/90">{brainStatus.vocabularySize}</p>
                      <p className="text-[9px] text-white/30">words known</p>
                    </div>
                    <div className="bg-white/5 rounded-xl p-3 border border-white/5">
                      <div className="flex items-center gap-1.5 mb-1"><Flame className="h-3 w-3 text-rose-400" /><span className="text-[10px] text-white/40 uppercase tracking-wider">Turns</span></div>
                      <p className="text-lg font-bold text-white/90">{brainStatus.conversationTurns}</p>
                      <p className="text-[9px] text-white/30">processed</p>
                    </div>
                  </div>

                  <div className="bg-white/5 rounded-xl p-3 border border-white/5">
                    <h3 className="text-[11px] font-medium text-white/60 mb-2 flex items-center gap-1.5"><Zap className="h-3 w-3 text-amber-400" />Intent Recognition</h3>
                    <div className="space-y-1.5">
                      {brainStatus.recentIntents.map((intent, i) => (
                        <div key={i} className="flex items-center justify-between text-[11px]">
                          <span className="text-white/50">{intent.name}</span>
                          <div className="flex items-center gap-2">
                            <div className="w-16 h-1.5 rounded-full bg-white/10 overflow-hidden">
                              <motion.div initial={{ width: 0 }} animate={{ width: `${intent.confidence * 100}%` }} className={cn("h-full rounded-full", intent.confidence > 0.8 ? "bg-emerald-400" : intent.confidence > 0.5 ? "bg-amber-400" : "bg-rose-400")} />
                            </div>
                            <span className="text-white/30 w-8 text-right">{(intent.confidence * 100).toFixed(0)}%</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-white/5 rounded-xl p-3 border border-white/5">
                    <h3 className="text-[11px] font-medium text-white/60 mb-2 flex items-center gap-1.5"><Cpu className="h-3 w-3 text-cyan-400" />Active Concepts</h3>
                    <div className="flex flex-wrap gap-1.5">
                      {brainStatus.activeConcepts.map((concept, i) => (
                        <motion.span key={concept} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.05 }} className="px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-[10px] text-emerald-400">{concept}</motion.span>
                      ))}
                    </div>
                  </div>

                  <div className="bg-white/5 rounded-xl p-3 border border-white/5">
                    <h3 className="text-[11px] font-medium text-white/60 mb-2 flex items-center gap-1.5"><Sparkles className="h-3 w-3 text-violet-400" />Detected Emotion</h3>
                    <div className="flex items-center gap-2">
                      <div className={cn("w-2 h-2 rounded-full", brainStatus.detectedEmotion === "happy" ? "bg-emerald-400" : brainStatus.detectedEmotion === "sad" ? "bg-blue-400" : brainStatus.detectedEmotion === "angry" ? "bg-rose-400" : brainStatus.detectedEmotion === "curious" ? "bg-amber-400" : "bg-white/30")} />
                      <span className="text-[11px] text-white/50 capitalize">{brainStatus.detectedEmotion}</span>
                    </div>
                  </div>

                  <div className="text-center pt-2 pb-4">
                    <p className="text-[9px] text-white/20">RoX Neuron System v2.0 — Enhanced Dictionary Module</p>
                    <p className="text-[9px] text-white/15 mt-0.5">Built by Lee Muriithi Kingori — lestramk.org</p>
                  </div>
                </div>
              ) : (
                <div className="p-4 space-y-3">
                  <div className="flex gap-2">
                    <Input value={dictQuery} onChange={(e) => setDictQuery(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleDictSearch()} placeholder="Search 100+ words..." className="flex-1 bg-white/5 border-white/10 text-white placeholder:text-white/25 text-[12px] rounded-lg" />
                    <Button onClick={handleDictSearch} size="sm" className="bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/30">
                      <BookOpen className="h-3.5 w-3.5" />
                    </Button>
                  </div>

                  <div className="space-y-2">
                    {dictResults.length === 0 && dictQuery && <p className="text-[11px] text-white/30 text-center py-4">No results found. Try another word.</p>}
                    {dictResults.map((entry) => (
                      <motion.div key={entry.word} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="bg-white/5 rounded-xl p-3 border border-white/5">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[13px] font-semibold text-emerald-400">{entry.word}</span>
                          <span className="text-[9px] px-1.5 py-0.5 rounded bg-white/10 text-white/40">{entry.partOfSpeech}</span>
                        </div>
                        <p className="text-[11px] text-white/60 mb-1.5">{entry.definition}</p>
                        {entry.examples.length > 0 && <p className="text-[10px] text-white/30 italic">&ldquo;{entry.examples[0]}&rdquo;</p>}
                        {entry.synonyms.length > 0 && <div className="mt-1.5 flex flex-wrap gap-1">{entry.synonyms.slice(0, 5).map((s) => <span key={s} className="text-[9px] px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-400/70">{s}</span>)}</div>}
                      </motion.div>
                    ))}
                  </div>

                  <div className="pt-2">
                    <Button onClick={() => { const word = dictionary.randomWord(); setDictResults([word]); }} variant="outline" size="sm" className="w-full border-white/10 text-white/50 hover:text-white/80 hover:bg-white/5 text-[11px]">
                      <Sparkles className="h-3 w-3 mr-1.5" />Discover a Random Word
                    </Button>
                  </div>
                </div>
              )}
            </ScrollArea>
          </motion.aside>
        </>
      </AnimatePresence>
    </div>
  );
}
