import {
  BrowserRouter,
  Navigate,
  Outlet,
  Route,
  Routes,
} from "react-router-dom";
import CreateFormPost from "./pages/CreateFormPost";
import OptimisticUI from "./pages/OptimisticUI";
import Posts from "./pages/Posts";
import PostsLazyLoad from "./pages/PostsLazyLoad";
import Navbar from "./components/Navbar";
import PaginatedPosts from "./pages/PaginatedPosts";
import InfinitePosts from "./pages/InfinitePosts";
import CachePosts from "./pages/CachePosts";

function CatalogLayout() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <Navbar />
      <Outlet />
    </main>
  );
}

function NotFoundPage() {
  return (
    <section className="mx-auto max-w-7xl px-5 py-20 text-center sm:px-8">
      <p className="text-sm font-bold uppercase tracking-[0.35em] text-amber-300">
        404
      </p>
      <h1 className="mt-3 text-3xl font-black text-white">Page not found</h1>
      <p className="mt-3 text-slate-400">
        The page you are looking for does not exist.
      </p>
    </section>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<CatalogLayout />}>
          <Route index element={<Navigate to="/posts" replace />} />
          <Route path="posts" element={<Posts />} />
          <Route path="paging" element={<PaginatedPosts />} />
          <Route path="cache" element={<CachePosts />} />
          <Route path="infinite-posts" element={<InfinitePosts />} />
          <Route path="lazy-posts" element={<PostsLazyLoad />} />
          <Route path="create" element={<CreateFormPost />} />
          <Route path="posts/:id/edit" element={<OptimisticUI />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
