import math
import re
from functools import lru_cache
from typing import Any

from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

from app.core.config import settings
from app.services.resume_parser import find_skills


ACTION_VERBS = {
    "built",
    "designed",
    "developed",
    "deployed",
    "optimized",
    "analyzed",
    "automated",
    "implemented",
    "created",
    "improved",
    "trained",
    "evaluated",
    "integrated",
}


def analyze_resume_against_jd(
    resume_text: str,
    job_description: str,
    extracted_data: dict[str, Any],
) -> tuple[dict[str, Any], int, dict[str, Any]]:
    resume_skills = extracted_data.get("skills") or find_skills(resume_text)
    jd_skills = find_skills(job_description)
    strong_matches = sorted(set(resume_skills).intersection(jd_skills))
    missing_skills = sorted(set(jd_skills).difference(resume_skills))
    jd_keywords = extract_keywords(job_description, limit=28)
    keyword_gaps = [keyword for keyword in jd_keywords if keyword.lower() not in resume_text.lower()][:14]

    semantic_score = _semantic_similarity(resume_text, job_description)
    skill_score = _ratio_score(len(strong_matches), len(jd_skills))
    keyword_score = _ratio_score(len(jd_keywords) - len(keyword_gaps), len(jd_keywords))
    match_percentage = round(semantic_score * 0.45 + skill_score * 0.35 + keyword_score * 0.20)

    score_breakdown = _score_breakdown(
        resume_text=resume_text,
        extracted_data=extracted_data,
        jd_keywords=jd_keywords,
        keyword_gaps=keyword_gaps,
        strong_matches=strong_matches,
        jd_skills=jd_skills,
    )
    ats_score = min(100, max(0, round(sum(score_breakdown.values()))))

    match_result = {
        "match_percentage": min(100, match_percentage),
        "semantic_similarity": round(semantic_score, 1),
        "strong_matching_skills": strong_matches,
        "missing_skills": missing_skills,
        "keyword_gap_analysis": keyword_gaps,
        "jd_keywords": jd_keywords,
        "skill_distribution": skill_distribution(resume_skills),
        "project_category_analysis": project_category_analysis(extracted_data.get("projects", [])),
    }
    return match_result, ats_score, score_breakdown


def extract_keywords(text: str, limit: int = 20) -> list[str]:
    cleaned = re.sub(r"[^A-Za-z0-9+#. ]", " ", text)
    if len(cleaned.split()) < 5:
        return []
    vectorizer = TfidfVectorizer(stop_words="english", ngram_range=(1, 2), max_features=80)
    try:
        matrix = vectorizer.fit_transform([cleaned])
    except ValueError:
        return []
    features = vectorizer.get_feature_names_out()
    scores = matrix.toarray()[0]
    ranked = sorted(zip(features, scores), key=lambda item: item[1], reverse=True)
    keywords = []
    for keyword, _score in ranked:
        if len(keyword) < 3 or keyword.isdigit():
            continue
        keywords.append(keyword)
        if len(keywords) >= limit:
            break
    return keywords


def skill_distribution(skills: list[str]) -> dict[str, int]:
    categories = {
        "Programming": {"Python", "Java", "JavaScript", "TypeScript", "C++", "C", "C#", "R"},
        "Data Science": {
            "Machine Learning",
            "Deep Learning",
            "Data Science",
            "NLP",
            "Computer Vision",
            "Statistics",
            "Regression",
            "Classification",
            "Clustering",
            "EDA",
            "Feature Engineering",
        },
        "Libraries": {"Pandas", "NumPy", "scikit-learn", "TensorFlow", "PyTorch", "Keras", "Matplotlib", "Seaborn"},
        "Web": {"React", "Node.js", "FastAPI", "Flask", "Django", "HTML", "CSS", "Tailwind CSS", "REST API"},
        "Database": {"SQL", "MySQL", "PostgreSQL", "MongoDB", "NoSQL"},
        "Cloud & Tools": {"Git", "Docker", "AWS", "Azure", "GCP", "Linux", "Power BI", "Tableau", "Excel"},
    }
    distribution = {category: 0 for category in categories}
    for skill in skills:
        for category, category_skills in categories.items():
            if skill in category_skills:
                distribution[category] += 1
                break
    return distribution


def project_category_analysis(projects: list[str]) -> dict[str, int]:
    categories = {"AI/ML": 0, "Data Analytics": 0, "Web Apps": 0, "Automation": 0, "Other": 0}
    for project in projects:
        lowered = project.lower()
        if any(token in lowered for token in ["model", "ml", "ai", "prediction", "classification", "nlp"]):
            categories["AI/ML"] += 1
        elif any(token in lowered for token in ["dashboard", "analysis", "visualization", "power bi", "tableau"]):
            categories["Data Analytics"] += 1
        elif any(token in lowered for token in ["react", "web", "api", "fastapi", "flask", "django"]):
            categories["Web Apps"] += 1
        elif any(token in lowered for token in ["automation", "script", "pipeline", "etl"]):
            categories["Automation"] += 1
        else:
            categories["Other"] += 1
    return categories


def _score_breakdown(
    resume_text: str,
    extracted_data: dict[str, Any],
    jd_keywords: list[str],
    keyword_gaps: list[str],
    strong_matches: list[str],
    jd_skills: list[str],
) -> dict[str, float]:
    structure_sections = ["skills", "education", "projects", "experience"]
    structure_hits = sum(1 for section in structure_sections if extracted_data.get(section))
    contact_hits = sum(1 for value in (extracted_data.get("contact") or {}).values() if value)
    structure_score = min(15, structure_hits * 3 + min(contact_hits, 3))

    skills_relevance = min(35, _ratio_score(len(strong_matches), len(jd_skills)) * 0.35 if jd_skills else 20)
    keyword_presence = min(25, _ratio_score(len(jd_keywords) - len(keyword_gaps), len(jd_keywords)) * 0.25)
    experience_strength = _experience_score(resume_text, extracted_data.get("experience", []))
    project_quality = _project_score(extracted_data.get("projects", []))

    return {
        "skills_relevance": round(skills_relevance, 1),
        "keyword_presence": round(keyword_presence, 1),
        "resume_structure": round(structure_score, 1),
        "experience_strength": round(experience_strength, 1),
        "project_quality": round(project_quality, 1),
    }


def _experience_score(resume_text: str, experience: list[str]) -> float:
    lowered = resume_text.lower()
    years = len(re.findall(r"\b\d+\+?\s*(?:years?|yrs?)\b", lowered))
    metrics = len(re.findall(r"\b\d+%|\b\d+x\b|\b\d+\s*(?:users|records|rows|models|apis)\b", lowered))
    verbs = sum(1 for verb in ACTION_VERBS if verb in lowered)
    experience_lines = len(experience)
    return min(15, experience_lines * 2.2 + years * 2 + metrics * 1.4 + verbs * 0.4)


def _project_score(projects: list[str]) -> float:
    if not projects:
        return 2
    joined = " ".join(projects).lower()
    tech_mentions = len(find_skills(joined))
    metric_mentions = len(re.findall(r"\b\d+%|\b\d+x\b|\b\d+\s*(?:users|records|rows|models|features)\b", joined))
    return min(10, len(projects) * 1.7 + tech_mentions * 0.6 + metric_mentions)


def _ratio_score(numerator: int, denominator: int) -> float:
    if denominator <= 0:
        return 0.0
    return min(100.0, max(0.0, numerator / denominator * 100))


def _semantic_similarity(resume_text: str, job_description: str) -> float:
    try:
        model = _sentence_transformer()
        embeddings = model.encode([resume_text[:5000], job_description[:5000]], convert_to_tensor=False)
        score = cosine_similarity([embeddings[0]], [embeddings[1]])[0][0]
        if not math.isnan(score):
            return max(0.0, min(100.0, float(score) * 100))
    except Exception:
        pass

    vectorizer = TfidfVectorizer(stop_words="english", ngram_range=(1, 2), max_features=4000)
    try:
        matrix = vectorizer.fit_transform([resume_text, job_description])
        return max(0.0, min(100.0, float(cosine_similarity(matrix[0], matrix[1])[0][0]) * 100))
    except ValueError:
        return 0.0


@lru_cache(maxsize=1)
def _sentence_transformer():
    from sentence_transformers import SentenceTransformer

    return SentenceTransformer(settings.sentence_transformer_model)
