import { createPost } from "@/services";
import type { CreatePost, Post } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";

function CreateFormPost() {
  // fetch fresh data
  const queryClient = useQueryClient();

  // redirect to list page
  const navigate = useNavigate();

  // add new post
  const {
    mutate,
    isPending,
    error: mutationError,
  } = useMutation<Post, Error, CreatePost>({
    mutationFn: createPost,
    mutationKey: ["posts", "create"],
    onSuccess: () => navigate("/"),
    onSettled: () => queryClient.invalidateQueries({ queryKey: ["posts"] }),
  });

  // react hook form api
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreatePost>({
    defaultValues: { title: "", body: "", userId: 1 },
  });

  // submit form
  function onSubmit(values: CreatePost) {
    mutate(values);
  }

  return (
    <section className="mx-auto max-w-6xl px-5 py-10 sm:px-8 sm:py-14">
      {/* LINK: back to post list */}
      <Link
        className="group inline-flex items-center gap-2 text-sm font-medium text-slate-400 transition hover:text-white"
        to="/posts"
      >
        <span
          aria-hidden="true"
          className="transition-transform group-hover:-translate-x-1"
        >
          ←
        </span>
        Back to posts
      </Link>

      {/* HEADER */}
      <header className="mb-8 mt-8">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-300/20 bg-amber-300/10 px-3 py-1.5 text-xs font-semibold text-amber-200">
          <span className="size-1.5 rounded-full bg-amber-300" />
          Create something new
        </div>
        <h1 className="text-3xl font-black tracking-tight text-white sm:text-4xl">
          Write a post<span className="text-amber-300">.</span>
        </h1>
        <p className="mt-3 max-w-xl text-sm leading-6 text-slate-400 sm:text-base">
          Share an idea, a story, or something worth discussing with the
          community.
        </p>
      </header>

      {/* FORM: form event */}
      <form
        className="overflow-hidden rounded-2xl border border-white/10 bg-slate-900/70 shadow-2xl shadow-black/10"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="border-b border-white/10 px-5 py-5 sm:px-7">
          <h2 className="font-bold text-white">Post details</h2>
          <p className="mt-1 text-sm text-slate-400">
            Add a title and content to get your post started.
          </p>
        </div>

        <div className="space-y-6 px-5 py-6 sm:px-7 sm:py-7">
          {/* ALERT */}
          {mutationError && (
            <div
              className="flex items-start gap-3 rounded-xl border border-red-400/20 bg-red-400/5 p-4 text-sm text-red-200"
              role="alert"
            >
              <span aria-hidden="true" className="font-bold">
                !
              </span>
              <p>{mutationError.message}</p>
            </div>
          )}

          {/* INPUT: title */}
          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-slate-200">
              Title <span className="text-amber-300">*</span>
            </span>
            <input
              autoComplete="off"
              aria-invalid={Boolean(errors.title)}
              className={`w-full rounded-xl border bg-slate-950/70 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:ring-4 ${
                errors.title
                  ? "border-red-400/50 focus:border-red-300 focus:ring-red-300/10"
                  : "border-white/10 focus:border-amber-300/60 focus:ring-amber-300/10"
              }`}
              placeholder="Give your post a clear title"
              {...register("title", {
                required: "Post title is required.",
                minLength: {
                  value: 2,
                  message: "Title must be at least 2 characters.",
                },
                maxLength: {
                  value: 120,
                  message: "Title must be 120 characters or less.",
                },
              })}
            />
            {errors.title && (
              <span className="mt-2 block text-xs font-medium text-red-300">
                {errors.title.message}
              </span>
            )}
          </label>

          {/* INPUT: body */}
          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-slate-200">
              Content <span className="text-amber-300">*</span>
            </span>
            <textarea
              aria-invalid={Boolean(errors.body)}
              className={`min-h-56 w-full resize-y rounded-xl border bg-slate-950/70 px-4 py-3 text-sm leading-6 text-white outline-none transition placeholder:text-slate-600 focus:ring-4 ${
                errors.body
                  ? "border-red-400/50 focus:border-red-300 focus:ring-red-300/10"
                  : "border-white/10 focus:border-amber-300/60 focus:ring-amber-300/10"
              }`}
              placeholder="Write the details you want to share..."
              {...register("body", {
                required: "Post body is required.",
                minLength: {
                  value: 2,
                  message: "Body must be at least 2 characters.",
                },
                maxLength: {
                  value: 512,
                  message: "Body must be 512 characters or less.",
                },
              })}
            />
            {errors.body && (
              <span className="mt-2 block text-xs font-medium text-red-300">
                {errors.body.message}
              </span>
            )}
          </label>
        </div>

        <div className="flex flex-col-reverse gap-3 border-t border-white/10 bg-white/[0.02] px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-7">
          <p className="text-xs text-slate-500">
            Your post will be added to the community feed.
          </p>
          <div className="flex gap-3">
            {/* LINK: post list */}
            <Link
              className="inline-flex min-h-11 flex-1 items-center justify-center rounded-xl border border-white/10 px-4 text-sm font-semibold text-slate-300 transition hover:border-white/20 hover:bg-white/5 hover:text-white sm:flex-none"
              to="/posts"
            >
              Cancel
            </Link>
            {/* BUTTON: submit form */}
            <button
              className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-amber-300 px-5 text-sm font-bold text-slate-950 transition hover:bg-amber-200 focus:outline-none focus:ring-4 focus:ring-amber-300/20 disabled:cursor-wait disabled:opacity-60 sm:flex-none"
              type="submit"
              disabled={isPending}
            >
              {isPending && (
                <span className="size-4 animate-spin rounded-full border-2 border-slate-950/30 border-t-slate-950" />
              )}
              {isPending ? "Publishing..." : "Publish post"}
            </button>
          </div>
        </div>
      </form>
    </section>
  );
}

export default CreateFormPost;
