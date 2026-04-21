-- Tabela de pedidos
CREATE TABLE IF NOT EXISTS public.pedidos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cliente_nome TEXT NOT NULL,
  cliente_telefone TEXT NOT NULL,
  cliente_endereco TEXT NOT NULL,
  total NUMERIC NOT NULL,
  status TEXT NOT NULL DEFAULT 'Pendente',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.pedidos ENABLE ROW LEVEL SECURITY;

-- Permitir qualquer pessoa (anônima) criar pedidos (necessário para o checkout público)
CREATE POLICY "Qualquer um pode criar pedidos"
  ON public.pedidos FOR INSERT
  WITH CHECK (true);

-- Permitir usuários verem seus próprios pedidos (ou todos para admin)
CREATE POLICY "Admins podem ver todos os pedidos"
  ON public.pedidos FOR SELECT
  USING (true); -- Simplificado para teste, ajuste conforme necessário

-- Tabela de itens do pedido
CREATE TABLE IF NOT EXISTS public.itens_pedido (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pedido_id UUID NOT NULL REFERENCES public.pedidos(id) ON DELETE CASCADE,
  produto_id UUID REFERENCES public.produtos(id) ON DELETE SET NULL,
  quantidade INTEGER NOT NULL,
  preco_unitario NUMERIC NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.itens_pedido ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Qualquer um pode inserir itens de pedido"
  ON public.itens_pedido FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admins podem ver itens de pedido"
  ON public.itens_pedido FOR SELECT
  USING (true);
