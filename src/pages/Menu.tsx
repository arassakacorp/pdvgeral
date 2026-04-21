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
    <div className="min-h-screen bg-background pb-24 font-sans antialiased">
      {/* Hero Section */}
      <div className="relative h-64 md:h-80 overflow-hidden">
        <img 
          src="/premium_burger_hero_1776746871020.png" 
          alt="Premium Burger" 
          className="w-full h-full object-cover brightness-50"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center p-6 space-y-2">
          <div className="h-16 w-16 bg-primary rounded-2xl flex items-center justify-center shadow-glow mb-2 rotate-3 transform transition-transform hover:rotate-0">
             <Sparkles className="text-white h-10 w-10" />
          </div>
          <h1 className="text-4xl font-black italic tracking-tighter uppercase">Burger <span className="text-primary underline decoration-accent">Master</span></h1>
          <p className="text-sm font-medium opacity-90 tracking-wide">O verdadeiro sabor artesanal na sua casa</p>
        </div>
      </div>

      {/* Header Sticky com Busca */}
      <header className="bg-background/80 backdrop-blur-md border-b sticky top-0 z-20 shadow-sm">
        <div className="container max-w-2xl px-4 py-4 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground">
              <Badge variant="outline" className="border-green-500 text-green-600 bg-green-50">Aberto Agora</Badge>
              <span>• 30-45 min</span>
            </div>
            <div className="flex items-center gap-1 text-primary">
              <MapPin className="h-4 w-4" />
              <span className="text-xs font-bold">Taxa Grátis</span>
            </div>
          </div>
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground transition-colors group-focus-within:text-primary" />
            <Input 
              placeholder="Encontre seu lanche favorito..." 
              className="pl-12 h-14 rounded-2xl bg-muted/50 border-none focus-visible:ring-2 focus-visible:ring-primary shadow-inner text-lg"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </header>

      {/* Categorias e Produtos */}
      <main className="container max-w-2xl px-4 py-6 space-y-6">
        <div className="grid gap-6">
          {filteredProdutos.map((p) => (
            <Card key={p.id} className="overflow-hidden border-none shadow-elegant hover:shadow-glow transition-all duration-300 group">
              <div className="flex p-4 gap-6 items-center">
                <div className="flex-1 space-y-2">
                  <div>
                    <h3 className="font-black text-xl text-foreground uppercase tracking-tighter group-hover:text-primary transition-colors">{p.nome}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2 leading-tight">{p.categoria}</p>
                  </div>
                  <div className="flex items-center gap-3 pt-2">
                    <span className="text-primary font-black text-2xl tracking-tighter">{fmtBRL(Number(p.valor_venda))}</span>
                    {Number(p.valor_venda) > 30 && (
                       <Badge className="bg-accent text-accent-foreground font-bold text-[10px] animate-bounce">TOP</Badge>
                    )}
                  </div>
                </div>
                <div className="relative w-32 h-32 flex-shrink-0">
                  {p.imagem_url ? (
                    <img 
                      src={p.imagem_url} 
                      alt={p.nome} 
                      className="w-full h-full object-cover rounded-2xl shadow-md transform transition-transform group-hover:scale-105" 
                    />
                  ) : (
                    <div className="w-full h-full bg-muted rounded-2xl flex items-center justify-center text-muted-foreground border-2 border-dashed">
                      <ShoppingBag />
                    </div>
                  )}
                  <Button 
                    size="icon" 
                    className="absolute -bottom-2 -right-2 h-10 w-10 rounded-xl shadow-elegant bg-primary hover:bg-primary/90 text-white transform transition-all hover:scale-110 active:scale-95"
                    onClick={() => addToCart(p)}
                  >
                    <Plus className="h-6 w-6 font-bold" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </main>

      {/* Carrinho Flutuante */}
      {cart.length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-2xl z-30">
          <Button 
            className="w-full h-14 rounded-2xl shadow-2xl bg-primary hover:bg-primary/90 flex justify-between px-6 items-center"
            onClick={() => setCheckoutOpen(true)}
          >
            <div className="flex items-center gap-2">
              <div className="bg-white/20 px-2 py-0.5 rounded-md text-sm font-bold">{cartCount}</div>
              <span className="font-bold">Ver Carrinho</span>
            </div>
            <span className="font-bold text-lg">{fmtBRL(cartTotal)}</span>
          </Button>
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
