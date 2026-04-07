import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import { envConfig } from "../config/env.config";
import { Prisma } from "../config/prisma";
import { sendError, sendSuccess } from "../config/sender.config";

// Helper
const timeToMinutes = (t: string): number => {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
};

// Save Availability
export const SaveAvailability = async (
  req: Request,
  res: Response
): Promise<void> => {
  const userId = req.user!.userId;
  const { date, startTime, endTime } = req.body;

  try {
    // Validation
    if (!date || !startTime || !endTime) {
      return sendError(res, "date, startTime and endTime are required", 400);
    }

    if (timeToMinutes(startTime) >= timeToMinutes(endTime)) {
      return sendError(res, "startTime must be before endTime", 400);
    }

    // Upsert (userId + date unique should exist in DB)
    const availability = await Prisma.availability.upsert({
      where: {
        userId_date: {
          userId,
          date,
        },
      },
      update: {
        startTime,
        endTime,
      },
      create: {
        userId,
        date,
        startTime,
        endTime,
      },
    });

    const allAvailability = await Prisma.availability.findMany({
      where: { userId },
    });

    return sendSuccess(
      res,
      { new: availability, list: allAvailability },
      "Availability saved"
    );
  } catch (err) {
    console.error("Save availability error:", err);
    return sendError(res, "Failed to save availability", 500);
  }
};

// Generate Booking Link
export const GenerateBookingLink = async (
  req: Request,
  res: Response
): Promise<void> => {
  const userId = req.user!.userId;

  try {
    const slug = uuidv4();
    const baseUrl = envConfig("APP_BASE_URL");

    const link = await Prisma.bookingLink.create({
      data: {
        userId,
        slug,
      },
    });

    return sendSuccess(
      res,
      {
        ...link,
        url: `${baseUrl}/book/${slug}`,
      },
      "Booking link generated"
    );
  } catch (err) {
    console.error("Generate link error:", err);
    return sendError(res, "Failed to generate link", 500);
  }
};
