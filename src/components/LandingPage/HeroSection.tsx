import { ReactNode } from "react";

type HeroActionVariant = "primary" | "secondary";

interface HeroAction {
  label: string;
  href?: string;
  onClick?: () => void;
  variant?: HeroActionVariant;
}

interface HeroProps {
  heading: ReactNode;
  subheading?: ReactNode;
  primaryAction?: HeroAction;
  secondaryAction?: HeroAction;
  children?: ReactNode;
  className?: string;
}

function cx(...classes: Array<string | false | undefined>) {
  return classes.filter(Boolean).join(" ");
}

const actionBaseClasses =
  "inline-flex items-center justify-center rounded-xl px-6 py-3 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-orange-500 disabled:pointer-events-none disabled:opacity-50";

const actionVariantClasses: Record<HeroActionVariant, string> = {
  primary: "bg-orange-600 text-white hover:bg-orange-700",
  secondary: "border border-gray-300 bg-transparent text-gray-900 hover:bg-gray-50",
};

function HeroActionButton({ action }: { action: HeroAction }) {
  const classes = cx(actionBaseClasses, actionVariantClasses[action.variant ?? "primary"]);

  // A link that navigates must be a real <a> — screen readers, keyboard
  // behavior, and "open in new tab" all depend on the correct element.
  if (action.href) {
    return (
      <a href={action.href} className={classes}>
        {action.label}
      </a>
    );
  }

  return (
    <button type="button" onClick={action.onClick} className={classes}>
      {action.label}
    </button>
  );
}

export function Hero({
  heading,
  subheading,
  primaryAction,
  secondaryAction,
  children,
  className,
}: HeroProps) {
  const haschildren = Boolean(children);


  return (
    <section className={cx("w-full", className)}>
      <div
        className={cx(
          "mx-auto flex max-w-6xl flex-col items-center gap-10 px-6 py-16",
          haschildren && "lg:flex-row lg:items-center lg:justify-between lg:py-24"
        )}
      >
        <div className={cx("max-w-xl text-center", haschildren && "lg:text-left")}>
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            {heading}
          </h1>

          {subheading && <p className="mt-4 text-lg text-gray-600">{subheading}</p>}

          {(primaryAction || secondaryAction) && (
            <div
              className={cx(
                "mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center",
                haschildren && "lg:justify-start"
              )}
            >
              {primaryAction && <HeroActionButton action={primaryAction} />}
              {secondaryAction && <HeroActionButton action={secondaryAction} />}
            </div>
          )}
        </div>

        {children && <div className="w-full max-w-lg lg:max-w-none lg:flex-1">{children}</div>}
      </div>
    </section>
  );
}
