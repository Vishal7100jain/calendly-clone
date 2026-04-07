import jwt, { JwtPayload, SignOptions } from "jsonwebtoken";
import { envConfig } from "../config/env.config";

const JWT_SECRET = envConfig("JWT_SECRET") || "fallback_secret";
const JWT_EXPIRES_IN = envConfig("JWT_EXPIRES_IN") || "7d";

// Generate Token
export const generateToken = (payload: object): string => {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  } as SignOptions);
};

//  Verify Token
export const verifyToken = (token: string): JwtPayload | null => {
  try {
    return jwt.verify(token, JWT_SECRET) as JwtPayload;
  } catch (err) {
    return null;
  }
};
