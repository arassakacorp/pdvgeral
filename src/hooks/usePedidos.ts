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
        () => {
          qc.invalidateQueries({ queryKey: ["pedidos"] });
          // Toca um som opcional se for um novo pedido
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
            produtos (nome, imagem_url)
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
