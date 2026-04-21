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
  ExternalLink
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
  const { signOut, user } = useAuth();
  const { data: isAdmin } = useIsAdmin();
  const [isOpen, setIsOpen] = useState(true);

  const menuItems = [
    { name: "Dashboard", path: "/", icon: LayoutDashboard },
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
    <div className="flex min-h-screen bg-slate-50/50">
      {/* Sidebar Mobile Toggle */}
      <Button 
        variant="ghost" 
        size="icon" 
        className="fixed top-4 left-4 z-50 md:hidden bg-white shadow-md border"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {/* Sidebar */}
      <aside 
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-slate-200 transition-all duration-300 transform",
          isOpen ? "translate-x-0" : "-translate-x-full",
          "md:translate-x-0 md:static md:block"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 flex items-center gap-3 border-b">
            <div className="h-10 w-10 bg-gradient-primary rounded-xl flex items-center justify-center shadow-glow">
              <Sparkles className="text-white h-6 w-6" />
            </div>
            <div className="font-bold text-xl tracking-tight text-slate-800">
              PDV <span className="text-primary">Geral</span>
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
