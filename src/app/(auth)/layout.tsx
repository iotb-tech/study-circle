"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isSignin = pathname === "/signin";

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-neutral-800 flex-col items-center justify-center p-12 relative overflow-hidden">
        
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary-600/10 rounded-full translate-x-1/3 -translate-y-1/3" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-brown-500/10 rounded-full -translate-x-1/3 translate-y-1/3" />

        <div className="z-10 mb-6 bg-primary-300 rounded-full flex flex-col items-center justify-center text-center">
          <Image
            src="/assets/study-circle.png"
            alt="Study Circle Logo"
            width={190}
            height={190}
            style={{ width: "auto", height: "auto" }}
            priority
          />
        </div>

        <div className="relative z-10 text-center">
          <Link href="/" className="inline-block">
            <span className="text-4xl font-bold text-white">
              study<span className="text-primary-500">Circle</span>
            </span>
          </Link>
          <h1 className="text-xl font-normal text-white leading-tight mt-2">
            Learn together, grow together
          </h1>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex flex-col justify-center items-center px-4 py-12 sm:px-8 lg:px-16 bg-neutral-50 dark:bg-primary-700/80">
        <div className="w-full max-w-md">
          <div className="lg:hidden w-full flex flex-col items-center justify-center text-center mb-8">
            <Link href="/" className="inline-block">
              <span className="text-2xl font-bold text-neutral-900">
                study<span className="text-primary-600">Circle</span>
              </span>
            </Link>
            <Image
              src="/assets/study-circle.png"
              alt="Study Circle Logo"
              width={100}
              height={100}
              className="mt-2"
              style={{ width: "auto", height: "auto" }}
              priority
            />
          </div>
          
          <div className="hidden md:flex w-full flex items-center justify-center mb-4">
            <Image
              src="/assets/study-circle.png"
              alt="Study Circle Logo"
              width={140}
              height={140}
              style={{ width: "auto", height: "auto" }}
              priority
            />
          </div>

          <h2 className="text-2xl text-center font-bold text-neutral-800 dark:text-white mb-1">
            {isSignin ? "Welcome back!" : "Create your account"}
          </h2>
          <p className="text-sm text-center text-neutral-600 dark:text-neutral-200 mb-8">
            {isSignin
              ? "Sign in to continue your learning journey."
              : "Join the community and start sharing knowledge."}
          </p>

          {children}

          <p className="mt-6 text-center text-sm text-neutral-600 dark:text-neutral-200">
            {isSignin ? (
              <>
                Don&apos;t have an account?{" "}
                <Link
                  href="/signup"
                  className="font-medium text-primary-600 dark:text-neutral-100 hover:text-primary-700 hover:dark:text-neutral-400 transition-colors"
                >
                  Sign Up
                </Link>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <Link
                  href="/signin"
                  className="font-medium text-primary-700 hover:text-primary-300 transition-colors"
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