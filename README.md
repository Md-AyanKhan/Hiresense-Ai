# HireSense AI - Resume Analyzer & Interview Preparation Assistant

**HireSense AI** is a production-style full-stack AI portfolio project for resume parsing, ATS scoring, job-description matching, AI suggestions, interview preparation, chatbot guidance, analytics, authentication, history, and admin usage monitoring.

Built by **Ayan Khan**
Email: ayankhanghosi5@gmail.com
LinkedIn: https://www.linkedin.com/in/mohammad-ayan-khan3/

## Preview

| Landing | Dashboard |
|--------|----------|
| ![](docs/screenshots/landing-page.png) | ![](docs/screenshots/dashboard.png) |

| Resume Analysis | JD Match |
|----------------|----------|
| ![](docs/screenshots/resume-analysis.png) | ![](docs/screenshots/jd-match.png) |

| Interview Assistant | Chatbot | Admin Dashboard |
|-------------------|---------|----------------|
| ![](docs/screenshots/interview-assistant.png) | ![](docs/screenshots/chatbot.png) | 

## Features

- PDF/DOCX resume upload and parsing
- Extracted candidate profile: name, skills, education, experience, projects, certifications, contact details
- Job-description matching with semantic similarity, missing skills, strong skills, and keyword gaps
- ATS-style score out of 100 with detailed score breakdown
- AI-style resume improvement suggestions and stronger project bullet guidance
- Interview question generation for HR, technical, projects, SQL, Python, and data science/ML
- Context-aware chatbot for resume and interview preparation
- Dashboard analytics with Chart.js visualizations
- Signup/login with JWT authentication and secure password hashing
- MySQL-backed analysis history
- Admin dashboard for users, usage stats, and activity analytics

## Tech Stack

### Frontend
- React.js
- Tailwind CSS
- Framer Motion
- Chart.js / react-chartjs-2
- lucide-react

### Backend
- FastAPI
- SQLAlchemy
- JWT auth
- MySQL

### AI/NLP & File Processing
- spaCy-ready parsing flow
- scikit-learn TF-IDF and cosine similarity
- sentence-transformers semantic similarity
- transformers dependency included for extensibility
- PyPDF2
- pdfplumber
- python-docx
- OpenAI optional integration

## Folder Structure

```text
HireSense AI - Resume Analyzer & Interview Prep Assistant/
|-- backend/
|   |-- app/
|   |   |-- api/
|   |   |-- core/
|   |   |-- db/
|   |   |-- models/
|   |   |-- schemas/
|   |   |-- services/
|   |   `-- main.py
|   |-- storage/uploads/
|   |-- tests/
|   |-- .env.example
|   `-- requirements.txt
|-- frontend/
|   |-- public/
|   |-- src/
|   |   |-- api/
|   |   |-- components/
|   |   |-- context/
|   |   |-- data/
|   |   |-- layouts/
|   |   |-- pages/
|   |   |-- routes/
|   |   `-- utils/
|   |-- .env.example
|   `-- package.json
|-- database/
|   |-- schema.sql
|   `-- sample_seed.sql
|-- docs/
|   |-- API.md
|   `-- screenshots/
|-- sample_data/
|-- docker-compose.yml
|-- .gitignore
|-- LICENSE
`-- README.md
```

## Quick Start

### Clone Repository

```bash
git clone 
cd AI-Resume-Analyzer-Interview-Prep
```

### Backend Setup

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
copy .env.example .env
uvicorn app.main:app --reload
```

Backend:
```text
http://localhost:8000
```

API Docs:
```text
http://localhost:8000/docs
```

### Frontend Setup

Open another terminal:

```bash
cd frontend
npm install
copy .env.example .env
npm run dev
```

Frontend:
```text
http://localhost:5173
```

## Environment Variables

Backend `.env`

```env
APP_NAME=HireSense AI API
DATABASE_URL=mysql+pymysql://root:password@localhost:3306/hiresense_ai
SECRET_KEY=change-this-to-a-long-random-secret
ACCESS_TOKEN_EXPIRE_MINUTES=1440
FRONTEND_ORIGIN=http://localhost:5173
ADMIN_EMAIL=ayankhanghosi5@gmail.com
UPLOAD_DIR=storage/uploads
OPENAI_API_KEY=
ENABLE_OPENAI=false
GROQ_API_KEY=
GROQ_MODEL=openai/gpt-oss-20b
GROQ_BASE_URL=https://api.groq.com/openai/v1
```

### Enable the AI Chatbot

1. Create an API key in the [Groq Console](https://console.groq.com/keys).
2. Add it to `backend/.env`:

   ```env
   GROQ_API_KEY=your-groq-api-key
   GROQ_MODEL=openai/gpt-oss-20b
   GROQ_BASE_URL=https://api.groq.com/openai/v1
   ```

3. Restart the backend. The key must stay in the backend environment; do not add it to the frontend `.env`.

The chatbot accepts free-form prompts and keeps the latest conversation turns as context. Responses render Markdown lists, headings, code, and tables for readability. It sends the user's message and detected skills/job-match skills to Groq, but not resume contact details or raw text. It does not have live web-search access. Review Groq's current [data controls](https://console.groq.com/docs/your-data) and [rate limits](https://console.groq.com/docs/rate-limits) before using it with real resume data.

Frontend `.env`

```env
VITE_API_URL=http://localhost:8000/api
```

## Admin Access

First account created with:

```text
test@gmail.com
```

gets automatic admin access.

Demo password:

```text
test@12345
```

## API Documentation

See:

```text
docs/API.md
```

or:

```text
http://localhost:8000/docs
```

## Sample Test Files

Located in:

- sample_data/sample_resume.txt
- sample_data/sample_job_description.txt
- sample_data/sample_analysis.json

## Production Notes

- Replace SECRET_KEY
- Use production MySQL
- Restrict CORS
- Store uploads in object storage
- Add migrations
- Add rate limiting
