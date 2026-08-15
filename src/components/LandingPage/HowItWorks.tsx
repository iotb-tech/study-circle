const STEPS = [
  {
    number: "01",
    title: "Search before you ask",
    description: "Check if your question's already been answered \u2014 most have.",
  },
  {
    number: "02",
    title: "Ask if it hasn't",
    description: "Post it once, with tags, so the next fellow finds it in seconds.",
  },
  {
    number: "03",
    title: "Get a mentor-verified answer",
    description: "Comments and upvotes surface the right answer \u2014 for good.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-white py-20">
      <div className="mx-auto max-w-6xl px-6">
        <h2 className="max-w-xl text-3xl font-bold text-neutral-900">
          From buried question to verified answer.
        </h2>

        <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-3">
          {STEPS.map((step) => (
            <div key={step.number}>
              <span className="text-sm font-semibold text--600">{step.number}</span>
              <h3 className="mt-2 text-xl font-semibold text-neutral-900">{step.title}</h3>
              <p className="mt-2 text-sm text-neutral-600">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
