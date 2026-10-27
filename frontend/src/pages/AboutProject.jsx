import { ArrowLeft, Database, Lock, Server, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import Button from "../components/Button.jsx";
import GlassCard from "../components/GlassCard.jsx";
import { developer } from "../data/navigation.js";

export default function AboutProject() {
  const stack = [
    ["Frontend", "React.js, Tailwind CSS, Framer Motion, Chart.js, lucide-react"],
    ["Backend", "FastAPI, SQLAlchemy, JWT auth, modular service layer"],
    ["Database", "MySQL schema for users, analyses, history, admin stats"],
    ["AI/NLP", "spaCy-ready parsing, scikit-learn TF-IDF, sentence-transformers fallback flow"]
  ];

  return (
    <div className="min-h-screen bg-ink bg-app-radial px-4 py-8 text-white md:px-8">
      <div className="mx-auto max-w-6xl">
        <Link to="/">
          <Button variant="secondary" icon={ArrowLeft}>Back</Button>
        </Link>
        <div className="mt-10 grid gap-8 md:grid-cols-[1.1fr_.9fr]">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-mint">About Project</p>
            <h1 className="mt-4 text-4xl font-black md:text-6xl">HireSense AI</h1>
            <p className="mt-6 text-lg leading-8 text-white/60">
              HireSense AI is a full-stack AI project designed as a production-style portfolio build for resume parsing,
              ATS scoring, job-description matching, interview preparation, chatbot guidance, analytics, history, and
              admin usage views.
            </p>
            <div className="mt-8 rounded-2xl border border-white/10 bg-white/[0.045] p-5">
              <p className="text-sm text-white/50">Developer</p>
              <h2 className="mt-1 text-2xl font-bold">{developer.name}</h2>
              <p className="mt-2 text-white/60">{developer.role}</p>
              <p className="mt-2 text-white/60">{developer.email} | {developer.phone}</p>
            </div>
          </div>
          <GlassCard>
            <div className="grid grid-cols-2 gap-4">
              {[Sparkles, Server, Database, Lock].map((Icon, index) => (
                <div key={index} className="rounded-2xl border border-white/10 bg-white/[0.045] p-5">
                  <Icon className="h-7 w-7 text-mint" />
                  <div className="mt-5 text-3xl font-black">{["AI", "API", "SQL", "JWT"][index]}</div>
                  <p className="mt-1 text-sm text-white/40">Production module</p>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-2">
          {stack.map(([title, text]) => (
            <GlassCard key={title}>
              <h2 className="text-xl font-bold text-white">{title}</h2>
              <p className="mt-3 text-sm leading-6 text-white/60">{text}</p>
            </GlassCard>
          ))}
        </div>
      </div>
    </div>
  );
}
