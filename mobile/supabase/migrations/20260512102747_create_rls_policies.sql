-- =====================================================
-- CORREÇÃO COMPLETA DAS POLÍTICAS RLS - MEU CORRE APP
-- Execute este script no Supabase Dashboard > SQL Editor
-- =====================================================

-- ============ TABELA: profiles ============
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Remove políticas antigas (se existirem)
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can delete own profile" ON profiles;

-- Cria políticas corretas
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can delete own profile"
  ON profiles FOR DELETE
  USING (auth.uid() = id);

-- ============ TABELA: transactions ============
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own transactions" ON transactions;
DROP POLICY IF EXISTS "Users can insert own transactions" ON transactions;
DROP POLICY IF EXISTS "Users can update own transactions" ON transactions;
DROP POLICY IF EXISTS "Users can delete own transactions" ON transactions;

CREATE POLICY "Users can view own transactions"
  ON transactions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own transactions"
  ON transactions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own transactions"
  ON transactions FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own transactions"
  ON transactions FOR DELETE
  USING (auth.uid() = user_id);

-- ============ TABELA: clients ============
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own clients" ON clients;
DROP POLICY IF EXISTS "Users can insert own clients" ON clients;
DROP POLICY IF EXISTS "Users can update own clients" ON clients;
DROP POLICY IF EXISTS "Users can delete own clients" ON clients;

CREATE POLICY "Users can view own clients"
  ON clients FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own clients"
  ON clients FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own clients"
  ON clients FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own clients"
  ON clients FOR DELETE
  USING (auth.uid() = user_id);

-- ============ TABELA: appointments ============
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own appointments" ON appointments;
DROP POLICY IF EXISTS "Users can insert own appointments" ON appointments;
DROP POLICY IF EXISTS "Users can update own appointments" ON appointments;
DROP POLICY IF EXISTS "Users can delete own appointments" ON appointments;

CREATE POLICY "Users can view own appointments"
  ON appointments FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own appointments"
  ON appointments FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own appointments"
  ON appointments FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own appointments"
  ON appointments FOR DELETE
  USING (auth.uid() = user_id);

-- ============ TABELA: receipts (se existir) ============
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'receipts') THEN
    ALTER TABLE receipts ENABLE ROW LEVEL SECURITY;
    
    DROP POLICY IF EXISTS "Users can view own receipts" ON receipts;
    DROP POLICY IF EXISTS "Users can insert own receipts" ON receipts;
    DROP POLICY IF EXISTS "Users can update own receipts" ON receipts;
    DROP POLICY IF EXISTS "Users can delete own receipts" ON receipts;

    EXECUTE 'CREATE POLICY "Users can view own receipts" ON receipts FOR SELECT USING (auth.uid() = user_id)';
    EXECUTE 'CREATE POLICY "Users can insert own receipts" ON receipts FOR INSERT WITH CHECK (auth.uid() = user_id)';
    EXECUTE 'CREATE POLICY "Users can update own receipts" ON receipts FOR UPDATE USING (auth.uid() = user_id)';
    EXECUTE 'CREATE POLICY "Users can delete own receipts" ON receipts FOR DELETE USING (auth.uid() = user_id)';
  END IF;
END $$;

-- ============ TRIGGER: Criar perfil automaticamente no signup ============
-- Isso garante que todo usuário novo já tenha um registro na tabela profiles

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, name)
  VALUES (
    new.id,
    COALESCE(
      new.raw_user_meta_data->>'name',
      new.raw_user_meta_data->>'full_name',
      split_part(new.email, '@', 1)
    )
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN new;
END;
$$;

-- Remove trigger antigo se existir
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Cria trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- ============ VERIFICAÇÃO: Lista todas as políticas RLS ============
SELECT
  schemaname,
  tablename,
  policyname,
  cmd,
  qual
FROM pg_policies
WHERE tablename IN ('profiles', 'transactions', 'clients', 'appointments')
ORDER BY tablename, cmd;


-- Ensure existing auth users have a profile
INSERT INTO public.profiles (id, name)
SELECT 
  id,
  COALESCE(raw_user_meta_data->>'name', raw_user_meta_data->>'full_name', email)
FROM auth.users
ON CONFLICT (id) DO NOTHING;
