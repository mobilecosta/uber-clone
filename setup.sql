-- Script de configuração do banco de dados para o Clone do Uber
-- Cole este script no SQL Editor do seu projeto Supabase para criar as tabelas e ativar o Realtime.

-- 1. Habilitar a extensão UUID (geralmente ativa por padrão)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Tabela de Perfis (Passageiro e Motorista)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT UNIQUE,
    role TEXT NOT NULL CHECK (role IN ('passenger', 'driver')),
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'offline')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 3. Tabela de Corridas (Rides)
CREATE TABLE IF NOT EXISTS public.rides (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    passenger_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    driver_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    origin_address TEXT NOT NULL,
    origin_lat DOUBLE PRECISION NOT NULL,
    origin_lng DOUBLE PRECISION NOT NULL,
    dest_address TEXT NOT NULL,
    dest_lat DOUBLE PRECISION NOT NULL,
    dest_lng DOUBLE PRECISION NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('UberX', 'UberVIP', 'UberBlack', 'UberFlash')),
    status TEXT NOT NULL DEFAULT 'requested' CHECK (status IN ('requested', 'accepted', 'arrived', 'in_progress', 'completed', 'cancelled')),
    price NUMERIC(10, 2) NOT NULL,
    driver_lat DOUBLE PRECISION,
    driver_lng DOUBLE PRECISION,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 4. Tabela de Mensagens do Chat
CREATE TABLE IF NOT EXISTS public.messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ride_id UUID REFERENCES public.rides(id) ON DELETE CASCADE,
    sender_role TEXT NOT NULL CHECK (sender_role IN ('passenger', 'driver')),
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 5. Configurar o Supabase Realtime para publicar atualizações destas tabelas
-- Habilita o Realtime para as tabelas criadas
alter publication supabase_realtime add table public.profiles;
alter publication supabase_realtime add table public.rides;
alter publication supabase_realtime add table public.messages;

-- 6. Inserir dados de perfis iniciais simulados para demonstração rápida (opcional)
-- Caso o usuário queira testar sem registrar novos usuários
INSERT INTO public.profiles (id, name, email, role, status) VALUES
('a1111111-1111-1111-1111-111111111111', 'Carlos Passageiro', 'carlos@example.com', 'passenger', 'active')
ON CONFLICT (email) DO NOTHING;

INSERT INTO public.profiles (id, name, email, role, status) VALUES
('b2222222-2222-2222-2222-222222222222', 'Ronaldo Motorista', 'ronaldo@example.com', 'driver', 'active')
ON CONFLICT (email) DO NOTHING;
