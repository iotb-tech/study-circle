"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import Button from "@/components/ui/Button";

export default function CreatePostForm() {
  const [showForm, setShowForm] = useState(false);

  if (!showForm) {
    return (
      <button
        type="button"
        onClick={() => setShowForm(true)}
        className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg border-2 border-dashed border-neutral-300 bg-white py-4 text-neutral-500 transition-colors hover:border-primary-500 hover:text-primary-600"
      >
        <Plus size={18} />
        Create New Post
      </button>
    );
  }

  return (
    <div className="rounded-lg border border-neutral-200 bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-lg font-semibold text-neutral-900">
        Create New Post
      </h2>
      <Button
        type="button"
        variant="secondary"
        className="cursor-pointer"
        onClick={() => setShowForm(false)}
      >
        Cancel
      </Button>
    </div>
  );
}
