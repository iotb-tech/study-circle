import Link from "next/link";

const productLinks = [
  { label: "Browse Posts", href: "/posts" },
  { label: "Ask a Question", href: "/ask" },
  { label: "Sign In", href: "/signin" },
];

const aboutLinks = [
  { label: "The Problem", href: "/problem" },
  { label: "How It Works", href: "/how-it-works" },
];

const cohortLinks = [
  { label: "Contact a Mentor", href: "/contact-mentor" },
  { label: "Fellowship Home", href: "/fellowship" },
  { label: "View on GitHub", href: "https://github.com" },
];

function FooterLinks({
  title,
  links,
}: {
  title: string;
  links: { label: string; href: string }[];
}) {
  return (
    <div>
      <h3 className="mb-5 text-xs font-semibold uppercase tracking-wider text-primary-500">
        {title}
      </h3>

      <ul className="space-y-3">
        {links.map((link) => {
          const isExternal = link.href.startsWith("http");

          return (
            <li key={link.label}>
              {isExternal ? (
                <a
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-2 text-sm text-neutral-100 transition-colors duration-200 hover:text-primary-300"
                >
                  <span className="h-1 w-1 rounded-full bg-primary-500 opacity-0 transition-opacity group-hover:opacity-100" />
                  {link.label}
                </a>
              ) : (
                <Link
                  href={link.href}
                  className="group inline-flex items-center gap-2 text-sm text-neutral-100 transition-colors duration-200 hover:text-primary-300"
                >
                  <span className="h-1 w-1 rounded-full bg-primary-500 opacity-0 transition-opacity group-hover:opacity-100" />
                  {link.label}
                </Link>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default function Footer() {
  return (
    <footer className="bg-neutral-900 font-sans text-neutral-100">
      {/* Main footer */}
      <div className="border-y border-neutral-800">
        <div className="mx-auto max-w-7xl px-6 py-14 sm:px-8 lg:px-12">
          <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
            {/* Brand */}
            <div className="lg:pr-10">
              <Link
                href="/"
                className="inline-block text-2xl font-bold tracking-tight text-primary-500 transition-colors duration-200 hover:text-primary-300"
              >
                Study Circle
              </Link>

              <div className="mt-5 h-1 w-10 rounded-lg bg-primary-500" />

              <p className="mt-5 max-w-xs text-sm leading-6 text-neutral-400">
                A searchable knowledge base for fellowship cohorts.
              </p>
            </div>

            {/* Product */}
            <FooterLinks title="Product" links={productLinks} />

            {/* About */}
            <FooterLinks title="About" links={aboutLinks} />

            {/* Cohort */}
            <FooterLinks title="Cohort" links={cohortLinks} />
          </div>
        </div>
      </div>

      {/* Bottom section */}
      <div className="bg-neutral-900">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-6 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:px-12">
          <p className="text-xs text-neutral-400">
            © 2026 Study Circle. Built by{" "}
            <span className="font-medium text-primary-500">Team 2</span>.
          </p>

          <div className="h-1 w-12 rounded-lg bg-primary-600" />
        </div>
      </div>
    </footer>
  );
}
