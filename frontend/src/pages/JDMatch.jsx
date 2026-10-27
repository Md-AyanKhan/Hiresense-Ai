import { Target } from "lucide-react";
import { useState } from "react";
import { analysisApi } from "../api/client.js";
import AnalysisResult from "../components/AnalysisResult.jsx";
import Button from "../components/Button.jsx";
import GlassCard from "../components/GlassCard.jsx";
import PageHeader from "../components/PageHeader.jsx";
import { apiError, getLatestAnalysis, setLatestAnalysis } from "../utils/formatters.js";

export default function JDMatch() {
  const latest = getLatestAnalysis();
  const [resumeText, setResumeText] = useState(latest?.raw_text || "");
  const [jobDescription, setJobDescription] = useState(latest?.job_description || "");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      const { data } = await analysisApi.match({
        resume_text: resumeText,
        job_description: jobDescription,
        extracted_data: latest?.extracted_data || null
      });
      setResult(data);
      setLatestAnalysis(data);
    } catch (err) {
      setError(apiError(err, "Could not calculate match score."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <PageHeader
        eyebrow="JD Match"
        title="Compare Resume Against a Job Description"
        description="Run semantic matching, missing skill detection, and keyword gap analysis without re-uploading a file."
      />
      <form onSubmit={handleSubmit} className="grid gap-5 xl:grid-cols-2">
        <GlassCard>
          <label className="text-sm font-semibold text-white/80">Resume Text</label>
          <textarea
            className="field mt-3 min-h-[330px]"
            value={resumeText}
            onChange={(event) => setResumeText(event.target.value)}
            placeholder="Paste resume text"
            required
            minLength={20}
          />
        </GlassCard>
        <GlassCard>
          <label className="text-sm font-semibold text-white/80">Job Description</label>
          <textarea
            className="field mt-3 min-h-[330px]"
            value={jobDescription}
            onChange={(event) => setJobDescription(event.target.value)}
            placeholder="Paste job description"
            required
            minLength={20}
          />
          {error ? <p className="mt-4 rounded-xl bg-coral/10 px-4 py-3 text-sm text-coral">{error}</p> : null}
          <Button type="submit" icon={Target} loading={loading} className="mt-5 w-full">
            Calculate Match
          </Button>
        </GlassCard>
      </form>
      <AnalysisResult result={result} />
    </>
  );
}
