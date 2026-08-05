export function Wordmark({ className = "" }: { className?: string }) {
  return (
    <span
      className={`font-heading font-semibold tracking-tight text-[var(--color-ink)] ${className}`}
    >
      DemoBro
      <span className="text-[var(--color-accent)]">.video</span>
    </span>
  );
}
