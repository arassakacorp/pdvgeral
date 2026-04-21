import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { fmtBRL } from "@/lib/format";

const COLORS = [
  "hsl(28 90% 50%)",
  "hsl(42 100% 50%)",
  "hsl(38 95% 55%)",
  "hsl(142 70% 35%)",
  "hsl(0 84% 60%)",
  "hsl(20 90% 60%)",
];

interface Props {
  data: { name: string; value: number }[];
}

export const CategoryChart = ({ data }: Props) => {
  return (
    <div className="rounded-2xl bg-card p-6 shadow-soft animate-fade-in">
      <h3 className="mb-4 text-lg font-semibold">Vendas por categoria</h3>
      <ResponsiveContainer width="100%" height={280}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={4}
            dataKey="value"
          >
            {data.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{ borderRadius: 12, border: "1px solid hsl(var(--border))", background: "hsl(var(--card))" }}
            formatter={(v: number) => fmtBRL(v)}
          />
          <Legend wrapperStyle={{ fontSize: 12 }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};
