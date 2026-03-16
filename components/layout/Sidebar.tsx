"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();

  const menu = [
    { name: "Dashboard", path: "/dashboard", icon: "📊" },
    { name: "Students", path: "/students", icon: "🎓" },
  ];

  return (
    <>
      {/* Overlay for mobile */}
      <div
        className={`fixed inset-0 bg-black/10 bg-opacity-50 z-40 md:hidden transition-opacity ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* Sidebar */}
      <div
        className={`fixed md:static inset-y-0 left-0 z-50 w-64 bg-white text-black flex flex-col p-5 transform transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 overflow-y-auto`}
      >
        <h1 className="text-2xl font-bold mb-10 pb-4 tracking-wide border-b flex justify-center">
          Nielit Admin
        </h1>

        <nav className="flex flex-col gap-2">
          {menu.map((item, index) => {
            const active = pathname === item.path;

            return (
              <Link
                key={index}
                href={item.path}
                onClick={() => onClose()}
                className={`flex items-center gap-3 p-3 rounded-lg transition ${
                  active
                    ? "bg-blue-600 text-white"
                    : "text-black  hover:bg-gray-800 hover:text-white"
                }`}
              >
                <span>{item.icon}</span>
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>
    </>
  );
}