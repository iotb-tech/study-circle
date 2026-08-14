import { ReactNode } from "react";

interface FooterLink {
  label: string;
  href: string;
}

interface FooterLinkGroup {
  title: string;
  links: FooterLink[];
}

interface FooterSocialLink {
  label: string;
  href: string;
  icon: ReactNode;
}

interface FooterProps {
  brand?: ReactNode;
  description?: ReactNode;
  linkGroups?: FooterLinkGroup[];
  socialLinks?: FooterSocialLink[];
  copyright?: ReactNode;
  className?: string;
}

function cx(...classes: Array<string | false | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function Footer({
  brand,
  description,
  linkGroups = [],
  socialLinks = [],
  copyright,
  className,
}: FooterProps) {
  const hasBrandColumn = Boolean(brand || description);

  return (
    <footer className={cx("w-full border-t border-gray-200 bg-gray-50", className)}>
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {hasBrandColumn && (
            <div className="lg:col-span-1">
              {brand && <div className="text-lg font-semibold text-gray-900">{brand}</div>}
              {description && (
                <p className="mt-3 max-w-xs text-sm text-gray-600">{description}</p>
              )}

              {socialLinks.length > 0 && (
                <div className="mt-5 flex gap-4">
                  {socialLinks.map((social) => (
                    <a
                      key={social.href}
                      href={social.href}
                      aria-label={social.label}
                      className="rounded text-gray-500 transition-colors hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-orange-500"
                    >
                      {social.icon}
                    </a>
                  ))}
                </div>
              )}
            </div>
          )}

          {linkGroups.length > 0 && (
            <nav
              aria-label="Footer"
              className="grid grid-cols-2 gap-8 sm:col-span-2 sm:grid-cols-3 lg:col-span-3"
            >
              {linkGroups.map((group) => (
                <div key={group.title}>
                  <h2 className="text-sm font-semibold text-gray-900">{group.title}</h2>
                  <ul className="mt-4 space-y-3">
                    {group.links.map((link) => (
                      <li key={link.href}>
                        <a
                          href={link.href}
                          className="rounded text-sm text-gray-600 transition-colors hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-orange-500"
                        >
                          {link.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </nav>
          )}
        </div>

        {copyright && (
          <div className="mt-12 border-t border-gray-200 pt-6 text-sm text-gray-500">
            {copyright}
          </div>
        )}
      </div>
    </footer>
  );
}
