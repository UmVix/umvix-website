"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "@/lib/hooks";

const SNIPPETS = [
  {
    label: "web.tsx",
    code: `export function Hero() {
  const { data } = useQuery("metrics");
  return (
    <section className="hero">
      <h1>{data.headline}</h1>
      <CTA href="/contact">Start</CTA>
    </section>
  );
}`,
  },
  {
    label: "ai.ts",
    code: `const res = await anthropic.messages.create({
  model: "claude-sonnet-4-6",
  max_tokens: 1024,
  messages: [{ role: "user", content: prompt }],
});

return res.content[0].text;`,
  },
  {
    label: "automate.py",
    code: `def run_workflow(payload):
    data = extract(payload)
    enriched = ai_enrich(data)
    push_to_crm(enriched)
    return {"status": "done", "rows": len(data)}`,
  },
];

const KEYWORDS =
  /\b(export|function|const|let|return|await|def|import|from|async|new)\b/g;
const STRINGS = /("[^"]*"|'[^']*'|`[^`]*`)/g;
const COMMENTS = /(\/\/[^\n]*|#[^\n]*)/g;

function highlight(code: string): string {
  // Order matters: escape first, then wrap tokens.
  let html = code
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
  html = html.replace(STRINGS, '<span class="text-emerald-400">$1</span>');
  html = html.replace(COMMENTS, '<span class="text-brand-gray-muted">$1</span>');
  html = html.replace(KEYWORDS, '<span class="text-brand-red font-semibold">$1</span>');
  return html;
}

export default function CodeTerminal() {
  const { ref, inView } = useInView<HTMLDivElement>({ threshold: 0.2 });
  const reduced = useReducedMotion();
  const [snippetIdx, setSnippetIdx] = useState(0);
  const [typed, setTyped] = useState("");
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    const clearAll = () => {
      timers.current.forEach(clearTimeout);
      timers.current = [];
    };

    const snippet = SNIPPETS[snippetIdx].code;

    if (reduced || !inView) {
      if (reduced) setTyped(snippet);
      clearAll();
      return;
    }

    setTyped("");
    let i = 0;
    let didTypo = false;

    const schedule = (fn: () => void, delay: number) => {
      const t = setTimeout(fn, delay);
      timers.current.push(t);
    };

    const typeNext = () => {
      // Occasional typo + backspace correction around the middle.
      if (!didTypo && i === Math.floor(snippet.length * 0.45)) {
        didTypo = true;
        const wrong = typed + "x";
        setTyped(wrong);
        schedule(() => {
          setTyped(snippet.slice(0, i)); // backspace correction
          schedule(typeNext, 120);
        }, 220);
        return;
      }

      i += 1;
      setTyped(snippet.slice(0, i));

      if (i < snippet.length) {
        const ch = snippet[i - 1];
        const delay = ch === "\n" ? 140 : 18 + Math.random() * 50;
        schedule(typeNext, delay);
      } else {
        // Pause, then advance to next snippet.
        schedule(() => setSnippetIdx((s) => (s + 1) % SNIPPETS.length), 2600);
      }
    };

    schedule(typeNext, 400);
    return clearAll;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [snippetIdx, inView, reduced]);

  return (
    <div ref={ref} className="mx-auto max-w-3xl px-4">
      <div className="overflow-hidden rounded-xl border border-brand-red/20 bg-brand-black-soft shadow-2xl">
        {/* Title bar */}
        <div className="flex items-center gap-2 border-b border-brand-red/10 bg-brand-black/60 px-4 py-3">
          <span className="h-3 w-3 rounded-full bg-brand-red/80" />
          <span className="h-3 w-3 rounded-full bg-brand-gray/40" />
          <span className="h-3 w-3 rounded-full bg-brand-gray/40" />
          <span className="ml-3 font-mono text-xs text-brand-gray">
            {SNIPPETS[snippetIdx].label}
          </span>
          <span className="ml-auto text-xs text-brand-gray-muted">umvix ~ live</span>
        </div>
        {/* Code */}
        <pre className="scrollbar-thin min-h-[16rem] overflow-x-auto p-5 font-mono text-sm leading-relaxed text-brand-white">
          <code
            // Highlighted markup is generated from a fixed local snippet set.
            dangerouslySetInnerHTML={{
              __html:
                highlight(typed) +
                (typed.length < SNIPPETS[snippetIdx].code.length
                  ? '<span class="inline-block w-2 h-4 -mb-0.5 bg-brand-red animate-pulse"></span>'
                  : ""),
            }}
          />
        </pre>
      </div>
    </div>
  );
}
