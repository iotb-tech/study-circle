"use client";

import { useEffect, useState } from "react";
const [displayName, setDisplayName] = useState("");
const [savedName, setSavedName] = useState("");
type NotificationSettings = {
  replies: boolean;
  mentions: boolean;
  questionActivity: boolean;
};
const [notifications, setNotifications] =
  useState<NotificationSettings>({
    replies: true,
    mentions: true,
    questionActivity: false,
  });

useEffect(() => {
  const storedNotifications =
    localStorage.getItem("notificationSettings");

  if (storedNotifications) {
    try {
      setNotifications(JSON.parse(storedNotifications));
    } catch {
      console.error(
        "Unable to load notification settings."
      );
    }
  }
}, []);

const handleNotificationChange = (
  setting: keyof NotificationSettings
) => {
  setNotifications((current) => {
    const updatedSettings = {
      ...current,
      [setting]: !current[setting],
    };

    localStorage.setItem(
      "notificationSettings",
      JSON.stringify(updatedSettings)
    );

    return updatedSettings;
  });
};

useEffect(() => {
  const storedName = localStorage.getItem("displayName");

  if (storedName) {
    setDisplayName(storedName);
    setSavedName(storedName);
  }
}, []);

const handleSaveName = () => {
  const trimmedName = displayName.trim();

  if (!trimmedName) return;

  localStorage.setItem("displayName", trimmedName);
  setDisplayName(trimmedName);
  setSavedName(trimmedName);
};
type Section = "profile" | "appearance" | "notifications" | null;
type Theme = "light" | "dark";
const [theme, setTheme] = useState<Theme>("light");

useEffect(() => {
  const storedTheme = localStorage.getItem("theme") as Theme | null;

  if (storedTheme === "light" || storedTheme === "dark") {
    setTheme(storedTheme);
    applyTheme(storedTheme);
  } else {
    applyTheme("light");
  }
}, []);

const applyTheme = (selectedTheme: Theme) => {
  const root = document.documentElement;

  if (selectedTheme === "dark") {
    root.classList.add("dark");
  } else {
    root.classList.remove("dark");
  }
};

const handleThemeChange = (selectedTheme: Theme) => {
  setTheme(selectedTheme);
  localStorage.setItem("theme", selectedTheme);
  applyTheme(selectedTheme);
};

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
              aria-expanded={openSection === "profile"}
              className="flex w-full items-center justify-between gap-4 px-4 py-4 text-left transition hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500 dark:hover:bg-neutral-700 sm:px-5 sm:py-5"
            >
              <div>
                <h2 className="font-medium">Profile</h2>
                <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
                  Change your display name.
                </p>
              </div>

              <span
                className={`text-xl text-neutral-400 transition-transform duration-200 ${
                  openSection === "profile" ? "rotate-90" : ""
                }`}
              >
                ›
              </span>
            </button>

            <div
              className={`grid transition-[grid-template-rows] duration-300 ${
                openSection === "profile"
                  ? "grid-rows-[1fr]"
                  : "grid-rows-[0fr]"
              }`}
            >
              <div className="overflow-hidden">
                <div className="border-t border-neutral-200 px-4 py-5 dark:border-neutral-700 sm:px-5">
                  <label
  htmlFor="displayName"
  className="mb-2 block text-sm font-medium"
>
  Display name
</label>

<input
  id="displayName"
  type="text"
  value={displayName}
  onChange={(event) =>
    setDisplayName(event.target.value)
  }
  placeholder="Enter your display name"
  className="w-full rounded-lg border border-neutral-200 bg-white px-3 py-2.5 text-sm outline-none placeholder:text-neutral-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 dark:border-neutral-700 dark:bg-neutral-900 dark:focus:ring-primary-700"
/>

<button
  type="button"
  onClick={handleSaveName}
  disabled={
    !displayName.trim() ||
    displayName.trim() === savedName
  }
  className="mt-4 w-full rounded-lg bg-primary-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-primary-600 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
>
  Save changes
</button>
                </div>
              </div>
            </div>
          </section>

          {/* Appearance */}
          <section className="overflow-hidden rounded-lg border border-neutral-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-800">
            <button
              type="button"
              onClick={() => toggleSection("appearance")}
              aria-expanded={openSection === "appearance"}
              className="flex w-full items-center justify-between gap-4 px-4 py-4 text-left transition hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500 dark:hover:bg-neutral-700 sm:px-5 sm:py-5"
            >
              <div>
                <h2 className="font-medium">Appearance</h2>
                <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
                  Choose how Study Circle looks.
                </p>
              </div>

              <span
                className={`text-xl text-neutral-400 transition-transform duration-200 ${
                  openSection === "appearance" ? "rotate-90" : ""
                }`}
              >
                ›
              </span>
            </button>

            <div
              className={`grid transition-[grid-template-rows] duration-300 ${
                openSection === "appearance"
                  ? "grid-rows-[1fr]"
                  : "grid-rows-[0fr]"
              }`}
            >
              <div className="overflow-hidden">
                <div className="border-t border-neutral-200 px-4 py-5 dark:border-neutral-700 sm:px-5">
                  <p className="mb-4 text-sm font-medium">
  Theme
</p>

<div className="space-y-2">
  {/* Light */}
  <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-neutral-200 p-3 transition hover:bg-neutral-50 dark:border-neutral-700 dark:hover:bg-neutral-700 sm:p-4">
    <input
      type="radio"
      name="theme"
      value="light"
      checked={theme === "light"}
      onChange={() => handleThemeChange("light")}
      className="h-4 w-4 accent-primary-500"
    />

    <div>
      <p className="text-sm font-medium">Light</p>
      <p className="text-xs text-neutral-600 dark:text-neutral-400">
        Use the light theme.
      </p>
    </div>
  </label>

  {/* Dark */}
  <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-neutral-200 p-3 transition hover:bg-neutral-50 dark:border-neutral-700 dark:hover:bg-neutral-700 sm:p-4">
    <input
      type="radio"
      name="theme"
      value="dark"
      checked={theme === "dark"}
      onChange={() => handleThemeChange("dark")}
      className="h-4 w-4 accent-primary-500"
    />

    <div>
      <p className="text-sm font-medium">Dark</p>
      <p className="text-xs text-neutral-600 dark:text-neutral-400">
        Use the dark theme.
      </p>
    </div>
  </label>
</div>
                </div>
              </div>
            </div>
          </section>

          {/* Notifications */}
          <section className="overflow-hidden rounded-lg border border-neutral-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-800">
            <button
              type="button"
              onClick={() => toggleSection("notifications")}
              aria-expanded={openSection === "notifications"}
              className="flex w-full items-center justify-between gap-4 px-4 py-4 text-left transition hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500 dark:hover:bg-neutral-700 sm:px-5 sm:py-5"
            >
              <div>
                <h2 className="font-medium">Notifications</h2>
                <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
                  Choose what activity you want to hear about.
                </p>
              </div>

              <span
                className={`text-xl text-neutral-400 transition-transform duration-200 ${
                  openSection === "notifications" ? "rotate-90" : ""
                }`}
              >
                ›
              </span>
            </button>

            <div
              className={`grid transition-[grid-template-rows] duration-300 ${
                openSection === "notifications"
                  ? "grid-rows-[1fr]"
                  : "grid-rows-[0fr]"
              }`}
            >
              <div className="overflow-hidden">
                <div className="border-t border-neutral-200 px-4 py-5 dark:border-neutral-700 sm:px-5">
                  <NotificationToggle
  title="Replies to my posts"
  description="Get notified when someone replies to your post."
  checked={notifications.replies}
  onChange={() =>
    handleNotificationChange("replies")
  }
/>

<NotificationToggle
  title="Mentions"
  description="Get notified when someone mentions you."
  checked={notifications.mentions}
  onChange={() =>
    handleNotificationChange("mentions")
  }
/>

<NotificationToggle
  title="Question activity"
  description="Get notified about activity on questions you're following."
  checked={notifications.questionActivity}
  onChange={() =>
    handleNotificationChange("questionActivity")
  }
/>
                </div>
              </div>
            </div>
          </section>
        </div>

        <section className="mt-8 border-t border-neutral-200 pt-6 dark:border-neutral-800">
          <button className="text-sm font-medium text-error hover:underline">
            Sign out
          </button>
        </section>
      </div>
    </main>
  );
} type NotificationToggleProps = {
  title: string;
  description: string;
  checked: boolean;
  onChange: () => void;
};

function NotificationToggle({
  title,
  description,
  checked,
  onChange,
}: NotificationToggleProps) {
  return (
    <div className="flex items-center justify-between gap-4 px-4 py-4 sm:px-5">
      <div className="min-w-0">
        <p className="text-sm font-medium">{title}</p>

        <p className="mt-1 text-xs leading-5 text-neutral-600 dark:text-neutral-400">
          {description}
        </p>
      </div>

      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={onChange}
        className={`relative h-6 w-11 shrink-0 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 ${
          checked
            ? "bg-primary-500"
            : "bg-neutral-300 dark:bg-neutral-600"
        }`}
      >
        <span
          className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow-sm transition-transform duration-200 ${
            checked
              ? "translate-x-6"
              : "translate-x-1"
          }`}
        />
      </button>
    </div>
  );
}