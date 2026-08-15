const STATS = [
  { value: "71.4%", label: "have held back from asking a question publicly" },
  { value: "66.7%", label: "have asked something already answered in chat" },
  { value: "57%", label: "often struggle to find a past answer in chat history" },
  { value: "50%", label: "say fear of \u201closing stupid\u201d keeps them quiet" },
];

export function ProblemHighlights() {
  return (
    <section id="problem" className="bg-white py-20">
      <div className="mx-auto max-w-6xl px-6">
        <div className="max-w-xl">
          <h2 className="text-3xl font-bold text-neutral-900">You&apos;ve felt this before.</h2>
          <p className="mt-3 text-neutral-600">
            We surveyed 7 fellows before writing a line of code. Here&apos;s what they told us.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {STATS.map((stat) => (
            <div
              key={stat.label}
              className="rounded-lg border border-neutral-200 bg-neutral-50 p-6"
            >
              <div className="text-3xl font-bold text-primary-600">{stat.value}</div>
              <p className="mt-2 text-sm text-neutral-600">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}


