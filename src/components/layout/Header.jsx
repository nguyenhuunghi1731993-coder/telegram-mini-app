import { useEffect, useState } from "react";
import {
  Bell,
  Heart,
  Menu,
  MessageCircle,
  User,
} from "lucide-react";

function Header() {
  const menuButton =
    "flex h-10 w-10 items-center justify-center rounded-xl border border-zinc-800 bg-zinc-900 transition-all duration-300 hover:-translate-y-1 hover:border-red-500 hover:bg-red-500 hover:shadow-lg hover:shadow-red-500/30";

  const colorSets = [
    {
      border: "border-pink-500",
      bg: "bg-pink-500/15",
      icon: "text-pink-500",
      shadow: "shadow-pink-500/40",
      text: "text-pink-400",
    },
    {
      border: "border-amber-500",
      bg: "bg-amber-500/15",
      icon: "text-amber-400",
      shadow: "shadow-amber-500/40",
      text: "text-amber-300",
    },
    {
      border: "border-sky-500",
      bg: "bg-sky-500/15",
      icon: "text-sky-400",
      shadow: "shadow-sky-500/40",
      text: "text-sky-400",
    },
    {
      border: "border-emerald-500",
      bg: "bg-emerald-500/15",
      icon: "text-emerald-400",
      shadow: "shadow-emerald-500/40",
      text: "text-emerald-400",
    },
    {
      border: "border-violet-500",
      bg: "bg-violet-500/15",
      icon: "text-violet-400",
      shadow: "shadow-violet-500/40",
      text: "text-violet-400",
    },
  ];

  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % colorSets.length);
    }, 3000);

    return () => clearInterval(timer);
  }, []);

  const getColor = (offset) => {
    return colorSets[(index + offset) % colorSets.length];
  };

  const iconButton = (offset) =>
    `relative flex h-10 w-10 items-center justify-center rounded-xl border
    ${getColor(offset).border}
    ${getColor(offset).bg}
    shadow-lg
    ${getColor(offset).shadow}
    transition-all duration-700
    hover:scale-110`;

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-800/70 bg-[#0b0b0c]/90 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between px-4 lg:px-6">

        <div className="flex items-center gap-3">

          <button className={menuButton}>
            <Menu className="h-5 w-5 text-white" />
          </button>

          <div>
            <h1 className="text-xl font-bold tracking-wide text-white">
              SG<span className="text-red-500">VIP</span>
            </h1>

            <p
              className={`mt-0.5 text-[11px] font-semibold tracking-[2px]
              ${getColor(0).text}
              transition-all duration-700 animate-pulse`}
            >
              Premium Escort Directory
            </p>
          </div>

        </div>
                {/* Right */}
        <div className="flex items-center gap-2">

          {/* Favorite */}
          <button className={iconButton(0)}>
            <Heart
              className={`h-5 w-5 ${getColor(0).icon} transition-all duration-700`}
            />
          </button>

          {/* Notification */}
          <button className={iconButton(1)}>
            <Bell
              className={`h-5 w-5 ${getColor(1).icon} transition-all duration-700`}
            />

            <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-[10px] font-bold text-white animate-bounce">
              3
            </span>
          </button>

          {/* Chat */}
          <button className={iconButton(2)}>
            <MessageCircle
              className={`h-5 w-5 ${getColor(2).icon} transition-all duration-700`}
            />
          </button>

          {/* Profile */}
          <button className={iconButton(3)}>
            <User
              className={`h-5 w-5 ${getColor(3).icon} transition-all duration-700`}
            />
          </button>

        </div>

      </div>
    </header>
  );
}

export default Header;