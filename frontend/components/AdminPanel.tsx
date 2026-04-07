/* eslint-disable @typescript-eslint/no-explicit-any */
import { availabilityActions } from "@/actions/availability.actions";
import { Availability, BookingLink } from "@/types";
import { useState } from "react";
import toast from "react-hot-toast";
import { AvailabilityForm } from "./AvailabilityForm";

export const AdminPanel = () => {
  const [availabilityList, setAvailabilityList] = useState<Availability[]>([]);
  const [bookingLink, setBookingLink] = useState<BookingLink | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const generateLink = async () => {
    setIsLoading(true);
    try {
      const link = await availabilityActions.generateBookingLink();
      setBookingLink(link);
      toast.success("Booking link generated successfully!");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to generate link");
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async () => {
    if (bookingLink) {
      try {
        await navigator.clipboard.writeText(bookingLink.url);
        toast.success("Link copied to clipboard!");
      } catch (err) {
        toast.error("Failed to copy link");
      }
    }
  };

  // Handle successful availability addition
  const handleAvailabilityAdded = (
    newAvailability: Availability,
    updatedList: Availability[]
  ) => {
    setAvailabilityList(updatedList);
    toast.success("Availability added successfully!");
  };

  console.log("availabilityList: ", availabilityList);

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
        🛠️ Admin Panel
      </h2>

      {/* Set Availability Form */}
      <div className="mb-8">
        <h3 className="text-lg font-medium text-gray-700 mb-3">
          Set Your Availability
        </h3>
        <AvailabilityForm onSuccess={handleAvailabilityAdded} />
      </div>

      {/* Availability List - Show to Admin Only */}
      {availabilityList.length > 0 && (
        <div className="mb-8">
          <h4 className="font-medium text-gray-700 mb-2">
            Your Availability List:
            <span className="text-sm text-gray-500 ml-2">
              ({availabilityList.length} slots)
            </span>
          </h4>
          <div className="space-y-2 max-h-60 overflow-y-auto border border-gray-200 rounded-lg p-2">
            {availabilityList.map((item) => (
              <div
                key={item?.id}
                className="bg-gray-50 p-3 rounded-lg text-sm hover:bg-gray-100 transition-colors"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <span className="font-medium text-gray-800">
                      📅 {item?.date}
                    </span>
                    <span className="text-gray-600 ml-3">
                      🕐 {item?.startTime} - {item?.endTime}
                    </span>
                  </div>
                  <span className="text-xs text-gray-400">ID: {item?.id}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* No Availability Message */}
      {availabilityList.length === 0 && !isLoading && (
        <div className="mb-8 text-center py-6 bg-gray-50 rounded-lg">
          <p className="text-gray-500">No availability slots added yet.</p>
          <p className="text-sm text-gray-400 mt-1">
            Use the form above to add your available time slots.
          </p>
        </div>
      )}

      {/* Generate Booking Link */}
      <div className="border-t pt-6">
        <h3 className="text-lg font-medium text-gray-700 mb-3">
          Generate Booking Link
        </h3>

        <button
          onClick={generateLink}
          disabled={isLoading}
          className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors font-medium mb-3 disabled:bg-gray-400"
        >
          {isLoading ? "Generating..." : "🔗 Generate New Booking Link"}
        </button>

        {bookingLink && (
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-sm text-gray-600 mb-2">Your booking link:</p>
            <div className="flex gap-2">
              <input
                type="text"
                value={bookingLink.url}
                readOnly
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm text-black"
              />
              <button
                onClick={copyToClipboard}
                className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors text-sm"
              >
                Copy
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Slug: {bookingLink.slug}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
