import { useEffect, useState, useRef } from "react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ProdutoDB, useUpsertProduto } from "@/hooks/useProdutos";
import { supabase } from "@/integrations/supabase/client";
import { ImagePlus, Loader2, X } from "lucide-react";
import { z } from "zod";
import { toast } from "sonner";

const schema = z.object({
  nome: z.string().trim().min(1, "Nome obrigatório").max(120),
  categoria: z.string().trim().min(1, "Categoria obrigatória").max(60),
  custo_unit: z.number().min(0).max(1_000_000),
  qntd_comprada: z.number().int().min(0).max(1_000_000),
  valor_venda: z.number().min(0).max(1_000_000),
  qntd_vendida: z.number().int().min(0).max(1_000_000),
  imagem_url: z.string().optional(),
});

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  produto?: ProdutoDB | null;
  categorias: string[];
}

export const ProdutoDialog = ({ open, onOpenChange, produto, categorias }: Props) => {
  const upsert = useUpsertProduto();
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({
    nome: "",
    categoria: "Outros",
    custo_unit: 0,
    qntd_comprada: 0,
    valor_venda: 0,
    qntd_vendida: 0,
    imagem_url: "",
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
        imagem_url: produto.imagem_url || "",
      });
    } else {
      setForm({ 
        nome: "", 
        categoria: "Outros", 
        custo_unit: 0, 
        qntd_comprada: 0, 
        valor_venda: 0, 
        qntd_vendida: 0,
        imagem_url: ""
      });
    }
  }, [produto, open]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('snack-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('snack-images')
        .getPublicUrl(filePath);

      setForm(prev => ({ ...prev, imagem_url: publicUrl }));
      toast.success("Imagem carregada!");
    } catch (error) {
      toast.error("Erro ao subir imagem");
      console.error(error);
    } finally {
      setUploading(false);
    }
  };

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
          <DialogTitle>{produto ? "Editar lanche" : "Novo lanche"}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-2">
          {/* Upload de Imagem */}
          <div className="flex flex-col items-center gap-4 py-2">
            <div 
              className="relative h-32 w-full max-w-[200px] overflow-hidden rounded-xl border-2 border-dashed border-muted-foreground/25 bg-muted/50 flex items-center justify-center cursor-pointer hover:border-primary/50 transition-colors"
              onClick={() => fileRef.current?.click()}
            >
              {form.imagem_url ? (
                <>
                  <img src={form.imagem_url} alt="Preview" className="h-full w-full object-cover" />
                  <button 
                    className="absolute top-1 right-1 p-1 bg-destructive text-destructive-foreground rounded-full"
                    onClick={(e) => { e.stopPropagation(); setForm(prev => ({ ...prev, imagem_url: "" })); }}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </>
              ) : (
                <div className="flex flex-col items-center gap-2 text-muted-foreground text-sm">
                  {uploading ? <Loader2 className="h-6 w-6 animate-spin" /> : <ImagePlus className="h-6 w-6" />}
                  <span>Carregar foto</span>
                </div>
              )}
            </div>
            <input ref={fileRef} type="file" accept="image/*" hidden onChange={handleFileUpload} disabled={uploading} />
          </div>

          <div className="space-y-2">
            <Label>Nome do Lanche</Label>
            <Input value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} maxLength={120} placeholder="Ex: X-Salada Especial" />
          </div>
          <div className="space-y-2">
            <Label>Categoria</Label>
            <Input
              value={form.categoria}
              onChange={(e) => setForm({ ...form, categoria: e.target.value })}
              list="categorias-list"
              maxLength={60}
              placeholder="Ex: Hambúrgueres, Bebidas..."
            />
            <datalist id="categorias-list">
              {categorias.map((c) => <option key={c} value={c} />)}
            </datalist>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>Custo (R$)</Label>
              <Input type="number" step="0.01" value={form.custo_unit} onChange={(e) => setForm({ ...form, custo_unit: num(e.target.value) })} />
            </div>
            <div className="space-y-2">
              <Label>Preço de Venda (R$)</Label>
              <Input type="number" step="0.01" value={form.valor_venda} onChange={(e) => setForm({ ...form, valor_venda: num(e.target.value) })} />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
          <Button onClick={submit} disabled={upsert.isPending || uploading} className="bg-gradient-primary">
            {produto ? "Salvar Alterações" : "Criar Lanche"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
