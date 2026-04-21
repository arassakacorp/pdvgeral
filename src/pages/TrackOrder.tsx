import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { 
  ShoppingBag, 
  Clock, 
  Flame, 
  CheckCircle2, 
  Loader2, 
  MapPin, 
  UtensilsCrossed 
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const TrackOrder = () => {
  const { id } = useParams();
  const [pedido, setPedido] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    // Busca inicial
    const fetchPedido = async () => {
      const { data, error } = await supabase
        .from("pedidos")
        .select("*, itens_pedido(*, produtos(nome))")
        .eq("id", id)
        .single();
      
      if (!error) setPedido(data);
      setLoading(false);
    };

    fetchPedido();

    // Inscrição em Tempo Real
    const channel = supabase
      .channel(`track-order-${id}`)
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'pedidos', filter: `id=eq.${id}` },
        (payload) => {
          setPedido((prev: any) => ({ ...prev, ...payload.new }));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [id]);

  if (loading) return <div className="flex min-h-screen items-center justify-center"><Loader2 className="animate-spin text-primary" /></div>;
  if (!pedido) return <div className="flex min-h-screen items-center justify-center text-muted-foreground">Pedido não encontrado.</div>;

  const steps = [
    { name: "Recebido", status: "Pendente", icon: Clock },
    { name: "Preparando", status: "Preparando", icon: Flame },
    { name: "Pronto", status: "Pronto", icon: CheckCircle2 },
    { name: "Entregue", status: "Finalizado", icon: ShoppingBag },
  ];

  const currentStepIndex = steps.findIndex(s => s.status === pedido.status);

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="mx-auto max-w-md space-y-8 animate-fade-in">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="mx-auto h-20 w-20 bg-primary rounded-3xl flex items-center justify-center shadow-glow rotate-3 mb-6">
             <span className="text-white font-black text-4xl italic">R</span>
          </div>
          <h1 className="text-3xl font-black italic uppercase tracking-tighter">
            Red <span className="text-primary">Burguer's</span>
          </h1>
          <p className="text-sm text-muted-foreground font-medium uppercase tracking-widest">Pedido #{id?.slice(0, 5)}</p>
        </div>

        {/* Status Visual */}
        <div className="relative space-y-8 pt-4">
          {steps.map((step, idx) => {
            const isCompleted = idx < currentStepIndex;
            const isCurrent = idx === currentStepIndex;
            const isPending = idx > currentStepIndex;

            return (
              <div key={step.name} className="flex items-center gap-4 relative z-10">
                <div className={cn(
                  "h-12 w-12 rounded-full flex items-center justify-center border-2 transition-all duration-500",
                  isCompleted ? "bg-green-500 border-green-500 text-white" : 
                  isCurrent ? "bg-primary border-primary text-white scale-110 shadow-glow animate-pulse" : 
                  "bg-white border-slate-200 text-slate-300"
                )}>
                  <step.icon className="h-6 w-6" />
                </div>
                <div>
                  <h3 className={cn(
                    "font-bold transition-all",
                    isCurrent ? "text-primary text-lg" : isCompleted ? "text-slate-800" : "text-slate-400"
                  )}>
                    {step.name}
                  </h3>
                  {isCurrent && <p className="text-xs text-primary font-medium">Acontecendo agora...</p>}
                </div>

                {/* Linha Conectora */}
                {idx < steps.length - 1 && (
                  <div className={cn(
                    "absolute left-6 top-12 w-0.5 h-8 -z-10 transition-all duration-500",
                    isCompleted ? "bg-green-500" : "bg-slate-200"
                  )} />
                )}
              </div>
            );
          })}
        </div>

        {/* Detalhes do Pedido */}
        <Card className="border-none shadow-elegant overflow-hidden">
          <CardContent className="p-6 space-y-4">
             <div className="space-y-1">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Endereço de Entrega</p>
                <p className="font-medium text-slate-700 flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-primary" /> {pedido.cliente_endereco}
                </p>
             </div>
             
             <div className="pt-4 border-t space-y-2">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Resumo</p>
                {pedido.itens_pedido?.map((item: any) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-slate-600">{item.quantidade}x {item.produtos?.nome}</span>
                  </div>
                ))}
             </div>
          </CardContent>
        </Card>

        <p className="text-center text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground pt-8">
           Obrigado por escolher a RedBurguer's! ❤️
        </p>
      </div>
    </div>
  );
};

export default TrackOrder;
