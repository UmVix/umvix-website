"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { X, Send, Bot, Mic, MicOff } from "lucide-react";
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
          content: `${msg} You can also reach us directly at info@umvix.com.`,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Launcher — brand "um" mark on a dark glass disc */}
      <motion.button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close chat" : "Open chat assistant"}
        data-cursor="hover"
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.94 }}
        className={`fixed bottom-6 right-6 z-[120] flex h-14 w-14 items-center justify-center rounded-full ${
          open ? "bg-brand-black-soft shadow-[0_10px_30px_rgba(0,0,0,0.65)]" : ""
        }`}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={open ? "x" : "chat"}
            initial={{ rotate: -90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: 90, opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="flex h-full w-full items-center justify-center"
          >
            {open ? (
              <X size={22} className="text-brand-white" />
            ) : (
              // the artwork sits in the middle ~55% of the canvas (glow padding),
              // so scale it up to fill the disc
              <Image
                src="/icons/logo-small.png"
                alt=""
                width={56}
                height={56}
                className="h-full w-full scale-[1.6] object-contain"
              />
            )}
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
            className="glass fixed bottom-24 right-6 z-[120] flex h-[31rem] max-h-[72vh] w-[calc(100vw-3rem)] max-w-[21.5rem] flex-col overflow-hidden rounded-2xl shadow-2xl"
            style={{ willChange: "transform, opacity" }}
          >
            {/* Header */}
            <div className="relative border-b border-white/[0.08] bg-white/[0.03] px-4 py-3.5">
              {/* brand accent line */}
              <div aria-hidden className="absolute inset-x-0 top-0 h-[2px] bg-brand-gradient" />
              <div className="flex items-center gap-2.5">
                <div className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-gradient text-white shadow-[0_6px_18px_rgba(255,31,61,0.35)]">
                  <Bot size={15} />
                  <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-[#101014] bg-green-500" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-brand-white">
                    <BrandLogo variant="xs" asLink={false} />
                    <span className="leading-none">Assistant</span>
                  </div>
                  <p className="mt-0.5 truncate text-[10px] text-brand-gray">
                    {listening
                      ? "Listening..."
                      : speaking
                        ? "Speaking..."
                        : "Typically replies in seconds"}
                  </p>
                </div>
                {(listening || speaking) && <Waveform />}
              </div>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="scrollbar-thin flex-1 space-y-3.5 overflow-y-auto px-4 py-4">
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={`flex items-end gap-2 ${m.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  {m.role === "assistant" && (
                    <span className="mb-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-red/15 text-brand-red">
                      <Bot size={13} />
                    </span>
                  )}
                  <div
                    className={`max-w-[82%] px-3 py-2 text-[12.5px] leading-relaxed ${
                      m.role === "user"
                        ? "rounded-2xl rounded-br-md bg-brand-gradient text-brand-white shadow-[0_6px_18px_rgba(255,31,61,0.25)]"
                        : "rounded-2xl rounded-bl-md border border-white/[0.08] bg-white/[0.05] text-brand-white/90"
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
                <div className="flex items-end gap-2">
                  <span className="mb-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-red/15 text-brand-red">
                    <Bot size={13} />
                  </span>
                  <div className="rounded-2xl rounded-bl-md border border-white/[0.08] bg-white/[0.05] px-3.5 py-3">
                    <span className="inline-flex gap-1">
                      <Dot /> <Dot delay="0.2s" /> <Dot delay="0.4s" />
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Suggestions */}
            {messages.length === 1 && (
              <div className="px-4 pb-3">
                <p className="mb-1.5 text-[9px] font-bold uppercase tracking-[0.16em] text-brand-gray-muted">
                  Quick questions
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {SUGGESTIONS.map((s) => (
                    <button
                      key={s}
                      onClick={() => send(s)}
                      data-cursor="hover"
                      className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[11px] text-brand-gray transition-colors hover:border-brand-red/50 hover:bg-brand-red/10 hover:text-brand-white"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input */}
            <div className="border-t border-white/[0.08] bg-white/[0.02] p-3">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  send(input);
                }}
                className="flex items-center gap-2 rounded-full border border-white/10 bg-brand-black/70 py-1.5 pl-1.5 pr-1.5 transition-colors focus-within:border-brand-red/50"
              >
                {voiceSupported && (
                  <button
                    type="button"
                    onClick={toggleListening}
                    aria-label={listening ? "Stop listening" : "Speak your message"}
                    data-cursor="hover"
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-colors ${
                      listening
                        ? "btn-primary"
                        : "text-brand-gray hover:bg-white/[0.06] hover:text-brand-red"
                    }`}
                  >
                    {listening ? <MicOff size={14} /> : <Mic size={14} />}
                  </button>
                )}
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={listening ? "Listening..." : "Ask about our services..."}
                  className="min-w-0 flex-1 bg-transparent px-1.5 text-[12.5px] text-brand-white outline-none placeholder:text-brand-gray-muted"
                />
                <button
                  type="submit"
                  disabled={loading || !input.trim()}
                  aria-label="Send message"
                  data-cursor="hover"
                  className="btn-primary flex h-8 w-8 shrink-0 items-center justify-center rounded-full disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <Send size={14} />
                </button>
              </form>
              <p className="mt-1.5 text-center text-[9px] text-brand-gray-muted">
                Powered by Umvix AI · Answers questions about Umvix only
              </p>
            </div>
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
