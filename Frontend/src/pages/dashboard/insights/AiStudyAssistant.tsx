import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Send,
  BookOpen,
  Calculator,
  FileText,
  Brain,
  Plus,
  MessageSquare,
} from "lucide-react";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  text: string;
}

interface ChatThread {
  id: string;
  title: string;
  messages: ChatMessage[];
}

const suggestedPrompts = [
  { icon: BookOpen, label: "Summarize my Data Structures notes on trees", color: "#1EC2BC" },
  { icon: Calculator, label: "Quiz me on vector spaces before Friday", color: "#E7714A" },
  { icon: FileText, label: "Help me outline my research proposal", color: "#9277ff" },
  { icon: Brain, label: "Explain process scheduling like I'm new to it", color: "#65e6f4" },
];

const initialThreads: ChatThread[] = [
  {
    id: "t1",
    title: "Binary tree traversal help",
    messages: [
      { id: "m1", role: "user", text: "Can you explain the difference between in-order and post-order traversal?" },
      {
        id: "m2",
        role: "assistant",
        text: "In-order traversal visits left subtree → node → right subtree, which gives you sorted output for a BST. Post-order visits left subtree → right subtree → node, which is useful when you need to process children before the parent — like deleting a tree or evaluating an expression tree bottom-up.",
      },
    ],
  },
  {
    id: "t2",
    title: "Research proposal structure",
    messages: [
      { id: "m3", role: "user", text: "What should go in the methodology section?" },
      {
        id: "m4",
        role: "assistant",
        text: "Your methodology should cover: how you'll gather evidence (sources, data, or experiments), why that approach fits your research question, and any limitations you're aware of. Keep it specific enough that someone else could roughly replicate your approach.",
      },
    ],
  },
];

function TypingDots() {
  return (
    <div className="flex items-center gap-1 px-1">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="w-1.5 h-1.5 rounded-full bg-slate-text"
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 1, repeat: Infinity, delay: i * 0.15 }}
        />
      ))}
    </div>
  );
}

function generateReply(prompt: string): string {
  const p = prompt.toLowerCase();
  if (p.includes("summar")) {
    return "Here's a quick summary based on your notes: key concepts are broken into definitions, worked examples, and common pitfalls. Want me to turn this into flashcards or a practice quiz?";
  }
  if (p.includes("quiz")) {
    return "Sure — here's a quick one: What's the difference between linear dependence and independence in a vector space? Take your time, I'll check your answer.";
  }
  if (p.includes("outline") || p.includes("proposal")) {
    return "A solid outline usually has: 1) Problem statement, 2) Literature review, 3) Methodology, 4) Expected outcomes, 5) Timeline. Want me to draft a paragraph for any of these sections?";
  }
  return "Good question — let's break it down step by step. Can you tell me a bit more about what you're working on, or paste in the specific problem you're stuck on?";
}

export default function AiStudyAssistant() {
  const [threads, setThreads] = useState<ChatThread[]>(initialThreads);
  const [activeThreadId, setActiveThreadId] = useState<string | null>(initialThreads[0]?.id ?? null);
  const [draft, setDraft] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const activeThread = threads.find((t) => t.id === activeThreadId) ?? null;

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [activeThread?.messages.length, isTyping]);

  const sendMessage = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;

    let threadId = activeThreadId;

    if (!threadId) {
      const newThread: ChatThread = { id: `t${Date.now()}`, title: trimmed.slice(0, 40), messages: [] };
      setThreads((prev) => [newThread, ...prev]);
      threadId = newThread.id;
      setActiveThreadId(threadId);
    }

    const userMsg: ChatMessage = { id: `m${Date.now()}`, role: "user", text: trimmed };
    setThreads((prev) => prev.map((t) => (t.id === threadId ? { ...t, messages: [...t.messages, userMsg] } : t)));
    setDraft("");
    setIsTyping(true);

    setTimeout(() => {
      const reply: ChatMessage = { id: `m${Date.now() + 1}`, role: "assistant", text: generateReply(trimmed) };
      setThreads((prev) => prev.map((t) => (t.id === threadId ? { ...t, messages: [...t.messages, reply] } : t)));
      setIsTyping(false);
    }, 1100);
  };

  const startNewThread = () => {
    setActiveThreadId(null);
    setDraft("");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="max-w-7xl mx-auto"
    >
      <div className="mb-6">
        <h1 className="font-display text-2xl font-semibold tracking-tight flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-teal" />
          AI Study Assistant
        </h1>
        <p className="text-sm text-slate-text mt-1">Ask questions, get quizzed, or work through problems together.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-4 h-[620px]">
        <div className="rounded-2xl border border-white/8 bg-white/[0.02] flex flex-col overflow-hidden">
          <div className="p-3 border-b border-white/8">
            <button
              onClick={startNewThread}
              className="w-full inline-flex items-center justify-center gap-1.5 bg-teal text-ink text-xs font-medium px-3 py-2 rounded-full hover:bg-teal-glow transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              New chat
            </button>
          </div>
          <div className="flex-1 overflow-y-auto py-2">
            {threads.map((t) => (
              <button
                key={t.id}
                onClick={() => setActiveThreadId(t.id)}
                className={`w-full text-left px-3 py-2.5 flex items-center gap-2 transition-colors ${
                  t.id === activeThreadId ? "bg-teal/[0.08] text-teal" : "text-slate-text hover:text-cream hover:bg-white/[0.03]"
                }`}
              >
                <MessageSquare className="w-3.5 h-3.5 shrink-0" />
                <span className="text-xs truncate">{t.title}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-white/8 bg-white/[0.02] flex flex-col overflow-hidden">
          <div ref={scrollRef} className="flex-1 overflow-y-auto px-5 py-5">
            {!activeThread || activeThread.messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center px-4">
                <span className="w-12 h-12 rounded-2xl bg-teal/10 flex items-center justify-center text-teal mb-4">
                  <Sparkles className="w-6 h-6" />
                </span>
                <h2 className="font-display text-lg font-semibold mb-1">How can I help you study?</h2>
                <p className="text-sm text-slate-text mb-6 max-w-sm">
                  Ask about a concept, request a quiz, or get help planning your next study session.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 w-full max-w-lg">
                  {suggestedPrompts.map((p) => {
                    const Icon = p.icon;
                    return (
                      <button
                        key={p.label}
                        onClick={() => sendMessage(p.label)}
                        className="flex items-start gap-2.5 text-left rounded-xl border border-white/8 hover:border-white/20 p-3 transition-colors"
                      >
                        <span
                          className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                          style={{ backgroundColor: `${p.color}1a`, color: p.color }}
                        >
                          <Icon className="w-3.5 h-3.5" />
                        </span>
                        <span className="text-xs text-slate-text leading-snug">{p.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {activeThread.messages.map((m) => (
                  <div key={m.id} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[80%] flex items-start gap-2.5 ${m.role === "user" ? "flex-row-reverse" : ""}`}>
                      {m.role === "assistant" && (
                        <span className="w-7 h-7 rounded-full bg-teal/10 text-teal flex items-center justify-center shrink-0 mt-0.5">
                          <Sparkles className="w-3.5 h-3.5" />
                        </span>
                      )}
                      <div
                        className={`rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                          m.role === "user"
                            ? "bg-teal text-ink rounded-br-sm"
                            : "bg-white/5 border border-white/8 text-cream rounded-bl-sm"
                        }`}
                      >
                        {m.text}
                      </div>
                    </div>
                  </div>
                ))}

                <AnimatePresence>
                  {isTyping && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex items-start gap-2.5"
                    >
                      <span className="w-7 h-7 rounded-full bg-teal/10 text-teal flex items-center justify-center shrink-0">
                        <Sparkles className="w-3.5 h-3.5" />
                      </span>
                      <div className="rounded-2xl rounded-bl-sm bg-white/5 border border-white/8 px-4 py-3">
                        <TypingDots />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>

          <div className="p-3 border-t border-white/8 flex items-center gap-2">
            <input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage(draft)}
              placeholder="Ask your study assistant anything..."
              className="flex-1 bg-white/5 border border-white/8 rounded-full px-4 py-2.5 text-sm text-cream placeholder:text-slate-text focus:outline-none focus:border-teal/30"
            />
            <button
              onClick={() => sendMessage(draft)}
              disabled={!draft.trim()}
              className="w-10 h-10 rounded-full bg-teal text-ink flex items-center justify-center shrink-0 hover:bg-teal-glow transition-colors disabled:opacity-40"
              aria-label="Send"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}