import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ProdutoDB, useUpsertProduto } from "@/hooks/useProdutos";
import { z } from "zod";
import { toast } from "sonner";

const schema = z.object({
  nome: z.string().trim().min(1, "Nome obrigatório").max(120),
  categoria: z.string().trim().min(1, "Categoria obrigatória").max(60),
  custo_unit: z.number().min(0).max(1_000_000),
  qntd_comprada: z.number().int().min(0).max(1_000_000),
  valor_venda: z.number().min(0).max(1_000_000),
  qntd_vendida: z.number().int().min(0).max(1_000_000),
});

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  produto?: ProdutoDB | null;
  categorias: string[];
}

export const ProdutoDialog = ({ open, onOpenChange, produto, categorias }: Props) => {
  const upsert = useUpsertProduto();
  const [form, setForm] = useState({
    nome: "",
    categoria: "Outros",
    custo_unit: 0,
    qntd_comprada: 0,
    valor_venda: 0,
    qntd_vendida: 0,
  });

  useEffect(() => {
    if (produto) {
      setForm({
        nome: produto.nome,
        categoria: produto.categoria,
        custo_unit: Number(produto.custo_unit),
        qntd_comprada: produto.qntd_comprada,
        valor_venda: Number(produto.valor_venda),
        qntd_vendida: produto.qntd_vendida,
      });
    } else {
      setForm({ nome: "", categoria: "Outros", custo_unit: 0, qntd_comprada: 0, valor_venda: 0, qntd_vendida: 0 });
    }
  }, [produto, open]);

  const submit = async () => {
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0].message);
      return;
    }
    await upsert.mutateAsync({ id: produto?.id, ...parsed.data });
    onOpenChange(false);
  };

  const num = (v: string) => (v === "" ? 0 : Number(v));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{produto ? "Editar produto" : "Novo produto"}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-2">
          <div className="space-y-2">
            <Label>Nome</Label>
            <Input value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} maxLength={120} />
          </div>
          <div className="space-y-2">
            <Label>Categoria</Label>
            <Input
              value={form.categoria}
              onChange={(e) => setForm({ ...form, categoria: e.target.value })}
              list="categorias-list"
              maxLength={60}
            />
            <datalist id="categorias-list">
              {categorias.map((c) => <option key={c} value={c} />)}
            </datalist>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>Custo unitário (R$)</Label>
              <Input type="number" step="0.01" value={form.custo_unit} onChange={(e) => setForm({ ...form, custo_unit: num(e.target.value) })} />
            </div>
            <div className="space-y-2">
              <Label>Qntd comprada</Label>
              <Input type="number" value={form.qntd_comprada} onChange={(e) => setForm({ ...form, qntd_comprada: num(e.target.value) })} />
            </div>
            <div className="space-y-2">
              <Label>Valor de venda (R$)</Label>
              <Input type="number" step="0.01" value={form.valor_venda} onChange={(e) => setForm({ ...form, valor_venda: num(e.target.value) })} />
            </div>
            <div className="space-y-2">
              <Label>Qntd vendida</Label>
              <Input type="number" value={form.qntd_vendida} onChange={(e) => setForm({ ...form, qntd_vendida: num(e.target.value) })} />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
          <Button onClick={submit} disabled={upsert.isPending} className="bg-gradient-primary">
            {produto ? "Salvar" : "Criar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
