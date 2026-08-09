import dotenv from "dotenv";
// Load environment variables once for the whole backend
dotenv.config();

// Robust loader for PrismaClient to support different packaging (ESM/CJS) and Prisma versions
let PrismaClient;
try {
  // Try dynamic ESM import first (works when package exposes ESM named exports)
  const pkg = await import("@prisma/client");
  PrismaClient =
    pkg?.PrismaClient ?? pkg?.default?.PrismaClient ?? pkg?.default ?? pkg;
  // If pkg itself is the client constructor (rare), use it
  if (
    PrismaClient &&
    typeof PrismaClient !== "function" &&
    PrismaClient.PrismaClient
  ) {
    PrismaClient = PrismaClient.PrismaClient;
  }
} catch (e) {
  // Fallback to CommonJS require when dynamic import fails or package is CJS-only
  try {
    const { createRequire } = await import("module");
    const require = createRequire(import.meta.url);
    const pkg = require("@prisma/client");
    PrismaClient = pkg.PrismaClient ?? pkg.default ?? pkg;
  } catch (err) {
    console.error("Failed to load @prisma/client:", err);
    throw err;
  }
}

// Instantiate shared Prisma client and provide connection info for Prisma v7
// For Prisma v5 the client can be instantiated without a driver adapter.
// Use a simple shared client instance.
export const db = new PrismaClient();

// Graceful shutdown
process.on("SIGINT", async () => {
  await db.$disconnect();
  process.exit(0);
});
