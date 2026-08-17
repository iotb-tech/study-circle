"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, X } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import Form from "@/components/ui/Form";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import Button from "@/components/ui/Button";
import { postSchema, type PostFormData } from "@/types/post";

export default function CreatePostForm() {
  const router = useRouter();
  const supabase = createClient();
  const [showForm, setShowForm] = useState(false);
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [serverError, setServerError] = useState<string | null>(null);

  const addTag = () => {
    const trimmed = tagInput.trim().toLowerCase();
    if (trimmed && !tags.includes(trimmed) && tags.length < 5) {
      setTags([...tags, trimmed]);
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const methods = useForm<PostFormData>({
    resolver: zodResolver(postSchema),
    defaultValues: { title: "", body: "" },
  });

  const {
    register,
    reset,
    formState: { errors, isSubmitting },
  } = methods;

  const closeForm = () => {
    reset();
    setTags([]);
    setTagInput("");
    setServerError(null);
    setShowForm(false);
  };

  const onSubmit = async (data: PostFormData) => {
    try {
      setServerError(null);

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setServerError("You must be signed in to create a post.");
        return;
      }

      const { data: post, error } = await supabase
        .from("posts")
        .insert({
          user_id: user.id,
          title: data.title,
          body: data.body,
          tags,
        })
        .select()
        .single();

      if (error) {
        setServerError(error.message);
        return;
      }

      closeForm();
      router.push(`/discussions/${post.id}`);
      router.refresh();
    } catch (error) {
      console.error("Create post error:", error);
      setServerError("An unexpected error occurred.");
    }
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
        <div>
          <label className="mb-1.5 block text-sm font-medium text-neutral-800">
            Tags
          </label>
          <div className="flex gap-2">
            <Input
              placeholder="Add tag (e.g., react)"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addTag();
                }
              }}
            />
            <Button
              className="cursor-pointer"
              type="button"
              variant="secondary"
              onClick={addTag}
            >
              Add
            </Button>
          </div>
          {tags.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1.5 rounded-full bg-primary-50 px-3 py-1.5 text-xs font-medium text-primary-700"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="cursor-pointer hover:text-primary-900"
                  >
                    <X size={12} />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {serverError && (
          <div className="rounded-lg border border-error/20 bg-error/10 px-4 py-3 text-sm text-error">
            {serverError}
          </div>
        )}

        <div className="flex gap-3">
          <Button
            type="submit"
            loading={isSubmitting}
            loadingText="Creating post..."
            className="flex-1 cursor-pointer py-3"
          >
            Submit Post
          </Button>
          <Button
            type="button"
            variant="secondary"
            className="cursor-pointer"
            onClick={closeForm}
          >
            Cancel
          </Button>
        </div>
      </Form>
    </div>
  );
}
