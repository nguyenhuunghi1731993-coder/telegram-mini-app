import { NavLink } from "react-router-dom";

const menus = [
  { name: "Dashboard", path: "/admin" },
  { name: "Girls", path: "/admin/girls" },
  { name: "Add Girl", path: "/admin/girls/add" },
  { name: "Settings", path: "/admin/settings" },
];

export default function Sidebar() {
  return (
    <aside className="w-64 bg-black border-r border-zinc-800">
      <div className="text-2xl font-bold p-6">
        SG VIP
      </div>

      <nav className="flex flex-col">
        {menus.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `px-6 py-4 hover:bg-zinc-800 ${
                isActive ? "bg-zinc-800 text-yellow-400" : ""
              }`
            }
          >
            {item.name}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}