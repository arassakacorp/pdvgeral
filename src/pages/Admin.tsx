import { useNavigate } from "react-router-dom";
import { ArrowLeft, Loader2, Shield, ShieldOff, Mail, Calendar, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { useIsAdmin, useUsersList, useToggleAdmin } from "@/hooks/useAdmin";
import { fmtInt } from "@/lib/format";

const Admin = () => {
  const nav = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { data: isAdmin, isLoading: roleLoading } = useIsAdmin();
  const { data: users = [], isLoading: usersLoading } = useUsersList(!!isAdmin);
  const toggle = useToggleAdmin();

  if (authLoading || roleLoading) {
    return <div className="flex min-h-screen items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  }
  if (!user) { nav("/auth", { replace: true }); return null; }
  if (!isAdmin) {
    return (
      <div className="container py-12 text-center">
        <Shield className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
        <h1 className="text-xl font-bold">Acesso restrito</h1>
        <p className="text-sm text-muted-foreground mt-2">Apenas administradores podem acessar esta página.</p>
        <Button className="mt-6" onClick={() => nav("/")}>Voltar</Button>
      </div>
    );
  }

  const fmtDate = (d: string | null) => d ? new Date(d).toLocaleString("pt-BR") : "—";

  return (
    <div className="min-h-screen">
      <header className="border-b border-border/50 bg-card/40 backdrop-blur-xl sticky top-0 z-10">
        <div className="container flex items-center justify-between gap-3 py-5">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => nav("/")} aria-label="Voltar">
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-xl font-bold tracking-tight">Administração</h1>
              <p className="text-xs text-muted-foreground">{users.length} usuários cadastrados</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container py-8">
        {usersLoading ? (
          <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
        ) : (
          <div className="rounded-2xl bg-card shadow-soft overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted/50 text-left text-xs uppercase tracking-wide text-muted-foreground">
                  <tr>
                    <th className="px-4 py-3 font-semibold"><Mail className="inline h-3 w-3 mr-1" />Email</th>
                    <th className="px-4 py-3 font-semibold"><Calendar className="inline h-3 w-3 mr-1" />Cadastrado em</th>
                    <th className="px-4 py-3 font-semibold">Último acesso</th>
                    <th className="px-4 py-3 font-semibold text-right"><Package className="inline h-3 w-3 mr-1" />Produtos</th>
                    <th className="px-4 py-3 font-semibold">Papel</th>
                    <th className="px-4 py-3 font-semibold text-right">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u.id} className="border-t border-border hover:bg-muted/40 transition-smooth">
                      <td className="px-4 py-3 font-medium">{u.email}</td>
                      <td className="px-4 py-3 text-muted-foreground">{fmtDate(u.created_at)}</td>
                      <td className="px-4 py-3 text-muted-foreground">{fmtDate(u.last_sign_in_at)}</td>
                      <td className="px-4 py-3 text-right tabular-nums">{fmtInt(Number(u.produtos_count))}</td>
                      <td className="px-4 py-3">
                        {u.is_admin ? <Badge className="bg-gradient-primary">Admin</Badge> : <Badge variant="secondary">Usuário</Badge>}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Button
                          size="sm"
                          variant={u.is_admin ? "outline" : "default"}
                          disabled={toggle.isPending || u.id === user.id}
                          onClick={() => toggle.mutate({ userId: u.id, makeAdmin: !u.is_admin })}
                          className={u.is_admin ? "" : "bg-gradient-primary"}
                        >
                          {u.is_admin ? <><ShieldOff className="mr-2 h-3 w-3" />Remover admin</> : <><Shield className="mr-2 h-3 w-3" />Tornar admin</>}
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Admin;
