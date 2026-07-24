function EmptyState() {
  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900 py-20 text-center">
      <h3 className="text-2xl font-bold text-white">
        No profiles found
      </h3>

      <p className="mt-3 text-zinc-400">
        Try another keyword or choose another category.
      </p>
    </div>
  );
}

export default EmptyState;