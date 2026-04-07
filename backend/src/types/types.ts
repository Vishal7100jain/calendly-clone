// ─── DB row shapes ─────────────────────────────────────────────────────────────

export interface UserRow {
  id: number;
  name: string;
  email: string;
  password: string;
  created_at: Date;
  updated_at: Date;
}

export interface AvailabilitySlotRow {
  id: number;
  user_id: number;
  slot_date: string; // "YYYY-MM-DD"
  start_time: string; // "HH:MM:SS"
  end_time: string; // "HH:MM:SS"
  created_at: Date;
}

export interface BookingLinkRow {
  id: number;
  user_id: number;
  token: string;
  created_at: Date;
}

export interface BookingRow {
  id: number;
  booking_link_id: number;
  booked_date: string; // "YYYY-MM-DD"
  booked_time: string; // "HH:MM:SS"
  guest_name: string | null;
  guest_email: string | null;
  created_at: Date;
}

// ─── JWT payload ───────────────────────────────────────────────────────────────

export interface JwtPayload {
  userId: number;
  email: string;
}

// ─── Augment Express Request ───────────────────────────────────────────────────

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}
