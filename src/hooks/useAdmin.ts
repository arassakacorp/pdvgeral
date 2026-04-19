import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { toast } from "sonner";

export interface AdminUser {
  id: string;
  email: string;
  created_at: string;
  last_sign_in_at: string | null;
  is_admin: boolean;
  produtos_count: number;
}

export const useIsAdmin = () => {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["is-admin", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user!.id)
        .eq("role", "admin")
        .maybeSingle();
      if (error) throw error;
      return !!data;
    },
  });
};

export const useUsersList = (enabled: boolean) => {
  return useQuery({
    queryKey: ["admin-users"],
    enabled,
    queryFn: async () => {
      const { data, error } = await supabase.rpc("list_users");
      if (error) throw error;
      return (data ?? []) as AdminUser[];
    },
  });
};

export const useToggleAdmin = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ userId, makeAdmin }: { userId: string; makeAdmin: boolean }) => {
      if (makeAdmin) {
        const { error } = await supabase.from("user_roles").insert({ user_id: userId, role: "admin" });
        if (error) throw error;
      } else {
        const { error } = await supabase.from("user_roles").delete().eq("user_id", userId).eq("role", "admin");
        if (error) throw error;
      }
    },
    onSuccess: (_, v) => {
      qc.invalidateQueries({ queryKey: ["admin-users"] });
      qc.invalidateQueries({ queryKey: ["is-admin"] });
      toast.success(v.makeAdmin ? "Promovido a admin" : "Admin removido");
    },
    onError: (e: Error) => toast.error(e.message),
  });
};

export const useCreatorsMap = () => {
  return useQuery({
    queryKey: ["creators-map"],
    queryFn: async () => {
      const { data, error } = await supabase.rpc("list_users");
      if (error) return {} as Record<string, string>;
      const map: Record<string, string> = {};
      (data ?? []).forEach((u: AdminUser) => { map[u.id] = u.email; });
      return map;
    },
  });
};
