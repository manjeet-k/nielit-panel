"use client";

import { FaSignInAlt, FaBars } from "react-icons/fa";

interface HeaderProps {
  onMenuClick: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    
      window.location.href = '/login';
  };


  return (
    <header className="sticky top-0 z-30 w-full bg-white shadow-md px-6 py-4 flex justify-between items-center">
      <div className="flex items-center gap-3">
        {/* Hamburger Menu - visible only on mobile */}
        <button
          onClick={onMenuClick}
          className="md:hidden text-gray-800 text-2xl focus:outline-none"
        >
          <FaBars />
        </button>

        <span className="text-xl font-bold text-gray-800">
          Admin Panel
        </span>
      </div>

      <div>
        <button 
        onClick={handleLogout}
          className="flex cursor-pointer items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          <FaSignInAlt />
          <span className="hidden sm:inline">Admin Logout</span>
        </button>
      </div>
    </header>
  );
}