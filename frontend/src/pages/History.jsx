import { CalendarDays, FileText } from "lucide-react";
import { useEffect, useState } from "react";
import { analysisApi } from "../api/client.js";
import EmptyState from "../components/EmptyState.jsx";
import GlassCard from "../components/GlassCard.jsx";
import PageHeader from "../components/PageHeader.jsx";
import SkillPill from "../components/SkillPill.jsx";
import { formatDate, setLatestAnalysis } from "../utils/formatters.js";

export default function History() {
  const [items, setItems] = useState([]);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    analysisApi
      .history()
      .then(({ data }) => {
        setItems(data);
        setSelected(data[0] || null);
        if (data[0]) setLatestAnalysis(data[0]);
      })
      .catch(() => {});
  }, []);

  return (
    <>
      <PageHeader
        eyebrow="History"
        title="Previous Resume Analyses"
        description="Review saved reports from the MySQL-backed analysis history."
      />

      {items.length ? (
        <div className="grid gap-5 lg:grid-cols-[.9fr_1.1fr]">
          <GlassCard>
            <div className="space-y-3">
              {items.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setSelected(item);
                    setLatestAnalysis(item);
                  }}
                  className={`w-full rounded-2xl border p-4 text-left transition ${
                    selected?.id === item.id ? "border-mint/50 bg-mint/10" : "border-white/10 bg-white/[0.04] hover:bg-white/[0.07]"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-mint" />
                    <p className="font-semibold">{item.resume_filename}</p>
                  </div>
                  <p className="mt-2 flex items-center gap-2 text-xs text-white/40">
                    <CalendarDays className="h-4 w-4" />
                    {formatDate(item.created_at)}
                  </p>
                </button>
              ))}
            </div>
          </GlassCard>

          <GlassCard>
            <h2 className="text-2xl font-bold">{selected?.resume_filename}</h2>
            <div className="mt-5 grid grid-cols-2 gap-4">
              <div className="rounded-2xl bg-mint/10 p-4">
                <p className="text-sm text-mint">ATS Score</p>
                <p className="mt-1 text-3xl font-bold">{selected?.ats_score}</p>
              </div>
              <div className="rounded-2xl bg-coral/10 p-4">
                <p className="text-sm text-coral">JD Match</p>
                <p className="mt-1 text-3xl font-bold">{selected?.match_result?.match_percentage || 0}%</p>
              </div>
            </div>
            <h3 className="mt-6 text-lg font-bold">Matched Skills</h3>
            <div className="mt-3 flex flex-wrap gap-2">
              {(selected?.match_result?.strong_matching_skills || []).map((skill) => (
                <SkillPill key={skill} variant="match">{skill}</SkillPill>
              ))}
            </div>
            <h3 className="mt-6 text-lg font-bold">Resume Improvements</h3>
            <div className="mt-3 space-y-3">
              {(selected?.suggestions?.resume_improvements || []).map((item) => (
                <p key={item} className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-sm leading-6 text-white/60">
                  {item}
                </p>
              ))}
            </div>
          </GlassCard>
        </div>
      ) : (
        <EmptyState title="No saved analyses" description="Your completed reports will appear here after running a resume analysis." />
      )}
    </>
  );
}
