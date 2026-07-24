import { Search, X } from "lucide-react";

function SearchBar({ value, onChange }) {
  return (
    <div className="relative mb-6">
      <Search
        size={18}
        className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400"
      />

      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search girl, code, area..."
        className="w-full rounded-2xl border border-zinc-800 bg-zinc-900 py-3 pl-11 pr-12 text-white outline-none transition focus:border-red-500"
      />

      {value && (
        <button
          onClick={() => onChange("")}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white"
        >
          <X size={18} />
        </button>
      )}
    </div>
  );
}

export default SearchBar;