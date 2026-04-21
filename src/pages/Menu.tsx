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
      <header className="sticky top-0 z-50 glass-premium">
        <div className="container max-w-6xl mx-auto px-4 h-20 flex items-center gap-8">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0 flex items-center gap-2">
            <div className="h-10 w-10 bg-primary rounded-xl flex items-center justify-center shadow-glow rotate-3">
              <span className="text-white font-black text-xl italic leading-none">N</span>
            </div>
            <span className="font-black text-xl tracking-tighter uppercase italic hidden sm:block">
              Nano <span className="text-primary">Banana</span>
            </span>
          </Link>

          {/* Busca Centralizada */}
          <div className="flex-1 relative group max-w-xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-all duration-300" />
            <Input 
              placeholder="O que você quer comer hoje?" 
              className="w-full h-12 pl-12 pr-4 rounded-2xl bg-slate-100/50 border-none focus-visible:ring-2 focus-visible:ring-primary shadow-inner transition-all"
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
            <div className="h-10 w-[1px] bg-border/50" />
            <Button variant="ghost" className="font-black uppercase tracking-tighter hover:text-primary transition-all">Entrar</Button>
          </div>
        </div>
      </header>

      <div className="container max-w-6xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Sidebar de Categorias (Desktop) */}
          <aside className="hidden lg:block w-64 space-y-3 sticky top-32 h-fit">
            <h4 className="px-4 text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground mb-6">Categorias</h4>
            {["Burgers", "Combos", "Acompanhamentos", "Bebidas", "Sobremesas"].map((cat) => (
              <button 
                key={cat}
                className="w-full text-left px-5 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-primary hover:text-white hover:shadow-glow transition-all duration-300 border border-transparent"
              >
                {cat}
              </button>
            ))}
          </aside>

          {/* Conteúdo Principal */}
          <main className="flex-1 space-y-16 pb-32">
            {/* Banner Promocional */}
            <div className="relative h-56 md:h-72 rounded-[3rem] overflow-hidden shadow-elegant-lg group border-4 border-white/50">
               <img 
                src="/premium_burger_hero_1776746871020.png" 
                alt="Promo" 
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/30 to-transparent flex flex-col justify-center px-12 text-white">
                 <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary rounded-full w-fit mb-4">
                    <Star className="h-3 w-3 fill-white" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Oferta de Elite</span>
                 </div>
                 <h2 className="text-4xl md:text-6xl font-black italic uppercase leading-none tracking-tighter">Sabor <br /><span className="text-primary stroke-text-white">Imponente</span></h2>
              </div>
            </div>

            {/* Listagem por Categoria */}
            <section className="space-y-8">
               <div className="flex items-center justify-between border-b-2 border-slate-200 pb-6">
                  <h3 className="text-3xl font-black italic uppercase tracking-tighter">Favoritos <span className="text-primary underline decoration-4 underline-offset-8">Artesanais</span></h3>
                  <div className="flex items-center gap-2">
                    <Utensils className="h-5 w-5 text-primary" />
                    <span className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">{filteredProdutos.length} opções</span>
                  </div>
               </div>
               
               <div className="grid gap-6">
                  {filteredProdutos.map((p) => (
                    <div 
                      key={p.id} 
                      className="bg-white p-6 rounded-[2.5rem] border-2 border-transparent hover:border-primary/30 hover:shadow-elegant-lg transition-all duration-500 flex items-center gap-8 cursor-pointer group relative overflow-hidden"
                      onClick={() => addToCart(p)}
                    >
                      <div className="flex-1 space-y-4">
                        <div>
                          <h4 className="font-black text-2xl text-[#1a1a1a] uppercase tracking-tighter group-hover:text-primary transition-colors leading-none">{p.nome}</h4>
                          <p className="text-sm text-muted-foreground mt-3 font-medium line-clamp-2 leading-relaxed opacity-70">{p.categoria}</p>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="text-3xl font-black text-primary tracking-tighter">{fmtBRL(Number(p.valor_venda))}</span>
                          {Number(p.valor_venda) > 35 && (
                             <Badge className="bg-accent text-black font-black uppercase tracking-widest text-[9px] px-3">Premium</Badge>
                          )}
                        </div>
                      </div>
                      <div className="relative h-40 w-40 md:h-48 md:w-48 flex-shrink-0">
                        {p.imagem_url ? (
                          <img 
                            src={p.imagem_url} 
                            alt={p.nome} 
                            className="h-full w-full object-cover rounded-[2rem] shadow-elegant group-hover:scale-105 transition-transform duration-700" 
                          />
                        ) : (
                          <div className="h-full w-full bg-slate-50 rounded-[2rem] flex items-center justify-center text-muted-foreground border-2 border-dashed border-slate-200">
                            <ShoppingBag className="opacity-10 h-12 w-12" />
                          </div>
                        )}
                        <div className="absolute -bottom-2 -right-2 h-14 w-14 bg-primary text-white rounded-2xl flex items-center justify-center shadow-glow transform transition-all group-hover:scale-110 active:scale-95 group-hover:rotate-12">
                          <Plus className="h-8 w-8 font-bold" />
                        </div>
                      </div>
                    </div>
                  ))}
               </div>
            </section>
          </main>
        </div>
      </div>

      {/* Carrinho Flutuante (Design Expert Evolution) */}
      {cart.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 z-50 p-6 animate-in slide-in-from-bottom-full duration-700">
          <div className="container max-w-6xl mx-auto">
             <div className="glass-premium rounded-[2.5rem] p-4 flex items-center justify-between shadow-glow-lg border-2 border-primary/20">
                <div className="hidden md:flex items-center gap-8 pl-6">
                   <div className="relative h-14 w-14 flex items-center justify-center">
                      <div className="absolute inset-0 bg-primary rounded-2xl pulse-primary" />
                      <ShoppingBag className="h-7 w-7 text-white relative z-10" />
                      <div className="absolute -top-2 -right-2 h-6 w-6 bg-accent text-black rounded-full flex items-center justify-center text-[10px] font-black shadow-lg">
                        {cart.length}
                      </div>
                   </div>
                   <div className="space-y-0.5">
                      <p className="font-black text-lg uppercase tracking-tighter italic">Seu Carrinho</p>
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Prepare-se para o melhor lanche da sua vida</p>
                   </div>
                </div>
                <Button 
                   className="w-full md:w-fit h-20 px-16 rounded-[2rem] bg-primary hover:bg-primary/90 text-white shadow-glow flex items-center justify-between md:justify-center gap-12 active:scale-95 transition-all group"
                   onClick={() => setCheckoutOpen(true)}
                >
                   <span className="font-black text-2xl uppercase tracking-tighter italic flex items-center gap-3">
                      Finalizar <ArrowRight className="h-6 w-6 group-hover:translate-x-2 transition-transform" />
                   </span>
                   <span className="text-3xl font-black tracking-tighter border-l-2 border-white/20 pl-10">{fmtBRL(cartTotal)}</span>
                </Button>
             </div>
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
