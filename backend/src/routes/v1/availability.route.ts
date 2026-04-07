import { Router } from "express";
import {
  GenerateBookingLink,
  SaveAvailability,
} from "../../controllers/availability.controller";
import { validateData } from "../../middleware/validation.middleware";
import { SaveAvailabilitySchema } from "../../schema/availability.schema";

const availabilityRootRoutes = Router();

// POST /api/v1/availability — save/upsert a date+time window
availabilityRootRoutes.post(
  "/",
  validateData({ body: SaveAvailabilitySchema }),
  SaveAvailability
);

// POST /api/v1/availability/generate-link  — create a new booking link
availabilityRootRoutes.post("/generate-link", GenerateBookingLink);

export default availabilityRootRoutes;
