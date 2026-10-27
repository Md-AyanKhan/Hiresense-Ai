import ChartPanel from "./ChartPanel.jsx";
import { BarChart, DoughnutChart, RadarChart } from "./Charts.jsx";
import GlassCard from "./GlassCard.jsx";
import ScoreRing from "./ScoreRing.jsx";
import SkillPill from "./SkillPill.jsx";

export default function AnalysisResult({ result }) {
  if (!result) return null;

  const extracted = result.extracted_data || {};
  const match = result.match_result || {};
  const suggestions = result.suggestions || {};

  return (
    <div className="mt-8 space-y-6">
      <div className="grid gap-4 lg:grid-cols-[.8fr_1.2fr]">
        <GlassCard>
          <div className="flex flex-col items-center text-center">
            <ScoreRing value={result.ats_score} label="ATS" />
            <h2 className="mt-5 text-xl font-bold">{extracted.name || "Candidate"}</h2>
            <p className="mt-2 text-sm text-white/50">
              JD Match: <span className="font-semibold text-mint">{match.match_percentage || 0}%</span>
            </p>
          </div>
        </GlassCard>

        <GlassCard>
          <h2 className="text-xl font-bold">Extracted Candidate Profile</h2>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <InfoBlock title="Contact" items={Object.values(extracted.contact || {}).filter(Boolean)} />
            <InfoBlock title="Education" items={extracted.education || []} />
            <InfoBlock title="Experience" items={extracted.experience || []} />
            <InfoBlock title="Certifications" items={extracted.certifications || []} />
          </div>
        </GlassCard>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <ChartPanel title="ATS Score Breakdown">
          <RadarChart dataMap={result.score_breakdown || {}} />
        </ChartPanel>
        <ChartPanel title="Skill Distribution">
          <DoughnutChart dataMap={match.skill_distribution || {}} />
        </ChartPanel>
        <ChartPanel title="Project Categories">
          <BarChart dataMap={match.project_category_analysis || {}} />
        </ChartPanel>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <GlassCard>
          <h3 className="text-lg font-bold">Strong Matching Skills</h3>
          <div className="mt-4 flex flex-wrap gap-2">
            {(match.strong_matching_skills || []).map((skill) => (
              <SkillPill key={skill} variant="match">{skill}</SkillPill>
            ))}
          </div>
        </GlassCard>
        <GlassCard>
          <h3 className="text-lg font-bold">Missing Skills</h3>
          <div className="mt-4 flex flex-wrap gap-2">
            {(match.missing_skills || []).map((skill) => (
              <SkillPill key={skill} variant="missing">{skill}</SkillPill>
            ))}
          </div>
        </GlassCard>
        <GlassCard>
          <h3 className="text-lg font-bold">Keyword Gaps</h3>
          <div className="mt-4 flex flex-wrap gap-2">
            {(match.keyword_gap_analysis || []).map((keyword) => (
              <SkillPill key={keyword} variant="keyword">{keyword}</SkillPill>
            ))}
          </div>
        </GlassCard>
      </div>

      <GlassCard>
        <h3 className="text-xl font-bold">AI Resume Suggestions</h3>
        <p className="mt-4 rounded-2xl border border-mint/20 bg-mint/10 p-4 text-sm leading-6 text-white/75">
          {suggestions.better_summary_statement}
        </p>
        <div className="mt-5 grid gap-3 md:grid-cols-2">
          {(suggestions.resume_improvements || []).map((item) => (
            <div key={item} className="rounded-2xl border border-white/10 bg-white/[0.045] p-4 text-sm leading-6 text-white/60">
              {item}
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
}

function InfoBlock({ title, items }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
      <p className="text-sm font-semibold text-white/80">{title}</p>
      <div className="mt-3 space-y-2">
        {items.length ? (
          items.slice(0, 4).map((item) => (
            <p key={item} className="text-sm leading-5 text-white/50">
              {item}
            </p>
          ))
        ) : (
          <p className="text-sm text-white/40">Not detected</p>
        )}
      </div>
    </div>
  );
}
