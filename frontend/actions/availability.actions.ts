/* eslint-disable @typescript-eslint/no-explicit-any */
import { API_END_POINTS } from "@/contants/api.end.point";
import api from "@/lib/axios";
import apiService from "@/lib/axios.service";
import { ApiResponse, Availability, BookingLink } from "@/types";

interface IAvailabilityResponse {
  new: Availability;
  list: Availability[];
}

export const availabilityActions = {
  createAvailability: async (data: Availability) => {
    try {
      const response = await apiService.post<
        IAvailabilityResponse,
        Availability
      >(API_END_POINTS.availability.create, data);
      return response;
    } catch (error: any) {
      return {
        data: null,
        message: error?.message,
        status: "error",
      };
    }
  },

  generateBookingLink: async (): Promise<BookingLink> => {
    const response = await api.post<ApiResponse<BookingLink>>(
      "/availability/generate-link",
      {}
    );
    return response.data.data;
  },

  deleteAvailability: async (id: string): Promise<void> => {
    await api.delete(`/availability/${id}`);
  },
};
