import React from "react";
import { Home, Compass, ShoppingBag, Users, Star, MessageSquare, Settings } from "lucide-react";

const menu = [
  { icon: <Home className="w-4 h-4" />, label: "Feed" },
  { icon: <Compass className="w-4 h-4" />, label: "Explore" },
  { icon: <ShoppingBag className="w-4 h-4" />, label: "Marketplace" },
  { icon: <Users className="w-4 h-4" />, label: "Groups" },
  { icon: <Star className="w-4 h-4" />, label: "My favorites" },
  { icon: <MessageSquare className="w-4 h-4" />, label: "Messages" },
  { icon: <Settings className="w-4 h-4" />, label: "Settings" },
];

export default function SidebarLeft() {
  return (
    <aside className="w-58 bg-white min-h-screen p-6 flex flex-col">
      <div className="mb-8">
        <span className="text-2xl font-bold text-blue-700 tracking-tight">Vedanta Social</span>
      </div>
      <nav className="flex flex-col gap-3">
        {menu.map((item) => (
          <button
            key={item.label}
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-blue-50 font-medium transition"
          >
            {item.icon}
            {item.label}
          </button>
        ))}
      </nav>
    </aside>
  );
}
