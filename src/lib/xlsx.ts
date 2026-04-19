import * as XLSX from "xlsx";
import { ProdutoDB, ProdutoInput } from "@/hooks/useProdutos";

export const exportToXLSX = (produtos: ProdutoDB[]) => {
  const rows = produtos.map((p) => ({
    "NOME DO PRODUTO": p.nome,
    "CATEGORIA": p.categoria,
    "CUSTO DO PRODUTO": Number(p.custo_unit),
    "QNTD COMPRADA": p.qntd_comprada,
    "CUSTO TOTAL": Number(p.custo_total),
    "VALOR DE VENDA": Number(p.valor_venda),
    "QNTD VENDIDA": p.qntd_vendida,
    "VENDA TOTAL": Number(p.venda_total),
    "LUCRO": Number(p.lucro),
  }));
  const ws = XLSX.utils.json_to_sheet(rows);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Vendas");
  XLSX.writeFile(wb, `controle_vendas_${new Date().toISOString().slice(0, 10)}.xlsx`);
};

const cat = (nome: string): string => {
  const u = nome.toUpperCase();
  if (u.includes("ACTION FIGURE")) return "Action Figures";
  if (u.includes("FUNKO")) return "Funko Pop";
  if (u.includes("CARD") || u.includes("CARTA") || u.includes("BOOSTER")) return "Cards";
  if (u.includes("CHAVEIRO")) return "Chaveiros";
  return "Outros";
};

const num = (v: unknown): number => {
  if (v === null || v === undefined || v === "") return 0;
  const n = Number(v);
  return isNaN(n) ? 0 : n;
};

export const parseXLSX = async (file: File): Promise<ProdutoInput[]> => {
  const buf = await file.arrayBuffer();
  const wb = XLSX.read(buf, { type: "array" });
  const ws = wb.Sheets[wb.SheetNames[0]];
  const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(ws, { defval: "" });
  return rows
    .map((r) => {
      const nome = String(r["NOME DO PRODUTO"] ?? r["nome"] ?? "").trim();
      if (!nome) return null;
      const categoria = String(r["CATEGORIA"] ?? r["categoria"] ?? "").trim() || cat(nome);
      return {
        nome: nome.slice(0, 120),
        categoria: categoria.slice(0, 60),
        custo_unit: num(r["CUSTO DO PRODUTO"] ?? r["custo_unit"]),
        qntd_comprada: Math.floor(num(r["QNTD COMPRADA"] ?? r["qntd_comprada"])),
        valor_venda: num(r["VALOR DE VENDA"] ?? r["valor_venda"]),
        qntd_vendida: Math.floor(num(r["QNTD VENDIDA"] ?? r["qntd_vendida"])),
      };
    })
    .filter((r): r is ProdutoInput => r !== null);
};
