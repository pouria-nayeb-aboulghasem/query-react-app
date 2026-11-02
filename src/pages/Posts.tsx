import { getPosts } from "@/services";
import type { Post } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";

function Posts() {
  const {
    data: posts,
    isLoading,
    error,
    refetch,
  } = useQuery<Post[]>({
    queryFn: getPosts,
    queryKey: ["posts"],
    staleTime: 6 * 1000,
  });

  if (isLoading) {
    return (
      <section className="mx-auto max-w-7xl px-5 py-14 sm:px-8">
        <div className="mb-8 h-9 w-56 animate-pulse rounded-lg bg-white/10" />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }, (_, index) => (
            <div
              className="h-56 animate-pulse rounded-2xl border border-white/10 bg-white/[0.04]"
              key={index}
            />
          ))}
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="mx-auto max-w-7xl px-5 py-14 sm:px-8">
        <div
          className="rounded-2xl border border-red-400/20 bg-red-400/5 p-8 text-center"
          role="alert"
        >
          <p className="text-lg font-bold text-white">Posts didn’t load</p>
          <p className="mt-2 text-sm text-slate-400">{error.message}</p>
          <button
            className="mt-5 rounded-xl bg-amber-300 px-5 py-2.5 text-sm font-bold text-slate-950 transition hover:bg-amber-200"
            onClick={() => refetch()}
            type="button"
          >
            Try again
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-7xl px-5 py-12 sm:px-8 sm:py-16">
      <header className="mb-9 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-amber-300/20 bg-amber-300/10 px-3 py-1.5 text-xs font-semibold text-amber-200">
            <span className="size-1.5 rounded-full bg-amber-300" />
            The latest stories
          </span>
          <h1 className="mt-4 text-4xl font-black tracking-tight text-white sm:text-5xl">
            Explore posts<span className="text-amber-300">.</span>
          </h1>
          <p className="mt-3 max-w-xl text-sm leading-6 text-slate-400 sm:text-base">
            A collection of thoughts, ideas, and conversations from the
            community.
          </p>
        </div>
        <p className="text-sm font-medium text-slate-400">
          <span className="text-2xl font-bold text-white">{posts?.length ?? 0}</span>{" "}
          posts to explore
        </p>
      </header>

      {posts?.length ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post, index) => (
            <article
              className="group relative flex min-h-64 flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] p-5 shadow-lg shadow-black/10 transition duration-300 hover:-translate-y-1 hover:border-amber-300/30 hover:bg-white/[0.07] sm:p-6"
              key={post.id}
            >
              <div
                className={`absolute inset-x-0 top-0 h-1 ${
                  index % 3 === 0
                    ? "bg-amber-300"
                    : index % 3 === 1
                      ? "bg-cyan-300"
                      : "bg-fuchsia-300"
                }`}
              />
              <div className="mb-6 flex items-center justify-between">
                <span className="rounded-full bg-white/[0.07] px-3 py-1 text-xs font-semibold text-slate-300">
                  Post {String(post.id).padStart(2, "0")}
                </span>
                <span
                  aria-hidden="true"
                  className="grid size-9 place-items-center rounded-full border border-white/10 text-slate-400 transition group-hover:border-amber-300/30 group-hover:text-amber-200"
                >
                  ↗
                </span>
              </div>

              <h2 className="text-xl font-bold leading-snug text-white transition group-hover:text-amber-100">
                {post.title}
              </h2>
              <p className="mt-3 line-clamp-3 flex-1 text-sm leading-6 text-slate-400">
                {post.body}
              </p>

              <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-4">
                <span className="text-xs text-slate-500">
                  Shared by <span className="text-slate-300">User {post.userId}</span>
                </span>
                <Link
                  className="rounded-lg px-3 py-2 text-xs font-bold text-amber-200 transition hover:bg-amber-300/10 hover:text-amber-100 focus:outline-none focus:ring-2 focus:ring-amber-300/50"
                  to={`/posts/${post.id}/edit`}
                >
                  Edit post
                </Link>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-white/15 bg-white/[0.03] px-6 py-16 text-center">
          <p className="text-lg font-bold text-white">Nothing here yet</p>
          <p className="mt-2 text-sm text-slate-400">
            Posts will show up here when they’re available.
          </p>
        </div>
      )}
    </section>
  );
}

export default Posts;
