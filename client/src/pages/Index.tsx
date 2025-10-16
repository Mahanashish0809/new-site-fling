'use client';

import { Header } from "@/components/Header";
import { Search } from "lucide-react";
import { useEffect } from "react";

/* JoltQ – Gradient Future palette */
const JP = {
  navy: "#001F3F",
  orange: "#FF6B35",
  gold: "#FFD166",
  bg1: "#0B1120",
  bg2: "#0D182A",
  bg3: "#0A1E33",
};

export default function Landing() {
  // inject keyframes once (safe on client)
  useEffect(() => {
    if (document.getElementById("joltq-float-style")) return;
    const style = document.createElement("style");
    style.id = "joltq-float-style";
    style.innerHTML = `
      @keyframes floatY { 0%,100% { transform: translateY(0) } 50% { transform: translateY(-12px) } }
    `;
    document.head.appendChild(style);
  }, []);

  return (
    <div className="min-h-screen text-white">
      <Header />

      {/* HERO */}
      <section className="relative overflow-hidden">
        {/* background gradient + subtle blobs */}
        <div
          className="absolute inset-0 -z-10"
          style={{ background: `linear-gradient(135deg, ${JP.bg1}, ${JP.bg2} 45%, ${JP.bg3})` }}
        />
        <div
          className="pointer-events-none absolute -top-24 -left-24 h-[520px] w-[520px] rounded-full blur-3xl opacity-40 -z-10"
          style={{ background: `radial-gradient(closest-side, ${JP.orange}, transparent 70%)` }}
        />
        <div
          className="pointer-events-none absolute -top-12 right-[-10%] h-[560px] w-[560px] rounded-full blur-3xl opacity-40 -z-10"
          style={{ background: `radial-gradient(closest-side, ${JP.gold}, transparent 70%)` }}
        />

        <div className="container mx-auto px-6 pt-16 pb-10 md:pt-24 md:pb-16">
          {/* floating avatar circles (placeholder gradients) */}
          <div className="relative">
            <Bubble className="left-4 top-6" />
            <Bubble className="left-[14%] -top-10" delay="0.3s" />
            <Bubble className="right-[10%] -top-8" delay="0.5s" />
            <Bubble className="right-4 top-8" delay="0.7s" />
          </div>

          {/* center copy */}
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-extrabold leading-tight">
              Create your career path with{" "}
              <span
                className="bg-clip-text text-transparent"
                style={{ backgroundImage: `linear-gradient(90deg, ${JP.orange}, ${JP.gold})` }}
              >
                JoltQ
              </span>
            </h1>
            <p className="mt-4 text-base md:text-xl text-white/80">
              Discover roles, analyze your skills, and get AI-powered recommendations.
            </p>

            {/* glass input bar */}
            <div
              className="mt-8 mx-auto flex w-full max-w-2xl items-center gap-2 rounded-2xl p-2"
              style={{
                background: "rgba(255,255,255,0.06)",
                boxShadow: "0 10px 40px rgba(0,0,0,0.25)",
                backdropFilter: "blur(10px)",
              }}
            >
              <input
                className="flex-1 bg-transparent placeholder-white/60 text-white px-4 py-3 focus:outline-none"
                placeholder="Describe your role or paste a job link…"
              />
              <button
                className="flex items-center gap-2 rounded-xl px-4 py-3 font-semibold"
                style={{
                  background: `linear-gradient(90deg, ${JP.orange}, ${JP.gold})`,
                  color: "#0B0F1A",
                  boxShadow: "0 8px 24px rgba(255, 107, 53, 0.35)",
                }}
              >
                <Search className="h-5 w-5" />
                Generate
              </button>
            </div>

            {/* logo strip */}
            <div className="mt-10 opacity-70 flex flex-wrap items-center justify-center gap-8 text-white/60">
              {["AGL", "citi", "energy", "datasphere", "elo"].map((x) => (
                <div key={x} className="text-sm md:text-base">
                  {x}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div
          className="h-[1px] w-full"
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent)",
          }}
        />
      </section>

      {/* HOW IT WORKS */}
      <section className="container mx-auto px-6 py-14 md:py-20">
        <h2 className="text-3xl md:text-4xl font-bold text-center">How it works?</h2>
        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
          <HowCard title="Provide Brief Information" text="Paste JD, upload resume, or pick a role." badge="Step 1" />
          <HowCard title="Choose Your Concept" text="Job match, Skill gap, or Learning path." badge="Step 2" />
          <HowCard title="Instant Insights" text="Fit scores and next actions, instantly." badge="Step 3" highlight />
        </div>
      </section>
    </div>
  );
}

/* --- small components (no images) --- */

function Bubble({ className = "", delay = "0s" }) {
  return (
    <div
      className={`absolute h-16 w-16 md:h-24 md:w-24 rounded-full ring-2 ring-white/15 overflow-hidden ${className}`}
      style={{
        animation: `floatY 6s ease-in-out ${delay} infinite`,
        background:
          "radial-gradient(closest-side, rgba(255,255,255,0.85), rgba(255,255,255,0.2)), linear-gradient(180deg, rgba(255,255,255,0.2), transparent)",
        boxShadow: "0 12px 35px rgba(0,0,0,0.35)",
      }}
    />
  );
}

function HowCard({ title, text, badge, highlight = false }) {
  return (
    <div
      className={`rounded-3xl p-6 md:p-7 backdrop-blur-md border transition-transform ${
        highlight ? "scale-[1.02]" : ""
      }`}
      style={{
        background: highlight
          ? "linear-gradient(180deg, rgba(255,255,255,0.12), rgba(255,255,255,0.06))"
          : "linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0.04))",
        borderColor: "rgba(255,255,255,0.18)",
        boxShadow: highlight
          ? "0 20px 60px rgba(255,107,53,0.25)"
          : "0 12px 40px rgba(0,0,0,0.25)",
      }}
    >
      <div className="text-xs tracking-wide inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-white/80">
        <span
          className="h-2 w-2 rounded-full"
          style={{ background: "linear-gradient(90deg, #FF6B35, #FFD166)" }}
        />
        {badge}
      </div>
      <h4 className="mt-3 text-xl font-bold text-white">{title}</h4>
      <p className="mt-2 text-sm text-white/75">{text}</p>
      <div
        className="mt-4 h-[2px] w-20 rounded"
        style={{ background: "linear-gradient(90deg, #FF6B35, #FFD166)" }}
      />
    </div>
  );
}
