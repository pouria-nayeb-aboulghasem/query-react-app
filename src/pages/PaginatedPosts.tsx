import { usePost } from "@/hooks";
import { getPaginatedPosts } from "@/services";
import type { Post } from "@/types";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";

function PaginatedPosts() {
  const { page, setPage } = usePost();
  const {
    data: posts,
    isLoading,
    error,
    isPlaceholderData,
    refetch,
  } = useQuery<Post[]>({
    queryFn: () => getPaginatedPosts(page),
    queryKey: ["posts", page],
    placeholderData: keepPreviousData,
  });

  // LOADING
  if (isLoading) {
    return (
      <section className="mx-auto max-w-7xl px-5 py-12 sm:px-8 sm:py-16">
        <div className="mb-8 h-9 w-56 animate-pulse rounded-lg bg-white/10" />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }, (_, index) => (
            <div
              className="h-56 animate-pulse rounded-2xl border border-white/10 bg-white/4"
              key={index}
            />
          ))}
        </div>
      </section>
    );
  }

  // ERROR
  if (error) {
    return (
      <section className="mx-auto max-w-7xl px-5 py-12 sm:px-8 sm:py-16">
        <div
          className="rounded-2xl border border-red-400/20 bg-red-400/5 p-8 text-center"
          role="alert"
        >
          <p className="text-lg font-bold text-white">This page didn’t load</p>
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
      {/* HEADER */}
      <header className="mb-9 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-violet-300/20 bg-violet-300/10 px-3 py-1.5 text-xs font-semibold text-violet-200">
            <span className="size-1.5 rounded-full bg-violet-300" />
            Browse by page
          </span>
          <h1 className="mt-4 text-4xl font-black tracking-tight text-white sm:text-5xl">
            Post library<span className="text-violet-300">.</span>
          </h1>
          <p className="mt-3 max-w-xl text-sm leading-6 text-slate-400 sm:text-base">
            Explore the collection one page at a time.
          </p>
        </div>

        {/* INDICATOR: current page */}
        <div className="flex items-center gap-3 self-start rounded-xl border border-white/10 bg-white/4 px-4 py-3 sm:self-auto">
          <span className="grid size-9 place-items-center rounded-lg bg-violet-300/10 text-sm font-bold text-violet-200">
            {page}
          </span>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
              Current page
            </p>
            <p className="text-sm font-semibold text-white">Page {page}</p>
          </div>
        </div>
      </header>

      {/* COUNT: page list */}
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-slate-300">Posts</h2>
        <span className="text-xs text-slate-500">
          {posts?.length ?? 0} on this page
        </span>
      </div>

      {posts?.length ? (
        // list of post
        <ul
          className={`grid gap-5 transition-opacity sm:grid-cols-2 lg:grid-cols-3 ${
            isPlaceholderData ? "opacity-50" : "opacity-100"
          }`}
          aria-busy={isPlaceholderData}
        >
          {posts.map((post, index) => (
            <li
              className="group relative flex min-h-56 flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/4 p-5 shadow-lg shadow-black/10 transition duration-300 hover:-translate-y-1 hover:border-violet-300/30 hover:bg-white/[0.07] sm:p-6"
              key={post.id}
            >
              <div
                className={`absolute inset-x-0 top-0 h-1 ${
                  index % 3 === 0
                    ? "bg-violet-300"
                    : index % 3 === 1
                      ? "bg-cyan-300"
                      : "bg-amber-300"
                }`}
              />
              <div className="mb-5 flex items-center justify-between">
                <span className="rounded-full bg-white/[0.07] px-3 py-1 text-xs font-semibold text-slate-300">
                  Post {String(post.id).padStart(2, "0")}
                </span>
                <span
                  aria-hidden="true"
                  className="text-sm text-slate-500 transition group-hover:text-violet-200"
                >
                  ↗
                </span>
              </div>
              <h3 className="text-lg font-bold leading-snug text-white transition group-hover:text-violet-100">
                {post.title}
              </h3>
              <p className="mt-3 line-clamp-3 flex-1 text-sm leading-6 text-slate-400">
                {post.body}
              </p>
              <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-4">
                <span className="text-xs text-slate-500">
                  User <span className="text-slate-300">{post.userId}</span>
                </span>
                <Link
                  className="rounded-lg px-3 py-2 text-xs font-bold text-violet-200 transition hover:bg-violet-300/10 hover:text-violet-100 focus:outline-none focus:ring-2 focus:ring-violet-300/50"
                  to={`/posts/${post.id}/edit`}
                >
                  Edit post
                </Link>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        // no post
        <div className="rounded-2xl border border-dashed border-white/15 bg-white/3 px-6 py-16 text-center">
          <p className="text-lg font-bold text-white">No posts on this page</p>
          <p className="mt-2 text-sm text-slate-400">
            Try another page to keep exploring.
          </p>
        </div>
      )}

      <nav
        aria-label="Post pages"
        className="mt-8 flex flex-col items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/3 p-4 sm:flex-row sm:px-5"
      >
        {/* INDICATOR: current page */}
        <p className="text-sm text-slate-400">
          Showing <span className="font-semibold text-white">page {page}</span>
        </p>
        <div className="flex w-full gap-3 sm:w-auto">
          {/* BUTTON: prev page */}
          <button
            className="inline-flex min-h-10 flex-1 items-center justify-center gap-2 rounded-xl border border-white/10 px-4 text-sm font-semibold text-slate-300 transition hover:border-white/20 hover:bg-white/5 hover:text-white focus:outline-none focus:ring-2 focus:ring-violet-300/40 disabled:cursor-not-allowed disabled:opacity-40 sm:flex-none"
            onClick={() => setPage(Math.max(page - 1, 1))}
            disabled={page === 1 || isPlaceholderData}
            type="button"
          >
            <span aria-hidden="true">←</span>
            Previous
          </button>

          {/* BUTTON: next page */}
          <button
            className="inline-flex min-h-10 flex-1 items-center justify-center gap-2 rounded-xl bg-violet-300 px-4 text-sm font-bold text-slate-950 transition hover:bg-violet-200 focus:outline-none focus:ring-4 focus:ring-violet-300/20 disabled:cursor-wait disabled:opacity-60 sm:flex-none"
            onClick={() => setPage(page + 1)}
            disabled={isPlaceholderData || !posts?.length}
            type="button"
          >
            Next
            <span aria-hidden="true">→</span>
          </button>
        </div>
      </nav>
    </section>
  );
}

export default PaginatedPosts;
