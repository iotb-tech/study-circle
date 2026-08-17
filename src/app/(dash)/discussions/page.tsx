import CreatePostForm from "@/components/Discussions/CreatePostForm";

export default function DiscussionsPage() {
  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="mb-6 text-2xl font-bold text-neutral-900">Discussions</h1>
      <CreatePostForm />
    </div>
  );
}
