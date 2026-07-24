import { NavLink } from "react-router-dom";
import {
  House,
  Heart,
  Search,
  User,
} from "lucide-react";

const menus = [
  {
    name: "Home",
    path: "/",
    icon: House,
  },
  {
    name: "Favorite",
    path: "/favorite",
    icon: Heart,
  },
  {
    name: "Search",
    path: "/search",
    icon: Search,
  },
  {
    name: "Profile",
    path: "/profile",
    icon: User,
  },
];

function BottomNavigation() {
  return (
    <nav className="fixed bottom-4 left-1/2 z-50 w-[95%] max-w-md -translate-x-1/2 rounded-2xl border border-zinc-800 bg-zinc-900/90 px-4 py-3 backdrop-blur-xl shadow-2xl">
      <div className="flex items-center justify-between">
        {menus.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex flex-col items-center gap-1 transition ${
                  isActive
                    ? "text-red-500"
                    : "text-zinc-500 hover:text-white"
                }`
              }
            >
              <Icon size={22} />

              <span className="text-xs">
                {item.name}
              </span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}

export default BottomNavigation;