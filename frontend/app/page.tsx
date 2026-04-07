"use client";

import { PublicBooking } from "@/components/PublicBooking";
import { Toaster } from "react-hot-toast";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <Toaster position="bottom-right" />
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">
          📅 Smart Scheduling System
        </h1>
        <PublicBooking />
      </div>
    </div>
  );
}
