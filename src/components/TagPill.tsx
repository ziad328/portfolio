export default function TagPill({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-border px-4 py-1.5 font-mono text-[11px] uppercase tracking-[0.12em] text-fg">
      {children}
    </span>
  );
}
