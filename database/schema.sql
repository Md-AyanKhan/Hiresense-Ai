CREATE DATABASE IF NOT EXISTS hiresense_ai CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE hiresense_ai;

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  full_name VARCHAR(120) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  phone VARCHAR(30),
  hashed_password VARCHAR(255) NOT NULL,
  role VARCHAR(30) NOT NULL DEFAULT 'student',
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX ix_users_email (email)
);

CREATE TABLE IF NOT EXISTS analysis_history (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  resume_filename VARCHAR(255) NOT NULL,
  raw_text TEXT NOT NULL,
  job_description TEXT,
  extracted_data JSON NOT NULL,
  match_result JSON NOT NULL,
  score_breakdown JSON NOT NULL,
  ats_score INT NOT NULL,
  suggestions JSON NOT NULL,
  interview_questions JSON NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX ix_analysis_user_id (user_id),
  INDEX ix_analysis_created_at (created_at),
  CONSTRAINT fk_analysis_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
