import { getPosts, updatePost } from "@/services";
import type { CreatePost, Post } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import { useForm, useWatch } from "react-hook-form";
import { Link, useNavigate, useParams } from "react-router-dom";

type UpdatePostVariables = {
  id: number;
  post: CreatePost;
};

type UpdatePostContext = {
  previousPosts: Post[] | undefined;
};

function OptimisticUI() {
  // get post id from URL
  const { id } = useParams();

  // validate page id
  const postId = Number(id);
  const isValidPostId = Number.isInteger(postId) && postId > 0;

  // redirect to page
  const navigate = useNavigate();

  // get/cancel/fetch post/posts
  const queryClient = useQueryClient();

  // get feed by post id when page load
  const initializedPostId = useRef<number | null>(null);

  // update post
  const {
    data: posts,
    isLoading,
    error: postsError,
  } = useQuery<Post[]>({
    queryFn: getPosts,
    queryKey: ["posts"],
    enabled: isValidPostId,
  });

  // find current post
  const post = posts?.find((item) => item.id === postId);

  // update current post
  const {
    mutate,
    isPending,
    error: mutationError,
  } = useMutation<Post, Error, UpdatePostVariables, UpdatePostContext>({
    mutationFn: ({ id: postIdToUpdate, post: updatedFields }) =>
      updatePost(postIdToUpdate, updatedFields),

    mutationKey: ["posts", "update"],

    // UI: update
    onMutate: async ({ id: postIdToUpdate, post: updatedFields }) => {
      // CANCEL: ongoing queries
      await queryClient.cancelQueries({ queryKey: ["posts"] });

      // SNAPSHOT: get prev data
      const previousPosts = queryClient.getQueryData<Post[]>(["posts"]);

      // UI: update cached data
      queryClient.setQueryData<Post[]>(["posts"], (currentPosts) =>
        currentPosts?.map((currentPost) =>
          currentPost.id === postIdToUpdate
            ? { ...currentPost, ...updatedFields }
            : currentPost,
        ),
      );

      return { previousPosts };
    },
    onError: (_error, _variables, context) => {
      if (context?.previousPosts) {
        // ROLLBACK: if server request fails
        queryClient.setQueryData(["posts"], context.previousPosts);
      }
    },
    onSuccess: (updatedPost) => {
      // UI: update specific post
      queryClient.setQueryData<Post[]>(["posts"], (currentPosts) =>
        currentPosts?.map((currentPost) =>
          currentPost.id === updatedPost.id ? updatedPost : currentPost,
        ),
      );

      // redirect to home
      navigate("/");
    },
    // synchronize with the server
    onSettled: () => queryClient.invalidateQueries({ queryKey: ["posts"] }),
  });

  // react form hook api
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<CreatePost>({
    defaultValues: { title: "", body: "", userId: 1 },
  });

  // live watch
  const titleValue = useWatch({ control, name: "title" });
  const bodyValue = useWatch({ control, name: "body" });

  useEffect(() => {
    // feed initial data
    if (post && initializedPostId.current !== post.id) {
      reset({
        title: post.title,
        body: post.body,
        userId: post.userId,
      });
      initializedPostId.current = post.id;
    }
  }, [post, reset]);

  if (!isValidPostId) {
    // check post id validation
    return (
      <section className="mx-auto max-w-3xl px-5 py-16 sm:px-8">
        <div
          className="rounded-2xl border border-red-400/20 bg-red-400/5 p-8 text-center"
          role="alert"
        >
          <p className="text-sm font-semibold text-red-200">Invalid post ID</p>
          <p className="mt-2 text-sm text-slate-400">
            The post link is missing a valid ID.
          </p>
          <Link
            className="mt-6 inline-flex rounded-lg bg-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/15"
            to="/posts"
          >
            Back to posts
          </Link>
        </div>
      </section>
    );
  }

  if (isLoading) {
    // loading
    return (
      <section className="mx-auto max-w-3xl px-5 py-16 sm:px-8">
        <div
          className="rounded-2xl border border-white/10 bg-white/4 p-8 text-center"
          role="status"
        >
          <div className="mx-auto size-8 animate-spin rounded-full border-2 border-white/15 border-t-amber-300" />
          <p className="mt-4 text-sm text-slate-300">Loading post...</p>
        </div>
      </section>
    );
  }

  if (postsError) {
    // post loading issue
    return (
      <section className="mx-auto max-w-3xl px-5 py-16 sm:px-8">
        <div
          className="rounded-2xl border border-red-400/20 bg-red-400/5 p-8 text-center"
          role="alert"
        >
          <p className="text-sm font-semibold text-red-200">
            Could not load this post
          </p>
          <p className="mt-2 text-sm text-slate-400">{postsError.message}</p>
          <Link
            className="mt-6 inline-flex rounded-lg bg-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/15"
            to="/posts"
          >
            Back to posts
          </Link>
        </div>
      </section>
    );
  }

  if (!post) {
    // post not found
    return (
      <section className="mx-auto max-w-3xl px-5 py-16 sm:px-8">
        <div
          className="rounded-2xl border border-white/10 bg-white/4 p-8 text-center"
          role="status"
        >
          <p className="text-sm font-semibold text-white">Post not found</p>
          <p className="mt-2 text-sm text-slate-400">
            This post may have been removed or its link may be incorrect.
          </p>
          <Link
            className="mt-6 inline-flex rounded-lg bg-amber-300 px-4 py-2 text-sm font-bold text-slate-950 transition hover:bg-amber-200"
            to="/posts"
          >
            Back to posts
          </Link>
        </div>
      </section>
    );
  }

  // submit form
  function onSubmit(values: CreatePost) {
    mutate({ id: postId, post: values });
  }

  return (
    <section className="mx-auto max-w-6xl px-5 py-10 sm:px-8 sm:py-14">
      {/* LINK: post list */}
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
      <header className="mb-8 mt-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-300/20 bg-amber-300/10 px-3 py-1.5 text-xs font-semibold text-amber-200">
            <span className="size-1.5 rounded-full bg-amber-300" />
            Editing post #{post.id}
          </div>
          <h1 className="text-3xl font-black tracking-tight text-white sm:text-4xl">
            Edit your post
          </h1>
          <p className="mt-3 max-w-xl text-sm leading-6 text-slate-400">
            Make your changes below. Your post preview updates as you type.
          </p>
        </div>
        <div className="hidden text-right text-xs text-slate-500 sm:block">
          <p>POST ID</p>
          <p className="mt-1 font-mono text-sm text-slate-300">{post.id}</p>
        </div>
      </header>

      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1.6fr)_minmax(260px,0.8fr)]">
        {/* FORM: form event */}
        <form
          className="overflow-hidden rounded-2xl border border-white/10 bg-slate-900/70 shadow-2xl shadow-black/10"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="border-b border-white/10 px-5 py-5 sm:px-7">
            <h2 className="font-bold text-white">Post details</h2>
            <p className="mt-1 text-sm text-slate-400">
              Fields marked with <span className="text-amber-300">*</span> are
              required.
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
              <span className="mb-2 flex items-center justify-between text-sm font-semibold text-slate-200">
                <span>
                  Title <span className="text-amber-300">*</span>
                </span>
                <span className="text-xs font-normal text-slate-500">
                  {titleValue.length}/120
                </span>
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
              <span className="mb-2 flex items-center justify-between text-sm font-semibold text-slate-200">
                <span>
                  Content <span className="text-amber-300">*</span>
                </span>
                <span className="text-xs font-normal text-slate-500">
                  {bodyValue.length}/1024
                </span>
              </span>
              <textarea
                aria-invalid={Boolean(errors.body)}
                className={`min-h-52 w-full resize-y rounded-xl border bg-slate-950/70 px-4 py-3 text-sm leading-6 text-white outline-none transition placeholder:text-slate-600 focus:ring-4 ${
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
                    value: 1024,
                    message: "Body must be 1024 characters or less.",
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

          <div className="flex flex-col-reverse gap-3 border-t border-white/10 bg-white/2 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-7">
            <p className="text-xs text-slate-500">
              Changes are saved when you update the post.
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
                {isPending ? "Saving changes..." : "Save changes"}
              </button>
            </div>
          </div>
        </form>

        <aside className="space-y-5">
          <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-5 sm:p-6">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-sm font-bold text-white">Live preview</h2>
              <span className="rounded-full bg-emerald-300/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-200">
                Preview
              </span>
            </div>
            <article className="rounded-xl border border-white/10 bg-slate-950/60 p-4">
              <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.2em] text-amber-200">
                Post #{post.id}
              </p>
              <h3 className="wrap-break-word text-lg font-bold leading-snug text-white">
                {titleValue || "Your post title"}
              </h3>
              <p className="mt-3 whitespace-pre-wrap wrap-break-word text-sm leading-6 text-slate-400">
                {bodyValue || "Your post content will appear here as you type."}
              </p>
            </article>
          </div>

          <div className="rounded-2xl border border-amber-300/15 bg-amber-300/5 p-5 sm:p-6">
            <h2 className="text-sm font-bold text-amber-100">Quick tips</h2>
            <ul className="mt-4 space-y-3 text-sm leading-5 text-slate-300">
              <li className="flex gap-2.5">
                <span className="text-amber-300">•</span>
                Keep the title clear and descriptive.
              </li>
              <li className="flex gap-2.5">
                <span className="text-amber-300">•</span>
                Use the content field for the full details.
              </li>
              <li className="flex gap-2.5">
                <span className="text-amber-300">•</span>
                Your changes appear immediately in the preview.
              </li>
            </ul>
          </div>
        </aside>
      </div>
    </section>
  );
}

export default OptimisticUI;
