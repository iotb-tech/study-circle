const STEPS = [
  {
    number: "1",
    title: "Search before you ask",
    description: "Check if your question's already been answered, most have.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
        <circle cx="11" cy="11" r="7" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
    ),
  },
  {
    number: "2",
    title: "Ask if it hasn't",
    description: "Post it once, with tags, so the next fellow finds it in seconds.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
      </svg>
    ),
  },
  {
    number: "3",
    title: "Get a mentor-verified answer",
    description: "Comments and upvotes surface the right answer, for good.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <path d="M9 12l2 2 4-4" />
      </svg>
    ),
  },
];

export function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="relative overflow-hidden bg-neutral-50 bg-[radial-gradient(#e4e4e7_1px,transparent_1px)] bg-[length:22px_22px] py-24"
    >
      <div className="pointer-events-none absolute -bottom-36 -left-24 h-[380px] w-[380px] rounded-full bg-primary-100 opacity-50 blur-[100px]" />

      <div className="relative z-10 mx-auto max-w-6xl px-6">
        <span className="text-xs font-semibold uppercase tracking-widest text-primary-700">
          How it works
        </span>
        <h2 className="mt-3 max-w-xl text-4xl font-bold tracking-tight text-neutral-900">
          From buried question to verified answer.
        </h2>

        <div className="relative mt-16 grid grid-cols-1 gap-10 sm:grid-cols-3">
          <div className="pointer-events-none absolute left-[16.5%] right-[16.5%] top-[34px] hidden border-t-2 border-dashed border-neutral-200 sm:block" />

          {STEPS.map((step) => (
            <div key={step.number} className="relative z-10">
              <div className="relative h-[68px] w-[68px]">
                <div className="flex h-[68px] w-[68px] items-center justify-center rounded-full bg-primary-100 text-primary-600 shadow-[0_0_0_8px_rgba(255,255,255,0.6),0_8px_18px_rgba(22,163,74,0.14)]">
                  <span className="h-7 w-7">{step.icon}</span>
                </div>
                <span className="absolute -right-1.5 -top-1.5 flex h-[22px] w-[22px] items-center justify-center rounded-full border-2 border-neutral-50 bg-primary-600 text-[11px] font-bold text-white">
                  {step.number}
                </span>
              </div>

              <h3 className="mt-5 text-xl font-semibold text-neutral-900">{step.title}</h3>
              <p className="mt-2 max-w-[260px] text-sm leading-relaxed text-neutral-600">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
