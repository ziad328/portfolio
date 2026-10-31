// Infinitely scrolling strip of skills, separated by ◆. Renders nothing when there are no items.
export default function MarqueeTicker({ items }: { items: string[] }) {
  // Dedupe case-insensitively, keeping the first spelling ("React" and "react" show once)
  const unique = [...new Map(items.map((item) => [item.trim().toLowerCase(), item.trim()])).values()].filter(Boolean);
  if (unique.length === 0) return null;

  // shortcut: repeats to ~24 entries so one copy is wider than the screen; measure the width if items get very short or screens very wide
  const copy = Array.from({ length: Math.ceil(24 / unique.length) }, () => unique).flat();

  return (
    <div className="overflow-hidden border-y border-border py-5">
      {/* Two identical copies; the track slides by -50% so the second takes the first's place seamlessly */}
      {/* Duration scales with length so the speed stays the same however many tags there are */}
      <div className="marquee-track flex w-max" style={{ animationDuration: `${copy.length * 2}s` }}>
        {[0, 1].map((n) => (
          <ul key={n} aria-hidden={n === 1} aria-label={n === 0 ? 'Skills' : undefined} className="flex shrink-0 items-center">
            {copy.map((item, i) => (
              <li key={i} className="flex items-center font-mono text-xs uppercase tracking-[0.12em] text-fg-muted">
                <span className="px-6">{item}</span>
                <span aria-hidden="true" className="text-accent">◆</span>
              </li>
            ))}
          </ul>
        ))}
      </div>
    </div>
  );
}
