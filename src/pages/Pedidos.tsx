import { usePedidos, useUpdatePedidoStatus, Pedido } from "@/hooks/usePedidos";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Clock, CheckCircle2, ShoppingBag, Phone, MapPin, MessageSquare } from "lucide-react";
import { fmtBRL } from "@/lib/format";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

const Pedidos = () => {
  const { data: pedidos = [], isLoading } = usePedidos();
  const updateStatus = useUpdatePedidoStatus();

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pendente": return "bg-yellow-500/20 text-yellow-600 border-yellow-500/50";
      case "Preparando": return "bg-blue-500/20 text-blue-600 border-blue-500/50";
      case "Pronto": return "bg-green-500/20 text-green-600 border-green-500/50";
      default: return "bg-slate-500/20 text-slate-600 border-slate-500/50";
    }
  };

  const handleStatusChange = (id: string, currentStatus: string) => {
    let nextStatus = "Pendente";
    if (currentStatus === "Pendente") nextStatus = "Preparando";
    else if (currentStatus === "Preparando") nextStatus = "Pronto";
    else if (currentStatus === "Pronto") nextStatus = "Finalizado";
    
    updateStatus.mutate({ id, status: nextStatus });
  };

  const notifyCustomer = (pedido: Pedido) => {
    let msg = "";
    if (pedido.status === "Pendente") msg = `Olá ${pedido.cliente_nome}! Seu pedido #${pedido.id.slice(0, 5)} foi recebido e já vai entrar em produção! 🍔`;
    else if (pedido.status === "Preparando") msg = `Olá ${pedido.cliente_nome}! Seu pedido já está sendo preparado com muito carinho! 👨‍🍳`;
    else if (pedido.status === "Pronto") msg = `Boa notícia ${pedido.cliente_nome}! Seu pedido está PRONTO e logo chegará até você! 🛵💨`;
    
    if (pedido.cliente_telefone) {
      const phone = pedido.cliente_telefone.replace(/\D/g, '');
      const url = `https://wa.me/55${phone}?text=${encodeURIComponent(msg)}`;
      window.open(url, '_blank');
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 p-4 md:p-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Monitor de Pedidos</h1>
            <p className="text-muted-foreground">Acompanhe os pedidos da sua lanchonete em tempo real.</p>
          </div>
          <div className="flex gap-4">
            <Badge variant="outline" className="px-4 py-1">
              {pedidos.filter(p => p.status !== 'Finalizado').length} Ativos
            </Badge>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {pedidos.filter(p => p.status !== 'Finalizado').map((pedido) => (
            <Card key={pedido.id} className="overflow-hidden border-2 shadow-sm transition-all hover:shadow-md">
              <CardHeader className="bg-white/50 border-b pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShoppingBag className="h-4 w-4 text-primary" />
                    <span className="font-bold">#{pedido.id.slice(0, 5)}</span>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-6 w-6 text-green-600 hover:text-green-700 hover:bg-green-50"
                      onClick={() => notifyCustomer(pedido)}
                      title="Notificar via WhatsApp"
                    >
                      <MessageSquare className="h-4 w-4" />
                    </Button>
                  </div>
                  <Badge className={getStatusColor(pedido.status)}>
                    {pedido.status}
                  </Badge>
                </div>
                <div className="mt-2 text-sm text-muted-foreground flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {formatDistanceToNow(new Date(pedido.created_at), { addSuffix: true, locale: ptBR })}
                </div>
              </CardHeader>

              <CardContent className="py-4 space-y-4">
                <div className="space-y-1">
                  <h3 className="font-bold text-lg">{pedido.cliente_nome}</h3>
                  {pedido.cliente_telefone && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Phone className="h-3 w-3" /> {pedido.cliente_telefone}
                    </div>
                  )}
                  {pedido.cliente_endereco && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="h-3 w-3" /> {pedido.cliente_endereco}
                    </div>
                  )}
                </div>

                <div className="space-y-2 border-t pt-4">
                  {pedido.itens_pedido?.map((item) => (
                    <div key={item.id} className="flex justify-between items-center text-sm">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-primary">{item.quantidade}x</span>
                        <span>{item.produtos?.nome}</span>
                      </div>
                      <span className="text-muted-foreground">{fmtBRL(item.preco_unitario * item.quantidade)}</span>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between items-center border-t pt-4 font-bold text-lg">
                  <span>Total</span>
                  <span className="text-primary">{fmtBRL(pedido.total)}</span>
                </div>
              </CardContent>

              <CardFooter className="bg-slate-50 border-t p-4">
                <Button 
                  className="w-full font-bold"
                  variant={pedido.status === "Pronto" ? "default" : "outline"}
                  onClick={() => handleStatusChange(pedido.id, pedido.status)}
                  disabled={updateStatus.isPending}
                >
                  {pedido.status === "Pendente" && "Começar a Preparar"}
                  {pedido.status === "Preparando" && "Marcar como Pronto"}
                  {pedido.status === "Pronto" && "Finalizar Pedido"}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {pedidos.filter(p => p.status !== 'Finalizado').length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 text-center space-y-4 rounded-3xl border-2 border-dashed">
            <ShoppingBag className="h-12 w-12 text-muted-foreground opacity-20" />
            <h2 className="text-xl font-medium text-muted-foreground">Nenhum pedido ativo no momento.</h2>
          </div>
        )}
      </div>
    </div>
  );
};

export default Pedidos;
