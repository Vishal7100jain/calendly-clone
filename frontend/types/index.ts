/* eslint-disable @typescript-eslint/no-explicit-any */
// types/index.ts
export interface User {
  id: string;
  email: string;
  name: string;
}

export interface Availability {
  id?: number;
  userId?: number;
  date: string;
  startTime: string;
  endTime: string;
}

export interface AvailableDate {
  date: string;
  available_slots?: number;
}

export interface BookingLink {
  url: string;
  slug: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  message?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}
