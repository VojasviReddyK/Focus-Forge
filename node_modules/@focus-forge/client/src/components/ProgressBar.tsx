export function ProgressBar({ value }: { value: number }) {
  return (
    <div className="h-3 w-full overflow-hidden rounded-full bg-slate-100">
      <div className="h-full rounded-full bg-gradient-to-r from-primary via-indigo to-cyan transition-all" style={{ width: `${Math.min(100, value)}%` }} />
    </div>
  );
}
