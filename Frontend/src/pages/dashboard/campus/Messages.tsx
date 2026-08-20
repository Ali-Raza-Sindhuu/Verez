import { useState, useMemo, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, Send, MessageSquare, Users } from "lucide-react";

interface ChatMessage {
  id: string;
  from: "me" | "them";
  senderInitials?: string;
  text: string;
  time: string;
}

interface Conversation {
  id: string;
  name: string;
  isGroup: boolean;
  avatarColor: string;
  lastMessage: string;
  lastTime: string;
  unread: number;
  messages: ChatMessage[];
}

const initialConversations: Conversation[] = [
  {
    id: "conv1",
    name: "DS Study Circle",
    isGroup: true,
    avatarColor: "#1EC2BC",
    lastMessage: "Sana: can someone share the AVL tree slides?",
    lastTime: "10m ago",
    unread: 3,
    messages: [
      { id: "m1", from: "them", senderInitials: "SM", text: "Hey, are we still on for Saturday?", time: "9:12 AM" },
      { id: "m2", from: "me", text: "Yep! Library room 2, 3pm", time: "9:14 AM" },
      { id: "m3", from: "them", senderInitials: "RB", text: "I'll bring the practice problems from last week", time: "9:20 AM" },
      { id: "m4", from: "them", senderInitials: "SM", text: "can someone share the AVL tree slides?", time: "10:02 AM" },
    ],
  },
  {
    id: "conv2",
    name: "Priya Nair",
    isGroup: false,
    avatarColor: "#E7714A",
    lastMessage: "Thanks for the notes!",
    lastTime: "1h ago",
    unread: 0,
    messages: [
      { id: "m5", from: "them", text: "Did you finish the linear algebra homework?", time: "Yesterday" },
      { id: "m6", from: "me", text: "Almost, stuck on problem 6", time: "Yesterday" },
      { id: "m7", from: "them", text: "I can send you my notes on that one", time: "Yesterday" },
      { id: "m8", from: "me", text: "That'd be great, thank you!", time: "Yesterday" },
      { id: "m9", from: "them", text: "Thanks for the notes!", time: "1h ago" },
    ],
  },
  {
    id: "conv3",
    name: "Research Proposal Team",
    isGroup: true,
    avatarColor: "#9277ff",
    lastMessage: "You: pushed the updated draft to the shared doc",
    lastTime: "3h ago",
    unread: 0,
    messages: [
      { id: "m10", from: "them", senderInitials: "RB", text: "How's the intro section coming along?", time: "2:00 PM" },
      { id: "m11", from: "me", text: "Almost done, will have it by tonight", time: "2:15 PM" },
      { id: "m12", from: "me", text: "pushed the updated draft to the shared doc", time: "3:40 PM" },
    ],
  },
  {
    id: "conv4",
    name: "Dr. Farah Zaidi",
    isGroup: false,
    avatarColor: "#65e6f4",
    lastMessage: "See you at office hours tomorrow",
    lastTime: "1d ago",
    unread: 0,
    messages: [
      { id: "m13", from: "me", text: "Is it okay if I come to office hours to discuss the project topic?", time: "Yesterday" },
      { id: "m14", from: "them", text: "Of course, see you at office hours tomorrow", time: "Yesterday" },
    ],
  },
];

export default function Messages() {
  const [conversations, setConversations] = useState<Conversation[]>(initialConversations);
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(initialConversations[0]?.id ?? null);
  const [draft, setDraft] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  const filtered = useMemo(
    () => conversations.filter((c) => c.name.toLowerCase().includes(query.toLowerCase())),
    [conversations, query]
  );

  const selected = conversations.find((c) => c.id === selectedId) ?? null;

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [selectedId, selected?.messages.length]);

  const selectConversation = (id: string) => {
    setSelectedId(id);
    setConversations((prev) => prev.map((c) => (c.id === id ? { ...c, unread: 0 } : c)));
  };

  const sendMessage = () => {
    const text = draft.trim();
    if (!text || !selectedId) return;
    setConversations((prev) =>
      prev.map((c) =>
        c.id === selectedId
          ? {
              ...c,
              lastMessage: `You: ${text}`,
              lastTime: "Just now",
              messages: [...c.messages, { id: `m${Date.now()}`, from: "me", text, time: "Just now" }],
            }
          : c
      )
    );
    setDraft("");
  };

  const totalUnread = conversations.reduce((sum, c) => sum + c.unread, 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="max-w-7xl mx-auto"
    >
      <div className="mb-6">
        <h1 className="font-display text-2xl font-semibold tracking-tight">Messages</h1>
        <p className="text-sm text-slate-text mt-1">
          {totalUnread > 0 ? `${totalUnread} unread` : "All caught up"}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-4 h-[600px]">
        <div className="rounded-2xl border border-white/8 bg-white/[0.02] flex flex-col overflow-hidden">
          <div className="p-3 border-b border-white/8">
            <div className="flex items-center gap-2 bg-white/5 border border-white/8 rounded-full px-3 py-2">
              <Search className="w-3.5 h-3.5 text-slate-text shrink-0" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search messages"
                className="bg-transparent text-xs placeholder:text-slate-text focus:outline-none w-full"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {filtered.length === 0 && (
              <div className="py-12 text-center text-xs text-slate-text px-4">No conversations found.</div>
            )}
            {filtered.map((c) => (
              <button
                key={c.id}
                onClick={() => selectConversation(c.id)}
                className={`w-full text-left px-4 py-3 border-b border-white/5 transition-colors flex items-start gap-3 ${
                  c.id === selectedId ? "bg-teal/[0.06]" : "hover:bg-white/[0.03]"
                }`}
              >
                <span
                  className="w-9 h-9 rounded-full flex items-center justify-center text-[10px] font-semibold text-ink shrink-0"
                  style={{ backgroundColor: c.avatarColor }}
                >
                  {c.isGroup ? <Users className="w-4 h-4" /> : c.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2 mb-0.5">
                    <span className="text-sm text-cream truncate">{c.name}</span>
                    <span className="text-[10px] text-slate-text shrink-0">{c.lastTime}</span>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-xs text-slate-text/70 truncate">{c.lastMessage}</p>
                    {c.unread > 0 && (
                      <span className="w-4 h-4 rounded-full bg-teal text-ink text-[9px] font-bold flex items-center justify-center shrink-0">
                        {c.unread}
                      </span>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-white/8 bg-white/[0.02] flex flex-col overflow-hidden">
          {selected ? (
            <>
              <div className="flex items-center gap-3 px-5 py-3.5 border-b border-white/8">
                <span
                  className="w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-semibold text-ink shrink-0"
                  style={{ backgroundColor: selected.avatarColor }}
                >
                  {selected.isGroup ? <Users className="w-4 h-4" /> : selected.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                </span>
                <span className="text-sm font-medium text-cream">{selected.name}</span>
              </div>

              <div ref={scrollRef} className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
                {selected.messages.map((m) => (
                  <div key={m.id} className={`flex ${m.from === "me" ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[75%] ${m.from === "me" ? "items-end" : "items-start"} flex flex-col gap-1`}>
                      {m.from === "them" && selected.isGroup && (
                        <span className="text-[10px] text-slate-text px-1">{m.senderInitials}</span>
                      )}
                      <div
                        className={`rounded-2xl px-3.5 py-2 text-sm ${
                          m.from === "me"
                            ? "bg-teal text-ink rounded-br-sm"
                            : "bg-white/5 border border-white/8 text-cream rounded-bl-sm"
                        }`}
                      >
                        {m.text}
                      </div>
                      <span className="text-[10px] text-slate-text px-1">{m.time}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-3 border-t border-white/8 flex items-center gap-2">
                <input
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                  placeholder="Type a message..."
                  className="flex-1 bg-white/5 border border-white/8 rounded-full px-4 py-2.5 text-sm text-cream placeholder:text-slate-text focus:outline-none focus:border-teal/30"
                />
                <button
                  onClick={sendMessage}
                  className="w-10 h-10 rounded-full bg-teal text-ink flex items-center justify-center shrink-0 hover:bg-teal-glow transition-colors disabled:opacity-40"
                  disabled={!draft.trim()}
                  aria-label="Send"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center text-slate-text">
              <MessageSquare className="w-8 h-8 mb-3 opacity-40" />
              <p className="text-sm">Select a conversation to start messaging.</p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}