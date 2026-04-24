import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, Send, X, Sparkles } from "lucide-react";

type Msg = { role: "user" | "assistant"; content: string };

const GREETING: Msg = {
  role: "assistant",
  content:
    "Hey! I'm AMBI, Ambar's AI sidekick. Ask me about his work, stack, projects, or how to hire him.",
};

const SUGGESTIONS = [
  "What does Ambar build?",
  "Show me his stack",
  "How do I hire him?",
];

export function ChatBubble() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Msg[]>([GREETING]);
  const [streaming, setStreaming] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, streaming, open]);

  async function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed || streaming) return;
    const next: Msg[] = [...messages, { role: "user", content: trimmed }, { role: "assistant", content: "" }];
    setMessages(next);
    setInput("");
    setStreaming(true);

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const base = (import.meta.env.BASE_URL ?? "/").replace(/\/$/, "");
      const res = await fetch(`${base}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: next.slice(0, -1).map((m) => ({ role: m.role, content: m.content })),
        }),
        signal: controller.signal,
      });

      if (!res.ok || !res.body) throw new Error(`HTTP ${res.status}`);

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let acc = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const parts = buffer.split("\n\n");
        buffer = parts.pop() ?? "";
        for (const part of parts) {
          const line = part.trim();
          if (!line.startsWith("data:")) continue;
          const payload = line.slice(5).trim();
          try {
            const evt = JSON.parse(payload);
            if (evt.content) {
              acc += evt.content;
              setMessages((prev) => {
                const copy = prev.slice();
                copy[copy.length - 1] = { role: "assistant", content: acc };
                return copy;
              });
            }
            if (evt.error) throw new Error(evt.error);
          } catch {
            /* ignore malformed chunk */
          }
        }
      }
      if (!acc) {
        setMessages((prev) => {
          const copy = prev.slice();
          copy[copy.length - 1] = {
            role: "assistant",
            content: "Hmm, I went quiet for a sec. Try again?",
          };
          return copy;
        });
      }
    } catch (err: any) {
      if (err?.name === "AbortError") return;
      setMessages((prev) => {
        const copy = prev.slice();
        copy[copy.length - 1] = {
          role: "assistant",
          content: "Connection hiccup — please try again in a moment.",
        };
        return copy;
      });
    } finally {
      setStreaming(false);
      abortRef.current = null;
    }
  }

  return (
    <>
      <motion.button
        data-hover
        onClick={() => setOpen((v) => !v)}
        initial={{ opacity: 0, scale: 0.6 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.2, type: "spring", stiffness: 200, damping: 18 }}
        className="fixed bottom-6 right-6 z-[9980] group"
        aria-label={open ? "Close chat" : "Open chat with AMBI"}
      >
        <span className="absolute inset-0 rounded-full bg-cyan-400/40 blur-xl group-hover:bg-cyan-400/60 transition-colors" />
        <span className="absolute inset-0 rounded-full animate-ping bg-cyan-400/20" />
        <span className="relative flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-br from-cyan-400 via-cyan-500 to-violet-500 shadow-[0_8px_32px_rgba(34,211,238,0.45)] border border-white/20">
          {open ? (
            <X className="w-6 h-6 text-white" />
          ) : (
            <MessageCircle className="w-6 h-6 text-white" />
          )}
        </span>
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 240, damping: 24 }}
            className="fixed bottom-24 right-6 z-[9980] w-[min(92vw,380px)] h-[min(70vh,540px)] flex flex-col rounded-3xl overflow-hidden border border-white/10 bg-slate-950/85 backdrop-blur-2xl shadow-[0_24px_80px_rgba(8,11,24,0.7)]"
          >
            <div className="absolute -top-20 -right-20 w-48 h-48 rounded-full bg-cyan-500/20 blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -left-20 w-56 h-56 rounded-full bg-violet-500/20 blur-3xl pointer-events-none" />

            <div className="relative flex items-center gap-3 px-4 py-3 border-b border-white/10">
              <div className="relative w-9 h-9 rounded-full bg-gradient-to-br from-cyan-400 to-violet-500 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-400 border-2 border-slate-950" />
              </div>
              <div className="flex flex-col leading-tight">
                <span className="text-sm font-semibold text-white">AMBI</span>
                <span className="text-[11px] text-emerald-300">online · usually replies in seconds</span>
              </div>
            </div>

            <div ref={scrollRef} className="relative flex-1 overflow-y-auto px-4 py-4 space-y-3">
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] px-3.5 py-2.5 text-sm leading-relaxed rounded-2xl whitespace-pre-wrap break-words ${
                      m.role === "user"
                        ? "bg-gradient-to-br from-cyan-500/90 to-violet-500/90 text-white rounded-br-sm shadow-lg shadow-cyan-500/20"
                        : "bg-white/[0.06] text-slate-100 border border-white/10 rounded-bl-sm"
                    }`}
                  >
                    {m.content || (
                      <span className="inline-flex gap-1 items-center text-cyan-300/80">
                        <Dot delay={0} />
                        <Dot delay={150} />
                        <Dot delay={300} />
                      </span>
                    )}
                  </div>
                </div>
              ))}

              {messages.length <= 1 && !streaming && (
                <div className="flex flex-wrap gap-2 pt-1">
                  {SUGGESTIONS.map((s) => (
                    <button
                      key={s}
                      data-hover
                      onClick={() => send(s)}
                      className="text-xs px-3 py-1.5 rounded-full border border-cyan-400/30 bg-cyan-400/5 text-cyan-200 hover:bg-cyan-400/15 transition-colors"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                send(input);
              }}
              className="relative flex items-center gap-2 px-3 py-3 border-t border-white/10 bg-slate-950/60"
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={streaming ? "AMBI is typing..." : "Ask about Ambar..."}
                disabled={streaming}
                className="flex-1 bg-white/[0.04] border border-white/10 focus:border-cyan-400/60 focus:outline-none rounded-full px-4 py-2 text-sm text-white placeholder:text-slate-500 transition-colors disabled:opacity-60"
              />
              <button
                data-hover
                type="submit"
                disabled={streaming || !input.trim()}
                className="w-9 h-9 flex items-center justify-center rounded-full bg-gradient-to-br from-cyan-400 to-violet-500 text-white disabled:opacity-40 disabled:cursor-not-allowed hover:scale-105 transition-transform"
                aria-label="Send"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function Dot({ delay }: { delay: number }) {
  return (
    <span
      className="inline-block w-1.5 h-1.5 rounded-full bg-cyan-300 animate-bounce"
      style={{ animationDelay: `${delay}ms` }}
    />
  );
}
