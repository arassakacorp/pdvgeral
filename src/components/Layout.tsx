import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Package, 
  Shield, 
  LogOut, 
  Sparkles,
  Menu,
  X,
  ExternalLink,
  Loader2
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useIsAdmin } from "@/hooks/useAdmin";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const { pathname } = useLocation();
  const { signOut, user, loading: authLoading } = useAuth();
  const { data: isAdmin, isLoading: adminLoading } = useIsAdmin();
  const [isOpen, setIsOpen] = useState(true);

  const isPublicPath = pathname === "/cardapio" || pathname.startsWith("/acompanhar") || pathname === "/";

  // Se for uma página pública, não aplica nada do layout administrativo
  if (isPublicPath) {
    return <>{children}</>;
  }

  // Se estiver carregando auth ou admin check nas rotas sensíveis
  if (authLoading || adminLoading) {
    return <div className="flex min-h-screen items-center justify-center"><Loader2 className="animate-spin text-primary" /></div>;
  }

  // Trava desativada temporariamente para permitir acesso
  /*
  if (isTargetingAdmin && !isAdmin) {
    return <div className="flex min-h-screen flex-col items-center justify-center gap-4">
      <Shield className="h-12 w-12 text-red-500" />
      <h1 className="text-xl font-bold">Acesso Negado</h1>
      <p className="text-muted-foreground">Você não tem permissão para acessar esta área.</p>
      <Button onClick={() => window.location.href = "/auth"}>Ir para Login</Button>
    </div>;
  }
  */

  const menuItems = [
    { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { name: "Pedidos", path: "/pedidos", icon: ShoppingBag },
    { name: "Produtos", path: "/produtos", icon: Package },
  ];

  if (isAdmin) {
    menuItems.push({ name: "Admin", path: "/admin", icon: Shield });
  }

  // Se não estiver logado (ex: no cardápio público), não mostrar sidebar
  const isPublicPage = pathname === "/cardapio" || pathname === "/auth";
  if (isPublicPage) return <>{children}</>;

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar Mobile Toggle */}
      <Button 
        variant="ghost" 
        size="icon" 
        className="fixed top-4 left-4 z-50 md:hidden bg-card shadow-md border"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {/* Sidebar */}
      <aside 
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 bg-card border-r border-border transition-all duration-300 transform shadow-elegant",
          isOpen ? "translate-x-0" : "-translate-x-full",
          "md:translate-x-0 md:static md:block"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-8 flex flex-col items-center gap-4 border-b border-border/50">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-primary shadow-glow">
              <span className="text-xl font-black italic text-primary-foreground">R</span>
            </div>
            <div className="text-center">
              <div className="font-black text-2xl tracking-tighter uppercase italic">
                Red <span className="text-primary">Burguer's</span>
              </div>
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Painel Admin</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-4 pb-2">Menu Principal</p>
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200",
                  pathname === item.path 
                    ? "bg-primary/10 text-primary font-bold" 
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                )}
              >
                <item.icon className={cn("h-5 w-5", pathname === item.path ? "text-primary" : "text-slate-400")} />
                {item.name}
              </Link>
            ))}

            <div className="pt-4 mt-4 border-t">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-4 pb-2">Público</p>
              <Link
                to="/cardapio"
                target="_blank"
                className="flex items-center justify-between px-4 py-3 text-slate-600 hover:bg-slate-100 rounded-xl transition-all"
              >
                <div className="flex items-center gap-3">
                  <ExternalLink className="h-5 w-5 text-slate-400" />
                  Cardápio Digital
                </div>
              </Link>
            </div>
          </nav>

          {/* User Profile / Logout */}
          <div className="p-4 border-t space-y-4">
            <div className="px-4 py-2 bg-slate-50 rounded-xl">
              <p className="text-[10px] text-slate-400 font-bold uppercase truncate">{user?.email}</p>
            </div>
            <Button 
              variant="ghost" 
              className="w-full justify-start gap-3 text-red-500 hover:text-red-600 hover:bg-red-50 rounded-xl"
              onClick={signOut}
            >
              <LogOut className="h-5 w-5" />
              Sair da Conta
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
};

export default Layout;
