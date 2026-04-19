import { cn } from "@/lib/utils";

interface Props {
  categories: string[];
  active: string;
  onChange: (c: string) => void;
}

export const CategoryFilter = ({ categories, active, onChange }: Props) => {
  return (
    <div className="flex flex-wrap gap-2 animate-fade-in">
      {["Todas", ...categories].map((c) => (
        <button
          key={c}
          onClick={() => onChange(c)}
          className={cn(
            "rounded-full px-4 py-2 text-sm font-medium transition-smooth",
            active === c
              ? "bg-gradient-primary text-primary-foreground shadow-soft"
              : "bg-card text-muted-foreground hover:text-foreground hover:shadow-soft"
          )}
        >
          {c}
        </button>
      ))}
    </div>
  );
};
