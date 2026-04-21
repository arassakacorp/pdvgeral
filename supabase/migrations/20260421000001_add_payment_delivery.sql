-- Adicionando colunas de pagamento e entrega na tabela pedidos
ALTER TABLE public.pedidos 
ADD COLUMN IF NOT EXISTS metodo_pagamento TEXT NOT NULL DEFAULT 'Não informado',
ADD COLUMN IF NOT EXISTS tipo_entrega TEXT NOT NULL DEFAULT 'Retirada';
