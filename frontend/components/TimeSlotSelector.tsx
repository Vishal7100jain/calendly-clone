import { usePathname } from "next/navigation";
import { useState } from "react";

// components/TimeSlotSelector.tsx
interface TimeSlotSelectorProps {
  slots: string[];
  isLoading: boolean;
  onBook: (time: string) => void;
}

export const TimeSlotSelector = ({
  slots,
  isLoading,
  onBook,
}: TimeSlotSelectorProps) => {
  const [selectedSlot, setSelectedSlot] = useState("");
  const pathName = usePathname();

  if (isLoading) {
    return (
      <div className="text-center py-8 text-gray-500">
        Loading time slots...
      </div>
    );
  }

  if (slots.length === 0) {
    return null;
  }

  const handleBook = () => {
    if (selectedSlot) {
      onBook(selectedSlot);
      setSelectedSlot("");
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-medium text-gray-700 mb-3">
          Available Time Slots
        </h3>
        <div className="grid grid-cols-3 gap-2">
          {slots.map((slot, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedSlot(slot)}
              className={`p-2 border rounded-lg text-center text-black transition-all ${
                selectedSlot === slot
                  ? "bg-green-600 text-white border-green-600"
                  : "hover:bg-green-50 border-gray-300 text-black"
              }`}
            >
              {slot}
            </button>
          ))}
        </div>
      </div>

      {selectedSlot && pathName !== "/admin" && (
        <button
          onClick={handleBook}
          className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors font-medium"
        >
          Confirm Booking for {selectedSlot}
        </button>
      )}
    </div>
  );
};
