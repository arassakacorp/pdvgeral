-- Função utilitária para updated_at (idempotente)
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Tabela de produtos
CREATE TABLE public.produtos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT NOT NULL,
  categoria TEXT NOT NULL DEFAULT 'Outros',
  custo_unit NUMERIC NOT NULL DEFAULT 0,
  qntd_comprada INTEGER NOT NULL DEFAULT 0,
  valor_venda NUMERIC NOT NULL DEFAULT 0,
  qntd_vendida INTEGER NOT NULL DEFAULT 0,
  custo_total NUMERIC GENERATED ALWAYS AS (custo_unit * qntd_comprada) STORED,
  venda_total NUMERIC GENERATED ALWAYS AS (valor_venda * qntd_vendida) STORED,
  lucro NUMERIC GENERATED ALWAYS AS ((valor_venda * qntd_vendida) - (custo_unit * qntd_comprada)) STORED,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.produtos ENABLE ROW LEVEL SECURITY;

-- Catálogo compartilhado: qualquer usuário autenticado pode tudo
CREATE POLICY "Logados podem ver produtos"
  ON public.produtos FOR SELECT
  TO authenticated USING (true);

CREATE POLICY "Logados podem criar produtos"
  ON public.produtos FOR INSERT
  TO authenticated WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Logados podem editar produtos"
  ON public.produtos FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Logados podem excluir produtos"
  ON public.produtos FOR DELETE
  TO authenticated USING (true);

-- Trigger updated_at
CREATE TRIGGER produtos_set_updated_at
  BEFORE UPDATE ON public.produtos
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX idx_produtos_categoria ON public.produtos(categoria);
CREATE INDEX idx_produtos_created_at ON public.produtos(created_at DESC);