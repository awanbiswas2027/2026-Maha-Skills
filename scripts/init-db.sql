-- MahaSkills Canonical Database Schema Initialization
-- PostgreSQL 16 DDL

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. Districts (36 Administrative Districts of Maharashtra)
CREATE TABLE IF NOT EXISTS districts (
    id SERIAL PRIMARY KEY,
    code VARCHAR(10) UNIQUE NOT NULL,
    name_en VARCHAR(100) NOT NULL,
    name_mr VARCHAR(100) NOT NULL,
    division VARCHAR(50) NOT NULL,
    latitude NUMERIC(9, 6) NOT NULL,
    longitude NUMERIC(9, 6) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- 2. Sectors (33 Economic Sectors)
CREATE TABLE IF NOT EXISTS sectors (
    id SERIAL PRIMARY KEY,
    code VARCHAR(20) UNIQUE NOT NULL,
    name_en VARCHAR(150) NOT NULL,
    name_mr VARCHAR(150) NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- 3. Sector Skill Councils (36 SSCs)
CREATE TABLE IF NOT EXISTS sscs (
    id SERIAL PRIMARY KEY,
    code VARCHAR(30) UNIQUE NOT NULL,
    name VARCHAR(200) NOT NULL,
    sector_id INT NOT NULL REFERENCES sectors(id) ON DELETE RESTRICT,
    contact_email VARCHAR(255) NOT NULL,
    portal_url VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- 4. Job Roles (~2,200 NSQF-Aligned Roles)
CREATE TABLE IF NOT EXISTS job_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sector_id INT NOT NULL REFERENCES sectors(id) ON DELETE RESTRICT,
    ssc_id INT REFERENCES sscs(id) ON DELETE SET NULL,
    qp_code VARCHAR(50) UNIQUE NOT NULL,
    title_en VARCHAR(200) NOT NULL,
    title_mr VARCHAR(200) NOT NULL,
    nsqf_level INT NOT NULL CHECK (nsqf_level BETWEEN 1 AND 10),
    description TEXT,
    version VARCHAR(20) DEFAULT '1.0' NOT NULL,
    is_active BOOLEAN DEFAULT TRUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- 5. Skills
CREATE TABLE IF NOT EXISTS skills (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sector_id INT NOT NULL REFERENCES sectors(id) ON DELETE RESTRICT,
    name_en VARCHAR(150) NOT NULL,
    name_mr VARCHAR(150) NOT NULL,
    skill_type VARCHAR(50) NOT NULL,
    is_emerging BOOLEAN DEFAULT FALSE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- 6. Job Role ↔ Skill Mapping
CREATE TABLE IF NOT EXISTS job_role_skills (
    job_role_id UUID NOT NULL REFERENCES job_roles(id) ON DELETE CASCADE,
    skill_id UUID NOT NULL REFERENCES skills(id) ON DELETE CASCADE,
    is_mandatory BOOLEAN DEFAULT TRUE NOT NULL,
    proficiency_level VARCHAR(30) DEFAULT 'INTERMEDIATE' NOT NULL,
    PRIMARY KEY (job_role_id, skill_id)
);

-- 7. Institutes (ITIs & Polytechnics)
CREATE TABLE IF NOT EXISTS institutes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    mis_code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    district_id INT NOT NULL REFERENCES districts(id) ON DELETE RESTRICT,
    taluka VARCHAR(100) NOT NULL,
    institute_type VARCHAR(50) NOT NULL,
    address TEXT NOT NULL,
    pincode VARCHAR(6) NOT NULL,
    principal_name VARCHAR(150) NOT NULL,
    principal_email VARCHAR(255) NOT NULL,
    principal_phone VARCHAR(20) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- 8. Courses (Trades)
CREATE TABLE IF NOT EXISTS courses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    job_role_id UUID NOT NULL REFERENCES job_roles(id) ON DELETE RESTRICT,
    course_code VARCHAR(50) UNIQUE NOT NULL,
    title_en VARCHAR(200) NOT NULL,
    title_mr VARCHAR(200) NOT NULL,
    duration_months INT NOT NULL CHECK (duration_months > 0),
    nsqf_level INT NOT NULL CHECK (nsqf_level BETWEEN 1 AND 10),
    tuition_fee_inr NUMERIC(10, 2) DEFAULT 0.00 NOT NULL,
    curriculum_version VARCHAR(20) DEFAULT '1.0' NOT NULL,
    status VARCHAR(30) DEFAULT 'ACTIVE' NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- 9. Institute Courses
CREATE TABLE IF NOT EXISTS institute_courses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    institute_id UUID NOT NULL REFERENCES institutes(id) ON DELETE CASCADE,
    course_id UUID NOT NULL REFERENCES courses(id) ON DELETE RESTRICT,
    sanctioned_intake INT NOT NULL CHECK (sanctioned_intake > 0),
    enrolled_count INT DEFAULT 0 NOT NULL,
    academic_year VARCHAR(9) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
    UNIQUE(institute_id, course_id, academic_year)
);

-- 10. Placement Batches
CREATE TABLE IF NOT EXISTS placement_batches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    institute_id UUID NOT NULL REFERENCES institutes(id) ON DELETE RESTRICT,
    academic_year VARCHAR(9) NOT NULL,
    batch_month INT NOT NULL CHECK (batch_month BETWEEN 1 AND 12),
    file_name VARCHAR(255) NOT NULL,
    s3_object_key VARCHAR(500) NOT NULL,
    total_records INT DEFAULT 0 NOT NULL,
    valid_records INT DEFAULT 0 NOT NULL,
    error_records INT DEFAULT 0 NOT NULL,
    status VARCHAR(30) DEFAULT 'PENDING' NOT NULL,
    uploaded_by UUID NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- 11. Placement Records (Partitioned by batch_year)
CREATE TABLE IF NOT EXISTS placement_records (
    id UUID DEFAULT gen_random_uuid(),
    batch_id UUID NOT NULL REFERENCES placement_batches(id) ON DELETE CASCADE,
    institute_id UUID NOT NULL REFERENCES institutes(id) ON DELETE RESTRICT,
    course_id UUID NOT NULL REFERENCES courses(id) ON DELETE RESTRICT,
    candidate_hash VARCHAR(64) NOT NULL,
    batch_year INT NOT NULL,
    is_placed BOOLEAN NOT NULL,
    employer_name VARCHAR(200),
    job_role_title VARCHAR(200),
    monthly_salary NUMERIC(10, 2),
    months_to_placement INT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
    PRIMARY KEY (id, batch_year)
) PARTITION BY RANGE (batch_year);

CREATE TABLE IF NOT EXISTS placement_records_2024 PARTITION OF placement_records
    FOR VALUES FROM (2024) TO (2025);
CREATE TABLE IF NOT EXISTS placement_records_2025 PARTITION OF placement_records
    FOR VALUES FROM (2025) TO (2026);
CREATE TABLE IF NOT EXISTS placement_records_2026 PARTITION OF placement_records
    FOR VALUES FROM (2026) TO (2027);

-- 12. Gap Scores
CREATE TABLE IF NOT EXISTS gap_scores (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    district_id INT NOT NULL REFERENCES districts(id) ON DELETE CASCADE,
    sector_id INT NOT NULL REFERENCES sectors(id) ON DELETE CASCADE,
    job_role_id UUID NOT NULL REFERENCES job_roles(id) ON DELETE CASCADE,
    nsqf_level INT NOT NULL,
    demand_count INT NOT NULL,
    trained_capacity INT NOT NULL,
    placement_rate NUMERIC(5, 2) NOT NULL,
    gap_score NUMERIC(5, 2) NOT NULL CHECK (gap_score BETWEEN 0.00 AND 100.00),
    severity_level VARCHAR(30) NOT NULL,
    calculation_date DATE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
    UNIQUE(district_id, job_role_id, calculation_date)
);

-- 13. Recommendations
CREATE TABLE IF NOT EXISTS recommendations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    recommendation_code VARCHAR(30) UNIQUE NOT NULL,
    job_role_id UUID NOT NULL REFERENCES job_roles(id) ON DELETE RESTRICT,
    district_id INT NOT NULL REFERENCES districts(id) ON DELETE RESTRICT,
    recommendation_type VARCHAR(50) NOT NULL,
    title_en VARCHAR(255) NOT NULL,
    rationale_en TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'DRAFT' NOT NULL,
    assigned_ssc_id INT REFERENCES sscs(id),
    current_assignee_id UUID,
    submitted_at TIMESTAMPTZ,
    published_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- 14. Recommendation Evidence
CREATE TABLE IF NOT EXISTS recommendation_evidence (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    recommendation_id UUID NOT NULL REFERENCES recommendations(id) ON DELETE CASCADE,
    evidence_type VARCHAR(50) NOT NULL,
    payload JSONB NOT NULL,
    dossier_pdf_s3_key VARCHAR(500),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- 15. District Plans
CREATE TABLE IF NOT EXISTS district_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    district_id INT NOT NULL REFERENCES districts(id) ON DELETE RESTRICT,
    fiscal_year VARCHAR(9) NOT NULL,
    plan_type VARCHAR(30) DEFAULT 'ANNUAL' NOT NULL,
    status VARCHAR(30) DEFAULT 'DRAFT' NOT NULL,
    total_target_intake INT DEFAULT 0 NOT NULL,
    total_projected_placements INT DEFAULT 0 NOT NULL,
    total_estimated_budget NUMERIC(14, 2) DEFAULT 0.00 NOT NULL,
    created_by UUID NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
    UNIQUE(district_id, fiscal_year, plan_type)
);

-- 16. Audit Logs
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    actor_id UUID,
    actor_role VARCHAR(50) NOT NULL,
    ip_address INET,
    action VARCHAR(100) NOT NULL,
    resource_type VARCHAR(100) NOT NULL,
    resource_id VARCHAR(100) NOT NULL,
    old_values JSONB,
    new_values JSONB,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL
);
