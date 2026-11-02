import { usePost } from "@/hooks";
import { getPosts } from "@/services";
import type { Post } from "@/types";
import { useQuery } from "@tanstack/react-query";

function PostsLazyLoad() {
  const { isPostLoad, setIsPostLoad } = usePost();
  const {
    data: posts,
    isLoading,
    error,
    isError,
    refetch,
  } = useQuery<Post[]>({
    queryFn: getPosts,
    queryKey: ["posts"],
    enabled: isPostLoad,
  });

  return (
    <section className="mx-auto max-w-7xl px-5 py-12 sm:px-8 sm:py-16">
      <header className="mb-9 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1.5 text-xs font-semibold text-cyan-200">
            <span className="size-1.5 rounded-full bg-cyan-300" />
            On-demand loading
          </span>
          <h1 className="mt-4 text-4xl font-black tracking-tight text-white sm:text-5xl">
            Lazy posts<span className="text-cyan-300">.</span>
          </h1>
          <p className="mt-3 max-w-xl text-sm leading-6 text-slate-400 sm:text-base">
            Posts load only when you ask for them, keeping the initial page
            lightweight.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          {!isPostLoad ? (
            <button
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-amber-300 px-5 text-sm font-bold text-slate-950 transition hover:bg-amber-200 focus:outline-none focus:ring-4 focus:ring-amber-300/20"
              onClick={() => setIsPostLoad()}
              type="button"
            >
              Load posts
              <span aria-hidden="true">↓</span>
            </button>
          ) : (
            <>
              <button
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.05] px-4 text-sm font-semibold text-slate-200 transition hover:border-white/20 hover:bg-white/10 focus:outline-none focus:ring-4 focus:ring-white/10 disabled:cursor-wait disabled:opacity-60"
                disabled={isLoading}
                onClick={() => refetch()}
                type="button"
              >
                <span aria-hidden="true">↻</span>
                Refresh
              </button>
              <span className="inline-flex min-h-11 items-center rounded-xl border border-emerald-300/20 bg-emerald-300/5 px-4 text-sm font-medium text-emerald-200">
                Posts loaded
              </span>
            </>
          )}
        </div>
      </header>

      {isLoading ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }, (_, index) => (
            <div
              className="h-56 animate-pulse rounded-2xl border border-white/10 bg-white/[0.04]"
              key={index}
            />
          ))}
        </div>
      ) : isError ? (
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
      ) : posts?.length ? (
        <>
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-300">
              Your feed
            </h2>
            <span className="text-xs text-slate-500">
              {posts.length} posts
            </span>
          </div>
          <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post, index) => (
              <li
                className="group relative flex min-h-56 flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] p-5 shadow-lg shadow-black/10 transition duration-300 hover:-translate-y-1 hover:border-cyan-300/30 hover:bg-white/[0.07] sm:p-6"
                key={post.id}
              >
                <div
                  className={`absolute inset-x-0 top-0 h-1 ${
                    index % 3 === 0
                      ? "bg-cyan-300"
                      : index % 3 === 1
                        ? "bg-amber-300"
                        : "bg-fuchsia-300"
                  }`}
                />
                <span className="mb-5 w-fit rounded-full bg-white/[0.07] px-3 py-1 text-xs font-semibold text-slate-300">
                  Post {String(post.id).padStart(2, "0")}
                </span>
                <h3 className="text-lg font-bold leading-snug text-white transition group-hover:text-cyan-100">
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
          <span className="mx-auto grid size-12 place-items-center rounded-2xl bg-cyan-300/10 text-xl text-cyan-200">
            ↓
          </span>
          <h2 className="mt-5 text-lg font-bold text-white">
            Ready when you are
          </h2>
          <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-400">
            Select “Load posts” to fetch the latest posts and display them here.
          </p>
        </div>
      )}
    </section>
  );
}

export default PostsLazyLoad;
