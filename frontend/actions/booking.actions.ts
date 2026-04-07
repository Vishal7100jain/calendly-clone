import { API_END_POINTS } from "@/contants/api.end.point";
import api from "@/lib/axios";
import { ApiResponse, AvailableDate } from "@/types";

export const bookingActions = {
  getAvailableDates: async (slug: string): Promise<AvailableDate[]> => {
    const response = await api.get<
      ApiResponse<{ available_dates: AvailableDate[] }>
    >(`${API_END_POINTS.booking.getAvailableDates}/${slug}`);
    return response.data.data.available_dates;
  },

  getAvailableSlots: async (slug: string, date: string): Promise<string[]> => {
    const response = await api.get<ApiResponse<{ slots: string[] }>>(
      `${API_END_POINTS.booking.getAvailableDates}/${slug}/slots`,
      { params: { date } }
    );
    return response.data.data.slots;
  },

  bookSlot: async (slug: string, date: string, time: string): Promise<void> => {
    await api.post(`${API_END_POINTS.booking.getAvailableDates}/${slug}`, {
      date,
      time,
    });
  },
};
