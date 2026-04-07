/* eslint-disable @typescript-eslint/no-explicit-any */
import { bookingActions } from "@/actions/booking.actions";
import { AvailableDate } from "@/types";
import { useState } from "react";
import toast from "react-hot-toast";

export const useBooking = () => {
  const [availableDates, setAvailableDates] = useState<AvailableDate[]>([]);
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [isLoadingDates, setIsLoadingDates] = useState(false);
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);
  const [currentSlug, setCurrentSlug] = useState("");

  const loadAvailableDates = async (slug: string) => {
    setIsLoadingDates(true);
    setCurrentSlug(slug);
    try {
      const dates = await bookingActions.getAvailableDates(slug);
      setAvailableDates(dates);
      if (dates.length === 0) {
        toast.error("No available dates found");
      }
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Failed to load available dates"
      );
      setAvailableDates([]);
    } finally {
      setIsLoadingDates(false);
    }
  };

  const loadAvailableSlots = async (date: string) => {
    if (!currentSlug) return;

    setIsLoadingSlots(true);
    try {
      const slots = await bookingActions.getAvailableSlots(currentSlug, date);
      setAvailableSlots(slots);
      if (slots.length === 0) {
        toast.error("No available slots for this date");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to load time slots");
      setAvailableSlots([]);
    } finally {
      setIsLoadingSlots(false);
    }
  };

  const bookSlot = async (date: string, time: string) => {
    if (!currentSlug) return false;

    try {
      await bookingActions.bookSlot(currentSlug, date, time);
      toast.success(`Successfully booked for ${date} at ${time}`);
      // Refresh slots after booking
      await loadAvailableSlots(date);
      return true;
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to book slot");
      return false;
    }
  };

  return {
    availableDates,
    availableSlots,
    isLoadingDates,
    isLoadingSlots,
    loadAvailableDates,
    loadAvailableSlots,
    bookSlot,
  };
};
