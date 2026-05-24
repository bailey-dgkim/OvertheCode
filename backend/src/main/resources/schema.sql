-- =========================================================
-- Over the Code V1 Schema
-- =========================================================

-- 기존 테이블 삭제용
-- 처음 실습할 때만 사용
-- 운영에서는 절대 함부로 쓰면 안 됨

DROP TABLE IF EXISTS user_quiz_results;
DROP TABLE IF EXISTS user_lesson_progress;
DROP TABLE IF EXISTS user_term_progress;
DROP TABLE IF EXISTS quiz_choices;
DROP TABLE IF EXISTS quiz_questions;
DROP TABLE IF EXISTS code_examples;
DROP TABLE IF EXISTS lesson_terms;
DROP TABLE IF EXISTS lessons;
DROP TABLE IF EXISTS terms;
DROP TABLE IF EXISTS modules;
DROP TABLE IF EXISTS chapters;
DROP TABLE IF EXISTS users;

-- =========================================================
-- Users
-- =========================================================

CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    external_auth_id VARCHAR(255) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    display_name VARCHAR(100),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- =========================================================
-- Content Structure
-- =========================================================

CREATE TABLE chapters (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    description TEXT,
    display_order INTEGER NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE modules (
    id BIGSERIAL PRIMARY KEY,
    chapter_id BIGINT NOT NULL,
    title VARCHAR(100) NOT NULL,
    description TEXT,
    display_order INTEGER NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_modules_chapter
        FOREIGN KEY (chapter_id)
        REFERENCES chapters(id)
);

CREATE TABLE terms (
    id BIGSERIAL PRIMARY KEY,
    module_id BIGINT NOT NULL,
    name VARCHAR(100) NOT NULL,
    short_definition TEXT NOT NULL,
    practical_context TEXT,
    example_sentence TEXT,
    display_order INTEGER NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_terms_module
        FOREIGN KEY (module_id)
        REFERENCES modules(id)
);

CREATE TABLE lessons (
    id BIGSERIAL PRIMARY KEY,
    module_id BIGINT NOT NULL,
    title VARCHAR(200) NOT NULL,
    summary TEXT,
    body_markdown TEXT NOT NULL,
    display_order INTEGER NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_lessons_module
        FOREIGN KEY (module_id)
        REFERENCES modules(id)
);

CREATE TABLE lesson_terms (
    lesson_id BIGINT NOT NULL,
    term_id BIGINT NOT NULL,
    display_order INTEGER,

    CONSTRAINT pk_lesson_terms
        PRIMARY KEY (lesson_id, term_id),

    CONSTRAINT fk_lesson_terms_lesson
        FOREIGN KEY (lesson_id)
        REFERENCES lessons(id),

    CONSTRAINT fk_lesson_terms_term
        FOREIGN KEY (term_id)
        REFERENCES terms(id)
);

CREATE TABLE code_examples (
    id BIGSERIAL PRIMARY KEY,
    lesson_id BIGINT NOT NULL,
    title VARCHAR(200) NOT NULL,
    code_type VARCHAR(50) NOT NULL,
    code_content TEXT NOT NULL,
    explanation TEXT,
    display_order INTEGER NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_code_examples_lesson
        FOREIGN KEY (lesson_id)
        REFERENCES lessons(id)
);

-- =========================================================
-- Quiz
-- =========================================================

CREATE TABLE quiz_questions (
    id BIGSERIAL PRIMARY KEY,
    module_id BIGINT NOT NULL,
    lesson_id BIGINT,
    term_id BIGINT,
    question_text TEXT NOT NULL,
    question_format VARCHAR(50) NOT NULL,
    question_type VARCHAR(50) NOT NULL,
    explanation TEXT,
    display_order INTEGER NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_quiz_questions_module
        FOREIGN KEY (module_id)
        REFERENCES modules(id),

    CONSTRAINT fk_quiz_questions_lesson
        FOREIGN KEY (lesson_id)
        REFERENCES lessons(id),

    CONSTRAINT fk_quiz_questions_term
        FOREIGN KEY (term_id)
        REFERENCES terms(id)
);

CREATE TABLE quiz_choices (
    id BIGSERIAL PRIMARY KEY,
    question_id BIGINT NOT NULL,
    choice_text TEXT NOT NULL,
    is_correct BOOLEAN NOT NULL DEFAULT FALSE,
    explanation TEXT,
    display_order INTEGER NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_quiz_choices_question
        FOREIGN KEY (question_id)
        REFERENCES quiz_questions(id)
);

-- =========================================================
-- User Progress
-- =========================================================

CREATE TABLE user_term_progress (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    term_id BIGINT NOT NULL,
    status VARCHAR(50) NOT NULL,
    completed_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_user_term_progress_user
        FOREIGN KEY (user_id)
        REFERENCES users(id),

    CONSTRAINT fk_user_term_progress_term
        FOREIGN KEY (term_id)
        REFERENCES terms(id),

    CONSTRAINT uq_user_term_progress
        UNIQUE (user_id, term_id)
);

CREATE TABLE user_lesson_progress (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    lesson_id BIGINT NOT NULL,
    status VARCHAR(50) NOT NULL,
    completed_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_user_lesson_progress_user
        FOREIGN KEY (user_id)
        REFERENCES users(id),

    CONSTRAINT fk_user_lesson_progress_lesson
        FOREIGN KEY (lesson_id)
        REFERENCES lessons(id),

    CONSTRAINT uq_user_lesson_progress
        UNIQUE (user_id, lesson_id)
);

CREATE TABLE user_quiz_results (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    question_id BIGINT NOT NULL,
    selected_choice_id BIGINT NOT NULL,
    is_correct BOOLEAN NOT NULL,
    answered_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_user_quiz_results_user
        FOREIGN KEY (user_id)
        REFERENCES users(id),

    CONSTRAINT fk_user_quiz_results_question
        FOREIGN KEY (question_id)
        REFERENCES quiz_questions(id),

    CONSTRAINT fk_user_quiz_results_choice
        FOREIGN KEY (selected_choice_id)
        REFERENCES quiz_choices(id),

    CONSTRAINT uq_user_quiz_result
        UNIQUE (user_id, question_id)
);

-- =========================================================
-- Indexes
-- =========================================================

CREATE INDEX idx_modules_chapter_id ON modules(chapter_id);
CREATE INDEX idx_terms_module_id ON terms(module_id);
CREATE INDEX idx_lessons_module_id ON lessons(module_id);
CREATE INDEX idx_code_examples_lesson_id ON code_examples(lesson_id);
CREATE INDEX idx_quiz_questions_module_id ON quiz_questions(module_id);
CREATE INDEX idx_quiz_questions_lesson_id ON quiz_questions(lesson_id);
CREATE INDEX idx_quiz_questions_term_id ON quiz_questions(term_id);
CREATE INDEX idx_quiz_choices_question_id ON quiz_choices(question_id);
CREATE INDEX idx_user_term_progress_user_id ON user_term_progress(user_id);
CREATE INDEX idx_user_lesson_progress_user_id ON user_lesson_progress(user_id);
CREATE INDEX idx_user_quiz_results_user_id ON user_quiz_results(user_id);