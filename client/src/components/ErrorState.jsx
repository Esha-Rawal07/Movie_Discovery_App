import { RefreshCcw } from "lucide-react";

export default function ErrorState({ onRetry }) {
  return (
    <div className="rounded-2xl border border-red-400/10 bg-red-400/[0.03] px-6 py-16 text-center">
      <h2 className="text-lg font-semibold">We couldn't load these movies</h2>
      <p className="mx-auto mt-2 max-w-md text-sm text-zinc-500">
        The movie service may be temporarily unavailable. Please try again in a moment.
      </p>
      <button
        onClick={onRetry}
        className="mt-5 inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-zinc-950 transition hover:bg-zinc-200"
      >
        <RefreshCcw size={16} /> Try again
      </button>
    </div>
  );
}
