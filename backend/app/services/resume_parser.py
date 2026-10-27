import re
from collections import OrderedDict
from typing import Any


SECTION_ALIASES = {
    "skills": ["skills", "technical skills", "core skills", "technologies", "tools"],
    "education": ["education", "academic background", "academics", "qualification"],
    "experience": ["experience", "work experience", "professional experience", "internship", "internships"],
    "projects": ["projects", "academic projects", "personal projects", "selected projects"],
    "certifications": ["certifications", "certificates", "courses", "achievements"],
    "summary": ["summary", "profile", "objective", "career objective", "about me"],
}

HEADING_WORDS = {alias for aliases in SECTION_ALIASES.values() for alias in aliases}

SKILL_ALIASES: dict[str, list[str]] = {
    "Python": ["python", "py"],
    "SQL": ["sql", "mysql", "postgresql", "sqlite"],
    "MySQL": ["mysql"],
    "PostgreSQL": ["postgresql", "postgres"],
    "Java": ["java"],
    "JavaScript": ["javascript", "js", "ecmascript"],
    "TypeScript": ["typescript", "ts"],
    "React": ["react", "react.js", "reactjs"],
    "Node.js": ["node.js", "nodejs", "node"],
    "FastAPI": ["fastapi"],
    "Flask": ["flask"],
    "Django": ["django"],
    "HTML": ["html", "html5"],
    "CSS": ["css", "css3"],
    "Tailwind CSS": ["tailwind", "tailwind css"],
    "Git": ["git", "github"],
    "Docker": ["docker"],
    "AWS": ["aws", "amazon web services"],
    "Azure": ["azure"],
    "GCP": ["gcp", "google cloud"],
    "Machine Learning": ["machine learning", "ml"],
    "Deep Learning": ["deep learning", "dl"],
    "Data Science": ["data science"],
    "Data Analysis": ["data analysis", "data analytics"],
    "NLP": ["nlp", "natural language processing"],
    "Computer Vision": ["computer vision", "opencv"],
    "Pandas": ["pandas"],
    "NumPy": ["numpy"],
    "scikit-learn": ["scikit-learn", "sklearn"],
    "TensorFlow": ["tensorflow"],
    "PyTorch": ["pytorch", "torch"],
    "Keras": ["keras"],
    "Matplotlib": ["matplotlib"],
    "Seaborn": ["seaborn"],
    "Power BI": ["power bi", "powerbi"],
    "Tableau": ["tableau"],
    "Excel": ["excel", "microsoft excel"],
    "Statistics": ["statistics", "statistical analysis"],
    "Regression": ["regression", "linear regression", "logistic regression"],
    "Classification": ["classification"],
    "Clustering": ["clustering", "k-means", "kmeans"],
    "EDA": ["eda", "exploratory data analysis"],
    "Feature Engineering": ["feature engineering"],
    "Model Deployment": ["model deployment", "deployment"],
    "REST API": ["rest api", "restful api", "api development"],
    "MongoDB": ["mongodb", "mongo"],
    "NoSQL": ["nosql"],
    "Linux": ["linux", "unix"],
    "C++": ["c++", "cpp"],
    "C": [" c ", "c language"],
    "C#": ["c#", "c sharp"],
    "R": [" r ", "r programming"],
}


def clean_text(text: str) -> str:
    text = text.replace("\x00", " ").replace("\u00a0", " ")
    text = re.sub(r"[ \t]+", " ", text)
    text = re.sub(r"\n{3,}", "\n\n", text)
    return text.strip()


def find_skills(text: str) -> list[str]:
    lowered = f" {clean_text(text).lower()} "
    found: OrderedDict[str, None] = OrderedDict()
    for canonical, aliases in SKILL_ALIASES.items():
        for alias in aliases:
            alias_lower = alias.lower()
            if re.search(rf"(?<![a-z0-9]){re.escape(alias_lower)}(?![a-z0-9])", lowered):
                found[canonical] = None
                break
    return list(found.keys())


def parse_resume_text(text: str) -> dict[str, Any]:
    cleaned = clean_text(text)
    lines = [line.strip(" -|\u2022\t") for line in cleaned.splitlines() if line.strip()]
    sections = {name: _extract_section(lines, aliases) for name, aliases in SECTION_ALIASES.items()}
    contact = _extract_contact(cleaned)
    skills = _merge_skills(sections.get("skills", []), find_skills(cleaned))

    return {
        "name": _extract_name(lines, contact),
        "contact": contact,
        "skills": skills,
        "education": _compact_items(sections.get("education", []), limit=8),
        "experience": _compact_items(sections.get("experience", []), limit=10),
        "projects": _compact_items(sections.get("projects", []), limit=10),
        "certifications": _compact_items(sections.get("certifications", []), limit=8),
        "summary": " ".join(_compact_items(sections.get("summary", []), limit=3)),
        "sections_detected": [key for key, value in sections.items() if value],
    }


def _extract_contact(text: str) -> dict[str, str | None]:
    email_match = re.search(r"[\w.+-]+@[\w-]+\.[\w.-]+", text)
    phone_match = re.search(r"(?:(?:\+91|91)[-\s]?)?[6-9]\d{9}", re.sub(r"[()\s-]", "", text))
    linkedin_match = re.search(r"(?:https?://)?(?:www\.)?linkedin\.com/in/[A-Za-z0-9_-]+", text, re.I)
    github_match = re.search(r"(?:https?://)?(?:www\.)?github\.com/[A-Za-z0-9_-]+", text, re.I)
    portfolio_match = re.search(r"(?:https?://)?(?:www\.)?[A-Za-z0-9-]+\.(?:dev|io|me|com)/?[^\s,;)]*", text, re.I)
    return {
        "email": email_match.group(0) if email_match else None,
        "phone": phone_match.group(0) if phone_match else None,
        "linkedin": linkedin_match.group(0) if linkedin_match else None,
        "github": github_match.group(0) if github_match else None,
        "portfolio": portfolio_match.group(0) if portfolio_match else None,
    }


def _extract_name(lines: list[str], contact: dict[str, str | None]) -> str:
    rejected_terms = set(HEADING_WORDS) | {"resume", "curriculum vitae", "cv"}
    for line in lines[:12]:
        normalized = re.sub(r"[^a-z ]", "", line.lower()).strip()
        if not normalized or normalized in rejected_terms:
            continue
        if contact.get("email") and contact["email"] in line:
            continue
        if "@" in line or re.search(r"\d{4,}", line):
            continue
        words = [word for word in line.split() if word.isalpha()]
        if 1 < len(words) <= 5 and len(line) <= 80:
            return " ".join(word.capitalize() for word in words)
    return "Unknown Candidate"


def _extract_section(lines: list[str], aliases: list[str]) -> list[str]:
    start_index: int | None = None
    for index, line in enumerate(lines):
        key = _normalize_heading(line)
        if any(key == alias or key.startswith(f"{alias} ") for alias in aliases):
            start_index = index + 1
            break

    if start_index is None:
        return []

    section_lines: list[str] = []
    for line in lines[start_index:]:
        key = _normalize_heading(line)
        if key in HEADING_WORDS or any(key == word or key.startswith(f"{word} ") for word in HEADING_WORDS):
            break
        section_lines.append(line)
    return section_lines


def _normalize_heading(line: str) -> str:
    return re.sub(r"[^a-z ]", "", line.lower()).strip()


def _compact_items(items: list[str], limit: int = 8) -> list[str]:
    compacted: list[str] = []
    for item in items:
        item = re.sub(r"\s+", " ", item).strip(" -\u2022")
        if len(item) < 3:
            continue
        if item not in compacted:
            compacted.append(item[:280])
        if len(compacted) >= limit:
            break
    return compacted


def _merge_skills(skill_section_lines: list[str], detected: list[str]) -> list[str]:
    section_text = " ".join(skill_section_lines)
    section_skills = find_skills(section_text) if section_text else []
    merged = OrderedDict((skill, None) for skill in [*section_skills, *detected])
    return list(merged.keys())
