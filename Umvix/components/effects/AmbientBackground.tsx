"use client";

/**
 * Global premium ambient backdrop: softly drifting gradient orbs.
 * Fixed behind all content; inert under reduced-motion via globals.css.
 */
export default function AmbientBackground() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-brand-black"
    >
      {/* Soft drifting orbs — one faint red, one cool white */}
      <div
        className="absolute -left-40 top-[8%] h-[34rem] w-[34rem] rounded-full opacity-50 blur-[120px]"
        style={{
          background:
            "radial-gradient(circle, rgba(255,31,61,0.16) 0%, transparent 70%)",
          animation: "ambient-drift 26s ease-in-out infinite",
        }}
      />
      <div
        className="absolute right-[-10rem] top-[40%] h-[30rem] w-[30rem] rounded-full opacity-40 blur-[120px]"
        style={{
          background:
            "radial-gradient(circle, rgba(255,255,255,0.07) 0%, transparent 70%)",
          animation: "ambient-drift-alt 32s ease-in-out infinite",
        }}
      />
      <div
        className="absolute bottom-[-8rem] left-[30%] h-[26rem] w-[26rem] rounded-full opacity-40 blur-[120px]"
        style={{
          background:
            "radial-gradient(circle, rgba(255,31,61,0.10) 0%, transparent 70%)",
          animation: "ambient-drift 38s ease-in-out infinite",
        }}
      />

    </div>
  );
}
