import { Request, Response } from "express";
import { Prisma } from "../config/prisma";
import { sendError, sendSuccess } from "../config/sender.config";

export const GetBookingLinkInfo = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { slug } = req.params;

  try {
    const link = await Prisma.bookingLink.findUnique({
      where: { slug },
      include: {
        user: true,
      },
    });

    if (!link) {
      return sendError(res, "Booking link not found", 404);
    }

    const today = new Date().toISOString().split("T")[0];

    const availability = await Prisma.availability.findMany({
      where: {
        userId: link.userId,
        date: {
          gte: today,
        },
      },
      orderBy: { date: "asc" },
    });

    return sendSuccess(res, {
      slug,
      host_name: link.user.name,
      available_dates: availability,
    });
  } catch (err) {
    console.error("Get booking link info error:", err);
    return sendError(res, "Internal server error", 500);
  }
};

const generateTimeSlots = (startTime: string, endTime: string): string[] => {
  const slots: string[] = [];

  const [sh, sm] = startTime.split(":").map(Number);
  const [eh, em] = endTime.split(":").map(Number);

  let current = sh * 60 + sm;
  const end = eh * 60 + em;

  while (current < end) {
    const h = Math.floor(current / 60);
    const m = current % 60;

    slots.push(`${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`);
    current += 30;
  }

  return slots;
};

export const GetAvailableSlots = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { slug } = req.params;
  const { date } = req.query;

  try {
    const link = await Prisma.bookingLink.findUnique({
      where: { slug },
    });

    if (!link) {
      return sendError(res, "Booking link not found", 404);
    }

    console.log("link.userId: ", link, date);

    const availability = await Prisma.availability.findUnique({
      where: {
        userId_date: {
          userId: link.userId,
          date: String(date) as string,
        },
      },
    });

    if (!availability) {
      return sendSuccess(res, { date, slots: [] });
    }

    const allSlots = generateTimeSlots(
      availability.startTime,
      availability.endTime
    );

    const now = new Date();
    const todayStr = now.toISOString().split("T")[0];

    const filteredSlots = allSlots.filter((slot) => {
      if (date !== todayStr) return true;

      const [h, m] = slot.split(":").map(Number);

      const slotMinutes = h * 60 + m;
      const currentMinutes = now.getHours() * 60 + now.getMinutes();

      return slotMinutes > currentMinutes;
    });

    const bookings = await Prisma.booking.findMany({
      where: {
        bookingLinkId: link.id,
        date: date as string,
      },
    });

    const bookedSet = new Set(bookings.map((b) => b.time));

    const availableSlots = filteredSlots.filter((s) => !bookedSet.has(s));

    return sendSuccess(res, {
      date,
      slots: availableSlots,
    });
  } catch (err) {
    console.error("Get slots error:", err);
    return sendError(res, "Failed to fetch slots", 500);
  }
};

export const CreateBooking = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { slug } = req.params;
  const { date, time } = req.body;

  try {
    const link = await Prisma.bookingLink.findUnique({
      where: { slug },
    });

    if (!link) {
      return sendError(res, "Booking link not found", 404);
    }

    const availability = await Prisma.availability.findUnique({
      where: {
        userId_date: {
          userId: link.userId,
          date,
        },
      },
    });

    if (!availability) {
      return sendError(res, "No availability for this date", 400);
    }

    const allSlots = generateTimeSlots(
      availability.startTime,
      availability.endTime
    );

    if (!allSlots.includes(time)) {
      return sendError(res, "Invalid time slot", 400);
    }

    // Core booking logic (atomic)
    try {
      const booking = await Prisma.booking.create({
        data: {
          bookingLinkId: link.id,
          date,
          time,
        },
      });

      return sendSuccess(res, booking, "Booking confirmed");
    } catch (err: any) {
      if (err.code === "P2002") {
        return sendError(res, "This slot is already booked", 409);
      }
      throw err;
    }
  } catch (err) {
    console.error("Create booking error:", err);
    return sendError(res, "Failed to create booking", 500);
  }
};

export const GetBookingsForLink = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { slug } = req.params;
  const userId = req.user!.userId;

  try {
    const link = await Prisma.bookingLink.findFirst({
      where: {
        slug,
        userId,
      },
    });

    if (!link) {
      return sendError(res, "Booking link not found", 404);
    }

    const bookings = await Prisma.booking.findMany({
      where: {
        bookingLinkId: link.id,
      },
      orderBy: [{ date: "asc" }, { time: "asc" }],
    });

    return sendSuccess(res, bookings);
  } catch (err) {
    console.error("Get bookings error:", err);
    return sendError(res, "Failed to fetch bookings", 500);
  }
};
