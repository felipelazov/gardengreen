-- ============================================
-- GardenGreen — Initial Schema Migration
-- Version: 1.0.0
-- Date: 2026-03-17
-- Author: @data-engineer (Dara)
-- Source: docs/architecture.md (Section 9)
-- ============================================
-- This migration creates the complete initial schema for GardenGreen.
-- Includes: extensions, enums, tables, triggers, indexes.
-- RLS policies are in a separate migration (20260317000002).
-- ============================================

-- EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- CUSTOM TYPES (ENUMS)
CREATE TYPE service_status AS ENUM ('scheduled', 'in_progress', 'completed', 'cancelled');
CREATE TYPE payment_status AS ENUM ('pending', 'paid', 'refunded', 'overdue');
CREATE TYPE payment_method AS ENUM ('pix_app', 'pix_direct', 'cash', 'transfer', 'other');
CREATE TYPE quote_status AS ENUM ('draft', 'sent', 'approved', 'rejected', 'expired');
CREATE TYPE recurrence_frequency AS ENUM ('weekly', 'biweekly', 'monthly');
CREATE TYPE photo_type AS ENUM ('before', 'after');
CREATE TYPE upload_status AS ENUM ('pending', 'uploading', 'uploaded', 'failed');
CREATE TYPE team_member_role AS ENUM ('admin', 'member');
CREATE TYPE team_member_status AS ENUM ('invited', 'active', 'inactive');
CREATE TYPE client_status AS ENUM ('active', 'inactive');
CREATE TYPE expense_category AS ENUM ('fuel', 'tools', 'supplies', 'maintenance', 'other');
CREATE TYPE user_plan AS ENUM ('free', 'solo', 'team');
CREATE TYPE user_role AS ENUM ('gardener', 'admin', 'member');

-- TRIGGER FUNCTION: auto-update updated_at
CREATE OR REPLACE FUNCTION trigger_set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- TABLE: users (perfil do jardineiro)
-- ============================================
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  city TEXT,
  service_type TEXT,
  avatar_url TEXT,
  cnpj_mei TEXT,
  address TEXT,
  plan user_plan NOT NULL DEFAULT 'free',
  role user_role NOT NULL DEFAULT 'gardener',
  team_id UUID,
  onboarding_completed BOOLEAN NOT NULL DEFAULT FALSE,
  profile_completion INTEGER NOT NULL DEFAULT 0 CHECK (profile_completion >= 0 AND profile_completion <= 100),
  expo_push_token TEXT,
  timezone TEXT NOT NULL DEFAULT 'America/Sao_Paulo',
  stripe_customer_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE users IS 'Perfil do jardineiro/usuario. Vinculado a auth.users via FK.';
COMMENT ON COLUMN users.plan IS 'Plano: free (trial), solo (R$29-49), team (R$99-199)';
COMMENT ON COLUMN users.profile_completion IS 'Porcentagem de completude do perfil (0-100)';

CREATE TRIGGER set_users_updated_at
  BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

CREATE INDEX idx_users_team_id ON users(team_id);
CREATE INDEX idx_users_plan ON users(plan);
CREATE INDEX idx_users_expo_push_token ON users(expo_push_token) WHERE expo_push_token IS NOT NULL;

-- ============================================
-- TABLE: teams
-- ============================================
CREATE TABLE teams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  plan user_plan NOT NULL DEFAULT 'team',
  max_members INTEGER NOT NULL DEFAULT 5,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE teams IS 'Equipes de jardinagem. Plano Equipe habilita.';

CREATE TRIGGER set_teams_updated_at
  BEFORE UPDATE ON teams FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

CREATE INDEX idx_teams_owner_id ON teams(owner_id);

-- FK circular resolvida apos criacao de teams
ALTER TABLE users ADD CONSTRAINT fk_users_team_id FOREIGN KEY (team_id) REFERENCES teams(id) ON DELETE SET NULL;

-- ============================================
-- TABLE: team_members
-- ============================================
CREATE TABLE team_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role team_member_role NOT NULL DEFAULT 'member',
  status team_member_status NOT NULL DEFAULT 'invited',
  invited_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  joined_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(team_id, user_id)
);

CREATE TRIGGER set_team_members_updated_at
  BEFORE UPDATE ON team_members FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

CREATE INDEX idx_team_members_team_id ON team_members(team_id);
CREATE INDEX idx_team_members_user_id ON team_members(user_id);

-- ============================================
-- TABLE: clients
-- ============================================
CREATE TABLE clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  address TEXT,
  neighborhood TEXT,
  city TEXT,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  notes TEXT,
  status client_status NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE clients IS 'Clientes do jardineiro. Nome + telefone obrigatorios, resto progressivo.';

CREATE TRIGGER set_clients_updated_at
  BEFORE UPDATE ON clients FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

CREATE INDEX idx_clients_user_id ON clients(user_id);
CREATE INDEX idx_clients_phone ON clients(user_id, phone);
CREATE INDEX idx_clients_name_trgm ON clients USING gin(name gin_trgm_ops);
CREATE INDEX idx_clients_status ON clients(user_id, status);

-- ============================================
-- TABLE: recurrences
-- ============================================
CREATE TABLE recurrences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  service_type TEXT NOT NULL,
  value INTEGER NOT NULL DEFAULT 0 CHECK (value >= 0),
  frequency recurrence_frequency NOT NULL,
  day_of_week INTEGER NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6),
  time TIME,
  active BOOLEAN NOT NULL DEFAULT TRUE,
  next_generation_date DATE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE recurrences IS 'Servicos recorrentes (ex: toda terca no Sr. Joao). Gera services automaticamente.';
COMMENT ON COLUMN recurrences.value IS 'Valor em centavos (ex: 15000 = R$150,00)';

CREATE TRIGGER set_recurrences_updated_at
  BEFORE UPDATE ON recurrences FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

CREATE INDEX idx_recurrences_user_id ON recurrences(user_id);
CREATE INDEX idx_recurrences_active ON recurrences(active, next_generation_date) WHERE active = TRUE;

-- ============================================
-- TABLE: quotes (orcamentos)
-- ============================================
CREATE TABLE quotes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  number TEXT NOT NULL,
  items JSONB NOT NULL DEFAULT '[]',
  total INTEGER NOT NULL DEFAULT 0 CHECK (total >= 0),
  status quote_status NOT NULL DEFAULT 'draft',
  valid_until DATE NOT NULL,
  sent_at TIMESTAMPTZ,
  approved_at TIMESTAMPTZ,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, number)
);

COMMENT ON TABLE quotes IS 'Orcamentos enviados para clientes. Items em JSONB [{description, value}].';
COMMENT ON COLUMN quotes.total IS 'Valor total em centavos';

CREATE TRIGGER set_quotes_updated_at
  BEFORE UPDATE ON quotes FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

CREATE INDEX idx_quotes_user_id ON quotes(user_id);
CREATE INDEX idx_quotes_client_id ON quotes(client_id);
CREATE INDEX idx_quotes_status ON quotes(user_id, status);
CREATE INDEX idx_quotes_valid_until ON quotes(valid_until) WHERE status = 'sent';

-- ============================================
-- TABLE: services (servicos agendados)
-- ============================================
CREATE TABLE services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  time TIME,
  type TEXT NOT NULL,
  description TEXT,
  value INTEGER NOT NULL DEFAULT 0 CHECK (value >= 0),
  status service_status NOT NULL DEFAULT 'scheduled',
  recurrence_id UUID REFERENCES recurrences(id) ON DELETE SET NULL,
  assigned_to UUID REFERENCES users(id) ON DELETE SET NULL,
  team_id UUID REFERENCES teams(id) ON DELETE SET NULL,
  quote_id UUID REFERENCES quotes(id) ON DELETE SET NULL,
  notes TEXT,
  completed_at TIMESTAMPTZ,
  cancelled_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE services IS 'Servicos agendados. Entidade central do app.';
COMMENT ON COLUMN services.value IS 'Valor em centavos';
COMMENT ON COLUMN services.assigned_to IS 'Membro da equipe atribuido (plano Equipe)';

CREATE TRIGGER set_services_updated_at
  BEFORE UPDATE ON services FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

CREATE INDEX idx_services_user_id ON services(user_id);
CREATE INDEX idx_services_client_id ON services(client_id);
CREATE INDEX idx_services_date ON services(user_id, date);
CREATE INDEX idx_services_status ON services(user_id, status);
CREATE INDEX idx_services_assigned_to ON services(assigned_to) WHERE assigned_to IS NOT NULL;
CREATE INDEX idx_services_team_id ON services(team_id) WHERE team_id IS NOT NULL;
CREATE INDEX idx_services_recurrence ON services(recurrence_id) WHERE recurrence_id IS NOT NULL;
CREATE INDEX idx_services_date_status ON services(user_id, date, status);

-- ============================================
-- TABLE: payments
-- ============================================
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id UUID NOT NULL REFERENCES services(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  amount INTEGER NOT NULL CHECK (amount > 0),
  method payment_method NOT NULL DEFAULT 'pix_app',
  status payment_status NOT NULL DEFAULT 'pending',
  pix_transaction_id TEXT,
  pix_qr_code TEXT,
  pix_copy_paste TEXT,
  pix_link TEXT,
  pix_expires_at TIMESTAMPTZ,
  paid_at TIMESTAMPTZ,
  refunded_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE payments IS 'Pagamentos de servicos. Suporta PIX integrado, manual e outros.';
COMMENT ON COLUMN payments.amount IS 'Valor em centavos';

CREATE TRIGGER set_payments_updated_at
  BEFORE UPDATE ON payments FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

CREATE INDEX idx_payments_service_id ON payments(service_id);
CREATE INDEX idx_payments_user_id ON payments(user_id);
CREATE INDEX idx_payments_client_id ON payments(client_id);
CREATE INDEX idx_payments_status ON payments(user_id, status);
CREATE INDEX idx_payments_paid_at ON payments(user_id, paid_at) WHERE paid_at IS NOT NULL;
CREATE INDEX idx_payments_pix_transaction ON payments(pix_transaction_id) WHERE pix_transaction_id IS NOT NULL;

-- ============================================
-- TABLE: expenses (despesas)
-- ============================================
CREATE TABLE expenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  amount INTEGER NOT NULL CHECK (amount > 0),
  category expense_category NOT NULL DEFAULT 'other',
  date DATE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE expenses IS 'Despesas do jardineiro (combustivel, ferramentas, insumos).';
COMMENT ON COLUMN expenses.amount IS 'Valor em centavos';

CREATE TRIGGER set_expenses_updated_at
  BEFORE UPDATE ON expenses FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

CREATE INDEX idx_expenses_user_id ON expenses(user_id);
CREATE INDEX idx_expenses_date ON expenses(user_id, date);
CREATE INDEX idx_expenses_category ON expenses(user_id, category);

-- ============================================
-- TABLE: photos
-- ============================================
CREATE TABLE photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id UUID NOT NULL REFERENCES services(id) ON DELETE CASCADE,
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type photo_type NOT NULL,
  url TEXT,
  local_path TEXT,
  upload_status upload_status NOT NULL DEFAULT 'pending',
  file_size INTEGER NOT NULL DEFAULT 0,
  width INTEGER NOT NULL DEFAULT 0,
  height INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER set_photos_updated_at
  BEFORE UPDATE ON photos FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

CREATE INDEX idx_photos_service_id ON photos(service_id);
CREATE INDEX idx_photos_client_id ON photos(client_id);
CREATE INDEX idx_photos_user_id ON photos(user_id);
CREATE INDEX idx_photos_upload_status ON photos(upload_status) WHERE upload_status != 'uploaded';

-- ============================================
-- TABLE: notes
-- ============================================
CREATE TABLE notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER set_notes_updated_at
  BEFORE UPDATE ON notes FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

CREATE INDEX idx_notes_client_id ON notes(client_id);
CREATE INDEX idx_notes_user_id ON notes(user_id);

-- ============================================
-- TABLE: notification_preferences
-- ============================================
CREATE TABLE notification_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE UNIQUE,
  morning_enabled BOOLEAN NOT NULL DEFAULT TRUE,
  morning_time TIME NOT NULL DEFAULT '06:00',
  evening_enabled BOOLEAN NOT NULL DEFAULT TRUE,
  evening_time TIME NOT NULL DEFAULT '20:00',
  payment_reminder_enabled BOOLEAN NOT NULL DEFAULT TRUE,
  payment_reminder_days INTEGER NOT NULL DEFAULT 3 CHECK (payment_reminder_days IN (1, 3, 5, 7)),
  monthly_report_enabled BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER set_notification_preferences_updated_at
  BEFORE UPDATE ON notification_preferences FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

-- ============================================
-- TABLE: monthly_reports
-- ============================================
CREATE TABLE monthly_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  month INTEGER NOT NULL CHECK (month >= 1 AND month <= 12),
  year INTEGER NOT NULL CHECK (year >= 2024),
  total_revenue INTEGER NOT NULL DEFAULT 0,
  total_expenses INTEGER NOT NULL DEFAULT 0,
  net_profit INTEGER NOT NULL DEFAULT 0,
  services_completed INTEGER NOT NULL DEFAULT 0,
  clients_served INTEGER NOT NULL DEFAULT 0,
  pending_payments INTEGER NOT NULL DEFAULT 0,
  pending_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, month, year)
);

COMMENT ON TABLE monthly_reports IS 'Relatorio mensal gerado automaticamente. Aha Moment do produto.';
COMMENT ON COLUMN monthly_reports.total_revenue IS 'Total de receitas em centavos';

CREATE INDEX idx_monthly_reports_user_id ON monthly_reports(user_id);
CREATE INDEX idx_monthly_reports_period ON monthly_reports(user_id, year, month);
