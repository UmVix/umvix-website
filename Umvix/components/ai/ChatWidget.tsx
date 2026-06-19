"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { MessageSquare, X, Send, Bot, Mic, MicOff } from "lucide-react";
import BrandLogo from "@/components/BrandLogo";

type Message = { role: "user" | "assistant"; content: string };

const SUGGESTIONS = [
  "What services do you offer?",
  "How does your process work?",
  "What's your pricing approach?",
];

// Minimal typings for the Web Speech API (not in standard TS lib DOM).
type SpeechRecognitionLike = {
  lang: string;
  interimResults: boolean;
  continuous: boolean;
  start: () => void;
  stop: () => void;
  onresult: ((e: { results: { 0: { transcript: string } }[] }) => void) | null;
  onend: (() => void) | null;
  onerror: (() => void) | null;
};

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Hi! I'm Umvix's AI assistant. Ask me about our services, process, or how we can help with your project.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [listening, setListening] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [voiceSupported, setVoiceSupported] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const voiceModeRef = useRef(false);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading, open]);

  // Set up speech recognition if available.
  useEffect(() => {
    const w = window as unknown as {
      SpeechRecognition?: new () => SpeechRecognitionLike;
      webkitSpeechRecognition?: new () => SpeechRecognitionLike;
    };
    const Ctor = w.SpeechRecognition || w.webkitSpeechRecognition;
    const hasSynth = typeof window !== "undefined" && "speechSynthesis" in window;
    if (!Ctor || !hasSynth) return;

    setVoiceSupported(true);
    const recognition = new Ctor();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.continuous = false;

    recognition.onresult = (e) => {
      const transcript = e.results[0][0].transcript;
      setInput(transcript);
      voiceModeRef.current = true;
      send(transcript);
    };
    recognition.onend = () => setListening(false);
    recognition.onerror = () => setListening(false);

    recognitionRef.current = recognition;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const speak = (text: string) => {
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    utter.rate = 1.02;
    utter.pitch = 1;
    utter.onstart = () => setSpeaking(true);
    utter.onend = () => setSpeaking(false);
    window.speechSynthesis.speak(utter);
  };

  const toggleListening = () => {
    const rec = recognitionRef.current;
    if (!rec) return;
    if (listening) {
      rec.stop();
      setListening(false);
    } else {
      window.speechSynthesis?.cancel();
      setSpeaking(false);
      try {
        rec.start();
        setListening(true);
      } catch {
        setListening(false);
      }
    }
  };

  const send = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || loading) return;

    const speakReply = voiceModeRef.current;
    voiceModeRef.current = false;

    const nextMessages: Message[] = [...messages, { role: "user", content: trimmed }];
    setMessages(nextMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: nextMessages.map((m) => ({ role: m.role, content: m.content })),
        }),
      });

      if (!res.ok || !res.body) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Request failed");
      }

      setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let acc = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        acc += decoder.decode(value, { stream: true });
        setMessages((prev) => {
          const copy = [...prev];
          copy[copy.length - 1] = { role: "assistant", content: acc };
          return copy;
        });
      }

      if (speakReply && acc) speak(acc);
    } catch (err) {
      const msg =
        err instanceof Error && err.message
          ? err.message
          : "Sorry, I'm having trouble responding right now.";
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: `${msg} You can also reach us directly at hello@umvix.com.`,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Launcher */}
      <motion.button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close chat" : "Open chat assistant"}
        data-cursor="hover"
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.94 }}
        className="btn-primary fixed bottom-6 right-6 z-[120] flex h-14 w-14 items-center justify-center rounded-full accent-glow"
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={open ? "x" : "chat"}
            initial={{ rotate: -90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: 90, opacity: 0 }}
            transition={{ duration: 0.18 }}
          >
            {open ? <X size={24} /> : <MessageSquare size={24} />}
          </motion.span>
        </AnimatePresence>
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.96 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="glass fixed bottom-24 right-6 z-[120] flex h-[34rem] max-h-[75vh] w-[calc(100vw-3rem)] max-w-sm flex-col overflow-hidden rounded-2xl shadow-2xl"
            style={{ willChange: "transform, opacity" }}
          >
            {/* Header */}
            <div className="flex items-center gap-3 border-b border-brand-red/15 px-4 py-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-red/15 text-brand-red">
                <Bot size={18} />
              </div>
              <div>
                <div className="flex items-center gap-2.5 text-sm font-semibold text-brand-white">
                  <BrandLogo variant="sm" asLink={false} />
                  <span className="leading-none">Assistant</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-brand-gray">
                  <span className="h-2 w-2 rounded-full bg-green-500" />
                  {listening ? "Listening..." : speaking ? "Speaking..." : "Online"}
                </div>
              </div>
              {(listening || speaking) && <Waveform />}
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="scrollbar-thin flex-1 space-y-4 overflow-y-auto px-4 py-4">
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                      m.role === "user"
                        ? "bg-brand-red text-brand-white"
                        : "border border-brand-red/10 bg-brand-black/60 text-brand-gray"
                    }`}
                  >
                    {m.content || (
                      <span className="inline-flex gap-1">
                        <Dot /> <Dot delay="0.2s" /> <Dot delay="0.4s" />
                      </span>
                    )}
                  </div>
                </div>
              ))}
              {loading && messages[messages.length - 1]?.role === "user" && (
                <div className="flex justify-start">
                  <div className="rounded-2xl border border-brand-red/10 bg-brand-black/60 px-4 py-3">
                    <span className="inline-flex gap-1">
                      <Dot /> <Dot delay="0.2s" /> <Dot delay="0.4s" />
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Suggestions */}
            {messages.length === 1 && (
              <div className="flex flex-wrap gap-2 px-4 pb-2">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => send(s)}
                    data-cursor="hover"
                    className="rounded-full border border-brand-red/30 px-3 py-1 text-xs text-brand-gray transition-colors hover:border-brand-red hover:text-brand-white"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}

            {/* Input */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                send(input);
              }}
              className="flex items-center gap-2 border-t border-brand-red/15 p-3"
            >
              {voiceSupported && (
                <button
                  type="button"
                  onClick={toggleListening}
                  aria-label={listening ? "Stop listening" : "Speak your message"}
                  data-cursor="hover"
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border transition-colors ${
                    listening
                      ? "btn-primary border-transparent"
                      : "border-brand-red/30 text-brand-red hover:bg-brand-red/10"
                  }`}
                >
                  {listening ? <MicOff size={16} /> : <Mic size={16} />}
                </button>
              )}
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={listening ? "Listening..." : "Ask about our services..."}
                className="flex-1 rounded-full bg-brand-black/60 px-4 py-2.5 text-sm text-brand-white outline-none placeholder:text-brand-gray-muted focus:ring-1 focus:ring-brand-red"
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                aria-label="Send message"
                data-cursor="hover"
                className="btn-primary flex h-10 w-10 shrink-0 items-center justify-center rounded-full disabled:opacity-40"
              >
                <Send size={16} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function Waveform() {
  return (
    <span className="ml-auto flex items-center gap-0.5" aria-hidden>
      {[0, 1, 2, 3, 4].map((i) => (
        <span
          key={i}
          className="w-0.5 rounded-full bg-brand-red"
          style={{
            height: "16px",
            animation: `waveform 0.9s ease-in-out ${i * 0.12}s infinite`,
          }}
        />
      ))}
    </span>
  );
}

function Dot({ delay = "0s" }: { delay?: string }) {
  return (
    <span
      className="h-1.5 w-1.5 rounded-full bg-brand-red animate-thinking-bounce"
      style={{ animationDelay: delay }}
    />
  );
}
