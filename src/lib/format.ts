export const fmtBRL = (n: number) =>
  n.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });

export const fmtPct = (n: number) =>
  `${(n * 100).toFixed(1)}%`;

export const fmtInt = (n: number) => n.toLocaleString("pt-BR");
