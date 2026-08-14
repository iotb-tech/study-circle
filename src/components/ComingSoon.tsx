"use client";

import { Construction, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

interface ComingSoonProps {
  title: string;
}

export default function ComingSoon({ title }: ComingSoonProps) {
  const router = useRouter();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#f8fafc] px-6 text-center">
      <Construction size={80} className="mb-6 text-primary-800" />

      <h1 className="mb-3 text-3xl font-bold text-primary-600">{title}</h1>

      <h2 className="mb-2 text-xl font-semibold text-neutral-900">Coming Soon</h2>

      <p className="mb-8 max-w-md text-neutral-600">
        This page is currently under development and will be available in a
        future update.
      </p>

      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 rounded-lg bg-primary-600 px-5 py-3 text-white transition hover:bg-primary-800 cursor-pointer"
      >
        <ArrowLeft size={18} />
        Go Back
      </button>
    </div>
  );
}