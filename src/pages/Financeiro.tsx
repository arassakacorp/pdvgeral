import { usePedidos } from "@/hooks/usePedidos";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Loader2, DollarSign, CreditCard, Banknote, Landmark, TrendingUp } from "lucide-react";
import { fmtBRL } from "@/lib/format";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

const Financeiro = () => {
  const { data: pedidos = [], isLoading } = usePedidos();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Filtrar apenas pedidos finalizados (que geraram receita real)
  const finalizados = pedidos.filter(p => p.status === 'Finalizado');

  // Cálculos
  const totalPix = finalizados
    .filter(p => p.metodo_pagamento?.toLowerCase().includes("pix"))
    .reduce((acc, p) => acc + p.total, 0);

  const totalCartao = finalizados
    .filter(p => p.metodo_pagamento?.toLowerCase().includes("cartão") || p.metodo_pagamento?.toLowerCase().includes("cartao"))
    .reduce((acc, p) => acc + p.total, 0);

  const totalDinheiro = finalizados
    .filter(p => p.metodo_pagamento?.toLowerCase().includes("dinheiro"))
    .reduce((acc, p) => acc + p.total, 0);

  const totalGeral = finalizados.reduce((acc, p) => acc + p.total, 0);

  return (
    <div className="min-h-screen bg-slate-50/50 p-4 md:p-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Fechamento de Caixa</h1>
          <p className="text-muted-foreground">Acompanhe todos os pagamentos recebidos dos pedidos finalizados.</p>
        </div>

        {/* Cards de Resumo */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="border-l-4 border-l-emerald-500 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total em PIX</CardTitle>
              <Landmark className="h-4 w-4 text-emerald-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{fmtBRL(totalPix)}</div>
            </CardContent>
          </Card>
          
          <Card className="border-l-4 border-l-blue-500 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total em Cartão</CardTitle>
              <CreditCard className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{fmtBRL(totalCartao)}</div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-amber-500 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total em Dinheiro</CardTitle>
              <Banknote className="h-4 w-4 text-amber-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{fmtBRL(totalDinheiro)}</div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-primary shadow-sm bg-primary/5">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-bold text-primary">Faturamento Bruto</CardTitle>
              <TrendingUp className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-black text-primary">{fmtBRL(totalGeral)}</div>
            </CardContent>
          </Card>
        </div>

        {/* Tabela de Pedidos */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-primary" />
              Histórico de Recebimentos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50">
                    <TableHead className="min-w-[150px]">Data/Hora</TableHead>
                    <TableHead>Pedido</TableHead>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Pagamento</TableHead>
                    <TableHead className="text-right">Valor Pago</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {finalizados.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                        Nenhum pedido finalizado ainda.
                      </TableCell>
                    </TableRow>
                  ) : (
                    finalizados.map((pedido) => (
                      <TableRow key={pedido.id}>
                        <TableCell className="font-medium">
                          {format(new Date(pedido.created_at), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                        </TableCell>
                        <TableCell>#{pedido.id.slice(0, 5)}</TableCell>
                        <TableCell>{pedido.cliente_nome}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className={pedido.tipo_entrega === 'Delivery' ? 'border-primary text-primary' : ''}>
                            {pedido.tipo_entrega || 'Delivery'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <span className="font-semibold text-slate-700">
                            {pedido.metodo_pagamento || 'Não informado'}
                          </span>
                        </TableCell>
                        <TableCell className="text-right font-bold text-emerald-600">
                          {fmtBRL(pedido.total)}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Financeiro;
