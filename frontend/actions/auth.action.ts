/* eslint-disable @typescript-eslint/no-explicit-any */
import { API_END_POINTS } from "@/contants/api.end.point";
import apiService from "@/lib/axios.service";
import { LoginCredentials, RegisterData, User } from "@/types";

export const authActions = {
  login: async (credentials: LoginCredentials) => {
    try {
      const response = await apiService.post<
        { token: string; user: User },
        {
          email: string;
          password: string;
        }
      >(API_END_POINTS.auth.login, credentials);

      return response;
    } catch (error: any) {
      return {
        data: null,
        message: error?.message,
        status: "error",
      };
    }
  },

  register: async (data: RegisterData) => {
    try {
      const response = await apiService.post<
        { token: string; user: User },
        any
      >(API_END_POINTS.auth.register, data);

      return response;
    } catch (error: any) {
      return {
        data: null,
        message: error?.message,
        status: "error",
      };
    }
  },

  logout: () => {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user");
  },

  getCurrentUser: (): User | null => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      return JSON.parse(userStr);
    }
    return null;
  },
};
