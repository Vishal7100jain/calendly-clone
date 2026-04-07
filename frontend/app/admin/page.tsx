"use client";

import { authActions } from "@/actions/auth.action";
import { AdminPanel } from "@/components/AdminPanel";
import { PublicBooking } from "@/components/PublicBooking";
import { useAuth } from "@/hooks/useAuth";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { Toaster } from "react-hot-toast";

export default function AdminPage() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathName = usePathname();

  useEffect(() => {
    const currentUser = authActions.getCurrentUser();
    const currentToken = localStorage.getItem("auth_token");
    if (!currentUser || !currentToken) {
      router.push("/");
    }
  }, [router]);

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <Toaster position="bottom-right" />

      <div className="max-w-6xl mx-auto">
        {/* Header with user info and logout */}
        <div className="flex justify-between items-center mb-8 bg-white rounded-lg p-4 shadow">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              📅 Smart Scheduling System
            </h1>
            <p className="text-gray-600">Welcome back, {user.name}!</p>
          </div>
          <button
            onClick={logout}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            Logout
          </button>
        </div>

        {/* Admin Panel and Public Booking Preview */}
        <div className="grid md:grid-cols-2 gap-8">
          <AdminPanel />
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              {pathName === "/admin"
                ? "Preview of Public Booking"
                : "Public Booking Preview"}
            </h2>
            <PublicBooking />
          </div>
        </div>
      </div>
    </div>
  );
}
