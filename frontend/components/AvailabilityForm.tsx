/* eslint-disable @typescript-eslint/no-explicit-any */
import { availabilityActions } from "@/actions/availability.actions";
import { Availability } from "@/types";
import { useState } from "react";
import toast from "react-hot-toast";

interface AvailabilityFormProps {
  onSuccess?: (
    newAvailability: Availability,
    updatedList: Availability[]
  ) => void;
}

export const AvailabilityForm = ({ onSuccess }: AvailabilityFormProps) => {
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!date || !startTime || !endTime) {
      toast.error("Please fill in all fields");
      return;
    }

    if (startTime >= endTime) {
      toast.error("End time must be after start time");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await availabilityActions.createAvailability({
        date,
        startTime,
        endTime,
      });

      if (response?.status === "success" && response?.data) {
        setDate("");
        setStartTime("");
        setEndTime("");

        if (onSuccess) {
          onSuccess(response.data?.new, response.data?.list);
        }

        toast.success(response?.message);
      } else {
        toast.error(response?.message || "Failed to add availability");
      }
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Failed to add availability"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Date
        </label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Start Time
          </label>
          <input
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            End Time
          </label>
          <input
            type="time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
            required
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:bg-gray-400"
      >
        {isSubmitting ? "Adding..." : "+ Add Availability"}
      </button>
    </form>
  );
};
