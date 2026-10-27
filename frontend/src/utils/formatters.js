export function cx(...classes) {
  return classes.filter(Boolean).join(" ");
}

export function formatDate(value) {
  if (!value) return "Not available";
  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(new Date(value));
}

export function apiError(error, fallback = "Something went wrong. Please try again.") {
  const detail = error?.response?.data?.detail;
  if (typeof detail === "string") return detail;

  if (Array.isArray(detail)) {
    const messages = detail
      .map((item) => (typeof item === "string" ? item : item?.msg))
      .filter((message) => typeof message === "string");
    if (messages.length) return messages.join(" ");
  }

  return error?.message || fallback;
}

export function getLatestAnalysis() {
  const cached = localStorage.getItem("hiresense_latest_analysis");
  return cached ? JSON.parse(cached) : null;
}

export function setLatestAnalysis(analysis) {
  localStorage.setItem("hiresense_latest_analysis", JSON.stringify(analysis));
}
