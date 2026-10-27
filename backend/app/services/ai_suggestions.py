from typing import Any


def generate_resume_suggestions(
    extracted_data: dict[str, Any],
    match_result: dict[str, Any],
    score_breakdown: dict[str, Any],
) -> dict[str, Any]:
    missing_skills = match_result.get("missing_skills", [])[:8]
    keyword_gaps = match_result.get("keyword_gap_analysis", [])[:8]
    projects = extracted_data.get("projects", [])
    skills = extracted_data.get("skills", [])
    name = extracted_data.get("name") or "Candidate"

    summary = _summary_statement(name, skills, missing_skills)
    project_rewrites = [_rewrite_project(project) for project in projects[:4]]

    improvements = []
    if score_breakdown.get("resume_structure", 0) < 12:
        improvements.append("Add clearly labeled Skills, Education, Projects, Experience, and Certifications sections.")
    if score_breakdown.get("keyword_presence", 0) < 18:
        improvements.append("Mirror important job-description keywords naturally in your summary and project bullets.")
    if score_breakdown.get("experience_strength", 0) < 10:
        improvements.append("Quantify impact with metrics such as accuracy, latency, users, records processed, or time saved.")
    if score_breakdown.get("project_quality", 0) < 8:
        improvements.append("For each project, include the problem, tech stack, model/approach, result, and deployment detail.")

    return {
        "better_summary_statement": summary,
        "skills_to_add": missing_skills,
        "keywords_to_include": keyword_gaps,
        "project_description_rewrites": project_rewrites,
        "resume_improvements": improvements or [
            "Your resume is structurally strong. Focus on tailoring the top summary and project bullets for each role."
        ],
    }


def _summary_statement(name: str, skills: list[str], missing_skills: list[str]) -> str:
    current_skills = ", ".join(skills[:5]) if skills else "Python, SQL, analytics, and applied machine learning"
    target_skills = ", ".join(missing_skills[:3])
    addition = f" with growing exposure to {target_skills}" if target_skills else ""
    return (
        f"{name} is a data-focused computer science student skilled in {current_skills}{addition}, "
        "building production-minded analytics and ML projects that translate data into measurable product decisions."
    )


def _rewrite_project(project: str) -> dict[str, str]:
    compact = project[:140].strip()
    return {
        "original": compact,
        "suggested": (
            f"Built {compact} using a clear problem-to-impact workflow; documented the dataset, core algorithms, "
            "evaluation metric, deployment approach, and measurable result for ATS-friendly readability."
        ),
    }
