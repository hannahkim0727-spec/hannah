type ProgressProps = {
  value: number;
};

export function Progress({ value }: ProgressProps) {
  const safeValue = Math.max(0, Math.min(100, value));

  return (
    <div className="h-3 w-full overflow-hidden rounded-full bg-[color:var(--surface-strong)]">
      <div
        className="h-full rounded-full bg-[linear-gradient(90deg,var(--accent)_0%,var(--accent-soft)_100%)] transition-[width] duration-500"
        style={{ width: `${safeValue}%` }}
      />
    </div>
  );
}
