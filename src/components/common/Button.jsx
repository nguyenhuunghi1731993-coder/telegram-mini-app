function Button({
  children,
  onClick,
  variant = "primary",
}) {
  const variants = {
    primary:
      "bg-red-600 hover:bg-red-500 text-white",

    secondary:
      "bg-zinc-800 hover:bg-zinc-700 text-white",
  };

  return (
    <button
      onClick={onClick}
      className={`rounded-xl px-5 py-3 font-semibold transition ${variants[variant]}`}
    >
      {children}
    </button>
  );
}

export default Button;