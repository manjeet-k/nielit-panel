"use client";

import Header from "@/components/layout/Navbar";
import Sidebar from "@/components/layout/Sidebar";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useEffect, useState } from "react";


export default function Dashboard() {
  const [totalStudents, setTotalStudents] = useState<number>(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/student/get-students`;

  const fetchStudents = async () => {
    try { 
      const res = await fetch(API_URL);
      const data = await res.json();
      setTotalStudents(data.pagination.totalStudents);
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  };

  useEffect(() => { 
    fetchStudents();
  }, []);

  return (
    <ProtectedRoute>
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header onMenuClick={() => setSidebarOpen(true)} />

        <div className="flex-1 p-4 md:p-10 overflow-y-auto">
          <div className="mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Dashboard</h1>
            <p className="text-gray-500">Welcome to the Admin Panel</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl shadow-md p-6 hover:shadow-xl transition duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">Total Students</p>
                  <h2 className="text-4xl font-bold text-blue-600 mt-2">
                    {totalStudents}
                  </h2>
                </div>
                <div className="bg-blue-100 text-blue-600 p-4 rounded-full text-2xl">
                  🎓
                </div>
              </div>
              <p className="text-sm text-gray-400 mt-4">
                Students registered in the system
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-md p-6 hover:shadow-xl transition duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">Total Classes</p>
                  <h2 className="text-4xl font-bold text-green-600 mt-2">
                    15
                  </h2>
                </div>
                <div className="bg-green-100 text-green-600 p-4 rounded-full text-2xl">
                  📚
                </div>
              </div>
              <p className="text-sm text-gray-400 mt-4">
                Classes created by admin
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
    </ProtectedRoute>
  );
}