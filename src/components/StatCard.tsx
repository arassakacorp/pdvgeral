import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: string;
  hint?: string;
  icon: LucideIcon;
  variant?: "primary" | "success" | "accent" | "warning";
}

const gradientMap = {
  primary: "bg-gradient-primary",
  success: "bg-gradient-success",
  accent: "bg-gradient-accent",
  warning: "bg-gradient-warning",
};

export const StatCard = ({ label, value, hint, icon: Icon, variant = "primary" }: StatCardProps) => {
  return (
    <div className="group relative overflow-hidden rounded-2xl bg-card p-6 shadow-soft transition-smooth hover:shadow-elegant hover:-translate-y-1 animate-fade-in">
      <div className={cn("absolute -right-6 -top-6 h-24 w-24 rounded-full opacity-20 blur-2xl transition-smooth group-hover:opacity-40", gradientMap[variant])} />
      <div className="relative flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">{label}</p>
          <p className="text-3xl font-bold tracking-tight text-foreground">{value}</p>
          {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
        </div>
        <div className={cn("flex h-12 w-12 items-center justify-center rounded-xl text-primary-foreground shadow-soft", gradientMap[variant])}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </div>
  );
};
