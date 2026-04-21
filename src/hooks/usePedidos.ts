import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";
import { toast } from "sonner";

export interface PedidoItem {
  id: string;
  produto_id: string;
  quantidade: number;
  preco_unitario: number;
  produtos?: {
    nome: string;
    imagem_url: string;
  };
}

export interface Pedido {
  id: string;
  cliente_nome: string;
  cliente_telefone: string;
  cliente_endereco: string;
  total: number;
  status: string;
  metodo_pagamento: string;
  tipo_entrega: string;
  created_at: string;
  itens_pedido?: PedidoItem[];
}

export const usePedidos = () => {
  const qc = useQueryClient();

  useEffect(() => {
    const channel = supabase
      .channel('pedidos-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'pedidos' },
        (payload) => {
          qc.invalidateQueries({ queryKey: ["pedidos"] });
          
          if (payload.eventType === 'INSERT') {
            const audio = new Audio("https://cdn.pixabay.com/download/audio/2021/08/04/audio_0625c1539c.mp3?filename=service-bell-ring-14610.mp3");
            audio.play().catch(e => console.error("Erro ao tocar áudio:", e));
            
            toast.success("🚨 NOVO PEDIDO NA COZINHA!", {
              duration: 8000,
              position: "top-center",
              className: "bg-primary text-black font-black text-lg border-4 border-black animate-pulse"
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [qc]);

  return useQuery({
    queryKey: ["pedidos"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("pedidos")
        .select(`
          *,
          itens_pedido (
            *,
            produtos (nome, imagem_url, categoria)
          )
        `)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as Pedido[];
    },
  });
};

export const useUpdatePedidoStatus = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase.from("pedidos").update({ status }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["pedidos"] });
      toast.success("Status atualizado");
    },
    onError: (e: Error) => toast.error(e.message),
  });
};

export const useUpdatePedidoFinanceiro = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, total, metodo_pagamento, tipo_entrega }: { id: string; total: number; metodo_pagamento: string; tipo_entrega: string }) => {
      const { error } = await supabase.from("pedidos").update({ total, metodo_pagamento, tipo_entrega }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["pedidos"] });
      toast.success("Valores atualizados com sucesso!");
    },
    onError: (e: Error) => toast.error(e.message),
  });
};
