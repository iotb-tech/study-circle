"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

interface AuthLayoutProps {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  const pathname = usePathname();
  const isSignin = pathname === "/signin";

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left panel — brand section */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary-600 via-primary-700 to-brown-900 flex-col justify-between p-12 relative overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full translate-x-1/3 -translate-y-1/3" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full -translate-x-1/3 translate-y-1/3" />
        <div className="absolute top-1/2 left-1/2 w-48 h-48 bg-white/5 rounded-full -translate-x-1/2 -translate-y-1/2" />

        {/* Logo */}
        <div className="relative z-10">
          <Link href="/" className="inline-block">
            <span className="text-3xl font-bold text-white">
              study<span className="text-primary-300">Circle</span>
            </span>
          </Link>
        </div>

        {/* Tagline */}
        <div className="relative z-10 max-w-md">
          <h1 className="text-4xl font-bold text-white leading-tight mb-4">
            Learn Together,
            <br />
            <span className="text-primary-300">Grow Together</span>
          </h1>
          <p className="text-lg text-white/70">
            A searchable knowledge base for fellowship cohorts.
            Ask questions, share answers, and never lose valuable
            knowledge again.
          </p>
        </div>

        {/* Bottom quote or stats */}
        <div className="relative z-10">
          <blockquote className="text-sm text-white/60 italic">
            &quot;The beautiful thing about learning is that no one
            can take it away from you.&quot;
          </blockquote>
          <p className="text-sm text-white/40 mt-2">— B.B. King</p>
        </div>
      </div>

      {/* Right panel — auth form */}
      <div className="flex-1 flex flex-col justify-center items-center px-4 py-12 sm:px-8 lg:px-16 bg-neutral-50">
        <div className="w-full max-w-md">
          {/* Mobile logo (visible only on small screens) */}
          <div className="lg:hidden text-center mb-8">
            <Link href="/" className="inline-block">
              <span className="text-2xl font-bold text-neutral-900">
                study<span className="text-primary-600">Circle</span>
              </span>
            </Link>
          </div>

          {/* Tab pill navigation */}
          <div className="mb-8">
            <div className="flex rounded-lg bg-neutral-200 p-1">
              <Link
                href="/signin"
                className={cn(
                  "flex-1 rounded-md py-2 text-sm font-medium text-center transition-all",
                  isSignin
                    ? "bg-white text-neutral-900 shadow-sm"
                    : "text-neutral-600 hover:text-neutral-900"
                )}
              >
                Sign In
              </Link>
              <Link
                href="/signup"
                className={cn(
                  "flex-1 rounded-md py-2 text-sm font-medium text-center transition-all",
                  !isSignin
                    ? "bg-white text-neutral-900 shadow-sm"
                    : "text-neutral-600 hover:text-neutral-900"
                )}
              >
                Sign Up
              </Link>
            </div>
          </div>

          {/* Heading */}
          <h2 className="text-2xl font-bold text-neutral-900 mb-1">
            {isSignin ? "Welcome back!" : "Create your account"}
          </h2>
          <p className="text-sm text-neutral-600 mb-6">
            {isSignin
              ? "Sign in to continue your learning journey."
              : "Join the community and start sharing knowledge."}
          </p>

          {/* Auth form content */}
          {children}
        </div>
      </div>
    </div>
  );
}