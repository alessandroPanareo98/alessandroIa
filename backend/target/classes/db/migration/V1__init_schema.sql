CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    email VARCHAR(120) NOT NULL UNIQUE,
    password_hash VARCHAR(120) NOT NULL,
    full_name VARCHAR(120) NOT NULL,
    role VARCHAR(20) NOT NULL,
    enabled BOOLEAN NOT NULL,
    created_at TIMESTAMPTZ NOT NULL
);

CREATE TABLE user_settings (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id),
    key_name VARCHAR(50) NOT NULL,
    value VARCHAR(4000) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL
);

CREATE TABLE projects (
    id BIGSERIAL PRIMARY KEY,
    gitlab_project_id BIGINT NOT NULL UNIQUE,
    name VARCHAR(200) NOT NULL,
    path VARCHAR(300) NOT NULL,
    web_url VARCHAR(300) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL
);

CREATE TABLE pipelines (
    id BIGSERIAL PRIMARY KEY,
    project_id BIGINT NOT NULL REFERENCES projects(id),
    gitlab_pipeline_id BIGINT NOT NULL UNIQUE,
    ref_name VARCHAR(120) NOT NULL,
    status VARCHAR(20) NOT NULL,
    started_at TIMESTAMPTZ NOT NULL,
    finished_at TIMESTAMPTZ
);

CREATE TABLE jobs (
    id BIGSERIAL PRIMARY KEY,
    pipeline_id BIGINT NOT NULL REFERENCES pipelines(id),
    gitlab_job_id BIGINT NOT NULL UNIQUE,
    name VARCHAR(150) NOT NULL,
    status VARCHAR(20) NOT NULL,
    log_excerpt VARCHAR(4000),
    created_at TIMESTAMPTZ NOT NULL
);

CREATE TABLE build_errors (
    id BIGSERIAL PRIMARY KEY,
    job_id BIGINT NOT NULL REFERENCES jobs(id),
    severity VARCHAR(20) NOT NULL,
    title VARCHAR(500) NOT NULL,
    details VARCHAR(4000) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL
);

CREATE TABLE ai_analyses (
    id BIGSERIAL PRIMARY KEY,
    error_id BIGINT NOT NULL UNIQUE REFERENCES build_errors(id),
    severity VARCHAR(30) NOT NULL,
    cause VARCHAR(2000) NOT NULL,
    solution VARCHAR(3000) NOT NULL,
    confidence DOUBLE PRECISION NOT NULL,
    raw_response VARCHAR(5000) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL
);

CREATE TABLE notifications (
    id BIGSERIAL PRIMARY KEY,
    error_id BIGINT REFERENCES build_errors(id),
    channel VARCHAR(20) NOT NULL,
    message VARCHAR(2000) NOT NULL,
    read_flag BOOLEAN NOT NULL,
    created_at TIMESTAMPTZ NOT NULL
);
