import { z } from "zod";

const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

export const SlugParamSchema = z.object({
  slug: z
    .string({
      required_error: "slug is required",
      invalid_type_error: "slug must be a string",
    })
    .min(1, "slug is required"),
});

export const GetAvailableSlotsSchema = z.object({
  date: z
    .string({
      required_error: "date is required",
      invalid_type_error: "date must be a string",
    })
    .regex(dateRegex, "date must be in YYYY-MM-DD format")
    .refine((date) => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const inputDate = new Date(date);
      return inputDate >= today;
    }, "date cannot be in the past"),
});

export const CreateBookingSchema = z
  .object({
    date: z
      .string({
        required_error: "date is required",
        invalid_type_error: "date must be a string",
      })
      .regex(dateRegex, "date must be in YYYY-MM-DD format")
      .refine((date) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const inputDate = new Date(date);
        return inputDate >= today;
      }, "date cannot be in the past"),

    time: z
      .string({
        required_error: "time is required",
        invalid_type_error: "time must be a string",
      })
      .regex(timeRegex, "time must be in HH:MM format (24hr)"),
  })
  .refine(
    (data) => {
      const now = new Date();

      const inputDate = new Date(data.date);

      const today = new Date();
      today.setHours(0, 0, 0, 0);
      inputDate.setHours(0, 0, 0, 0);

      if (inputDate.getTime() !== today.getTime()) return true;

      const [h, m] = data.time.split(":").map(Number);

      const currentMinutes = now.getHours() * 60 + now.getMinutes();
      const slotMinutes = h * 60 + m;

      return slotMinutes > currentMinutes;
    },
    {
      message: "time must be in the future",
      path: ["time"],
    }
  );

export const GetBookingsForLinkSchema = z.object({
  params: SlugParamSchema,
});
