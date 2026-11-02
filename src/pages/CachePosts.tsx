import { getPosts } from "@/services";
import type { Post } from "@/types";
import { useQuery } from "@tanstack/react-query";

function CachePosts() {
  const {
    data: posts,
    dataUpdatedAt,
    isError,
    isFetching,
    isLoading,
    error,
    refetch,
  } = useQuery<Post[]>({
    queryFn: getPosts,
    queryKey: ["posts"],
    staleTime: 5 * 1000,
    gcTime: 5 * 1000,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
  });

  if (isLoading) {
    return (
      <section className="mx-auto max-w-7xl px-5 py-12 sm:px-8 sm:py-16">
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

  if (isError && !posts) {
    return (
      <section className="mx-auto max-w-7xl px-5 py-12 sm:px-8 sm:py-16">
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
          <span className="inline-flex items-center gap-2 rounded-full border border-emerald-300/20 bg-emerald-300/10 px-3 py-1.5 text-xs font-semibold text-emerald-200">
            <span className="size-1.5 rounded-full bg-emerald-300" />
            React Query cache
          </span>
          <h1 className="mt-4 text-4xl font-black tracking-tight text-white sm:text-5xl">
            Cached posts<span className="text-emerald-300">.</span>
          </h1>
          <p className="mt-3 max-w-xl text-sm leading-6 text-slate-400 sm:text-base">
            Revisit posts instantly from cache, with automatic refresh when
            needed.
          </p>
        </div>

        <button
          className="inline-flex min-h-11 items-center justify-center gap-2 self-start rounded-xl border border-white/10 bg-white/[0.05] px-4 text-sm font-semibold text-slate-200 transition hover:border-white/20 hover:bg-white/10 focus:outline-none focus:ring-4 focus:ring-emerald-300/10 disabled:cursor-wait disabled:opacity-60 sm:self-auto"
          disabled={isFetching}
          onClick={() => refetch()}
          type="button"
        >
          <span className={isFetching ? "animate-spin" : ""} aria-hidden="true">
            ↻
          </span>
          {isFetching ? "Refreshing..." : "Refresh posts"}
        </button>
      </header>

      <div className="mb-6 flex flex-col gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
        <div className="flex items-center gap-3">
          <span
            className={`grid size-10 place-items-center rounded-xl ${
              isFetching
                ? "bg-amber-300/10 text-amber-200"
                : "bg-emerald-300/10 text-emerald-200"
            }`}
            aria-hidden="true"
          >
            {isFetching ? "↻" : "✓"}
          </span>
          <div>
            <p className="text-sm font-semibold text-white">
              {isFetching ? "Syncing with server" : "Data ready"}
            </p>
            <p className="mt-0.5 text-xs text-slate-400">
              {dataUpdatedAt
                ? `Last updated ${new Date(dataUpdatedAt).toLocaleTimeString()}`
                : "Waiting for the first fetch"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 self-start rounded-full border border-white/10 px-3 py-1.5 sm:self-auto">
          <span
            className={`size-1.5 rounded-full ${
              isFetching ? "animate-pulse bg-amber-300" : "bg-emerald-300"
            }`}
          />
          <span className="text-xs font-medium text-slate-300">
            {isFetching ? "Updating cache" : "Cached"}
          </span>
        </div>
      </div>

      {isError && (
        <div
          className="mb-5 rounded-xl border border-red-400/20 bg-red-400/5 px-4 py-3 text-sm text-red-200"
          role="alert"
        >
          Refresh failed: {error.message}. Showing the cached posts instead.
        </div>
      )}

      {posts?.length ? (
        <>
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-300">Your posts</h2>
            <span className="text-xs text-slate-500">
              {posts.length} posts
            </span>
          </div>
          <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post, index) => (
              <li
                className="group relative flex min-h-56 flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] p-5 shadow-lg shadow-black/10 transition duration-300 hover:-translate-y-1 hover:border-emerald-300/30 hover:bg-white/[0.07] sm:p-6"
                key={post.id}
              >
                <div
                  className={`absolute inset-x-0 top-0 h-1 ${
                    index % 3 === 0
                      ? "bg-emerald-300"
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
                    className="text-xs text-slate-500"
                    title="Served through the posts query cache"
                  >
                    Cached
                  </span>
                </div>
                <h3 className="text-lg font-bold leading-snug text-white transition group-hover:text-emerald-100">
                  {post.title}
                </h3>
                <p className="mt-3 line-clamp-3 flex-1 text-sm leading-6 text-slate-400">
                  {post.body}
                </p>
                <div className="mt-5 border-t border-white/10 pt-4 text-xs text-slate-500">
                  Shared by <span className="text-slate-300">User {post.userId}</span>
                </div>
              </li>
            ))}
          </ul>
        </>
      ) : (
        <div className="rounded-2xl border border-dashed border-white/15 bg-white/[0.03] px-6 py-16 text-center">
          <p className="text-lg font-bold text-white">No cached posts</p>
          <p className="mt-2 text-sm text-slate-400">
            Try refreshing to load the latest posts.
          </p>
        </div>
      )}
    </section>
  );
}

export default CachePosts;
