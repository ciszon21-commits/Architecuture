-- PostgreSQL 資料模型草稿，2026-10-20；未執行遷移，需依正式需求審核。
-- 已發布版本不可覆寫；重疊生效區間與循環依賴由發布驗證器阻擋。
CREATE TABLE law (
  id text PRIMARY KEY,
  title text NOT NULL,
  jurisdiction text NOT NULL,
  authority text NOT NULL,
  official_url text NOT NULL
);
CREATE TABLE article (
  id text PRIMARY KEY,
  law_id text NOT NULL REFERENCES law(id),
  locator text NOT NULL,
  UNIQUE(law_id, locator)
);
CREATE TABLE source_snapshot (
  id text PRIMARY KEY,
  source_url text NOT NULL,
  retrieved_at timestamptz NOT NULL,
  storage_key text,
  sha256 text,
  reuse_status text NOT NULL DEFAULT 'pending',
  CHECK(sha256 IS NULL OR sha256 ~ '^[a-f0-9]{64}$')
);
CREATE TABLE article_version (
  id text PRIMARY KEY,
  article_id text NOT NULL REFERENCES article(id),
  snapshot_id text NOT NULL REFERENCES source_snapshot(id),
  promulgated_on date,
  effective_from date,
  effective_until date,
  effect_state text NOT NULL CHECK(effect_state IN ('scheduled','effective','repealed','unknown')),
  body text NOT NULL,
  text_sha256 text NOT NULL CHECK(text_sha256 ~ '^[a-f0-9]{64}$'),
  CHECK(effective_until IS NULL OR (effective_from IS NOT NULL AND effective_until > effective_from))
);
CREATE TABLE source_check (
  id text PRIMARY KEY,
  article_version_id text NOT NULL REFERENCES article_version(id),
  locator text NOT NULL,
  checked_at timestamptz NOT NULL,
  actor text NOT NULL,
  method text NOT NULL,
  evidence text NOT NULL,
  status text NOT NULL CHECK(status IN ('unverified','source_checked'))
);
CREATE TABLE exam_outline (
  id text PRIMARY KEY,
  exam_name text NOT NULL,
  revision_date date,
  first_applicable_year integer,
  snapshot_id text REFERENCES source_snapshot(id),
  verification_status text NOT NULL CHECK(verification_status IN ('pending','checked'))
);
CREATE TABLE outline_item (
  id text PRIMARY KEY,
  outline_id text NOT NULL REFERENCES exam_outline(id),
  subject text NOT NULL,
  official_locator text NOT NULL,
  official_text text NOT NULL
);
CREATE TABLE learning_unit (
  id text PRIMARY KEY,
  kind text NOT NULL CHECK(kind IN ('topic','diagram','rule','explanation')),
  title text NOT NULL
);
CREATE TABLE unit_revision (
  id text PRIMARY KEY,
  unit_id text NOT NULL REFERENCES learning_unit(id),
  revision integer NOT NULL CHECK(revision > 0),
  content jsonb NOT NULL,
  workflow_state text NOT NULL CHECK(workflow_state IN ('draft','in_review','approved','needs_review')),
  reviewed_by text,
  reviewed_at timestamptz,
  published_at timestamptz,
  UNIQUE(unit_id, revision),
  CHECK(workflow_state <> 'approved' OR (reviewed_by IS NOT NULL AND reviewed_at IS NOT NULL)),
  CHECK(published_at IS NULL OR (reviewed_by IS NOT NULL AND reviewed_at IS NOT NULL))
);
CREATE TABLE unit_citation (
  revision_id text NOT NULL REFERENCES unit_revision(id),
  article_version_id text NOT NULL REFERENCES article_version(id),
  claim_key text NOT NULL,
  locator text NOT NULL,
  source_check_id text REFERENCES source_check(id),
  PRIMARY KEY(revision_id, claim_key, article_version_id)
);
CREATE TABLE unit_dependency (
  revision_id text NOT NULL REFERENCES unit_revision(id),
  depends_on_revision_id text NOT NULL REFERENCES unit_revision(id),
  PRIMARY KEY(revision_id, depends_on_revision_id),
  CHECK(revision_id <> depends_on_revision_id)
);
CREATE TABLE scope_mapping (
  outline_item_id text NOT NULL REFERENCES outline_item(id),
  unit_id text NOT NULL REFERENCES learning_unit(id),
  coverage text NOT NULL CHECK(coverage IN ('planned','partial','reviewed')),
  PRIMARY KEY(outline_item_id, unit_id)
);
CREATE TABLE question (
  id text PRIMARY KEY,
  origin text NOT NULL CHECK(origin IN ('official','authored')),
  exam_year integer,
  subject text NOT NULL,
  question_number text,
  source_snapshot_id text REFERENCES source_snapshot(id),
  body jsonb NOT NULL,
  CHECK(origin <> 'official' OR (source_snapshot_id IS NOT NULL AND exam_year IS NOT NULL))
);
CREATE TABLE answer_version (
  id text PRIMARY KEY,
  question_id text NOT NULL REFERENCES question(id),
  kind text NOT NULL CHECK(kind IN ('official_answer','official_correction','editorial')),
  answer jsonb NOT NULL,
  source_snapshot_id text REFERENCES source_snapshot(id),
  issued_on date,
  supersedes_id text REFERENCES answer_version(id),
  CHECK(kind = 'editorial' OR source_snapshot_id IS NOT NULL)
);
CREATE TABLE question_explanation (
  question_id text NOT NULL REFERENCES question(id),
  revision_id text NOT NULL REFERENCES unit_revision(id),
  context text NOT NULL CHECK(context IN ('historical_exam','current_law')),
  applicability_basis text NOT NULL,
  PRIMARY KEY(question_id, revision_id)
);
-- 正式環境須由身分驗證服務對應帳號，套用資料列權限或等效伺服器授權。
CREATE TABLE learner (
  id uuid PRIMARY KEY,
  external_subject text UNIQUE NOT NULL
);
CREATE TABLE attempt (
  id uuid PRIMARY KEY,
  learner_id uuid NOT NULL REFERENCES learner(id),
  question_id text NOT NULL REFERENCES question(id),
  answer_version_id text REFERENCES answer_version(id),
  submitted_answer jsonb NOT NULL,
  correct boolean,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE bookmark (
  learner_id uuid NOT NULL REFERENCES learner(id),
  unit_id text NOT NULL REFERENCES learning_unit(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY(learner_id, unit_id)
);
CREATE INDEX article_version_lookup ON article_version(article_id, effective_from);
CREATE INDEX citation_impact_lookup ON unit_citation(article_version_id);
CREATE INDEX dependency_impact_lookup ON unit_dependency(depends_on_revision_id);
-- 發布驗證器另驗：引用的source_check對應同一article_version、題解版本適用性、
-- 生效區間、規則單位與邊界案例、專業審核身分、依賴圖循環及修法重審狀態。
