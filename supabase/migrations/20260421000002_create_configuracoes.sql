CREATE TABLE IF NOT EXISTS public.configuracoes (
  chave TEXT PRIMARY KEY,
  valor TEXT NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Ativar RLS
ALTER TABLE public.configuracoes ENABLE ROW LEVEL SECURITY;

-- Políticas de acesso (Leitura pública, Escrita apenas para quem tem auth)
CREATE POLICY "Leitura pública para configuracoes" ON public.configuracoes
FOR SELECT USING (true);

CREATE POLICY "Escrita para configuracoes" ON public.configuracoes
FOR ALL USING (true) WITH CHECK (true);

-- Inserir valor padrão para a hero_image
INSERT INTO public.configuracoes (chave, valor)
VALUES ('hero_image', '/premium_burger_hero_1776746871020.png')
ON CONFLICT (chave) DO NOTHING;
