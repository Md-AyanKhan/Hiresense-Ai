import { BrainCircuit } from "lucide-react";
import { useState } from "react";
import { analysisApi } from "../api/client.js";
import AnalysisResult from "../components/AnalysisResult.jsx";
import Button from "../components/Button.jsx";
import FileDropzone from "../components/FileDropzone.jsx";
import GlassCard from "../components/GlassCard.jsx";
import PageHeader from "../components/PageHeader.jsx";
import { apiError, setLatestAnalysis } from "../utils/formatters.js";

const sampleJD =
  "We are hiring a Data Science Intern with strong Python, SQL, machine learning, data visualization, pandas, scikit-learn, model evaluation, REST API exposure, and dashboard-building experience.";

export default function ResumeUpload() {
  const [file, setFile] = useState(null);
  const [jobDescription, setJobDescription] = useState(sampleJD);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleAnalyze = async (event) => {
    event.preventDefault();
    if (!file) {
      setError("Please upload a PDF or DOCX resume.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const { data } = await analysisApi.analyze(file, jobDescription);
      setResult(data);
      setLatestAnalysis(data);
    } catch (err) {
      setError(apiError(err, "Resume analysis failed."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <PageHeader
        eyebrow="Resume Analyzer"
        title="Upload Resume & Generate ATS Report"
        description="Parse the resume, compare it with a target role, calculate an ATS-style score, and save the report to history."
      />

      <form onSubmit={handleAnalyze} className="grid gap-5 lg:grid-cols-[.9fr_1.1fr]">
        <GlassCard>
          <FileDropzone file={file} onFileChange={setFile} />
        </GlassCard>
        <GlassCard>
          <label className="text-sm font-semibold text-white/80">Job Description</label>
          <textarea
            className="field mt-3 min-h-[190px] resize-y"
            value={jobDescription}
            onChange={(event) => setJobDescription(event.target.value)}
            minLength={20}
            required
          />
          {error ? <p className="mt-4 rounded-xl bg-coral/10 px-4 py-3 text-sm text-coral">{error}</p> : null}
          <Button type="submit" icon={BrainCircuit} loading={loading} className="mt-5 w-full">
            Analyze Resume
          </Button>
        </GlassCard>
      </form>

      <AnalysisResult result={result} />
    </>
  );
}
