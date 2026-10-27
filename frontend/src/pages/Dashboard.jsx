import { BrainCircuit, History, Sparkles, Target } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import ChartPanel from "../components/ChartPanel.jsx";
import { BarChart, DoughnutChart, RadarChart } from "../components/Charts.jsx";
import EmptyState from "../components/EmptyState.jsx";
import MetricCard from "../components/MetricCard.jsx";
import PageHeader from "../components/PageHeader.jsx";
import { analysisApi } from "../api/client.js";
import { demoAnalysis } from "../data/navigation.js";
import { formatDate, getLatestAnalysis, setLatestAnalysis } from "../utils/formatters.js";

export default function Dashboard() {
  const [history, setHistory] = useState([]);
  const [latest, setLatest] = useState(() => getLatestAnalysis() || demoAnalysis);

  useEffect(() => {
    analysisApi
      .history()
      .then(({ data }) => {
        setHistory(data);
        if (data[0]) {
          setLatest(data[0]);
          setLatestAnalysis(data[0]);
        }
      })
      .catch(() => {});
  }, []);

  const metrics = useMemo(() => {
    const match = latest?.match_result || {};
    return [
      { label: "ATS Score", value: latest?.ats_score || 0, detail: "Weighted resume score", icon: BrainCircuit, tone: "mint" },
      { label: "JD Match", value: `${match.match_percentage || 0}%`, detail: "Resume to role alignment", icon: Target, tone: "coral" },
      { label: "Saved Analyses", value: history.length || "Demo", detail: "Recent reports in database", icon: History, tone: "amber" },
      {
        label: "Skill Gaps",
        value: match.missing_skills?.length || 0,
        detail: "Missing target skills",
        icon: Sparkles,
        tone: "sky"
      }
    ];
  }, [latest, history.length]);

  return (
    <>
      <PageHeader
        eyebrow="Command Center"
        title="AI Resume Intelligence Dashboard"
        description="A polished workspace for resume parsing, job matching, ATS scoring, interview preparation, and portfolio analytics."
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => (
          <MetricCard key={metric.label} {...metric} />
        ))}
      </div>

      <div className="mt-6 grid gap-4 xl:grid-cols-3">
        <ChartPanel title="ATS Score Breakdown" subtitle="Weighted resume quality signals">
          <RadarChart dataMap={latest?.score_breakdown || demoAnalysis.score_breakdown} />
        </ChartPanel>
        <ChartPanel title="Skill Distribution" subtitle="Detected skills by portfolio category">
          <DoughnutChart dataMap={latest?.match_result?.skill_distribution || demoAnalysis.match_result.skill_distribution} />
        </ChartPanel>
        <ChartPanel title="JD Match Analysis" subtitle="Project and role alignment categories">
          <BarChart dataMap={latest?.match_result?.project_category_analysis || demoAnalysis.match_result.project_category_analysis} />
        </ChartPanel>
      </div>

      <div className="mt-6">
        {history.length ? (
          <div className="glass rounded-2xl p-5">
            <h2 className="text-xl font-bold">Recent Analyses</h2>
            <div className="mt-4 divide-y divide-white/10">
              {history.slice(0, 5).map((item) => (
                <div key={item.id} className="flex flex-col gap-2 py-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="font-semibold text-white">{item.resume_filename}</p>
                    <p className="text-sm text-white/40">{formatDate(item.created_at)}</p>
                  </div>
                  <div className="flex gap-2 text-sm">
                    <span className="rounded-full bg-mint/10 px-3 py-1 text-mint">ATS {item.ats_score}</span>
                    <span className="rounded-full bg-coral/10 px-3 py-1 text-coral">
                      Match {item.match_result?.match_percentage || 0}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <EmptyState
            title="Demo analytics are loaded"
            description="Run your first resume analysis to replace the sample dashboard with live MySQL-backed results."
          />
        )}
      </div>
    </>
  );
}
