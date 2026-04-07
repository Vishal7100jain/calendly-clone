import { z } from "zod";

const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;

export const SaveAvailabilitySchema = z
  .object({
    date: z
      .string({
        required_error: "date is required",
        invalid_type_error: "date must be a string",
      })
      .regex(/^\d{4}-\d{2}-\d{2}$/, "date must be in YYYY-MM-DD format"),

    startTime: z
      .string({
        required_error: "start Time is required",
        invalid_type_error: "start Time must be a string",
      })
      .regex(timeRegex, "start Time must be in HH:MM format (24hr)"),

    endTime: z
      .string({
        required_error: "end Time is required",
        invalid_type_error: "end Time must be a string",
      })
      .regex(timeRegex, "end Time must be in HH:MM format (24hr)"),
  })
  .refine(
    (data) => {
      const now = new Date();

      const inputDate = new Date(data.date);

      const today = new Date();
      today.setHours(0, 0, 0, 0);
      inputDate.setHours(0, 0, 0, 0);

      // If NOT today → valid
      if (inputDate.getTime() !== today.getTime()) return true;

      const [sh, sm] = data.startTime.split(":").map(Number);

      const currentMinutes = now.getHours() * 60 + now.getMinutes();
      const startMinutes = sh * 60 + sm;

      return startMinutes > currentMinutes;
    },
    {
      message: "start Time must be in the future",
      path: ["startTime"],
    }
  )
  .refine(
    (data) => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const inputDate = new Date(data.date);
      return inputDate >= today;
    },
    {
      message: "date cannot be in the past",
      path: ["date"],
    }
  );
