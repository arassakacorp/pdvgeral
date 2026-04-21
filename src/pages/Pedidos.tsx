import { usePedidos, useUpdatePedidoStatus, Pedido } from "@/hooks/usePedidos";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Loader2, Clock, CheckCircle2, ShoppingBag, Phone, MapPin, MessageSquare, XCircle, ChevronRight 
} from "lucide-react";
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
      case "Cancelado": return "bg-red-500/20 text-red-600 border-red-500/50";
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
      let phone = pedido.cliente_telefone.replace(/\D/g, '');
      if (phone.length <= 11) phone = '55' + phone;
      const url = `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`;
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

  const ativos = pedidos.filter(p => !['Finalizado', 'Cancelado'].includes(p.status));
  const finalizados = pedidos.filter(p => p.status === 'Finalizado');
  const cancelados = pedidos.filter(p => p.status === 'Cancelado');

  return (
    <div className="min-h-screen bg-slate-50/50 p-4 md:p-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Monitor de Pedidos</h1>
            <p className="text-muted-foreground">Acompanhe os estágios de produção em tempo real.</p>
          </div>
        </div>

        <Tabs defaultValue="ativos" className="space-y-6">
          <TabsList className="bg-white border p-1 rounded-xl shadow-sm">
            <TabsTrigger value="ativos" className="rounded-lg px-6">
              Ativos <Badge variant="secondary" className="ml-2 bg-primary/10 text-primary">{ativos.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="finalizados" className="rounded-lg px-6">Finalizados</TabsTrigger>
            <TabsTrigger value="cancelados" className="rounded-lg px-6 text-red-500">Cancelados</TabsTrigger>
          </TabsList>

          <TabsContent value="ativos" className="space-y-6">
             <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {ativos.map((pedido) => (
                  <PedidoCard 
                    key={pedido.id} 
                    pedido={pedido} 
                    onStatusChange={handleStatusChange} 
                    onNotify={notifyCustomer} 
                    onCancel={(id) => updateStatus.mutate({ id, status: 'Cancelado' })}
                    isPending={updateStatus.isPending}
                    getStatusColor={getStatusColor}
                  />
                ))}
             </div>
             {ativos.length === 0 && <EmptyState text="Nenhum pedido ativo no momento." />}
          </TabsContent>

          <TabsContent value="finalizados" className="space-y-6">
             <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {finalizados.map((pedido) => (
                  <PedidoCard key={pedido.id} pedido={pedido} isHistory getStatusColor={getStatusColor} />
                ))}
             </div>
             {finalizados.length === 0 && <EmptyState text="Nenhum pedido finalizado ainda." />}
          </TabsContent>

          <TabsContent value="cancelados" className="space-y-6">
             <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {cancelados.map((pedido) => (
                  <PedidoCard key={pedido.id} pedido={pedido} isHistory getStatusColor={getStatusColor} />
                ))}
             </div>
             {cancelados.length === 0 && <EmptyState text="Nenhum pedido cancelado." />}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

const PedidoCard = ({ pedido, onStatusChange, onNotify, onCancel, isPending, getStatusColor, isHistory }: any) => (
  <Card className="overflow-hidden border shadow-sm hover:shadow-md transition-all">
    <CardHeader className="bg-white border-b pb-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShoppingBag className="h-4 w-4 text-primary" />
          <span className="font-bold">#{pedido.id.slice(0, 5)}</span>
          {!isHistory && (
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-6 w-6 text-green-600 hover:text-green-700 hover:bg-green-50"
              onClick={() => onNotify(pedido)}
            >
              <MessageSquare className="h-4 w-4" />
            </Button>
          )}
        </div>
        <Badge className={getStatusColor(pedido.status)}>
          {pedido.status}
        </Badge>
      </div>
      <div className="mt-2 text-xs text-muted-foreground flex items-center gap-1">
        <Clock className="h-3 w-3" />
        {formatDistanceToNow(new Date(pedido.created_at), { addSuffix: true, locale: ptBR })}
      </div>
    </CardHeader>

    <CardContent className="py-4 space-y-4">
      <div className="space-y-1">
        <h3 className="font-bold text-lg">{pedido.cliente_nome}</h3>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <MapPin className="h-3 w-3" /> {pedido.cliente_endereco}
        </div>
      </div>

      <div className="space-y-2 border-t pt-4">
        {pedido.itens_pedido?.map((item: any) => (
          <div key={item.id} className="flex justify-between items-center text-sm">
            <span className="text-slate-600">{item.quantidade}x {item.produtos?.nome}</span>
            <span className="font-medium">{fmtBRL(item.preco_unitario * item.quantidade)}</span>
          </div>
        ))}
      </div>

      <div className="flex justify-between items-center border-t pt-4 font-bold">
        <span>Total</span>
        <span className="text-primary text-xl">{fmtBRL(pedido.total)}</span>
      </div>
    </CardContent>

    {!isHistory && (
      <CardFooter className="bg-slate-50 border-t p-3 gap-2">
        <Button 
          variant="outline" 
          size="icon" 
          className="text-red-500 hover:bg-red-50 hover:text-red-600 border-red-100"
          onClick={() => onCancel(pedido.id)}
          disabled={isPending}
        >
          <XCircle className="h-5 w-5" />
        </Button>
        <Button 
          className="flex-1 font-bold shadow-sm"
          onClick={() => onStatusChange(pedido.id, pedido.status)}
          disabled={isPending}
        >
          {pedido.status === "Pendente" && "Começar Preparo"}
          {pedido.status === "Preparando" && "Marcar Pronto"}
          {pedido.status === "Pronto" && "Finalizar"}
          <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </CardFooter>
    )}
  </Card>
);

const EmptyState = ({ text }: { text: string }) => (
  <div className="flex flex-col items-center justify-center py-20 text-center space-y-4 rounded-3xl border-2 border-dashed bg-white/50">
    <ShoppingBag className="h-12 w-12 text-muted-foreground opacity-10" />
    <h2 className="text-lg font-medium text-muted-foreground">{text}</h2>
  </div>
);
export default Pedidos;
