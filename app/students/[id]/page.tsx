"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Navbar";
import ProtectedRoute from "@/components/ProtectedRoute";
import { FaWindowClose } from "react-icons/fa";
import { FaArrowRightArrowLeft } from "react-icons/fa6";
import { BsArrowLeft } from "react-icons/bs";
import Link from "next/link";

export default function StudentDetails() {
  const { id } = useParams();
  const [student, setStudent] = useState<any>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [image, setImage] = useState<string | null>(null);

  useEffect(() => {
    fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/admin/studentDetails/${id}`,
    )
      .then((res) => res.json())
      .then((data) => {
        setStudent(data.data);
      });
  }, [id]);

     if (!student) return <p className="p-10">Loading...</p>;

  const photoSrc = `${process.env.NEXT_PUBLIC_API_URL}/${student.photo.replace(/\\/g, "/")}`;
  const signSrc = `${process.env.NEXT_PUBLIC_API_URL}/${student.sign}`;

  const openImage = (src: string) => {
    setImage(src);
  };

  return ( 
    <ProtectedRoute>
      <div className="flex h-screen bg-gray-100 overflow-hidden">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        <div className="flex-1 flex flex-col overflow-hidden">
          <Header onMenuClick={() => setSidebarOpen(true)} />

          {/* Page Content */}
          <div className="flex-1 p-6 md:p-10 overflow-y-auto">
            <div className="   mb-3 flex items-center gap-4 ">
              <Link
                className="text-black flex items-center gap-1 font-bold"
                href="/students"
              > 
                <BsArrowLeft className="text-black stroke-1 "/> Back
              </Link>
            </div>

            <h1 className="text-3xl font-bold mb-6 text-gray-800">
              Student Details
            </h1>

            <div className="bg-white rounded-xl shadow-lg p-6 max-w-3xl">
              {/* Photo + Name */}
              <div className="flex gap-6 items-center mb-6">
                <img
                  onClick={() => openImage(photoSrc)}
                  src={photoSrc}
                  className="w-32 h-32 rounded-lg object-cover cursor-pointer"
                />

                <div>
                  <h2 className="text-2xl font-bold text-gray-800">
                    {student.fullName}
                  </h2>
                  <p className="text-gray-600">Mobile: {student.mobileNo}</p>
                </div>
              </div>

              {/* Details Grid */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <p className="font-semibold text-gray-500">Aadhar</p>
                  <p className="text-gray-600">{student.aadhar || "N/A"}</p>
                </div>

                <div>
                  <p className="font-semibold text-gray-500">Status</p>
                  <p className="text-gray-600">
                    {student.status ? "Active" : "Inactive"}
                  </p>
                </div>

                <div>
                  <p className="font-semibold text-gray-500">Created At</p>
                  <p className="text-gray-600">
                    {new Date(student.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {/* Signature + 10th DMC */}
              <div className="mt-6 flex flex-col md:flex-row gap-6">
                <div>
                  <p className="font-semibold mb-2 text-gray-500">Signature</p>
                  <img
                    onClick={() => openImage(signSrc)}
                    src={signSrc}
                    className="w-40 h-20 border rounded object-cover cursor-pointer"
                  />
                </div>

                <div>
                  <p className="font-semibold mb-2 text-gray-500">10th DMC</p>
                  <a
                    href={`${process.env.NEXT_PUBLIC_API_URL}/${student.tenthDMC}`}
                    target="_blank"
                    className="text-blue-600 underline"
                  >
                    View Document
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Image Modal */}
          {image && (
            <div className="fixed inset-0 flex items-center justify-center bg-black/20 bg-opacity-70 z-50">
              <div className="relative flex items-center justify-center max-w-[600px] max-h-[60%] md:max-h-[80%]">
                <button
                  className="absolute top-2 right-2 text-white"
                  onClick={() => setImage(null)}
                >
                  <FaWindowClose size={28} />
                </button>
                <img  
                  src={image}
                  className="max-w-full max-h-[60vh] md:max-h-[80vh] rounded-lg"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
