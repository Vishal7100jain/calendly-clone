import { Router } from "express";
import {
  CreateBooking,
  GetAvailableSlots,
  GetBookingLinkInfo,
  GetBookingsForLink,
} from "../../controllers/booking.controller";
import { authenticate } from "../../middleware/auth.middleware";
import { validateData } from "../../middleware/validation.middleware";
import {
  CreateBookingSchema,
  GetAvailableSlotsSchema,
  SlugParamSchema,
} from "../../schema/booking.schema";

const bookingRootRoutes = Router();

// GET verify link exists + get available dates
bookingRootRoutes.get(
  "/:slug",
  validateData({ params: SlugParamSchema }),
  GetBookingLinkInfo
);

// GET get un-booked time chips for a date
bookingRootRoutes.get(
  "/:slug/slots",
  validateData({ params: SlugParamSchema }),
  validateData({ query: GetAvailableSlotsSchema }),
  GetAvailableSlots
);

// POST create a booking
bookingRootRoutes.post(
  "/:slug",
  validateData({ params: SlugParamSchema }),
  validateData({ body: CreateBookingSchema }),
  CreateBooking
);

// GET host sees who booked via this link
bookingRootRoutes.get("/:slug/bookings", authenticate, GetBookingsForLink);

export default bookingRootRoutes;
