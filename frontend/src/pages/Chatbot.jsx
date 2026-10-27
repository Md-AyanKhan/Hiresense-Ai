import { Bot, Send, UserRound } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { chatbotApi } from "../api/client.js";
import Button from "../components/Button.jsx";
import GlassCard from "../components/GlassCard.jsx";
import PageHeader from "../components/PageHeader.jsx";
import { apiError, getLatestAnalysis } from "../utils/formatters.js";

export default function Chatbot() {
  const latest = getLatestAnalysis();
  const conversationRef = useRef([]);
  const chatWindowRef = useRef(null);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      text: "I can help improve your resume, generate interview questions, or suggest stronger data science projects."
    }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const chatWindow = chatWindowRef.current;
    if (chatWindow) {
      chatWindow.scrollTo({ top: chatWindow.scrollHeight, behavior: "smooth" });
    }
  }, [messages, loading, error]);

  const sendMessage = async (messageText) => {
    const text = messageText.trim();
    if (!text || loading) return;
    setInput("");
    setError("");
    setMessages((prev) => [...prev, { role: "user", text }]);
    setLoading(true);
    try {
      const { data } = await chatbotApi.message({
        message: text,
        context: latest || {},
        history: conversationRef.current
          .slice(-10)
          .map(({ role, text: content }) => ({ role, content: content.slice(0, 12000) }))
      });
      if (typeof data.answer !== "string" || !data.answer.trim()) {
        throw new Error("The chatbot returned an empty answer. Please try again.");
      }
      conversationRef.current = [
        ...conversationRef.current,
        { role: "user", text },
        { role: "assistant", text: data.answer }
      ].slice(-10);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: data.answer,
          prompts: Array.isArray(data.suggested_prompts)
            ? data.suggested_prompts.filter((suggestion) => typeof suggestion === "string" && suggestion.trim())
            : []
        }
      ]);
    } catch (err) {
      const errorMessage = apiError(err, "Chatbot request failed.");
      setError(errorMessage);
      setMessages((prev) => [...prev, { role: "assistant", text: errorMessage, isError: true }]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    void sendMessage(input);
  };

  const handleSuggestedPrompt = (prompt) => {
    void sendMessage(prompt);
  };

  return (
    <>
      <PageHeader
        eyebrow="AI Chatbot"
        title="Resume & Interview Coach"
        description="Ask HireSense anything, or get resume and interview coaching. Your message and detected skills are sent to Groq; contact details and raw resume text are not."
      />
      <GlassCard className="mx-auto max-w-4xl">
        <div ref={chatWindowRef} className="h-[58vh] min-h-[420px] space-y-5 overflow-y-auto pr-2">
          {messages.map((message, index) => (
            <div key={`${message.role}-${index}`} className={`flex gap-3 ${message.role === "user" ? "justify-end" : ""}`}>
              {message.role === "assistant" ? (
                <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-mint/10 text-mint">
                  <Bot className="h-5 w-5" />
                </div>
              ) : null}
              <div
                className={`min-w-0 max-w-[88%] rounded-2xl px-4 py-3 text-sm leading-6 sm:max-w-[82%] ${
                  message.role === "user"
                    ? "bg-mint text-ink"
                    : message.isError
                      ? "border border-coral/30 bg-coral/10 text-coral"
                      : "border border-white/10 bg-white/[0.05] text-white/70"
                }`}
              >
                {message.isError ? (
                  <p>{message.text}</p>
                ) : message.role === "assistant" ? (
                  <div className="chat-markdown">
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      components={{
                        h1: ({ children }) => <h2 className="mb-2 mt-4 text-base font-semibold text-white first:mt-0">{children}</h2>,
                        h2: ({ children }) => <h2 className="mb-2 mt-4 text-base font-semibold text-white first:mt-0">{children}</h2>,
                        h3: ({ children }) => <h3 className="mb-2 mt-3 font-semibold text-white">{children}</h3>,
                        p: ({ children }) => <p className="mb-3 last:mb-0">{children}</p>,
                        ul: ({ children }) => <ul className="mb-3 list-disc space-y-1 pl-5 last:mb-0">{children}</ul>,
                        ol: ({ children }) => <ol className="mb-3 list-decimal space-y-1 pl-5 last:mb-0">{children}</ol>,
                        li: ({ children }) => <li className="pl-1">{children}</li>,
                        strong: ({ children }) => <strong className="font-semibold text-white">{children}</strong>,
                        pre: ({ children }) => <pre className="my-3 overflow-x-auto rounded-lg bg-black/30 p-3 text-xs">{children}</pre>,
                        code: ({ children, className }) =>
                          className ? (
                            <code className={className}>{children}</code>
                          ) : (
                            <code className="rounded bg-white/10 px-1 py-0.5 text-mint">{children}</code>
                          ),
                        blockquote: ({ children }) => <blockquote className="my-3 border-l-2 border-mint/50 pl-3 text-white/60">{children}</blockquote>,
                        table: ({ children }) => (
                          <div className="my-3 max-w-full overflow-x-auto">
                            <table className="w-full border-collapse text-left text-xs">{children}</table>
                          </div>
                        ),
                        th: ({ children }) => <th className="border border-white/10 bg-white/[0.06] px-3 py-2 font-semibold text-white">{children}</th>,
                        td: ({ children }) => <td className="border border-white/10 px-3 py-2 align-top">{children}</td>
                      }}
                    >
                      {message.text}
                    </ReactMarkdown>
                  </div>
                ) : (
                  <p className="whitespace-pre-wrap break-words">{message.text}</p>
                )}
                {message.role === "assistant" && !message.isError && message.prompts?.length ? (
                  <div className="mt-4 flex flex-wrap gap-2 border-t border-white/10 pt-3">
                    {message.prompts.map((prompt) => (
                      <button
                        key={prompt}
                        type="button"
                        onClick={() => handleSuggestedPrompt(prompt)}
                        disabled={loading}
                        className="rounded-full border border-white/10 bg-white/[0.045] px-3 py-2 text-xs text-white/60 transition hover:border-mint/40 hover:text-mint disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {prompt}
                      </button>
                    ))}
                  </div>
                ) : null}
              </div>
              {message.role === "user" ? (
                <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-coral/10 text-coral">
                  <UserRound className="h-5 w-5" />
                </div>
              ) : null}
            </div>
          ))}
          {loading ? <p className="text-sm text-mint">Thinking...</p> : null}
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          {["How do I improve my resume?", "Ask me Python interview questions", "What projects should I add?"].map((prompt) => (
            <button
              key={prompt}
              type="button"
              onClick={() => handleSuggestedPrompt(prompt)}
              disabled={loading}
              className="rounded-full border border-white/10 bg-white/[0.045] px-3 py-2 text-xs text-white/60 transition hover:border-mint/40 hover:text-mint"
            >
              {prompt}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="mt-4 flex gap-3">
          <input
            className="field"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder="Ask anything—for example, explain APIs or review my resume..."
            aria-label="Your message to HireSense AI"
            minLength={2}
            maxLength={1200}
            disabled={loading}
          />
          <Button type="submit" icon={Send} loading={loading} disabled={loading || input.trim().length < 2}>
            Send
          </Button>
        </form>
        {error ? <p role="alert" className="mt-4 rounded-xl bg-coral/10 px-4 py-3 text-sm text-coral">{error}</p> : null}
      </GlassCard>
    </>
  );
}
