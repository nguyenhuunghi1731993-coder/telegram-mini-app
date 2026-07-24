import categories from "../../data/categories";

function CategoryMenu({ activeCategory, setActiveCategory }) {
  return (
    <div className="mx-auto mt-6 mb-6 max-w-6xl">
      <div className="flex flex-wrap justify-center gap-3">
        {categories.map((item) => {
          const isActive = activeCategory === item.name;

          return (
            <button
              key={item.name}
              onClick={() => setActiveCategory(item.name)}
              className={`group flex items-center gap-2 rounded-full border px-5 py-2.5 text-sm font-semibold transition-all duration-300
                ${
                  isActive
                    ? "border-red-500 bg-red-500 text-white shadow-lg shadow-red-500/30 scale-105"
                    : "border-zinc-700 bg-zinc-900 text-zinc-300 hover:border-red-500 hover:bg-zinc-800 hover:text-white hover:-translate-y-1"
                }`}
            >
              <span className="text-lg">{item.icon}</span>
              <span>{item.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default CategoryMenu;