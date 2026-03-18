-- ============================================
-- GardenGreen — RLS Policies Migration
-- Version: 1.0.0
-- Date: 2026-03-17
-- Author: @data-engineer (Dara)
-- Source: docs/architecture.md (Section 5.1)
-- ============================================
-- Multi-tenant isolation via RLS.
-- Principio: usuario ve apenas seus proprios dados.
-- Excecao: membros de equipe veem dados da equipe (com restricoes por role).
-- ============================================

-- ENABLE RLS ON ALL TABLES
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE recurrences ENABLE ROW LEVEL SECURITY;
ALTER TABLE quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE monthly_reports ENABLE ROW LEVEL SECURITY;

-- ============================================
-- USERS: ve/edita apenas seu proprio perfil
-- ============================================
CREATE POLICY "users_select_own" ON users FOR SELECT USING (id = auth.uid());
CREATE POLICY "users_update_own" ON users FOR UPDATE USING (id = auth.uid());
CREATE POLICY "users_insert_own" ON users FOR INSERT WITH CHECK (id = auth.uid());

-- ============================================
-- CLIENTS: usuario ve apenas seus clientes
-- ============================================
CREATE POLICY "clients_select_own" ON clients FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "clients_insert_own" ON clients FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "clients_update_own" ON clients FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY "clients_delete_own" ON clients FOR DELETE USING (user_id = auth.uid());

-- ============================================
-- SERVICES: dono ve tudo, membro ve atribuidos, admin ve equipe
-- ============================================
CREATE POLICY "services_select_own_or_assigned" ON services FOR SELECT
  USING (
    user_id = auth.uid()
    OR assigned_to = auth.uid()
    OR team_id IN (
      SELECT team_id FROM team_members
      WHERE user_id = auth.uid() AND role = 'admin' AND status = 'active'
    )
  );
CREATE POLICY "services_insert_own" ON services FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "services_update_own_or_admin" ON services FOR UPDATE
  USING (
    user_id = auth.uid()
    OR team_id IN (
      SELECT team_id FROM team_members
      WHERE user_id = auth.uid() AND role = 'admin' AND status = 'active'
    )
  );
CREATE POLICY "services_delete_own" ON services FOR DELETE USING (user_id = auth.uid());

-- ============================================
-- RECURRENCES
-- ============================================
CREATE POLICY "recurrences_select_own" ON recurrences FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "recurrences_insert_own" ON recurrences FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "recurrences_update_own" ON recurrences FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY "recurrences_delete_own" ON recurrences FOR DELETE USING (user_id = auth.uid());

-- ============================================
-- QUOTES (orcamentos)
-- ============================================
CREATE POLICY "quotes_select_own" ON quotes FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "quotes_insert_own" ON quotes FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "quotes_update_own" ON quotes FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY "quotes_delete_own" ON quotes FOR DELETE USING (user_id = auth.uid());

-- ============================================
-- PAYMENTS
-- ============================================
CREATE POLICY "payments_select_own" ON payments FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "payments_insert_own" ON payments FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "payments_update_own" ON payments FOR UPDATE USING (user_id = auth.uid());

-- ============================================
-- EXPENSES
-- ============================================
CREATE POLICY "expenses_select_own" ON expenses FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "expenses_insert_own" ON expenses FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "expenses_update_own" ON expenses FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY "expenses_delete_own" ON expenses FOR DELETE USING (user_id = auth.uid());

-- ============================================
-- PHOTOS
-- ============================================
CREATE POLICY "photos_select_own" ON photos FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "photos_insert_own" ON photos FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "photos_update_own" ON photos FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY "photos_delete_own" ON photos FOR DELETE USING (user_id = auth.uid());

-- ============================================
-- NOTES
-- ============================================
CREATE POLICY "notes_select_own" ON notes FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "notes_insert_own" ON notes FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "notes_update_own" ON notes FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY "notes_delete_own" ON notes FOR DELETE USING (user_id = auth.uid());

-- ============================================
-- TEAMS: membros veem a equipe, dono gerencia
-- ============================================
CREATE POLICY "teams_select_member" ON teams FOR SELECT
  USING (owner_id = auth.uid() OR id IN (SELECT team_id FROM team_members WHERE user_id = auth.uid()));
CREATE POLICY "teams_insert_owner" ON teams FOR INSERT WITH CHECK (owner_id = auth.uid());
CREATE POLICY "teams_update_owner" ON teams FOR UPDATE USING (owner_id = auth.uid());

-- ============================================
-- TEAM_MEMBERS: membro ve colegas, admin gerencia
-- ============================================
CREATE POLICY "team_members_select" ON team_members FOR SELECT
  USING (user_id = auth.uid() OR team_id IN (SELECT team_id FROM team_members WHERE user_id = auth.uid()));
CREATE POLICY "team_members_insert_admin" ON team_members FOR INSERT
  WITH CHECK (team_id IN (SELECT id FROM teams WHERE owner_id = auth.uid()));
CREATE POLICY "team_members_update_admin" ON team_members FOR UPDATE
  USING (team_id IN (SELECT id FROM teams WHERE owner_id = auth.uid()));
CREATE POLICY "team_members_delete_admin" ON team_members FOR DELETE
  USING (team_id IN (SELECT id FROM teams WHERE owner_id = auth.uid()));

-- ============================================
-- NOTIFICATION_PREFERENCES
-- ============================================
CREATE POLICY "notif_prefs_select_own" ON notification_preferences FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "notif_prefs_insert_own" ON notification_preferences FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "notif_prefs_update_own" ON notification_preferences FOR UPDATE USING (user_id = auth.uid());

-- ============================================
-- MONTHLY_REPORTS
-- ============================================
CREATE POLICY "reports_select_own" ON monthly_reports FOR SELECT USING (user_id = auth.uid());

-- ============================================
-- STORAGE BUCKETS
-- ============================================
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES
  ('garden-photos', 'garden-photos', false, 1048576, ARRAY['image/jpeg', 'image/png', 'image/webp']),
  ('avatars', 'avatars', false, 524288, ARRAY['image/jpeg', 'image/png']),
  ('report-images', 'report-images', false, 2097152, ARRAY['image/png'])
ON CONFLICT (id) DO NOTHING;

-- Storage policies: usuario acessa apenas suas fotos
CREATE POLICY "garden_photos_select" ON storage.objects FOR SELECT
  USING (bucket_id = 'garden-photos' AND (storage.foldername(name))[1] = auth.uid()::text);
CREATE POLICY "garden_photos_insert" ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'garden-photos' AND (storage.foldername(name))[1] = auth.uid()::text);
CREATE POLICY "garden_photos_delete" ON storage.objects FOR DELETE
  USING (bucket_id = 'garden-photos' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "avatars_select" ON storage.objects FOR SELECT
  USING (bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text);
CREATE POLICY "avatars_insert" ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text);
