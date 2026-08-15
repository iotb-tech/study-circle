// src/components/auth/AuthLayout.tsx

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface AuthLayoutProps {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  const pathname = usePathname();
  const isSignin = pathname === "/signin";

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left panel*/}
      <div className="hidden lg:flex lg:w-1/2 bg-neutral-900 flex-col items-center justify-center p-12 relative overflow-hidden">
        
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary-600/10 rounded-full translate-x-1/3 -translate-y-1/3" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-brown-500/10 rounded-full -translate-x-1/3 translate-y-1/3" />

        <div className="relative z-10 text-center">
          <span className="text-4xl font-bold text-white">
            study<span className="text-primary-500">Circle</span>
          </span>
          
          <h1 className="text-xl font-normal text-white leading-tight mt-2">
            Learn together, grow together
          </h1>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex flex-col justify-center items-center px-4 py-12 sm:px-8 lg:px-16 bg-neutral-50">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden text-center mb-8">
            <Link href="/" className="inline-block">
              <span className="text-2xl font-bold text-neutral-900">
                study<span className="text-primary-600">Circle</span>
              </span>
            </Link>
          </div>

          {/* Heading */}
          <h2 className="text-2xl text-center font-bold text-neutral-800 mb-1">
            {isSignin ? "Welcome back!" : "Create your account"}
          </h2>
          <p className="text-sm text-neutral-600 text-center mb-8">
            {isSignin
              ? "Sign in to continue your learning journey."
              : "Join the community and start sharing knowledge."}
          </p>

          {/* Auth form content (Signup or Signin component) */}
          {children}

          {/* Conventional switch link */}
          <p className="mt-6 text-center text-sm text-neutral-600">
            {isSignin ? (
              <>
                Don&apos;t have an account?{" "}
                <Link
                  href="/signup"
                  className="font-medium text-primary-600 hover:text-primary-700 transition-colors"
                >
                  Sign Up
                </Link>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <Link
                  href="/signin"
                  className="font-medium text-primary-600 hover:text-primary-700 transition-colors"
                >
                  Sign In
                </Link>
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}