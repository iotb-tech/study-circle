const stats = [
  {
    value: "85.7%",
    description: "would search before asking in chat",
  },
  {
    value: "7 / 7",
    description: "fellows rely on chat or DMs for help today",
  },
  {
    value: "100%",
    description: "want keyword search as a core feature",
  },
  {
    value: "2",
    description: "fellows already volunteered to seed content",
  },
];

export default function StatsBar() {
  return (
    <section id="stats" className="bg-neutral-900 px-6 py-14 text-neutral-50 md:px-10 lg:px-16">
      <div className="mx-auto max-w-7xl">
        {/* Section heading */}
        <h2 className="font-sans text-2xl font-semibold md:text-3xl">
          Why we&apos;re building this.
        </h2>

        {/* Stats */}
        <div className="mt-10 grid grid-cols-2 gap-x-8 gap-y-10 md:grid-cols-4 md:gap-x-10">
          {stats.map((stat) => (
            <div key={stat.value}>
              <p className="font-sans text-2xl font-semibold text-primary-500 md:text-3xl">
                {stat.value}
              </p>

              <p className="mt-2 max-w-48 text-sm leading-5 text-neutral-400">
                {stat.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}