import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useConfig = (chave: string) => {
  return useQuery({
    queryKey: ["config", chave],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("configuracoes")
        .select("valor")
        .eq("chave", chave)
        .maybeSingle();
      
      if (error) throw error;
      return data?.valor || "";
    },
  });
};

export const useUpdateConfig = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ chave, valor }: { chave: string; valor: string }) => {
      // Upsert logic: update if exists, insert if not
      const { error } = await supabase
        .from("configuracoes")
        .upsert({ chave, valor }, { onConflict: "chave" });
      if (error) throw error;
    },
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: ["config", vars.chave] });
      toast.success("Configuração atualizada com sucesso!");
    },
    onError: (e: Error) => toast.error("Erro ao atualizar: " + e.message),
  });
};
