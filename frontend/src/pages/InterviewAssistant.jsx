import { ClipboardList, RefreshCcw } from "lucide-react";
import { useEffect, useState } from "react";
import { interviewApi } from "../api/client.js";
import Button from "../components/Button.jsx";
import EmptyState from "../components/EmptyState.jsx";
import GlassCard from "../components/GlassCard.jsx";
import PageHeader from "../components/PageHeader.jsx";
import { apiError, getLatestAnalysis } from "../utils/formatters.js";

const labels = {
  hr_questions: "HR Questions",
  technical_questions: "Technical Questions",
  project_based_questions: "Project-Based Questions",
  sql_questions: "SQL Questions",
  python_questions: "Python Questions",
  data_science_ml_questions: "Data Science / ML Questions"
};

export default function InterviewAssistant() {
  const latest = getLatestAnalysis();
  const [questions, setQuestions] = useState(latest?.interview_questions || null);
  const [focusArea, setFocusArea] = useState("all");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (latest?.interview_questions) setQuestions(latest.interview_questions);
  }, []);

  const generate = async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await interviewApi.generate({
        extracted_data: latest?.extracted_data || null,
        focus_area: focusArea
      });
      setQuestions(data);
    } catch (err) {
      setError(apiError(err, "Could not generate interview questions."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <PageHeader
        eyebrow="Interview Assistant"
        title="Role-Specific Interview Preparation"
        description="Generate HR, technical, project, SQL, Python, and data science questions from the candidate profile."
        action={
          <Button icon={RefreshCcw} loading={loading} onClick={generate}>
            Generate Set
          </Button>
        }
      />

      <GlassCard className="mb-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-lg font-bold">Question Focus</h2>
            <p className="mt-1 text-sm text-white/50">Choose a category before generating a fresh set.</p>
          </div>
          <select className="field max-w-xs" value={focusArea} onChange={(event) => setFocusArea(event.target.value)}>
            <option value="all">All</option>
            <option value="hr">HR</option>
            <option value="technical">Technical</option>
            <option value="project">Project</option>
            <option value="sql">SQL</option>
            <option value="python">Python</option>
            <option value="data_science_ml">Data Science / ML</option>
          </select>
        </div>
        {error ? <p className="mt-4 rounded-xl bg-coral/10 px-4 py-3 text-sm text-coral">{error}</p> : null}
      </GlassCard>

      {questions ? (
        <div className="grid gap-5 xl:grid-cols-2">
          {Object.entries(questions).map(([key, values]) => (
            <GlassCard key={key}>
              <div className="flex items-center gap-3">
                <ClipboardList className="h-5 w-5 text-mint" />
                <h3 className="text-lg font-bold">{labels[key] || key}</h3>
              </div>
              <ol className="mt-5 space-y-3">
                {(values || []).map((question, index) => (
                  <li key={question} className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-sm leading-6 text-white/70">
                    <span className="mr-2 font-bold text-mint">{index + 1}.</span>
                    {question}
                  </li>
                ))}
              </ol>
            </GlassCard>
          ))}
        </div>
      ) : (
        <EmptyState
          title="No interview set yet"
          description="Run a resume analysis or generate a question set from the latest extracted profile."
        />
      )}
    </>
  );
}
