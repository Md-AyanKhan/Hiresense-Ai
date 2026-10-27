import { motion } from "framer-motion";
import { ArrowRight, Bot, BrainCircuit, ChartNoAxesCombined, Github, ShieldCheck, UploadCloud } from "lucide-react";
import { Link } from "react-router-dom";
import Button from "../components/Button.jsx";
import GlassCard from "../components/GlassCard.jsx";
import { developer } from "../data/navigation.js";

function HeroScene() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-app-radial" />
      <div className="absolute inset-0 premium-grid opacity-35" />
      <motion.div
        animate={{ y: [0, -16, 0], rotate: [0, 0.8, 0] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
        className="absolute right-[-60px] top-24 hidden w-[620px] rounded-[2rem] border border-white/10 bg-[#0d1a22]/80 p-5 shadow-panel backdrop-blur-xl lg:block"
      >
        <div className="grid grid-cols-[1.1fr_.9fr] gap-4">
          <div className="rounded-2xl bg-white/[0.055] p-4">
            <div className="h-3 w-28 rounded-full bg-mint/80" />
            <div className="mt-5 space-y-3">
              {[90, 74, 62, 82].map((width, index) => (
                <div key={width} className="h-3 rounded-full bg-white/10">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${width}%` }}
                    transition={{ duration: 1.2, delay: index * 0.2 }}
                    className="h-full rounded-full bg-mint"
                  />
                </div>
              ))}
            </div>
            <div className="mt-5 grid grid-cols-3 gap-3">
              {["ATS", "JD", "AI"].map((label) => (
                <div key={label} className="rounded-xl border border-white/10 bg-white/[0.04] p-3 text-center">
                  <p className="text-xs text-white/40">{label}</p>
                  <p className="text-lg font-bold text-white">{label === "ATS" ? "84" : label === "JD" ? "78%" : "12"}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-4">
            <div className="rounded-2xl bg-coral/10 p-4">
              <p className="text-sm font-semibold text-coral">Missing Skills</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {["Docker", "AWS", "NLP"].map((skill) => (
                  <span key={skill} className="rounded-full bg-coral/10 px-3 py-1 text-xs text-coral">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
            <div className="rounded-2xl bg-amber/10 p-4">
              <p className="text-sm font-semibold text-amber">Interview Set</p>
              <p className="mt-2 text-2xl font-bold">36 questions</p>
            </div>
            <div className="rounded-2xl bg-sky/10 p-4">
              <p className="text-sm font-semibold text-sky">Analytics</p>
              <div className="mt-3 h-16 rounded-xl bg-gradient-to-r from-sky/30 via-mint/30 to-coral/30" />
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default function LandingPage() {
  const modules = [
    { icon: UploadCloud, title: "Resume Parsing", text: "PDF and DOCX extraction with clean candidate profiling." },
    { icon: ChartNoAxesCombined, title: "JD Matching", text: "Semantic match score, missing skills, and keyword gaps." },
    { icon: BrainCircuit, title: "ATS Intelligence", text: "Resume score breakdown with targeted improvement signals." },
    { icon: Bot, title: "Interview Assistant", text: "HR, technical, SQL, Python, and project-based preparation." }
  ];

  return (
    <div className="min-h-screen bg-ink text-white">
      <section className="relative flex min-h-[92vh] items-center overflow-hidden px-4 py-10 md:px-8">
        <HeroScene />
        <nav className="absolute left-4 right-4 top-5 z-10 mx-auto flex max-w-7xl items-center justify-between rounded-2xl border border-white/10 bg-[#071016]/70 px-4 py-3 backdrop-blur-xl md:left-8 md:right-8">
          <Link to="/" className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-mint font-black text-ink">H</span>
            <span className="font-bold">HireSense AI</span>
          </Link>
          <div className="flex items-center gap-2">
            <Link to="/about" className="hidden rounded-xl px-4 py-2 text-sm text-white/70 hover:bg-white/10 md:inline-flex">
              About
            </Link>
            <Link to="/login" className="rounded-xl px-4 py-2 text-sm text-white/70 hover:bg-white/10">
              Login
            </Link>
            <Link to="/signup">
              <Button className="px-4">Start</Button>
            </Link>
          </div>
        </nav>

        <div className="relative z-10 mx-auto mt-20 w-full max-w-7xl">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <p className="mb-5 inline-flex rounded-full border border-mint/25 bg-mint/10 px-4 py-2 text-sm font-semibold text-mint">
              Full-stack AI portfolio project by {developer.name}
            </p>
            <h1 className="max-w-4xl text-5xl font-black leading-[1.02] text-white md:text-7xl">HireSense AI</h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-white/70 md:text-xl">
              A premium resume analyzer and interview preparation assistant built with React, FastAPI, MySQL, JWT,
              spaCy, scikit-learn, sentence-transformers, and modern NLP workflows.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link to="/signup">
                <Button icon={ArrowRight} className="w-full sm:w-auto">
                  Launch Dashboard
                </Button>
              </Link>
              <a href="https://github.com/" target="_blank" rel="noreferrer">
                <Button variant="secondary" icon={Github} className="w-full sm:w-auto">
                  GitHub Ready
                </Button>
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="relative z-10 mx-auto grid max-w-7xl gap-4 px-4 pb-16 md:grid-cols-4 md:px-8">
        {modules.map((module, index) => {
          const Icon = module.icon;
          return (
            <GlassCard key={module.title} delay={index * 0.06} className="min-h-[190px]">
              <Icon className="h-7 w-7 text-mint" />
              <h2 className="mt-5 text-lg font-bold">{module.title}</h2>
              <p className="mt-3 text-sm leading-6 text-white/60">{module.text}</p>
            </GlassCard>
          );
        })}
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-16 md:px-8">
        <div className="rounded-3xl border border-white/10 bg-white/[0.045] p-6 md:p-8">
          <div className="grid gap-6 md:grid-cols-[1fr_auto] md:items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber">Portfolio signal</p>
              <h2 className="mt-3 text-2xl font-bold md:text-3xl">Built for internship-ready GitHub presentation.</h2>
              <p className="mt-3 max-w-3xl text-sm leading-6 text-white/60">
                Includes modular source code, database schema, API documentation, sample data, environment templates,
                and screenshot placeholders for a polished repository.
              </p>
            </div>
            <ShieldCheck className="h-16 w-16 text-mint" />
          </div>
        </div>
      </section>
    </div>
  );
}
