import { useBooking } from "@/hooks/useBooking";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { DateSelector } from "./DateSelector";
import { TimeSlotSelector } from "./TimeSlotSelector";

export const PublicBooking = () => {
  const [slug, setSlug] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const {
    availableDates,
    availableSlots,
    isLoadingDates,
    isLoadingSlots,
    loadAvailableDates,
    loadAvailableSlots,
    bookSlot,
  } = useBooking();
  const router = useRouter();
  const pathName = usePathname();

  const handleLoad = async () => {
    const id = slug?.split("/")?.at(-1)?.trim();
    if (id) {
      await loadAvailableDates(id);
      setSelectedDate("");
    }
  };

  const handleDateSelect = async (date: string) => {
    setSelectedDate(date);
    await loadAvailableSlots(date);
  };

  const handleBook = async (time: string) => {
    if (selectedDate) {
      await bookSlot(selectedDate, time);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex flex-row justify-between">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
          📅 Book an Appointment
        </h2>

        {pathName !== "/admin" && (
          <button
            onClick={() => router.push("/login")}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            Login
          </button>
        )}
      </div>

      {/* Slug Input */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Enter Booking Link or Slug
        </label>
        <div className="flex gap-2">
          <input
            placeholder="e.g., john-doe-123"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-black"
          />
          <button
            onClick={handleLoad}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Load
          </button>
        </div>
      </div>

      {/* Date Selector */}
      <DateSelector
        dates={availableDates}
        selectedDate={selectedDate}
        isLoading={isLoadingDates}
        onSelectDate={handleDateSelect}
      />

      {/* Time Slot Selector */}
      <TimeSlotSelector
        slots={availableSlots}
        isLoading={isLoadingSlots}
        onBook={handleBook}
      />
    </div>
  );
};
