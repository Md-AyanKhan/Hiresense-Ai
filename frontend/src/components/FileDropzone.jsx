import { FileText, UploadCloud } from "lucide-react";
import { useRef } from "react";

export default function FileDropzone({ file, onFileChange }) {
  const inputRef = useRef(null);

  return (
    <button
      type="button"
      onClick={() => inputRef.current?.click()}
      className="group flex min-h-[190px] w-full flex-col items-center justify-center rounded-2xl border border-dashed border-white/20 bg-white/[0.045] p-6 text-center transition hover:border-mint/60 hover:bg-mint/10"
    >
      <input
        ref={inputRef}
        type="file"
        accept=".pdf,.docx"
        className="hidden"
        onChange={(event) => onFileChange(event.target.files?.[0] || null)}
      />
      <div className="rounded-2xl bg-mint/10 p-4 text-mint">
        {file ? <FileText className="h-8 w-8" /> : <UploadCloud className="h-8 w-8" />}
      </div>
      <p className="mt-4 text-base font-semibold text-white">{file ? file.name : "Upload PDF or DOCX resume"}</p>
      <p className="mt-2 max-w-sm text-sm leading-6 text-white/50">PDF and DOCX files up to 8MB are accepted.</p>
    </button>
  );
}
