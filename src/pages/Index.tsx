import { useMemo, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { TrendingUp, DollarSign, Package, Percent, Sparkles, Plus, Upload, Download, LogOut, Loader2 } from "lucide-react";
import { StatCard } from "@/components/StatCard";
import { CategoryChart } from "@/components/CategoryChart";
import { TopProductsChart } from "@/components/TopProductsChart";
import { ProductsTable } from "@/components/ProductsTable";
import { CategoryFilter } from "@/components/CategoryFilter";
import { ProdutoDialog } from "@/components/ProdutoDialog";
import { Button } from "@/components/ui/button";
import { fmtBRL, fmtPct, fmtInt } from "@/lib/format";
import { useAuth } from "@/hooks/useAuth";
import { useProdutos, useDeleteProduto, useBulkInsertProdutos, ProdutoDB } from "@/hooks/useProdutos";
import { exportToXLSX, parseXLSX } from "@/lib/xlsx";
import { toast } from "sonner";

const Index = () => {
  const nav = useNavigate();
  const { user, loading: authLoading, signOut } = useAuth();
  const { data: produtos = [], isLoading } = useProdutos();
  const del = useDeleteProduto();
  const bulk = useBulkInsertProdutos();

  const [category, setCategory] = useState("Todas");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<ProdutoDB | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  if (authLoading) {
    return <div className="flex min-h-screen items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  }
  if (!user) {
    nav("/auth", { replace: true });
    return null;
  }

  const categories = Array.from(new Set(produtos.map((p) => p.categoria))).sort();
  const filtered = category === "Todas" ? produtos : produtos.filter((p) => p.categoria === category);

  const stats = useMemo(() => {
    const receita = filtered.reduce((s, p) => s + Number(p.venda_total), 0);
    const custo = filtered.reduce((s, p) => s + Number(p.custo_total), 0);
    const lucro = filtered.reduce((s, p) => s + Number(p.lucro), 0);
    const unidades = filtered.reduce((s, p) => s + p.qntd_vendida, 0);
    const margem = receita > 0 ? lucro / receita : 0;
    return { receita, custo, lucro, unidades, margem };
  }, [filtered]);

  const byCategory = useMemo(() => {
    const map = new Map<string, number>();
    produtos.forEach((p) => map.set(p.categoria, (map.get(p.categoria) ?? 0) + Number(p.venda_total)));
    return Array.from(map.entries()).map(([name, value]) => ({ name, value }));
  }, [produtos]);

  const topProducts = useMemo(
    () => [...filtered].sort((a, b) => Number(b.lucro) - Number(a.lucro)).slice(0, 10).map((p) => ({ nome: p.nome, lucro: Number(p.lucro) })),
    [filtered]
  );

  const onNew = () => { setEditing(null); setDialogOpen(true); };
  const onEdit = (p: ProdutoDB) => { setEditing(p); setDialogOpen(true); };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const rows = await parseXLSX(file);
      if (rows.length === 0) { toast.error("Nenhum produto encontrado no arquivo"); return; }
      await bulk.mutateAsync(rows);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao importar");
    } finally {
      e.target.value = "";
    }
  };

  return (
    <div className="min-h-screen">
      <header className="border-b border-border/50 bg-card/40 backdrop-blur-xl sticky top-0 z-10">
        <div className="container flex flex-wrap items-center justify-between gap-3 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-primary shadow-glow">
              <Sparkles className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">Painel de Vendas</h1>
              <p className="text-xs text-muted-foreground">{user.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <input ref={fileRef} type="file" accept=".xlsx,.xls" hidden onChange={handleImport} />
            <Button variant="outline" size="sm" onClick={() => fileRef.current?.click()} disabled={bulk.isPending}>
              <Upload className="mr-2 h-4 w-4" /> Importar
            </Button>
            <Button variant="outline" size="sm" onClick={() => exportToXLSX(produtos)} disabled={produtos.length === 0}>
              <Download className="mr-2 h-4 w-4" /> Exportar
            </Button>
            <Button size="sm" onClick={onNew} className="bg-gradient-primary">
              <Plus className="mr-2 h-4 w-4" /> Novo
            </Button>
            <Button variant="ghost" size="icon" onClick={signOut} aria-label="Sair">
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      <main className="container space-y-8 py-8">
        <section className="space-y-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Visão geral</h2>
            <p className="text-sm text-muted-foreground">Filtre por categoria para detalhar os indicadores</p>
          </div>
          <CategoryFilter categories={categories} active={category} onChange={setCategory} />
        </section>

        <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Receita Total" value={fmtBRL(stats.receita)} hint={`${fmtInt(stats.unidades)} unidades vendidas`} icon={DollarSign} variant="primary" />
          <StatCard label="Lucro Líquido" value={fmtBRL(stats.lucro)} hint={`Custo: ${fmtBRL(stats.custo)}`} icon={TrendingUp} variant="success" />
          <StatCard label="Margem de Lucro" value={fmtPct(stats.margem)} hint="Lucro / Receita" icon={Percent} variant="accent" />
          <StatCard label="Produtos Ativos" value={fmtInt(filtered.length)} hint={category === "Todas" ? "Todas as categorias" : category} icon={Package} variant="warning" />
        </section>

        {isLoading ? (
          <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
        ) : produtos.length === 0 ? (
          <div className="rounded-2xl bg-card p-12 text-center shadow-soft">
            <Package className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
            <h3 className="mb-2 text-lg font-semibold">Nenhum produto ainda</h3>
            <p className="mb-6 text-sm text-muted-foreground">Adicione seu primeiro produto ou importe uma planilha.</p>
            <div className="flex justify-center gap-2">
              <Button onClick={onNew} className="bg-gradient-primary"><Plus className="mr-2 h-4 w-4" /> Novo produto</Button>
              <Button variant="outline" onClick={() => fileRef.current?.click()}><Upload className="mr-2 h-4 w-4" /> Importar planilha</Button>
            </div>
          </div>
        ) : (
          <>
            <section className="grid gap-6 lg:grid-cols-5">
              <div className="lg:col-span-3"><TopProductsChart data={topProducts} /></div>
              <div className="lg:col-span-2"><CategoryChart data={byCategory} /></div>
            </section>
            <section>
              <ProductsTable data={filtered} onEdit={onEdit} onDelete={(id) => del.mutate(id)} />
            </section>
          </>
        )}

        <footer className="pt-4 pb-8 text-center text-xs text-muted-foreground">
          Catálogo compartilhado · sincronizado em tempo real
        </footer>
      </main>

      <ProdutoDialog open={dialogOpen} onOpenChange={setDialogOpen} produto={editing} categorias={categories} />
    </div>
  );
};

export default Index;
