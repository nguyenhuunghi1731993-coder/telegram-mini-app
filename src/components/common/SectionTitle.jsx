function SectionTitle({ count }) {
  return (
    <div className="mb-6 flex justify-end">
      <div className="rounded-full bg-zinc-900 border border-zinc-800 px-4 py-2 text-sm font-medium text-zinc-300">
        {count} Profiles
      </div>
    </div>
  );
}

export default SectionTitle;