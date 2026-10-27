import {
  BarChart3,
  Bot,
  BriefcaseBusiness,
  ClipboardList,
  FileUp,
  History,
  LayoutDashboard,
  Shield,
  UserRound
} from "lucide-react";

export const navigationItems = [
  { label: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { label: "Resume Upload", path: "/upload", icon: FileUp },
  { label: "JD Match", path: "/jd-match", icon: BriefcaseBusiness },
  { label: "Interview", path: "/interview", icon: ClipboardList },
  { label: "Chatbot", path: "/chatbot", icon: Bot },
  { label: "History", path: "/history", icon: History },
  { label: "Profile", path: "/profile", icon: UserRound },
  { label: "Admin", path: "/admin", icon: Shield, adminOnly: true }
];

export const chartColors = ["#4DE1C1", "#FF7A76", "#F6C85F", "#63B3FF", "#B8F7D4", "#F2A2E8"];

export const developer = {
  name: "Ayan Khan",
  phone: "7652078508",
  email: "ayankhanghosi@gmail.com",
  role: "BTech Computer Science"
};

export const demoAnalysis = {
  ats_score: 84,
  match_result: {
    match_percentage: 78,
    strong_matching_skills: ["Python", "SQL", "Machine Learning", "Pandas", "React", "FastAPI"],
    missing_skills: ["Docker", "AWS", "NLP"],
    keyword_gap_analysis: ["model deployment", "feature stores", "experimentation"],
    skill_distribution: {
      Programming: 3,
      "Data Science": 5,
      Libraries: 4,
      Web: 3,
      Database: 2,
      "Cloud & Tools": 2
    },
    project_category_analysis: {
      "AI/ML": 3,
      "Data Analytics": 2,
      "Web Apps": 2,
      Automation: 1,
      Other: 0
    }
  },
  score_breakdown: {
    skills_relevance: 29,
    keyword_presence: 19,
    resume_structure: 14,
    experience_strength: 12,
    project_quality: 10
  },
  suggestions: {
    better_summary_statement:
      "Data-focused computer science student skilled in Python, SQL, machine learning, and full-stack analytics systems.",
    resume_improvements: [
      "Quantify project impact with accuracy, latency, user, or data-volume metrics.",
      "Add deployment details for portfolio projects.",
      "Mirror the top job-description keywords naturally in the summary."
    ],
    skills_to_add: ["Docker", "AWS", "NLP"]
  },
  interview_questions: {
    hr_questions: ["Tell me about yourself and your target internship role."],
    technical_questions: ["How have you used Python in a real project?"],
    sql_questions: ["Explain window functions with an example."],
    python_questions: ["How do generators help process large datasets?"],
    data_science_ml_questions: ["Explain bias-variance tradeoff."]
  }
};
