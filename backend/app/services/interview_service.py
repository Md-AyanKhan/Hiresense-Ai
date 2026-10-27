from typing import Any


def generate_interview_questions(extracted_data: dict[str, Any] | None = None, resume_text: str | None = None) -> dict[str, list[str]]:
    extracted_data = extracted_data or {}
    skills = extracted_data.get("skills", [])
    projects = extracted_data.get("projects", [])

    technical = _technical_questions(skills)
    project_based = _project_questions(projects)

    return {
        "hr_questions": [
            "Tell me about yourself and the kind of data science role you are targeting.",
            "Why should we hire you for this internship?",
            "Describe a time you learned a new technical concept quickly.",
            "What is one weakness in your resume that you are actively improving?",
            "Where do you see yourself after graduation?",
        ],
        "technical_questions": technical,
        "project_based_questions": project_based,
        "sql_questions": [
            "Write a SQL query to find the second highest salary in an employee table.",
            "Explain INNER JOIN, LEFT JOIN, and FULL OUTER JOIN with examples.",
            "How would you identify duplicate rows in a table?",
            "What are window functions, and when would you use ROW_NUMBER?",
            "How do indexes improve query performance, and what are their trade-offs?",
        ],
        "python_questions": [
            "Explain list comprehension and when it improves readability.",
            "What is the difference between a list, tuple, set, and dictionary?",
            "How do decorators work in Python?",
            "Explain exception handling in a production API.",
            "How would you process a large CSV file without loading it fully into memory?",
        ],
        "data_science_ml_questions": [
            "How do you handle missing values in a dataset?",
            "Explain bias-variance tradeoff in simple terms.",
            "What is the difference between precision, recall, F1-score, and accuracy?",
            "How would you detect overfitting in a model?",
            "Explain a machine learning pipeline from raw data to deployment.",
        ],
    }


def _technical_questions(skills: list[str]) -> list[str]:
    questions = []
    for skill in skills[:8]:
        questions.append(f"How have you used {skill} in a real project, and what trade-offs did you consider?")
    defaults = [
        "Explain how you would design a resume analysis API end to end.",
        "How would you debug a slow backend endpoint?",
        "What validation would you add before accepting uploaded files?",
    ]
    return (questions + defaults)[:8]


def _project_questions(projects: list[str]) -> list[str]:
    if not projects:
        return [
            "Walk me through your strongest project from problem statement to result.",
            "How did you evaluate whether your project was successful?",
            "What would you improve if you had two more weeks?",
        ]
    return [
        f"For this project, explain the problem, your architecture, and the measurable impact: {project[:120]}"
        for project in projects[:6]
    ]
