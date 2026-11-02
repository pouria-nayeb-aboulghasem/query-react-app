import { getPaginatedPosts } from "@/services";
import type { Post } from "@/types";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";

const POSTS_PER_PAGE = 10;

function InfinitePosts() {
  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isError,
    isFetchingNextPage,
    isLoading,
    isPending,
    refetch,
  } = useInfiniteQuery({
    queryKey: ["posts", "infinite"],
    queryFn: ({ pageParam }) => getPaginatedPosts(pageParam),
    initialPageParam: 1,
    getNextPageParam: (lastPage, _allPages, lastPageParam) =>
      lastPage.length === POSTS_PER_PAGE ? lastPageParam + 1 : undefined,
  });

  if (isLoading || isPending) {
    return (
      <section className="mx-auto max-w-5xl px-5 py-12 sm:px-8">
        <p className="text-sm text-slate-400" role="status">
          Loading posts...
        </p>
      </section>
    );
  }

  if (isError && !data) {
    return (
      <section className="mx-auto max-w-5xl px-5 py-12 sm:px-8">
        <div
          className="rounded-2xl border border-red-400/20 bg-red-400/10 p-6 text-red-200"
          role="alert"
        >
          <p>{error.message}</p>
          <button
            className="mt-4 rounded-lg bg-red-300 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-red-200"
            onClick={() => refetch()}
            type="button"
          >
            Try again
          </button>
        </div>
      </section>
    );
  }

  const posts: Post[] = data.pages.flat();

  return (
    <section className="mx-auto max-w-5xl px-5 py-12 sm:px-8">
      <header className="mb-8">
        <p className="text-sm font-bold uppercase tracking-[0.3em] text-amber-300">
          React Query
        </p>
        <h1 className="mt-3 text-3xl font-black tracking-tight text-white sm:text-4xl">
          Infinite posts
        </h1>
        <p className="mt-3 max-w-2xl text-slate-400">
          Load posts a page at a time without replacing the posts already shown.
        </p>
      </header>

      <ul className="grid gap-4 sm:grid-cols-2">
        {posts.map((post) => (
          <li
            className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 shadow-lg shadow-black/10 transition hover:border-amber-300/30"
            key={post.id}
          >
            <div className="mb-4 flex items-center justify-between gap-3">
              <span className="rounded-full bg-amber-300/10 px-3 py-1 text-xs font-semibold text-amber-200">
                Post #{post.id}
              </span>
              <Link
                className="text-xs font-semibold text-slate-400 transition hover:text-amber-200"
                to={`/posts/${post.id}/edit`}
              >
                Edit
              </Link>
            </div>
            <h2 className="text-lg font-bold capitalize leading-snug text-white">
              {post.title}
            </h2>
            <p className="mt-3 text-sm leading-6 text-slate-400">{post.body}</p>
          </li>
        ))}
      </ul>

      <div className="mt-8 flex flex-col items-center gap-3">
        {isError && (
          <p className="text-sm text-red-300" role="alert">
            {error.message}
          </p>
        )}
        {hasNextPage ? (
          <button
            className="rounded-full bg-amber-300 px-6 py-3 text-sm font-bold text-slate-950 transition hover:bg-amber-200 disabled:cursor-wait disabled:opacity-60"
            disabled={isFetchingNextPage}
            onClick={() => fetchNextPage()}
            type="button"
          >
            {isFetchingNextPage ? "Loading more..." : "Load more posts"}
          </button>
        ) : (
          <p className="text-sm text-slate-500">You have reached the end.</p>
        )}
      </div>
    </section>
  );
}

export default InfinitePosts;
