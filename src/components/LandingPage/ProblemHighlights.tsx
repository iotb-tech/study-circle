const BARS = [
  { label: "Re-asked something already answered in chat", value: 66.7 },
  { label: "Often struggle to find a past answer in chat history", value: 57 },
  { label: 'Cite fear of "looking stupid" as the reason they stay quiet', value: 50 },
];

export function ProblemHighlights() {
  return (
    <section
      id="problem"
      className="relative overflow-hidden bg-white bg-[radial-gradient(#e4e4e7_1px,transparent_1px)] bg-[length:22px_22px] py-24"
    >
      <div className="pointer-events-none absolute -right-24 -top-32 h-[420px] w-[420px] rounded-full bg-primary-100 opacity-70 blur-[90px]" />

      <div className="relative z-10 mx-auto max-w-6xl px-6">
        <span className="text-xs font-semibold uppercase tracking-widest text-primary-700">
          The problem
        </span>
        <h2 className="mt-3 text-4xl font-bold tracking-tight text-neutral-900">
          You&apos;ve felt this before.
        </h2>
        <p className="mt-3 max-w-xl text-neutral-600">
          We surveyed 7 fellows before writing a line of code. Here&apos;s what they told us.
        </p>

        <div className="mt-12 grid grid-cols-1 items-center gap-14 lg:grid-cols-[0.85fr_1.15fr]">
          <div className="flex flex-col items-center gap-6 rounded-lg bg-primary-50 p-7 text-center sm:flex-row sm:text-left">
            <div
              className="flex h-32 w-32 flex-shrink-0 items-center justify-center rounded-full shadow-[0_0_0_8px_rgba(255,255,255,0.6),0_12px_28px_rgba(22,163,74,0.18)]"
              style={{ background: "conic-gradient(#16a34a 0% 71.4%, #dcfce7 71.4% 100%)" }}
            >
              <div className="flex h-[100px] w-[100px] flex-col items-center justify-center rounded-full bg-white">
                <span className="text-2xl font-extrabold text-neutral-900">71.4%</span>
                <span className="mt-0.5 text-[10px] text-neutral-600">of fellows</span>
              </div>
            </div>
            <p className="text-base font-semibold leading-relaxed text-neutral-900">
              <span className="text-primary-600">71.4%</span> have held back from asking a
              question publicly.
            </p>
          </div>

          <div className="flex flex-col gap-6">
            {BARS.map((bar) => (
              <div key={bar.label}>
                <div className="mb-2 flex items-baseline justify-between">
                  <span className="text-sm font-medium text-neutral-600">{bar.label}</span>
                  <span className="text-[15px] font-bold text-primary-600">{bar.value}%</span>
                </div>
                <div className="h-2.5 overflow-hidden rounded-full bg-neutral-100">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-primary-500 to-primary-600"
                    style={{ width: `${bar.value}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
