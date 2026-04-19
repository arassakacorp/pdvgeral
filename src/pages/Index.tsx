import { useMemo, useState } from "react";
import { TrendingUp, DollarSign, Package, Percent, Sparkles } from "lucide-react";
import vendasData from "@/data/vendas.json";
import { StatCard } from "@/components/StatCard";
import { CategoryChart } from "@/components/CategoryChart";
import { TopProductsChart } from "@/components/TopProductsChart";
import { ProductsTable, Produto } from "@/components/ProductsTable";
import { CategoryFilter } from "@/components/CategoryFilter";
import { fmtBRL, fmtPct, fmtInt } from "@/lib/format";

const ALL = vendasData as Produto[];

const Index = () => {
  const [category, setCategory] = useState("Todas");

  const categories = useMemo(
    () => Array.from(new Set(ALL.map((p) => p.categoria))).sort(),
    []
  );

  const filtered = useMemo(
    () => (category === "Todas" ? ALL : ALL.filter((p) => p.categoria === category)),
    [category]
  );

  const stats = useMemo(() => {
    const receita = filtered.reduce((s, p) => s + p.vendaTotal, 0);
    const custo = filtered.reduce((s, p) => s + p.custoTotal, 0);
    const lucro = filtered.reduce((s, p) => s + p.lucro, 0);
    const unidades = filtered.reduce((s, p) => s + p.qntdVendida, 0);
    const margem = receita > 0 ? lucro / receita : 0;
    return { receita, custo, lucro, unidades, margem };
  }, [filtered]);

  const byCategory = useMemo(() => {
    const map = new Map<string, number>();
    ALL.forEach((p) => map.set(p.categoria, (map.get(p.categoria) ?? 0) + p.vendaTotal));
    return Array.from(map.entries()).map(([name, value]) => ({ name, value }));
  }, []);

  const topProducts = useMemo(
    () => [...filtered].sort((a, b) => b.lucro - a.lucro).slice(0, 10),
    [filtered]
  );

  return (
    <div className="min-h-screen">
      <header className="border-b border-border/50 bg-card/40 backdrop-blur-xl sticky top-0 z-10">
        <div className="container flex items-center justify-between py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-primary shadow-glow">
              <Sparkles className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">Painel de Vendas</h1>
              <p className="text-xs text-muted-foreground">Controle pessoal · {fmtInt(ALL.length)} produtos</p>
            </div>
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
          <StatCard
            label="Receita Total"
            value={fmtBRL(stats.receita)}
            hint={`${fmtInt(stats.unidades)} unidades vendidas`}
            icon={DollarSign}
            variant="primary"
          />
          <StatCard
            label="Lucro Líquido"
            value={fmtBRL(stats.lucro)}
            hint={`Custo: ${fmtBRL(stats.custo)}`}
            icon={TrendingUp}
            variant="success"
          />
          <StatCard
            label="Margem de Lucro"
            value={fmtPct(stats.margem)}
            hint="Lucro / Receita"
            icon={Percent}
            variant="accent"
          />
          <StatCard
            label="Produtos Ativos"
            value={fmtInt(filtered.length)}
            hint={category === "Todas" ? "Todas as categorias" : category}
            icon={Package}
            variant="warning"
          />
        </section>

        <section className="grid gap-6 lg:grid-cols-5">
          <div className="lg:col-span-3">
            <TopProductsChart data={topProducts.map((p) => ({ nome: p.nome, lucro: p.lucro }))} />
          </div>
          <div className="lg:col-span-2">
            <CategoryChart data={byCategory} />
          </div>
        </section>

        <section>
          <ProductsTable data={filtered} />
        </section>

        <footer className="pt-4 pb-8 text-center text-xs text-muted-foreground">
          Dados importados de CONTROLE_VENDAS.xlsx
        </footer>
      </main>
    </div>
  );
};

export default Index;
