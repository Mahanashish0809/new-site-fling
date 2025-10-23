'use client';

// import { useEffect, useRef, useState } from "react";
// import Typed from "react-typed"; // <-- MAKE SURE YOU HAVE RUN: npm install react-typed
import { useEffect, useRef, useState } from "react";
import { Typed } from "react-typed"; // <-- use named export
// ...existing code...
// import { useEffect, useRef, useState } from "react";
// import { Typed as TypedClass } from "react-typed"; // constructor-style export
// // ...existing code...

// Add this small React wrapper/shim for the Typed constructor
function TypedShim({
  strings,
  typeSpeed = 50,
  backSpeed = 30,
  backDelay = 1500,
  showCursor = true,
  onComplete,
}: {
  strings: string[];
  typeSpeed?: number;
  backSpeed?: number;
  backDelay?: number;
  showCursor?: boolean;
  onComplete?: () => void;
}) {
  const elRef = useRef<HTMLSpanElement | null>(null);
  const instanceRef = useRef<any>(null);

  useEffect(() => {
    if (!elRef.current) return;
    // Instantiate the Typed constructor against the DOM node
    instanceRef.current = new (Typed as any)(elRef.current, {
      strings,
      typeSpeed,
      backSpeed,
      backDelay,
      showCursor,
      onComplete,
    });

    return () => {
      if (instanceRef.current && typeof instanceRef.current.destroy === "function") {
        instanceRef.current.destroy();
      }
    };
  }, [strings, typeSpeed, backSpeed, backDelay, showCursor, onComplete]);

  return <span ref={elRef} />;
}
// ...existing code...


/* ===== THEME / BRAND COLORS ===== */
const JP = {
  orange: "#FF6B35",
  navy: "#1B3A5F",
  darkNavy: "#0F2744",
  skyBlue: "#87CEEB",
  lightSky: "#B0E0F6",
  white: "#FFFFFF",
};

/* ===== VALUE BLOCKS DATA ===== */
const VALUE_BLOCKS = [
  {
    id: "vb1",
    label: "JOB DISCOVERY",
    number: "01",
    title: "Put your skills in more places.",
    copy:
      "Many job seekers miss out on matching roles. JoltQ helps you map your skills to the right opportunities.",
    bullets: [
      "See top matching jobs instantly.",
      "Rank by skill-fit and growth potential.",
      "Filter roles by pay and flexibility.",
    ],
    cta: [
      { href: "/jobs", label: "Explore Jobs" },
      { href: "/skills", label: "Analyze Skills" },
    ],
  },
  {
    id: "vb2",
    label: "LEARNING INSIGHTS",
    number: "02",
    title: "Close your skill gaps easily.",
    copy:
      "Upload your resume or connect LinkedIn — JoltQ identifies what's missing and suggests real-world projects.",
    bullets: [
      "Auto-detect weak skill areas.",
      "Receive course & project suggestions.",
      "Track learning progress visually.",
    ],
    cta: [
      { href: "/learning", label: "View Learning Paths" },
      { href: "/upskill", label: "Start Now" },
    ],
  },
  {
    id: "vb3",
    label: "CAREER TRACKER",
    number: "03",
    title: "Track your job journey seamlessly.",
    copy:
      "Save, apply, and track all your job applications in one place — powered by automation and analytics.",
    bullets: [
      "Centralized job application tracker.",
      "Status updates and reminders.",
      "Analytics for interview readiness.",
    ],
    cta: [
      { href: "/tracker", label: "Open Tracker" },
      { href: "/signup", label: "Join for Free" },
    ],
  },
];


/* ===== SIMPLE HEADER ===== */

function Header() {
  return (
    <div className="container mx-auto px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className="text-2xl font-bold" style={{ color: JP.navy }}>
          JoltQ
        </div>
      </div>
      <nav className="hidden md:flex items-center gap-6">
        <a href="/jobs" className="font-medium hover:opacity-70 transition-opacity" style={{ color: JP.navy }}>
          Jobs
        </a>
        <a href="/skills" className="font-medium hover:opacity-70 transition-opacity" style={{ color: JP.navy }}>
          Skills
        </a>
        <a href="/about" className="font-medium hover:opacity-70 transition-opacity" style={{ color: JP.navy }}>
          About
        </a>
        <a
          href="/login"
          className="rounded-full px-4 py-2 font-semibold text-white transition-transform hover:scale-105"
          style={{ background: JP.orange }}
        >
          Sign In
        </a>
      </nav>
    </div>
  );
}

/* ===== PAGE (Header → Main → Footer) ===== */
export default function Landing() {
  const [showMainHeading, setShowMainHeading] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <div className="min-h-screen text-slate-800 bg-gradient-to-br from-sky-100 via-blue-50 to-sky-200">
      {/* HEADER */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-white/80 border-b border-sky-200">
        <Header />
      </header>

      {/* MAIN */}
      <main className="snap-y snap-mandatory">
        {/* ===== HERO (typing → headline) ===== */}
        <section
          className="relative h-screen flex flex-col items-center justify-center text-center overflow-hidden snap-start p-6" // Added padding for mobile
          style={{ background: "linear-gradient(135deg, #7EC8FF 0%, #0F2A47 80%)" }}
        >
          {/* Background pattern */}
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: "radial-gradient(#ffffff 1px, transparent 1px)",
              backgroundSize: "24px 24px",
            }}
          />
          
          {/* IMPROVEMENT: Main headline + CTAs are now rendered immediately but hidden.
            This prevents layout shift when the typing animation completes.
          */}
          <div
            className={`transition-opacity duration-700 ${showMainHeading ? 'opacity-100' : 'opacity-0'}`}
          >
            <h1 className="text-4xl md:text-6xl font-extrabold leading-tight text-white drop-shadow-lg">
              Create your career path with{" "}
              <span
                className="bg-clip-text text-transparent"
                style={{ backgroundImage: "linear-gradient(90deg, #0F2A47, #FF6B35)" }}
              >
                JoltQ
              </span>
            </h1>

            <p className="mt-4 text-lg md:text-xl text-white/90 max-w-2xl mx-auto"> {/* Added max-w for readability */}
              AI job discovery, skill-gap analysis, and role-matched learning paths.
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <a
                href="/jobs"
                className="rounded-full px-6 py-3 font-semibold text-white hover:scale-105 transition-transform"
                style={{ background: JP.orange, boxShadow: "0 10px 24px rgba(255,107,53,0.35)" }}
              >
                Explore Jobs
              </a>
              <a
                href="/analyzer"
                className="rounded-full px-6 py-3 font-semibold bg-white text-[#0F2A47] hover:bg-opacity-90 transition-all"
              >
                Analyze My Skills
              </a>
              <a
                href="/employers"
                className="rounded-full px-6 py-3 font-semibold border-2 text-white hover:bg-white/10 transition-all"
                style={{ borderColor: "#fff" }}
              >
                For Employers
              </a>
            </div>
          </div>
          

          {/* IMPROVEMENT: Typing lines are now absolutely positioned on top.
            We use 'isMounted' to prevent hydration errors.
          */}
          {isMounted && !showMainHeading && (
            <div className="absolute inset-0 flex items-center justify-center p-6">
              <h2 className="text-3xl md:text-4xl font-semibold text-white drop-shadow-lg">
                <TypedShim
                  strings={[
                    "It's not just a job search.",
                    "It's your skill map.",
                    "It's your AI career copilot.",
                  ]}
                  typeSpeed={60}
                  backSpeed={30}
                  backDelay={1500}
                  showCursor={false}
                  onComplete={() => setShowMainHeading(true)}
                />
              </h2>
            </div>
          )}
        </section>

        {/* ===== REFRAIN / TAGLINES ===== */}
        <section className="snap-start" style={{ background: JP.navy }}>
          <div className="container mx-auto px-6 py-16 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white">It's not just a job search.</h2>
            <h2 className="text-3xl md:text-4xl font-bold mt-2 text-sky-200">It's your skill map.</h2>
            <h2 className="text-3xl md:text-4xl font-bold mt-2" style={{ color: JP.orange }}>It's your AI career copilot.</h2>
          </div>
        </section>

        {/* ===== STACKED VALUE BLOCKS ===== */}
        <StackedValueBlocks />

        {/* ===== METRICS ===== */}
        <section className="bg-white">
          <div className="container mx-auto px-6 py-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <Metric kpi="98%" label="Better role fit" />
              <Metric kpi="40%" label="Faster time-to-offer" />
              <Metric kpi="5k+" label="Hiring companies" />
            </div>
          </div>
        </section>

        {/* ===== TESTIMONIALS + CTA ===== */}
        <section className="bg-white">
          <div className="container mx-auto px-6 py-16">
            <div className="grid md:grid-cols-2 gap-8">
              <Quote
                quote="JoltQ showed me roles I would've missed and exactly which skills to close first."
                name="Priya K."
                title="Product Analyst, NYC"
              />
              <Quote
                quote="Our team filled roles 30% faster after rolling JoltQ into our process."
                name="Devon R."
                title="Recruiting Lead"
              />
            </div>
            <div className="text-center mt-12">
              <a
                href="/signup"
                className="rounded-full px-6 py-3 font-semibold text-white hover:scale-105 transition-transform inline-block"
                style={{ background: JP.orange, boxShadow: "0 10px 24px rgba(255,107,53,0.35)" }}
              >
                Get started — it's free
              </a>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer style={{ background: JP.darkNavy }} className="text-sky-100">
        <div className="container mx-auto px-6 py-12 grid md:grid-cols-3 gap-6">
          <div>
            <h4 className="font-semibold text-white mb-3">Company</h4>
            <ul className="space-y-2">
              <li><a href="/about" className="hover:text-white transition-colors">About</a></li>
              <li><a href="/contact" className="hover:text-white transition-colors">Contact</a></li>
              <li><a href="/privacy" className="hover:text-white transition-colors">Privacy</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-3">Product</h4>
            <ul className="space-y-2">
              <li><a href="/jobs" className="hover:text-white transition-colors">Jobs</a></li>
              <li><a href="/analyzer" className="hover:text-white transition-colors">Skill Analyzer</a></li>
              <li><a href="/tracker" className="hover:text-white transition-colors">Tracker</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-3">Resources</h4>
            <ul className="space-y-2">
              <li><a href="/blog" className="hover:text-white transition-colors">Blog</a></li>
              <li><a href="/guides" className="hover:text-white transition-colors">Guides</a></li>
              <li><a href="/support" className="hover:text-white transition-colors">Help Center</a></li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
}

/* ===== STACKED VALUE BLOCKS ===== */
function StackedValueBlocks() {
  const sectionsRef = useRef<Array<HTMLElement | null>>([]);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const els = sectionsRef.current.filter(Boolean) as HTMLElement[];
    if (!els.length) return;

    /*
      IMPROVEMENT: Simplified IntersectionObserver logic.
      - Uses a simple `threshold: 0.5` to trigger when a card is 50% visible.
      - Finds the *last* intersecting entry, which is the one visually on top.
      - More efficient and standard than the previous `reduce` method.
    */
    const observer = new IntersectionObserver(
      (entries) => {
        const intersectingEntries = entries.filter(e => e.isIntersecting);
        
        if (intersectingEntries.length > 0) {
          // Get the last intersecting entry, as it will be the one highest on the screen
          const currentEntry = intersectingEntries[intersectingEntries.length - 1];
          const idx = els.indexOf(currentEntry.target as HTMLElement);
          if (idx !== -1) {
            setActive(idx);
          }
        }
      },
      { 
        root: null, // observes intersections in the viewport
        threshold: 0.5 
      }
    );

    els.forEach((el) => observer.observe(el));
    
    // Clean up all observers on unmount
    return () => els.forEach((el) => observer.unobserve(el));
  }, []); // Empty dependency array is correct here

  return (
    <div
      className="relative text-white"
      style={{ background: `linear-gradient(135deg, ${JP.skyBlue}, ${JP.navy} 60%, ${JP.darkNavy})` }}
    >
      {VALUE_BLOCKS.map((block, i) => (
        <StackedCard
          key={block.id}
          block={block}
          index={i}
          active={active === i}
          sectionRef={(el) => (sectionsRef.current[i] = el)}
        />
      ))}
    </div>
  );
}

function StackedCard({
  block,
  index,
  active,
  sectionRef,
}: {
  block: (typeof VALUE_BLOCKS)[number];
  index: number;
  active: boolean;
  sectionRef: (el: HTMLElement | null) => void;
}) {
  return (
    <section
      ref={sectionRef}
      className="relative h-[160vh] sm:h-[180vh] md:h-[200vh]"
      style={{ zIndex: VALUE_BLOCKS.length - index }}
    >
      <div className="sticky top-0 h-screen flex items-center justify-center">
        <div
          className={[
            "relative max-w-5xl mx-auto grid md:grid-cols-2 gap-10",
            "px-6 md:px-16 py-10 rounded-3xl", // Added vertical padding
            "transition-all duration-300 will-change-transform",
          ].join(" ")}
          style={{
            transform: `translateZ(0) scale(${active ? 1 : 0.985})`,
            opacity: active ? 1 : 0.92,
            background: "rgba(255, 255, 255, 0.12)",
            backdropFilter: "blur(10px)",
            border: `1px solid ${active ? 'rgba(135, 206, 235, 0.3)' : 'rgba(255, 255, 255, 0.1)'}`,
            boxShadow: active ? "0 20px 48px rgba(27,58,95,0.25)" : "none",
          }}
        >
          <div>
            <span className="inline-block text-xs font-semibold tracking-widest mb-4 px-3 py-1 rounded-full text-white" style={{ background: JP.orange }}>
              {block.label}
            </span>
            <h2 className="text-4xl md:text-5xl font-extrabold leading-tight">{block.title}</h2>
            <p className="mt-4 text-sky-100 text-base md:text-lg">{block.copy}</p>

            <div className="mt-8 flex flex-wrap gap-4">
              {block.cta.map((btn, i) => (
                <a
                  key={btn.href} // Use a more unique key if possible, but href is fine here
                  href={btn.href}
                  className={`rounded-full px-5 py-3 font-semibold transition-all ${
                    i === 0 ? "text-white hover:scale-105" : "text-white hover:bg-white/10"
                  }`}
                  style={
                    i === 0
                      ? { background: JP.orange, boxShadow: "0 8px 24px rgba(255,107,53,0.35)" }
                      : { border: "2px solid rgba(255,255,255,0.3)" }
                  }
                >
                  {btn.label}
                </a>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-center">
            <div className="w-full">
              <h3 className="text-2xl md:text-3xl font-bold mb-6">
                {index % 2 === 1 ? "We'll Help You:" : "With JoltQ, You Can:"}
              </h3>
              <ul className="space-y-4">
                {block.bullets.map((point, i) => (
                  <li
                    key={i} // Index as key is fine for a static list
                    className="border-t pt-3 text-sky-100 text-base"
                    style={{ borderColor: "rgba(135, 206, 235, 0.25)" }}
                  >
                    {point}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="pointer-events-none absolute inset-0 flex items-center justify-center text-[16rem] md:text-[20rem] font-extrabold select-none" style={{ color: "rgba(255, 255, 255, 0.04)" }}>
            {block.number}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ===== SMALL PRESENTATIONAL COMPONENTS ===== */
function Metric({ kpi, label }: { kpi: string; label: string }) {
  return (
    <div>
      <div className="text-4xl font-extrabold" style={{ color: JP.navy }}>{kpi}</div>
      <div className="mt-1 text-slate-600">{label}</div>
    </div>
  );
}

function Quote({ quote, name, title }: { quote: string; name: string; title: string }) {
  return (
    <figure className="rounded-2xl border bg-white p-6 shadow-lg" style={{ borderColor: JP.skyBlue }}>
      <blockquote className="text-lg" style={{ color: JP.navy }}>"{quote}"</blockquote>
      <figcaption className="mt-3 text-sm text-slate-600">
        <span className="font-semibold" style={{ color: JP.navy }}>{name}</span> — {title}
      </figcaption>
    </figure>
  );
}