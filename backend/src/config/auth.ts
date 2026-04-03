export default {
  secret: process.env.JWT_SECRET || "desafio-tasks-secret-key-2026-change-in-production",
  expiresIn: "7d",
} as const;