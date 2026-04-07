import cors from "cors";

const corsOptions = {
  origin: ["http://localhost:3000"],
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "X-API-KEY",
    "X-API-SECRET",
    "X-Requested-With",
  ],
  credentials: true,
};

export default cors(corsOptions);
