USE hiresense_ai;

-- Create users through the API so passwords are hashed with the configured bcrypt policy.
-- This seed keeps a realistic sample report shape for manual SQL testing.
INSERT INTO analysis_history (
  user_id,
  resume_filename,
  raw_text,
  job_description,
  extracted_data,
  match_result,
  score_breakdown,
  ats_score,
  suggestions,
  interview_questions
) VALUES (
  1,
  'resume.pdf',
  'Ayan Khan Python SQL Machine Learning React FastAPI MySQL Data Science Projects',
  'Data Science Intern with Python, SQL, ML, dashboards, APIs, Docker, AWS and NLP.',
  JSON_OBJECT(
    'name', 'Ayan khan',
    'skills', JSON_ARRAY('Python', 'SQL', 'Machine Learning', 'React', 'FastAPI', 'MySQL'),
    'education', JSON_ARRAY('BTech Computer Science, Data Science specialization'),
    'projects', JSON_ARRAY('Resume Analyzer with FastAPI and React', 'ML dashboard for prediction analytics'),
    'certifications', JSON_ARRAY('Data Science and Python coursework')
  ),
  JSON_OBJECT(
    'match_percentage', 78,
    'strong_matching_skills', JSON_ARRAY('Python', 'SQL', 'Machine Learning', 'React', 'FastAPI'),
    'missing_skills', JSON_ARRAY('Docker', 'AWS', 'NLP'),
    'keyword_gap_analysis', JSON_ARRAY('model deployment', 'cloud', 'natural language processing')
  ),
  JSON_OBJECT(
    'skills_relevance', 29,
    'keyword_presence', 19,
    'resume_structure', 14,
    'experience_strength', 12,
    'project_quality', 10
  ),
  84,
  JSON_OBJECT(
    'better_summary_statement', 'Data-focused computer science student skilled in Python, SQL, ML, and full-stack analytics.',
    'skills_to_add', JSON_ARRAY('Docker', 'AWS', 'NLP')
  ),
  JSON_OBJECT(
    'hr_questions', JSON_ARRAY('Tell me about yourself.'),
    'technical_questions', JSON_ARRAY('How have you used Python in a real project?')
  )
);
