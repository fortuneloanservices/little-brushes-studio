import { Palette } from "lucide-react";

export function Logo({ size = 40, withText = true }: { size?: number; withText?: boolean }) {
  return (
    <div className="flex items-center gap-2.5">
      <div
        className="grid place-items-center rounded-2xl gradient-primary text-white shadow-pop animate-pop-in"
        style={{ width: size, height: size }}
        aria-hidden
      >
        <Palette className="w-1/2 h-1/2" strokeWidth={2.4} />
      </div>
      {withText && (
        <div className="leading-tight">
          <div className="font-display text-lg font-bold text-secondary">Little Brushes</div>
          <div className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">Art Academy</div>
        </div>
      )}
    </div>
  );
}
