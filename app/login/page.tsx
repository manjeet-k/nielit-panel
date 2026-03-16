"use client";

import axios from "axios";
import { useState } from "react";
import { toast } from "react-toastify";

export default function Login() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const loginAdmin = async (e: any) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/admin/login`,
        {
          email: form.email,
          password: form.password,
        },
      );

      if (res.data.success) {
        toast.success(res.data.message);
        setForm({
          email: "",
          password: "",
        });

        localStorage.setItem("adminToken", res.data.token);

        window.location.href = "/dashboard";
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      {" "}
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <div className="flex justify-center mb-6">
          <h1 className="text-3xl font-bold text-blue-600 mb-2 text-center">
            LOGO
          </h1>
        </div>

        <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Admin Login
        </h1>

        <form onSubmit={loginAdmin} className="space-y-4">
          <div>
            <label className="block text-gray-600 mb-1">Email</label>
            <input
              value={form.email}
              onChange={handleChange}
              name="email"
              type="email"
              placeholder="Enter your email"
              className="border p-3 w-full text-black rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
          </div>

          <div>
            <label className="block text-gray-600 mb-1">Password</label>
            <input
              value={form.password}
              onChange={handleChange}
              name="password"
              type="password"
              placeholder="Enter your password"
              className="border p-3 w-full text-black rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Login
          </button>
        </form>

        <p className="text-center text-gray-500 text-sm mt-4">
          &copy; {new Date().getFullYear()} Admin Panel
        </p>
      </div>
    </div>
  );
}
