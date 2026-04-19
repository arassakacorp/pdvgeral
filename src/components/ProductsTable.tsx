import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, ArrowUpDown, Pencil, Trash2 } from "lucide-react";
import { fmtBRL, fmtInt } from "@/lib/format";
import { cn } from "@/lib/utils";
import { ProdutoDB } from "@/hooks/useProdutos";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";

type SortKey = "nome" | "venda_total" | "lucro" | "qntd_vendida";

interface Props {
  data: ProdutoDB[];
  onEdit: (p: ProdutoDB) => void;
  onDelete: (id: string) => void;
}

export const ProductsTable = ({ data, onEdit, onDelete }: Props) => {
  const [q, setQ] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("lucro");
  const [asc, setAsc] = useState(false);
  const [confirmDel, setConfirmDel] = useState<ProdutoDB | null>(null);

  const rows = useMemo(() => {
    const filtered = data.filter((p) => p.nome.toLowerCase().includes(q.toLowerCase()));
    return [...filtered].sort((a, b) => {
      const av = a[sortKey];
      const bv = b[sortKey];
      if (typeof av === "string" && typeof bv === "string") {
        return asc ? av.localeCompare(bv) : bv.localeCompare(av);
      }
      return asc ? Number(av) - Number(bv) : Number(bv) - Number(av);
    });
  }, [data, q, sortKey, asc]);

  const toggle = (k: SortKey) => {
    if (sortKey === k) setAsc(!asc);
    else { setSortKey(k); setAsc(false); }
  };

  return (
    <>
      <div className="rounded-2xl bg-card shadow-soft animate-fade-in overflow-hidden">
        <div className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-lg font-semibold">Produtos</h3>
            <p className="text-sm text-muted-foreground">{rows.length} de {data.length} itens</p>
          </div>
          <div className="relative sm:w-72">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Buscar produto..." value={q} onChange={(e) => setQ(e.target.value)} className="pl-9" />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-left text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <Th onClick={() => toggle("nome")}>Produto</Th>
                <Th className="text-right" onClick={() => toggle("qntd_vendida")}>Vendidos</Th>
                <Th className="text-right">Custo</Th>
                <Th className="text-right">Preço</Th>
                <Th className="text-right" onClick={() => toggle("venda_total")}>Total Vendas</Th>
                <Th className="text-right" onClick={() => toggle("lucro")}>Lucro</Th>
                <Th className="text-right">Ações</Th>
              </tr>
            </thead>
            <tbody>
              {rows.map((p) => (
                <tr key={p.id} className="border-t border-border transition-smooth hover:bg-muted/40">
                  <td className="px-4 py-3">
                    <div className="font-medium">{p.nome}</div>
                    <div className="text-xs text-muted-foreground">{p.categoria}</div>
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums">{fmtInt(p.qntd_vendida)}</td>
                  <td className="px-4 py-3 text-right tabular-nums text-muted-foreground">{fmtBRL(Number(p.custo_unit))}</td>
                  <td className="px-4 py-3 text-right tabular-nums">{fmtBRL(Number(p.valor_venda))}</td>
                  <td className="px-4 py-3 text-right tabular-nums font-medium">{fmtBRL(Number(p.venda_total))}</td>
                  <td className={cn("px-4 py-3 text-right tabular-nums font-semibold", Number(p.lucro) >= 0 ? "text-success" : "text-destructive")}>
                    {fmtBRL(Number(p.lucro))}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-1">
                      <Button size="icon" variant="ghost" onClick={() => onEdit(p)} aria-label="Editar">
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button size="icon" variant="ghost" onClick={() => setConfirmDel(p)} aria-label="Excluir" className="text-destructive hover:text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr><td colSpan={7} className="py-12 text-center text-muted-foreground">Nenhum produto encontrado</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <AlertDialog open={!!confirmDel} onOpenChange={(o) => !o && setConfirmDel(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir produto?</AlertDialogTitle>
            <AlertDialogDescription>
              "{confirmDel?.nome}" será removido permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => { if (confirmDel) onDelete(confirmDel.id); setConfirmDel(null); }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
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
