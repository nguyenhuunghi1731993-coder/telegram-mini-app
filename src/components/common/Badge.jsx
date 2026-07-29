function Badge({
  children,
  color = "red",
}) {
  const colors = {
    red: "bg-red-600 text-white",
    green: "bg-emerald-600 text-white",
    blue: "bg-sky-600 text-white",
    yellow: "bg-yellow-500 text-black",
    gray: "bg-zinc-700 text-white",
  };

  return (
    <span
      className={`rounded-md px-2 py-1 text-xs font-bold ${colors[color]}`}
    >
      {children}
    </span>
  );
}

export default Badge;