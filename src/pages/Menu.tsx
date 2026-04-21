import { useState, useMemo } from "react";
import { useProdutos } from "@/hooks/useProdutos";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  ShoppingBag, 
  Plus, 
  Minus, 
  ChevronRight, 
  Sparkles, 
  Search,
  MapPin,
  Phone,
  User,
  X,
  Loader2
} from "lucide-react";
import { fmtBRL } from "@/lib/format";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

interface CartItem {
  id: string;
  nome: string;
  preco: number;
  quantidade: number;
  imagem_url?: string;
}

const Menu = () => {
  const { data: produtos = [], isLoading } = useProdutos();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form de Checkout
  const [customer, setCustomer] = useState({
    nome: "",
    telefone: "",
    endereco: ""
  });

  const filteredProdutos = useMemo(() => {
    return produtos.filter(p => p.nome.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [produtos, searchTerm]);

  const addToCart = (p: any) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === p.id);
      if (existing) {
        return prev.map(item => item.id === p.id ? { ...item, quantidade: item.quantidade + 1 } : item);
      }
      return [...prev, { id: p.id, nome: p.nome, preco: Number(p.valor_venda), quantidade: 1, imagem_url: p.imagem_url }];
    });
    toast.success(`${p.nome} adicionado!`);
  };

  const removeFromCart = (id: string) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === id);
      if (existing && existing.quantidade > 1) {
        return prev.map(item => item.id === id ? { ...item, quantidade: item.quantidade - 1 } : item);
      }
      return prev.filter(item => item.id !== id);
    });
  };

  const cartTotal = cart.reduce((total, item) => total + (item.preco * item.quantidade), 0);
  const cartCount = cart.reduce((total, item) => total + item.quantidade, 0);

  const handleCheckout = async () => {
    if (!customer.nome || !customer.telefone || !customer.endereco) {
      toast.error("Por favor, preencha todos os campos.");
      return;
    }

    try {
      setIsSubmitting(true);
      
      // 1. Criar o pedido
      const { data: pedido, error: pedidoError } = await supabase
        .from("pedidos")
        .insert({
          cliente_nome: customer.nome,
          cliente_telefone: customer.telefone,
          cliente_endereco: customer.endereco,
          total: cartTotal,
          status: 'Pendente'
        })
        .select()
        .single();

      if (pedidoError) throw pedidoError;

      // 2. Criar os itens do pedido
      const itensPayload = cart.map(item => ({
        pedido_id: pedido.id,
        produto_id: item.id,
        quantidade: item.quantidade,
        preco_unitario: item.preco
      }));

      const { error: itensError } = await supabase
        .from("itens_pedido")
        .insert(itensPayload);

      if (itensError) throw itensError;

      // 3. Preparar Mensagem de WhatsApp
      const msgHeader = `*Novo Pedido #${pedido.id.slice(0, 5)}*\n\n`;
      const msgCliente = `*Cliente:* ${customer.nome}\n*Telefone:* ${customer.telefone}\n*Endereço:* ${customer.endereco}\n\n`;
      const msgItens = cart.map(item => `- ${item.quantidade}x ${item.nome} (${fmtBRL(item.preco * item.quantidade)})`).join('\n');
      const msgTotal = `\n\n*Total: ${fmtBRL(cartTotal)}*`;
      
      const fullMessage = encodeURIComponent(msgHeader + msgCliente + "*Itens:*\n" + msgItens + msgTotal);
      const whatsappUrl = `https://wa.me/5533998797876?text=${fullMessage}`;

      toast.success("Pedido enviado com sucesso!");
      
      // Abrir WhatsApp após um pequeno delay para o usuário ver o sucesso
      setTimeout(() => {
        window.open(whatsappUrl, '_blank');
        window.location.href = `/acompanhar/${pedido.id}`;
      }, 1500);

    } catch (error) {
      toast.error("Erro ao enviar pedido. Tente novamente.");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) return <div className="flex min-h-screen items-center justify-center"><Loader2 className="animate-spin" /></div>;

  return (
    <div className="min-h-screen bg-[#f8f9fa] font-sans antialiased text-[#3e3e3e]">
      {/* Topo Estilo Asgard */}
      <header className="sticky top-0 z-50 bg-white border-b shadow-sm">
        <div className="container max-w-6xl mx-auto px-4 h-20 flex items-center gap-8">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0 flex items-center gap-2">
            <div className="h-10 w-10 bg-primary rounded-lg flex items-center justify-center shadow-sm">
              <span className="text-white font-black text-xl italic leading-none">N</span>
            </div>
            <span className="font-black text-xl tracking-tighter uppercase italic hidden sm:block">
              Nano <span className="text-primary">Banana</span>
            </span>
          </Link>

          {/* Busca Centralizada */}
          <div className="flex-1 relative group max-w-xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <Input 
              placeholder="O que você quer comer hoje?" 
              className="w-full h-12 pl-12 pr-4 rounded-xl bg-[#f2f2f2] border-none focus-visible:ring-2 focus-visible:ring-primary shadow-inner transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* User / Address */}
          <div className="hidden lg:flex items-center gap-4 text-sm font-medium">
            <div className="flex flex-col items-end">
              <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Entregar em</span>
              <span className="flex items-center gap-1 text-primary">
                <MapPin className="h-4 w-4" /> Centro, Cidade
              </span>
            </div>
            <div className="h-10 w-[1px] bg-border" />
            <Button variant="ghost" className="font-bold hover:text-primary">Entrar</Button>
          </div>
        </div>
      </header>

      <div className="container max-w-6xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar de Categorias (Desktop) */}
          <aside className="hidden lg:block w-64 space-y-2 sticky top-28 h-fit">
            <h4 className="px-4 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-4">Categorias</h4>
            {["Burgers", "Combos", "Acompanhamentos", "Bebidas", "Sobremesas"].map((cat) => (
              <button 
                key={cat}
                className="w-full text-left px-4 py-3 rounded-xl font-bold text-sm hover:bg-white hover:text-primary hover:shadow-sm transition-all border border-transparent hover:border-border"
              >
                {cat}
              </button>
            ))}
          </aside>

          {/* Conteúdo Principal */}
          <main className="flex-1 space-y-12 pb-20">
            {/* Banner Promocional */}
            <div className="relative h-48 md:h-64 rounded-[2rem] overflow-hidden shadow-elegant group">
               <img 
                src="/premium_burger_hero_1776746871020.png" 
                alt="Promo" 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent flex flex-col justify-center px-12 text-white">
                 <Badge className="w-fit mb-4 bg-primary text-white border-none font-black italic tracking-tighter uppercase">Promoção do Dia</Badge>
                 <h2 className="text-3xl md:text-5xl font-black italic uppercase leading-none tracking-tighter">Compre 1 <br />Leve <span className="text-primary">2</span></h2>
              </div>
            </div>

            {/* Listagem por Categoria */}
            <section className="space-y-6">
               <div className="flex items-center justify-between border-b pb-4">
                  <h3 className="text-2xl font-black italic uppercase tracking-tighter">Burgers <span className="text-primary">Artesanais</span></h3>
                  <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">{filteredProdutos.length} itens</span>
               </div>
               
               <div className="grid gap-4">
                  {filteredProdutos.map((p) => (
                    <div 
                      key={p.id} 
                      className="bg-white p-4 rounded-2xl border border-transparent hover:border-primary/20 hover:shadow-elegant transition-all duration-300 flex items-center gap-6 cursor-pointer group"
                      onClick={() => addToCart(p)}
                    >
                      <div className="flex-1 space-y-2">
                        <div>
                          <h4 className="font-black text-xl text-[#3e3e3e] uppercase tracking-tighter group-hover:text-primary transition-colors leading-none">{p.nome}</h4>
                          <p className="text-sm text-muted-foreground mt-2 font-medium line-clamp-2 leading-relaxed">{p.categoria}</p>
                        </div>
                        <div className="flex items-center gap-4 pt-2">
                          <span className="text-2xl font-black text-primary tracking-tighter">{fmtBRL(Number(p.valor_venda))}</span>
                          {Number(p.valor_venda) < 25 && (
                             <Badge variant="outline" className="text-[10px] border-primary text-primary font-bold uppercase tracking-widest">Econômico</Badge>
                          )}
                        </div>
                      </div>
                      <div className="relative h-32 w-32 md:h-40 md:w-40 flex-shrink-0">
                        {p.imagem_url ? (
                          <img 
                            src={p.imagem_url} 
                            alt={p.nome} 
                            className="h-full w-full object-cover rounded-2xl shadow-sm group-hover:scale-105 transition-transform" 
                          />
                        ) : (
                          <div className="h-full w-full bg-[#f2f2f2] rounded-2xl flex items-center justify-center text-muted-foreground border border-dashed">
                            <ShoppingBag className="opacity-20 h-10 w-10" />
                          </div>
                        )}
                        <div className="absolute bottom-2 right-2 h-10 w-10 bg-primary text-white rounded-xl flex items-center justify-center shadow-glow transform transition-all hover:scale-110 active:scale-95 group-hover:rotate-12">
                          <Plus className="h-6 w-6 font-bold" />
                        </div>
                      </div>
                    </div>
                  ))}
               </div>
            </section>
          </main>
        </div>
      </div>

      {/* Carrinho Flutuante (Fiel ao Asgard/iFood) */}
      {cart.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t p-4 shadow-[0_-10px_30px_rgba(0,0,0,0.1)] animate-in slide-in-from-bottom-full duration-500">
          <div className="container max-w-6xl mx-auto flex items-center justify-between">
             <div className="hidden md:flex items-center gap-6">
                <div className="flex -space-x-2">
                   {cart.slice(0, 3).map((item, i) => (
                      <div key={i} className="h-10 w-10 rounded-full border-2 border-white bg-slate-200 flex items-center justify-center text-[10px] font-bold overflow-hidden shadow-sm">
                         <ShoppingBag className="h-4 w-4 text-slate-400" />
                      </div>
                   ))}
                </div>
                <div className="space-y-0.5">
                   <p className="font-bold text-sm">{cart.length} itens no carrinho</p>
                   <p className="text-xs text-muted-foreground">Adicione mais itens para entrega grátis</p>
                </div>
             </div>
             <Button 
                className="w-full md:w-fit h-14 px-12 rounded-xl bg-primary hover:bg-primary/90 text-white shadow-glow flex items-center justify-between md:justify-center gap-8 group"
                onClick={() => setCheckoutOpen(true)}
             >
                <span className="font-black text-xl uppercase tracking-tighter italic">Fechar Pedido</span>
                <span className="text-2xl font-black tracking-tighter border-l border-white/20 pl-6">{fmtBRL(cartTotal)}</span>
             </Button>
          </div>
        </div>
      )}


      {/* Modal de Checkout */}
      <Dialog open={checkoutOpen} onOpenChange={setCheckoutOpen}>
        <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold flex items-center gap-2">
              <ShoppingBag className="text-primary" /> Seu Pedido
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Itens do Carrinho */}
            <div className="space-y-4">
              {cart.map(item => (
                <div key={item.id} className="flex justify-between items-center gap-4">
                  <div className="flex-1">
                    <p className="font-bold">{item.nome}</p>
                    <p className="text-sm text-muted-foreground">{fmtBRL(item.preco)}</p>
                  </div>
                  <div className="flex items-center gap-3 bg-slate-100 rounded-lg p-1">
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => removeFromCart(item.id)}><Minus className="h-4 w-4" /></Button>
                    <span className="font-bold w-4 text-center">{item.quantidade}</span>
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-primary" onClick={() => addToCart(item)}><Plus className="h-4 w-4" /></Button>
                  </div>
                </div>
              ))}
            </div>

            {/* Dados do Cliente */}
            <div className="space-y-4 border-t pt-6">
              <h4 className="font-bold text-sm uppercase tracking-wider text-muted-foreground">Onde entregar?</h4>
              <div className="space-y-3">
                <div className="space-y-1">
                  <Label className="text-xs">Seu Nome</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Como te chamamos?" className="pl-10" value={customer.nome} onChange={e => setCustomer({...customer, nome: e.target.value})} />
                  </div>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Telefone / WhatsApp</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="(00) 00000-0000" className="pl-10" value={customer.telefone} onChange={e => setCustomer({...customer, telefone: e.target.value})} />
                  </div>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Endereço Completo</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Rua, número, bairro..." className="pl-10" value={customer.endereco} onChange={e => setCustomer({...customer, endereco: e.target.value})} />
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t pt-4">
              <div className="flex justify-between items-center text-lg font-bold">
                <span>Total</span>
                <span className="text-primary text-2xl">{fmtBRL(cartTotal)}</span>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button 
              className="w-full h-14 text-lg font-bold bg-green-600 hover:bg-green-700 rounded-xl"
              onClick={handleCheckout}
              disabled={isSubmitting}
            >
              {isSubmitting ? <Loader2 className="animate-spin mr-2" /> : "Confirmar e Enviar Pedido"}
              {!isSubmitting && <ChevronRight className="ml-2" />}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Menu;
