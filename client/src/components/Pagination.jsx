import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Pagination({ page, totalPages, onChange }) {
  if (!totalPages || totalPages <= 1) return null;

  return (
    <div className="mt-10 flex items-center justify-center gap-3">
      <button
        disabled={page <= 1}
        onClick={() => onChange(page - 1)}
        className="grid h-10 w-10 place-items-center rounded-xl border border-white/10 bg-white/[0.04] disabled:cursor-not-allowed disabled:opacity-30"
        aria-label="Previous page"
      >
        <ChevronLeft size={18} />
      </button>
      <span className="min-w-20 text-center text-sm text-zinc-400">
        Page <b className="text-white">{page}</b> of {Math.min(totalPages, 500)}
      </span>
      <button
        disabled={page >= totalPages || page >= 500}
        onClick={() => onChange(page + 1)}
        className="grid h-10 w-10 place-items-center rounded-xl border border-white/10 bg-white/[0.04] disabled:cursor-not-allowed disabled:opacity-30"
        aria-label="Next page"
      >
        <ChevronRight size={18} />
      </button>
    </div>
  );
}
