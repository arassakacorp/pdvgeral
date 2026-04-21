import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Cell } from "recharts";
import { fmtBRL } from "@/lib/format";

interface Props {
  data: { nome: string; lucro: number }[];
}

export const TopProductsChart = ({ data }: Props) => {
  return (
    <div className="rounded-2xl bg-card p-6 shadow-soft animate-fade-in">
      <h3 className="mb-4 text-lg font-semibold">Top 10 produtos por lucro</h3>
      <ResponsiveContainer width="100%" height={320}>
        <BarChart data={data} layout="vertical" margin={{ left: 10, right: 20 }}>
          <XAxis type="number" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
          <YAxis
            type="category"
            dataKey="nome"
            width={140}
            tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
            tickFormatter={(v) => (v.length > 18 ? v.slice(0, 18) + "…" : v)}
          />
          <Tooltip
            contentStyle={{ borderRadius: 12, border: "1px solid hsl(var(--border))", background: "hsl(var(--card))" }}
            formatter={(v: number) => fmtBRL(v)}
            cursor={{ fill: "hsl(var(--muted))" }}
          />
          <Bar dataKey="lucro" radius={[0, 8, 8, 0]}>
            {data.map((d, i) => (
              <Cell key={i} fill={d.lucro >= 0 ? "hsl(28 90% 50%)" : "hsl(0 84% 60%)"} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
