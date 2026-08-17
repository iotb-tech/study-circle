"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import Form from "@/components/ui/Form";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import Button from "@/components/ui/Button";
import { postSchema, type PostFormData } from "@/types/post";

export default function CreatePostForm() {
  const [showForm, setShowForm] = useState(false);

  const methods = useForm<PostFormData>({
    resolver: zodResolver(postSchema),
    defaultValues: { title: "", body: "" },
  });

  const {
    register,
    formState: { errors },
  } = methods;

  const onSubmit = (data: PostFormData) => {
    void data;
  };

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
      <Form methods={methods} onSubmit={onSubmit} className="space-y-4">
        <Input
          label="Title"
          placeholder="e.g., How do I use async/await in useEffect?"
          error={errors.title?.message}
          required
          {...register("title")}
        />
        <Textarea
          label="Body"
          placeholder="Describe your question in detail..."
          error={errors.body?.message}
          required
          className="min-h-[150px]"
          {...register("body")}
        />
        <Button
          type="button"
          variant="secondary"
          className="cursor-pointer"
          onClick={() => setShowForm(false)}
        >
          Cancel
        </Button>
      </Form>
    </div>
  );
}
