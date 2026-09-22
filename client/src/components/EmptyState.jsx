import { SearchX } from "lucide-react";

export default function EmptyState({ title = "Nothing here yet", message = "Try another search or filter." }) {
  return (
    <div className="rounded-2xl border border-dashed border-white/10 px-6 py-20 text-center">
      <SearchX className="mx-auto mb-4 text-zinc-600" size={40} />
      <h2 className="text-lg font-semibold">{title}</h2>
      <p className="mt-2 text-sm text-zinc-500">{message}</p>
    </div>
  );
}
