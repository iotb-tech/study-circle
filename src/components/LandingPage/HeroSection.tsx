import Link from "next/link";
import { ArrowUp, Check } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="bg-white">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-16 md:py-24 lg:grid-cols-2">
        <div className="max-w-xl">
          <p className="text-xs font-medium uppercase tracking-widest text-primary-500">
            For software development fellowships
          </p>
          <h1 className="mt-4 text-4xl font-bold tracking-tight text-neutral-900 md:text-5xl">
            Stop losing good answers{" "}
            <em className="italic font-semibold text-primary-500">
              in group chat.
            </em>
          </h1>
          <p className="mt-5 text-base leading-relaxed text-neutral-600 md:text-lg">
            Study Circle turns your cohort&apos;s questions into a searchable
            knowledge base. Nobody re-asks, nobody re-explains, and
            nobody&apos;s afraid to ask.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/signup"
              className="inline-flex items-center justify-center rounded-lg bg-primary-500 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
            >
              Join Study Circle
            </Link>
            <Link
              href="#how-it-works"
              className="inline-flex items-center justify-center rounded-lg border border-neutral-200 bg-white px-4 py-2.5 text-sm font-medium text-neutral-800 transition-colors hover:bg-neutral-100 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
            >
              See how it works
            </Link>
          </div>
        </div>

        <HeroPreview />
      </div>
    </section>
  );
}

function HeroPreview() {
  return (
    <div
      className="relative mx-auto w-full max-w-md"
      aria-hidden="true"
    >
      <div className="absolute -left-2 top-0 z-10 max-w-[70%] -rotate-2 rounded-lg border border-neutral-200 bg-neutral-100 px-3 py-2 text-sm text-neutral-800 shadow-sm">
        anyone know why my useEffect keeps looping
      </div>
      <div className="absolute -right-1 top-14 z-10 max-w-[65%] rotate-2 rounded-lg border border-primary-100 bg-primary-50 px-3 py-2 text-sm text-neutral-800 shadow-sm">
        Is this the same q from last week?
      </div>

      <article className="relative z-20 mt-32 rounded-lg border border-neutral-200 bg-white p-5 shadow-sm">
        <span className="inline-flex items-center gap-1 rounded-full bg-primary-100 px-2.5 py-1 text-xs font-medium text-primary-500">
          <Check className="h-3.5 w-3.5" strokeWidth={2.5} />
          Mentor verified
        </span>
        <h2 className="mt-3 text-lg font-semibold text-neutral-900">
          Why does my useEffect run twice?
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-neutral-600">
          React 18 Strict Mode mounts, unmounts, then mounts again in
          development so you can catch missing cleanup.
        </p>
        <div className="mt-4 flex items-center justify-between text-sm">
          <span className="inline-flex items-center gap-1 text-neutral-600">
            <ArrowUp className="h-3.5 w-3.5" />
            12 upvotes
          </span>
          <span className="text-primary-500">
            #react&nbsp;&nbsp;#hooks
          </span>
        </div>
      </article>
    </div>
  );
}
