import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface ProdutoDB {
  id: string;
  nome: string;
  categoria: string;
  custo_unit: number;
  qntd_comprada: number;
  valor_venda: number;
  qntd_vendida: number;
  custo_total: number;
  venda_total: number;
  lucro: number;
  imagem_url?: string;
  created_at: string;
  updated_at: string;
}

export interface ProdutoInput {
  nome: string;
  categoria: string;
  custo_unit: number;
  qntd_comprada: number;
  valor_venda: number;
  qntd_vendida: number;
  imagem_url?: string;
}

export const useProdutos = () => {
  return useQuery({
    queryKey: ["produtos"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("produtos")
        .select("*")
        .order("created_at", { ascending: true });
      if (error) throw error;
      return data as ProdutoDB[];
    },
  });
};

export const useUpsertProduto = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...input }: ProdutoInput & { id?: string }) => {
      if (id) {
        const { error } = await supabase.from("produtos").update(input).eq("id", id);
        if (error) throw error;
      } else {
        const { data: { user } } = await supabase.auth.getUser();
        const { error } = await supabase.from("produtos").insert({ ...input, created_by: user?.id });
        if (error) throw error;
      }
    },
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: ["produtos"] });
      toast.success(vars.id ? "Produto atualizado" : "Produto criado");
    },
    onError: (e: Error) => toast.error(e.message),
  });
};

export const useDeleteProduto = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("produtos").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["produtos"] });
      toast.success("Produto excluído");
    },
    onError: (e: Error) => toast.error(e.message),
  });
};

export const useBulkInsertProdutos = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (rows: ProdutoInput[]) => {
      const { data: { user } } = await supabase.auth.getUser();
      const payload = rows.map((r) => ({ ...r, created_by: user?.id }));
      const { error } = await supabase.from("produtos").insert(payload);
      if (error) throw error;
      return rows.length;
    },
    onSuccess: (n) => {
      qc.invalidateQueries({ queryKey: ["produtos"] });
      toast.success(`${n} produtos importados`);
    },
    onError: (e: Error) => toast.error(e.message),
  });
};
