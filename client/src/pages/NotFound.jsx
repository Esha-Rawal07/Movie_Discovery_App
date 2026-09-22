import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <section className="container-page grid min-h-[70vh] place-items-center text-center">
      <div>
        <p className="text-sm font-medium text-violet-300">404</p>
        <h1 className="mt-2 text-4xl font-bold">Page not found</h1>
        <p className="mt-3 text-zinc-500">The page you're looking for doesn't exist.</p>
        <Link to="/" className="mt-6 inline-block rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-zinc-950">
          Back home
        </Link>
      </div>
    </section>
  );
}
