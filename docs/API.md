# HireSense AI API Documentation

Base URL: `http://localhost:8000/api`

FastAPI interactive docs are available at `http://localhost:8000/docs` after the backend starts.

## Authentication

### POST `/auth/signup`

Creates a user. The configured `ADMIN_EMAIL` receives the `admin` role automatically.

```json
{
  "full_name": "Ayan Khan",
  "email": "ayankhan@gmail.com",
  "phone": "9810363542",
  "password": "strongpassword"
}
```

### POST `/auth/login`

Returns a JWT bearer token and user profile.

```json
{
  "email": "ayankhan@gmail.com",
  "password": "strongpassword"
}
```

### GET `/auth/me`

Requires `Authorization: Bearer <token>`.

## Resume

### POST `/resume/parse`

Multipart form-data:

- `file`: PDF or DOCX resume

Returns raw text and extracted name, contact details, skills, education, experience, projects, certifications, and detected sections.

## Analysis

### POST `/analysis/analyze`

Multipart form-data:

- `file`: PDF or DOCX resume
- `job_description`: target job description text

Runs the full pipeline and stores a history record.

### POST `/analysis/match`

```json
{
  "resume_text": "resume text...",
  "job_description": "job description...",
  "extracted_data": {}
}
```

Returns match percentage, missing skills, strong matches, keyword gaps, ATS score, suggestions, and interview questions.

### GET `/analysis/history`

Returns the current user's previous analyses.

### GET `/analysis/history/{history_id}`

Returns one saved analysis.

## Interview

### POST `/interview/generate`

```json
{
  "resume_text": "optional resume text",
  "extracted_data": {},
  "focus_area": "all"
}
```

Focus areas: `all`, `hr`, `technical`, `project`, `sql`, `python`, `data_science_ml`.

## Chatbot

### POST `/chatbot/message`

```json
{
  "message": "How do I improve my resume?",
  "context": {}
}
```

## Admin

Admin routes require a JWT for a user with role `admin`.

### GET `/admin/stats`

Returns total users, total analyses, average ATS score, average match percentage, and recent activity.

### GET `/admin/users`

Returns users with analysis counts.
