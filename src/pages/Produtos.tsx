import { useState, useMemo, useRef } from "react";
import { Plus, Upload, Download, Search, Package, Loader2 } from "lucide-react";
import { ProductsTable } from "@/components/ProductsTable";
import { CategoryFilter } from "@/components/CategoryFilter";
import { ProdutoDialog } from "@/components/ProdutoDialog";
import { Button } from "@/components/ui/button";
import { useProdutos, useDeleteProduto, useBulkInsertProdutos, ProdutoDB } from "@/hooks/useProdutos";
import { useCreatorsMap } from "@/hooks/useAdmin";
import { exportToXLSX, parseXLSX } from "@/lib/xlsx";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";

const Produtos = () => {
  const { data: produtos = [], isLoading } = useProdutos();
  const del = useDeleteProduto();
  const bulk = useBulkInsertProdutos();
  const { data: creators = {} } = useCreatorsMap();

  const [category, setCategory] = useState("Todas");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<ProdutoDB | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const categories = useMemo(
    () => Array.from(new Set(produtos.map((p) => p.categoria))).sort(),
    [produtos]
  );

  const filtered = useMemo(() => {
    return produtos.filter((p) => {
      const matchCat = category === "Todas" || p.categoria === category;
      const matchSearch = p.nome.toLowerCase().includes(searchTerm.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [produtos, category, searchTerm]);

  const onNew = () => { setEditing(null); setDialogOpen(true); };
  const onEdit = (p: ProdutoDB) => { setEditing(p); setDialogOpen(true); };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const rows = await parseXLSX(file);
      await bulk.mutateAsync(rows);
      toast.success("Importação concluída!");
    } catch (err) {
      toast.error("Erro ao importar");
    } finally {
      e.target.value = "";
    }
  };

  return (
    <div className="container py-8 space-y-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Estoque de Produtos</h1>
          <p className="text-muted-foreground">Gerencie seus lanches, preços e fotos.</p>
        </div>
        <div className="flex items-center gap-2">
          <input ref={fileRef} type="file" accept=".xlsx,.xls" hidden onChange={handleImport} />
          <Button variant="outline" size="sm" onClick={() => fileRef.current?.click()} disabled={bulk.isPending}>
            <Upload className="mr-2 h-4 w-4" /> Importar
          </Button>
          <Button variant="outline" size="sm" onClick={() => exportToXLSX(produtos)}>
            <Download className="mr-2 h-4 w-4" /> Exportar
          </Button>
          <Button size="sm" onClick={onNew} className="bg-gradient-primary shadow-md">
            <Plus className="mr-2 h-4 w-4" /> Novo Lanche
          </Button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Buscar lanche..." 
            className="pl-10" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <CategoryFilter categories={categories} active={category} onChange={setCategory} />
      </div>

      {isLoading ? (
        <div className="flex justify-center py-24"><Loader2 className="h-10 w-10 animate-spin text-primary" /></div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-24 border-2 border-dashed rounded-3xl">
          <Package className="h-12 w-12 text-muted-foreground mx-auto opacity-20 mb-4" />
          <p className="text-muted-foreground">Nenhum produto encontrado.</p>
        </div>
      ) : (
        <ProductsTable data={filtered} onEdit={onEdit} onDelete={(id) => del.mutate(id)} creators={creators} />
      )}

      <ProdutoDialog open={dialogOpen} onOpenChange={setDialogOpen} produto={editing} categorias={categories} />
    </div>
  );
};

export default Produtos;
