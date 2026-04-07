import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware";
import authRootRoutes from "./v1/auth.route";
import availabilityRootRoutes from "./v1/availability.route";
import bookingRootRoutes from "./v1/booking.route";

const rootRoute = Router();

// All auth routes go under this root route of Auth
rootRoute.use("/auth", authRootRoutes);

// All availability routes go under this root route of Availability
rootRoute.use("/availability", authenticate, availabilityRootRoutes);

// All booking routes routes go under this root route of Booking
rootRoute.use("/book", bookingRootRoutes);

export default rootRoute;
