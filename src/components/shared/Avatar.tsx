import { cn } from "@/lib/utils";

const palette = [
  "bg-primary text-primary-foreground",
  "bg-secondary text-secondary-foreground",
  "bg-accent text-accent-foreground",
  "bg-success text-success-foreground",
  "bg-info text-info-foreground",
];

export function Avatar({ name, size = 36, className }: { name: string; size?: number; className?: string }) {
  const initials = name.split(" ").slice(0, 2).map(n => n[0]).join("").toUpperCase();
  const idx = name.split("").reduce((a, c) => a + c.charCodeAt(0), 0) % palette.length;
  return (
    <div
      className={cn("rounded-full grid place-items-center font-bold shrink-0", palette[idx], className)}
      style={{ width: size, height: size, fontSize: size * 0.38 }}
    >
      {initials}
    </div>
  );
}
