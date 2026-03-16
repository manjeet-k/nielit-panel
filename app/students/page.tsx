"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Navbar";
import Link from "next/link";
import { FaTrash, FaEye, FaCircle } from "react-icons/fa";
import ProtectedRoute from "@/components/ProtectedRoute";
import { toast } from "react-toastify";

export default function StudentsPage() {
  const [students, setStudents] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalStudents, setTotalStudents] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const studentsPerPage = 10;

  const getPagination = (currentPage: any, totalPages: any) => {
    const delta = 2; // current ke side me kitne pages dkhane h 

    const range = [];
    const rangeWithDots = [];

    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, "...");
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push("...", totalPages);
    } else if (totalPages > 1) {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };
  const pages = getPagination(currentPage, totalPages);

  const fetchStudents = async (page: number = 1, search: string = "") => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/student/get-students?page=${page}&limit=${studentsPerPage}&search=${search}`,
      );

      const data = await res.json();

      if (data.success) {
        setStudents(data.data);
        setTotalPages(data.pagination.totalPages);
        setTotalStudents(data.pagination.totalStudents);
      }
    } catch (error) {
      toast.error("Error fetching students!" )
    }
  };

  useEffect(() => {
    fetchStudents(currentPage, searchQuery);
  }, [currentPage, searchQuery]);

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1); // reset page when searching
  };

  const deleteStudent = async (id: string) => {
    if (!confirm("Are you sure you want to delete this student?")) return;

    try {
      await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/student/delete-student/${id}`,
        {
          method: "DELETE",
        },
      );

      fetchStudents(currentPage, searchQuery);
    } catch (error) {
      toast.error("Error deleting student!" )
    }
  };

  const toggleStudentStatus = async (id: string, currentStatus: boolean) => {
    try {
    const res=  await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/admin/updateStudent/${id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: !currentStatus }),
        },
      );
      fetchStudents(currentPage, searchQuery);
      const updatedData = await res.json();
      if(updatedData.success){
        toast.success(updatedData.message)
      }
    } catch (error) {
      toast.error("Error updating student status!")
    }
  };

  const startIndex = (currentPage - 1) * studentsPerPage + 1;
  const endIndex = Math.min(startIndex + students.length - 1, totalStudents);

  return (
    <ProtectedRoute>
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header onMenuClick={() => setSidebarOpen(true)} />

        <div className="flex-1 p-4 md:p-10 overflow-y-auto"> 
          <div className="justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800">
              Students Management
            </h1>
            <p className="text-[#717182] mt-2">
              Manage registered users and approval requests
            </p>
          </div>

          {/* Search */}
          <div className="mb-6 w-full">
            <input
              type="text"
              placeholder="Search by student name..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full px-4 text-black py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Table */}
          <div className="bg-white shadow-lg rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gray-200 text-gray-700">
                  <tr>
                    <th className="p-4 text-left">#</th>
                    <th className="p-4 text-left">Name</th>
                    <th className="p-4 text-left">Mobile</th>
                    <th className="p-4 text-left">Status</th>
                    <th className="p-4 text-left">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {students.map((student: any, index) => (
                    <tr key={student._id} className="border-b hover:bg-gray-50">
                      <td className="p-4 text-gray-500">
                        {startIndex + index}
                      </td>

                      <td className="p-4 font-medium text-gray-700">
                        {student.fullName}
                      </td>

                      <td className="p-4 text-gray-500">{student.mobileNo}</td>

                      <td className="p-4">
                        <button
                          onClick={() =>
                            toggleStudentStatus(student._id, student.status)
                          }
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            student.status ? "bg-green-600" : "bg-gray-300"
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              student.status ? "translate-x-6" : "translate-x-1"
                            }`}
                          />
                        </button>
                      </td>

                      <td className="p-4 flex gap-4">
                        <Link href={`/students/${student._id}`}>
                          <FaEye className="text-blue-600 cursor-pointer hover:scale-110" />
                        </Link>

                        <FaTrash
                          onClick={() => deleteStudent(student._id)}
                          className="text-red-600 cursor-pointer hover:scale-110"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          <div className="mt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-gray-600">
              Showing {students.length > 0 ? startIndex : 0} to{" "}
              {students.length > 0 ? endIndex : 0} of {totalStudents} students
            </p>

            <div className="flex flex-wrap gap-1 justify-center">
              {pages.map((page, index) =>
                page === "..." ? (
                  <span key={index} className="px-2 py-1 flex items-end">
                    <div className="flex gap-1">
                      <FaCircle className="text-gray-500 w-1 h-1" />
                      <FaCircle className="text-gray-500 w-1 h-1" />
                      <FaCircle className="text-gray-500 w-1 h-1" />
                    </div>
                  </span>
                ) : (
                  <button
                    key={index}
                    onClick={() => setCurrentPage(page)}
                    className={`px-2 py-1 rounded-lg min-w-[32px] text-center ${
                      currentPage === page
                        ? "bg-blue-500 text-white"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                  >
                    {page}
                  </button>
                ),
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
    </ProtectedRoute>
  );
}
