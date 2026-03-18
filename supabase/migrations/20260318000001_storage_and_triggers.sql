-- ============================================
-- GardenGreen — Storage Buckets + Auth Trigger
-- Date: 2026-03-18
-- ============================================

-- STORAGE BUCKETS
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES
  ('garden-photos', 'garden-photos', false, 1048576, ARRAY['image/jpeg', 'image/png', 'image/webp']),
  ('avatars', 'avatars', true, 524288, ARRAY['image/jpeg', 'image/png']),
  ('report-images', 'report-images', false, 2097152, ARRAY['image/png'])
ON CONFLICT (id) DO NOTHING;

-- STORAGE POLICIES: garden-photos
CREATE POLICY "garden_photos_select_own" ON storage.objects FOR SELECT
  USING (bucket_id = 'garden-photos' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "garden_photos_insert_own" ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'garden-photos' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "garden_photos_delete_own" ON storage.objects FOR DELETE
  USING (bucket_id = 'garden-photos' AND auth.uid()::text = (storage.foldername(name))[1]);

-- STORAGE POLICIES: avatars (public read)
CREATE POLICY "avatars_select_all" ON storage.objects FOR SELECT
  USING (bucket_id = 'avatars');

CREATE POLICY "avatars_insert_own" ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

-- STORAGE POLICIES: report-images
CREATE POLICY "report_images_select_own" ON storage.objects FOR SELECT
  USING (bucket_id = 'report-images' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "report_images_insert_own" ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'report-images' AND auth.uid()::text = (storage.foldername(name))[1]);

-- ============================================
-- TRIGGER: Auto-create user profile on signup
-- ============================================
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, name, email, phone)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', 'Jardineiro'),
    NEW.email,
    NEW.phone
  );

  INSERT INTO public.notification_preferences (user_id)
  VALUES (NEW.id);

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
