import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Search, ArrowUpDown } from "lucide-react";
import { fmtBRL, fmtInt } from "@/lib/format";
import { cn } from "@/lib/utils";

export interface Produto {
  nome: string;
  custoUnit: number;
  qntdComprada: number;
  custoTotal: number;
  valorVenda: number;
  qntdVendida: number;
  vendaTotal: number;
  lucro: number;
  categoria: string;
}

type SortKey = "nome" | "vendaTotal" | "lucro" | "qntdVendida";

interface Props { data: Produto[]; }

export const ProductsTable = ({ data }: Props) => {
  const [q, setQ] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("lucro");
  const [asc, setAsc] = useState(false);

  const rows = useMemo(() => {
    const filtered = data.filter((p) => p.nome.toLowerCase().includes(q.toLowerCase()));
    return [...filtered].sort((a, b) => {
      const av = a[sortKey];
      const bv = b[sortKey];
      if (typeof av === "string" && typeof bv === "string") {
        return asc ? av.localeCompare(bv) : bv.localeCompare(av);
      }
      return asc ? (av as number) - (bv as number) : (bv as number) - (av as number);
    });
  }, [data, q, sortKey, asc]);

  const toggle = (k: SortKey) => {
    if (sortKey === k) setAsc(!asc);
    else { setSortKey(k); setAsc(false); }
  };

  return (
    <div className="rounded-2xl bg-card shadow-soft animate-fade-in overflow-hidden">
      <div className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold">Produtos</h3>
          <p className="text-sm text-muted-foreground">{rows.length} de {data.length} itens</p>
        </div>
        <div className="relative sm:w-72">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar produto..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-left text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              <Th onClick={() => toggle("nome")}>Produto</Th>
              <Th className="text-right" onClick={() => toggle("qntdVendida")}>Vendidos</Th>
              <Th className="text-right">Custo</Th>
              <Th className="text-right">Preço</Th>
              <Th className="text-right" onClick={() => toggle("vendaTotal")}>Total Vendas</Th>
              <Th className="text-right" onClick={() => toggle("lucro")}>Lucro</Th>
            </tr>
          </thead>
          <tbody>
            {rows.map((p, i) => (
              <tr key={i} className="border-t border-border transition-smooth hover:bg-muted/40">
                <td className="px-4 py-3 font-medium">{p.nome}</td>
                <td className="px-4 py-3 text-right tabular-nums">{fmtInt(p.qntdVendida)}</td>
                <td className="px-4 py-3 text-right tabular-nums text-muted-foreground">{fmtBRL(p.custoUnit)}</td>
                <td className="px-4 py-3 text-right tabular-nums">{fmtBRL(p.valorVenda)}</td>
                <td className="px-4 py-3 text-right tabular-nums font-medium">{fmtBRL(p.vendaTotal)}</td>
                <td className={cn("px-4 py-3 text-right tabular-nums font-semibold", p.lucro >= 0 ? "text-success" : "text-destructive")}>
                  {fmtBRL(p.lucro)}
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr><td colSpan={6} className="py-12 text-center text-muted-foreground">Nenhum produto encontrado</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const Th = ({ children, className, onClick }: { children: React.ReactNode; className?: string; onClick?: () => void }) => (
  <th className={cn("px-4 py-3 font-semibold", onClick && "cursor-pointer select-none hover:text-foreground", className)} onClick={onClick}>
    <span className="inline-flex items-center gap-1">
      {children}
      {onClick && <ArrowUpDown className="h-3 w-3 opacity-50" />}
    </span>
  </th>
);
