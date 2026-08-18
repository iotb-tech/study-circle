"use client";

import { useState } from "react";

type Section = "profile" | "appearance" | "notifications" | null;

export default function SettingsPage() {
  const [openSection, setOpenSection] = useState<Section>(null);

  const toggleSection = (section: Section) => {
    setOpenSection((current) =>
      current === section ? null : section
    );
  };

  return (
    <main className="min-h-screen bg-white text-neutral-900 dark:bg-neutral-900 dark:text-white">
      <div className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        {/* Header */}
        <header className="mb-8 sm:mb-10">
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Settings
          </h1>

          <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400 sm:text-base">
            Manage your Study Circle preferences.
          </p>
        </header>

        <div className="space-y-3">
          {/* Profile */}
          <section className="overflow-hidden rounded-lg border border-neutral-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-800">
            <button
              type="button"
              onClick={() => toggleSection("profile")}
              className="flex w-full items-center justify-between gap-4 px-4 py-4 text-left transition hover:bg-neutral-50 dark:hover:bg-neutral-700 sm:px-5 sm:py-5"
            >
              <div>
                <h2 className="font-medium">Profile</h2>
                <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
                  Change your display name.
                </p>
              </div>

              <span className="text-xl text-neutral-400">
                ›
              </span>
            </button>
          </section>

          {/* Appearance */}
          <section className="overflow-hidden rounded-lg border border-neutral-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-800">
            <button
              type="button"
              onClick={() => toggleSection("appearance")}
              className="flex w-full items-center justify-between gap-4 px-4 py-4 text-left transition hover:bg-neutral-50 dark:hover:bg-neutral-700 sm:px-5 sm:py-5"
            >
              <div>
                <h2 className="font-medium">Appearance</h2>
                <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
                  Choose how Study Circle looks.
                </p>
              </div>

              <span className="text-xl text-neutral-400">
                ›
              </span>
            </button>
          </section>

          {/* Notifications */}
          <section className="overflow-hidden rounded-lg border border-neutral-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-800">
            <button
              type="button"
              onClick={() => toggleSection("notifications")}
              className="flex w-full items-center justify-between gap-4 px-4 py-4 text-left transition hover:bg-neutral-50 dark:hover:bg-neutral-700 sm:px-5 sm:py-5"
            >
              <div>
                <h2 className="font-medium">Notifications</h2>
                <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
                  Choose what activity you want to hear about.
                </p>
              </div>

              <span className="text-xl text-neutral-400">
                ›
              </span>
            </button>
          </section>
        </div>

        {/* Sign out */}
        <section className="mt-8 border-t border-neutral-200 pt-6 dark:border-neutral-800">
          <button className="text-sm font-medium text-error hover:underline">
            Sign out
          </button>
        </section>
      </div>
    </main>
  );
}