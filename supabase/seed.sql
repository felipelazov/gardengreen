-- ============================================
-- GardenGreen — Seed Data (Development)
-- Jardineiro de teste: Seu Joao
-- ============================================
-- NOTA: Este seed assume que um usuario auth existe.
-- Para desenvolvimento local, crie o usuario via Supabase Studio
-- e substitua o UUID abaixo.
-- ============================================

-- Placeholder UUID (substituir pelo auth.uid do usuario de teste)
-- Em dev local: crie conta via Studio > Authentication > Add User
-- Depois copie o UUID aqui

DO $$
DECLARE
  test_user_id UUID := '00000000-0000-0000-0000-000000000001'; -- SUBSTITUIR
  client_1_id UUID;
  client_2_id UUID;
  client_3_id UUID;
  service_1_id UUID;
  service_2_id UUID;
BEGIN

  -- Inserir perfil de teste (so funciona se auth.user ja existe)
  -- INSERT INTO users (id, name, phone, city, service_type, plan, onboarding_completed)
  -- VALUES (test_user_id, 'Seu Joao', '+5511999999999', 'Sao Paulo', 'Manutencao', 'solo', true);

  -- Clientes de teste
  client_1_id := uuid_generate_v4();
  client_2_id := uuid_generate_v4();
  client_3_id := uuid_generate_v4();

  INSERT INTO clients (id, user_id, name, phone, address, city, status) VALUES
    (client_1_id, test_user_id, 'Maria Silva', '+5511988887777', 'Rua das Flores 123', 'Sao Paulo', 'active'),
    (client_2_id, test_user_id, 'Jose Santos', '+5511977776666', 'Av. Paulista 456', 'Sao Paulo', 'active'),
    (client_3_id, test_user_id, 'Ana Oliveira', '+5511966665555', 'Rua do Jardim 789', 'Sao Paulo', 'active');

  -- Servicos de teste (proximos dias)
  service_1_id := uuid_generate_v4();
  service_2_id := uuid_generate_v4();

  INSERT INTO services (id, user_id, client_id, date, time, type, value, status) VALUES
    (service_1_id, test_user_id, client_1_id, CURRENT_DATE, '08:00', 'Manutencao', 15000, 'scheduled'),
    (service_2_id, test_user_id, client_2_id, CURRENT_DATE, '14:00', 'Poda', 20000, 'scheduled'),
    (uuid_generate_v4(), test_user_id, client_3_id, CURRENT_DATE + 1, '09:00', 'Plantio', 35000, 'scheduled'),
    (uuid_generate_v4(), test_user_id, client_1_id, CURRENT_DATE + 7, '08:00', 'Manutencao', 15000, 'scheduled');

  -- Servico concluido com pagamento
  INSERT INTO services (id, user_id, client_id, date, time, type, value, status, completed_at) VALUES
    (uuid_generate_v4(), test_user_id, client_2_id, CURRENT_DATE - 3, '10:00', 'Manutencao', 15000, 'completed', NOW() - INTERVAL '3 days');

  -- Pagamento de teste
  INSERT INTO payments (service_id, user_id, client_id, amount, method, status, paid_at) VALUES
    (service_1_id, test_user_id, client_1_id, 15000, 'pix_direct', 'paid', NOW() - INTERVAL '3 days');

  -- Despesas de teste
  INSERT INTO expenses (user_id, description, amount, category, date) VALUES
    (test_user_id, 'Gasolina', 8000, 'fuel', CURRENT_DATE - 2),
    (test_user_id, 'Tesoura de poda nova', 12000, 'tools', CURRENT_DATE - 5),
    (test_user_id, 'Adubo organico', 4500, 'supplies', CURRENT_DATE - 1);

  -- Notas de teste
  INSERT INTO notes (client_id, user_id, content) VALUES
    (client_1_id, test_user_id, 'Portao azul, tocar campainha 2x. Cachorro no quintal (manso).'),
    (client_2_id, test_user_id, 'Apartamento cobertura. Interfone 301. Estacionamento visitante.'),
    (client_3_id, test_user_id, 'Preferencia por plantas nativas. Alergia a fertilizante quimico.');

  -- Preferencias de notificacao
  INSERT INTO notification_preferences (user_id, morning_enabled, morning_time, evening_enabled, evening_time)
  VALUES (test_user_id, true, '06:00', true, '20:00');

  RAISE NOTICE 'Seed data inserted for user %', test_user_id;
END $$;
